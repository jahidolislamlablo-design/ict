const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// 1. Add DELETE /api/custom-options right after app.post('/api/custom-options' ...
const postCustomOptPattern = "res.status(200).json({ success: true, option: { type, val: cleanVal } });\n    }\n  } catch (err) {\n    res.status(500).json({ success: false, error: err.message });\n  }\n});";

const deleteCustomOptCode = `
// কাস্টম অপশন ডিলিট করার API
app.delete('/api/custom-options', (req, res) => {
  try {
    const { type, val } = req.body || {};
    if (!type || !val) {
      return res.status(400).json({ success: false, message: 'type এবং val আবশ্যক' });
    }
    const cleanVal = val.trim();
    const data = readCustomOptionsFile();
    const map = {
      chapter: 'chapters',
      board: 'boards',
      year: 'years',
      college: 'colleges',
      modelTest: 'modelTests'
    };
    const key = map[type] || (type + 's');
    if (Array.isArray(data[key])) {
      data[key] = data[key].filter(item => item.trim().toLowerCase() !== cleanVal.toLowerCase());
      writeCustomOptionsFile(data);
    }
    res.json({ success: true, message: \`"\${cleanVal}" অপশনটি সফলভাবে মুছে ফেলা হয়েছে\` });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
`;

if (!code.includes("app.delete('/api/custom-options'")) {
  const idx = code.indexOf("app.post('/api/custom-options'");
  if (idx !== -1) {
    const endIdx = code.indexOf("});", idx) + 3;
    code = code.slice(0, endIdx) + "\n" + deleteCustomOptCode + code.slice(endIdx);
    console.log("Added DELETE /api/custom-options");
  }
}

// 2. Add Trash API endpoints before app.use((req, res) => {
const trashRoutesCode = `
// ==========================================
// ট্র্যাশ ক্যান (Trash Can) API রাউটস
// ==========================================

// ১. সকল ট্র্যাশ আইটেম ফেচ করা
app.get('/api/trash', async (req, res) => {
  try {
    let items = [];
    if (isConnected) {
      items = await Trash.find().sort({ deletedAt: -1 }).lean();
    }
    if (!items || items.length === 0) {
      items = readTrashFile();
    }
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    const list = readTrashFile();
    res.json({ success: true, count: list.length, data: list });
  }
});

// ২. ট্র্যাশ থেকে আইটেম পুনরুদ্ধার (Restore) করা
app.post('/api/trash/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        item = await Trash.findById(id).lean();
      } else {
        item = await Trash.findOne({ $or: [{ _id: id }, { originalId: id }] }).lean();
      }
    }
    if (!item) {
      const list = readTrashFile();
      item = list.find(t => String(t._id) === String(id) || String(t.originalId) === String(id));
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'ট্র্যাশে আইটেমটি পাওয়া যায়নি!' });
    }

    const { itemType, data } = item;
    const cleanData = data ? { ...data } : {};
    delete cleanData._id;
    delete cleanData.__v;

    if (itemType === 'mcq') {
      if (isConnected) {
        await Mcq.create(cleanData);
        await syncDatabaseJson('mcqs');
      } else {
        const mcqsPath = path.join(__dirname, 'database', 'mcqs.json');
        let mcqs = fs.existsSync(mcqsPath) ? JSON.parse(fs.readFileSync(mcqsPath, 'utf8')) : [];
        mcqs.unshift(data);
        fs.writeFileSync(mcqsPath, JSON.stringify(mcqs, null, 2), 'utf8');
      }
    } else if (itemType === 'cq') {
      if (isConnected) {
        await Cq.create(cleanData);
        await syncDatabaseJson('cqs');
      } else {
        const cqsPath = path.join(__dirname, 'database', 'cqs.json');
        let cqs = fs.existsSync(cqsPath) ? JSON.parse(fs.readFileSync(cqsPath, 'utf8')) : [];
        cqs.unshift(data);
        fs.writeFileSync(cqsPath, JSON.stringify(cqs, null, 2), 'utf8');
      }
    } else if (itemType === 'pdf') {
      if (isConnected) {
        await Pdf.create(cleanData);
        await syncDatabaseJson('pdfs');
      } else {
        const pdfsPath = path.join(__dirname, 'database', 'pdfs.json');
        let pdfs = fs.existsSync(pdfsPath) ? JSON.parse(fs.readFileSync(pdfsPath, 'utf8')) : [];
        pdfs.unshift(data);
        fs.writeFileSync(pdfsPath, JSON.stringify(pdfs, null, 2), 'utf8');
      }
    } else if (itemType === 'modelTest') {
      if (isConnected) {
        await ModelTest.create(cleanData);
        await syncDatabaseJson('modelTests');
      } else {
        const mtPath = path.join(__dirname, 'database', 'model_tests.json');
        let mts = fs.existsSync(mtPath) ? JSON.parse(fs.readFileSync(mtPath, 'utf8')) : [];
        mts.unshift(data);
        fs.writeFileSync(mtPath, JSON.stringify(mts, null, 2), 'utf8');
      }
    }

    // ট্র্যাশ থেকে মুছে ফেলা
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Trash.findByIdAndDelete(id);
      } else {
        await Trash.findOneAndDelete({ $or: [{ _id: id }, { originalId: id }] });
      }
    }
    const remaining = readTrashFile().filter(t => String(t._id) !== String(id) && String(t.originalId) !== String(id));
    writeTrashFile(remaining);

    autoPushToGitHub(\`Restore \${itemType}: \${item.title || id}\`);
    res.json({ success: true, message: 'আইটেমটি সফলভাবে পুনরুদ্ধার (Restore) করা হয়েছে!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'পুনরুদ্ধার ব্যর্থ হয়েছে: ' + err.message });
  }
});

// ৩. ট্র্যাশ থেকে একটি আইটেম স্থায়ীভাবে মুছে ফেলা
app.delete('/api/trash/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let item = null;
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        item = await Trash.findByIdAndDelete(id);
      } else {
        item = await Trash.findOneAndDelete({ $or: [{ _id: id }, { originalId: id }] });
      }
    }
    const list = readTrashFile();
    const found = list.find(t => String(t._id) === String(id) || String(t.originalId) === String(id));
    const filtered = list.filter(t => String(t._id) !== String(id) && String(t.originalId) !== String(id));
    writeTrashFile(filtered);

    // যদি PDF ফাইল হয় তবে ডিস্ক থেকেও ডিলিট করি
    const target = item || found;
    if (target && target.itemType === 'pdf' && target.data && target.data.pdfUrl) {
      const url = target.data.pdfUrl;
      if (url.startsWith('/uploads/pdfs/')) {
        const filename = path.basename(url);
        const filepath = path.join(pdfUploadDir, filename);
        if (fs.existsSync(filepath)) {
          try { fs.unlinkSync(filepath); } catch(e) {}
        }
        removePdfFileFromFrontend(filename);
      }
    }

    res.json({ success: true, message: 'ট্র্যাশ থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।' });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ৪. ট্র্যাশ সম্পূর্ণ খালি করা (Empty Trash)
app.delete('/api/trash', async (req, res) => {
  try {
    if (isConnected) {
      await Trash.deleteMany({});
    }
    writeTrashFile([]);
    res.json({ success: true, message: 'ট্র্যাশ সফলভাবে সম্পূর্ণ খালি করা হয়েছে!' });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
`;

if (!code.includes("app.get('/api/trash'")) {
  const notFoundIdx = code.indexOf("app.use((req, res) => {");
  if (notFoundIdx !== -1) {
    code = code.slice(0, notFoundIdx) + trashRoutesCode + "\n\n" + code.slice(notFoundIdx);
    console.log("Added Trash routes");
  }
}

// 3. Update DELETE /api/mcqs/:id to moveToTrash
const oldDeleteMcq = `app.delete('/api/mcqs/:id', async (req, res) => {
  try {
    const deletedMcq = await Mcq.findByIdAndDelete(req.params.id);
    if (!deletedMcq) {
      return res.status(404).json({ success: false, message: 'MCQ প্রশ্নটি পাওয়া যায়নি' });
    }
    await syncDatabaseJson('mcqs');
    autoPushToGitHub('Delete MCQ: ' + req.params.id);
    res.status(200).json({ success: true, message: 'MCQ প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

const newDeleteMcq = `app.delete('/api/mcqs/:id', async (req, res) => {
  try {
    let deletedMcq = null;
    if (isConnected) {
      deletedMcq = await Mcq.findById(req.params.id);
      if (deletedMcq) await Mcq.findByIdAndDelete(req.params.id);
    }
    const mcqsPath = path.join(__dirname, 'database', 'mcqs.json');
    if (!deletedMcq && fs.existsSync(mcqsPath)) {
      const list = JSON.parse(fs.readFileSync(mcqsPath, 'utf8'));
      deletedMcq = list.find(m => String(m._id) === String(req.params.id));
    }
    if (!deletedMcq) {
      return res.status(404).json({ success: false, message: 'MCQ প্রশ্নটি পাওয়া যায়নি' });
    }
    await moveToTrash('mcq', deletedMcq._id || req.params.id, deletedMcq.question, deletedMcq.chapter, deletedMcq);
    await syncDatabaseJson('mcqs');
    autoPushToGitHub('Delete MCQ: ' + req.params.id);
    res.status(200).json({ success: true, message: 'MCQ প্রশ্নটি ট্র্যাশে পাঠানো হয়েছে (প্রয়োজনে রিস্টোর করা যাবে)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

if (code.includes(oldDeleteMcq)) {
  code = code.replace(oldDeleteMcq, newDeleteMcq);
  console.log("Updated DELETE /api/mcqs/:id to use Trash");
}

// 4. Update DELETE /api/cqs/:id to moveToTrash
const oldDeleteCq = `app.delete('/api/cqs/:id', async (req, res) => {
  try {
    const deletedCq = await Cq.findByIdAndDelete(req.params.id);
    if (!deletedCq) {
      return res.status(404).json({ success: false, message: 'CQ প্রশ্নটি পাওয়া যায়নি' });
    }
    await syncDatabaseJson('cqs');
    autoPushToGitHub('Delete CQ: ' + req.params.id);
    res.status(200).json({ success: true, message: 'CQ প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;

// Wait, let's also check if deletedCq text has mojibake in file
const cqDelIdx = code.indexOf("app.delete('/api/cqs/:id'");
if (cqDelIdx !== -1) {
  const cqDelEnd = code.indexOf("});", cqDelIdx) + 3;
  const newCqDel = `app.delete('/api/cqs/:id', async (req, res) => {
  try {
    let deletedCq = null;
    if (isConnected) {
      deletedCq = await Cq.findById(req.params.id);
      if (deletedCq) await Cq.findByIdAndDelete(req.params.id);
    }
    const cqsPath = path.join(__dirname, 'database', 'cqs.json');
    if (!deletedCq && fs.existsSync(cqsPath)) {
      const list = JSON.parse(fs.readFileSync(cqsPath, 'utf8'));
      deletedCq = list.find(c => String(c._id) === String(req.params.id));
    }
    if (!deletedCq) {
      return res.status(404).json({ success: false, message: 'CQ প্রশ্নটি পাওয়া যায়নি' });
    }
    await moveToTrash('cq', deletedCq._id || req.params.id, deletedCq.stem || deletedCq.q_ka, deletedCq.chapter, deletedCq);
    await syncDatabaseJson('cqs');
    autoPushToGitHub('Delete CQ: ' + req.params.id);
    res.status(200).json({ success: true, message: 'CQ প্রশ্নটি ট্র্যাশে পাঠানো হয়েছে (প্রয়োজনে রিস্টোর করা যাবে)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;
  code = code.slice(0, cqDelIdx) + newCqDel + code.slice(cqDelEnd);
  console.log("Updated DELETE /api/cqs/:id to use Trash");
}

// 5. Update DELETE /api/pdfs/:id to moveToTrash
const pdfDelIdx = code.indexOf("app.delete('/api/pdfs/:id'");
if (pdfDelIdx !== -1) {
  const pdfDelEnd = code.indexOf("});", pdfDelIdx) + 3;
  const newPdfDel = `app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    let pdf = null;
    if (isConnected) {
      pdf = await Pdf.findById(req.params.id);
      if (pdf) await Pdf.findByIdAndDelete(req.params.id);
    }
    const pdfsPath = path.join(__dirname, 'database', 'pdfs.json');
    if (!pdf && fs.existsSync(pdfsPath)) {
      const list = JSON.parse(fs.readFileSync(pdfsPath, 'utf8'));
      pdf = list.find(p => String(p._id) === String(req.params.id));
    }
    if (!pdf) {
      return res.status(404).json({ success: false, message: 'পিডিএফ পাওয়া যায়নি' });
    }

    await moveToTrash('pdf', pdf._id || req.params.id, pdf.title, pdf.chapter || pdf.category, pdf);
    await syncPdfsJson();
    autoPushToGitHub(\`Delete PDF to Trash: \${pdf.title || 'item'}\`);

    res.status(200).json({
      success: true,
      message: 'পিডিএফ সফলভাবে ট্র্যাশে পাঠানো হয়েছে (প্রয়োজনে আবার রিস্টোর করতে পারবেন)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});`;
  code = code.slice(0, pdfDelIdx) + newPdfDel + code.slice(pdfDelEnd);
  console.log("Updated DELETE /api/pdfs/:id to use Trash");
}

// 6. Update DELETE /api/model-tests/:id to moveToTrash and clean up custom_options.json
const mtDelIdx = code.indexOf("app.delete('/api/model-tests/:id'");
if (mtDelIdx !== -1) {
  const mtDelEnd = code.indexOf("});", mtDelIdx) + 3;
  const newMtDel = `app.delete('/api/model-tests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let target = null;
    if (isConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        target = await ModelTest.findById(id);
        if (target) await ModelTest.findByIdAndDelete(id);
      } else {
        target = await ModelTest.findOne({ $or: [{ examNo: id }, { serialNo: parseInt(id, 10) || -1 }] });
        if (target) await ModelTest.findOneAndDelete({ $or: [{ examNo: id }, { serialNo: parseInt(id, 10) || -1 }] });
      }
    }

    const jsonPath = path.join(__dirname, 'database', 'model_tests.json');
    if (fs.existsSync(jsonPath)) {
      let fileData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (!target) {
        target = fileData.find(item => String(item._id) === String(id) || String(item.examNo) === String(id));
      }
      fileData = fileData.filter(item => String(item._id) !== String(id) && String(item.examNo) !== String(id));
      const destDirs = [
        path.join(__dirname, 'database'),
        'C:/Users/taibu/OneDrive/Desktop/Antygravity project/ict-easy-learning/database'
      ];
      destDirs.forEach(dir => {
        try {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'model_tests.json'), JSON.stringify(fileData, null, 2), 'utf8');
        } catch(e) {}
      });
    }

    if (target) {
      await moveToTrash('modelTest', target._id || id, target.title || target.examNo, target.category, target);

      // Clean up matching modelTest from custom_options.json so old ones don't linger in filter
      try {
        const custom = readCustomOptionsFile();
        if (Array.isArray(custom.modelTests)) {
          const tTitle = (target.title || '').trim().toLowerCase();
          const tExam = (target.examNo || '').trim().toLowerCase();
          custom.modelTests = custom.modelTests.filter(m => {
            const mLow = m.trim().toLowerCase();
            return mLow !== tTitle && mLow !== tExam && mLow !== \`model test \${tExam}\` && mLow !== \`model test 0\${tExam}\`;
          });
          writeCustomOptionsFile(custom);
        }
      } catch(e) {}
    }

    if (isConnected) {
      await syncDatabaseJson('modelTests');
    }

    autoPushToGitHub(\`Delete Live Exam / Model Test to Trash: \${id}\`);

    res.status(200).json({
      success: true,
      message: 'মডেল টেস্ট সফলভাবে ট্র্যাশে পাঠানো হয়েছে (প্রয়োজনে রিস্টোর করা যাবে)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'মডেল টেস্ট ডিলিট করতে সমস্যা হয়েছে',
      error: error.message
    });
  }
});`;
  code = code.slice(0, mtDelIdx) + newMtDel + code.slice(mtDelEnd);
  console.log("Updated DELETE /api/model-tests/:id to use Trash");
}

// 7. Update startup listening to print local WiFi IP
const oldListen = `if (require.main === module) {
  app.listen(PORT, () => {
    console.log(\`🚀 সার্ভার চালু হয়েছে: http://localhost:\${PORT}\`);
    console.log(\`📋 অ্যাডমিন ড্যাশবোর্ড: http://localhost:\${PORT}/admin.html\`);
    console.log(\`🌐 ফ্রন্টএন্ড Origin সাপোর্টেড: https://jahidolislamlablo-design.github.io\`);
  });
}`;

const newListen = `if (require.main === module) {
  const os = require('os');
  app.listen(PORT, () => {
    console.log(\`🚀 সার্ভার চালু হয়েছে: http://localhost:\${PORT}\`);
    console.log(\`📋 অ্যাডমিন ড্যাশবোর্ড: http://localhost:\${PORT}/admin.html\`);
    console.log(\`🌐 ফ্রন্টএন্ড Origin সাপোর্টেড: https://jahidolislamlablo-design.github.io\`);

    const interfaces = os.networkInterfaces();
    const wifiIps = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          wifiIps.push(iface.address);
        }
      }
    }
    if (wifiIps.length > 0) {
      console.log('📱 মোবাইল ফোন থেকে একই ওয়াইফাইয়ে ব্রাউজ ও একাউন্ট করতে:');
      wifiIps.forEach(ip => console.log(\`   👉 http://\${ip}:\${PORT}/login.html\`));
    }
  });
}`;

if (code.includes("if (require.main === module) {")) {
  const listenIdx = code.indexOf("if (require.main === module) {");
  const listenEnd = code.indexOf("}", code.indexOf("app.listen", listenIdx) + 10) + 3;
  code = code.slice(0, listenIdx) + newListen + "\n" + code.slice(listenEnd);
  console.log("Updated app.listen startup log");
}

fs.writeFileSync(serverFile, code, 'utf8');
console.log("server.js updated successfully!");
