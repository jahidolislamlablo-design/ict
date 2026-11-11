const fs = require('fs');
let s = fs.readFileSync('server.js', 'utf8');

// CQ POST
const oldCqPost = 'if (!chapter || !stem || !q_ka || !q_kha || !q_ga || !q_gha)';
const newCqPost = 'const primaryChapter = (finalChapters && finalChapters.length > 0) ? finalChapters[0] : (chapter ? chapter.trim() : "");\n    if (!primaryChapter || !stem || !q_ka || !q_kha || !q_ga || !q_gha)';
if (s.includes(oldCqPost)) {
  s = s.replace(oldCqPost, newCqPost);
  console.log('Replaced CQ POST validation');
}

// CQ POST modelTestNos
const oldCqNew = "testPaperName: testPaperName ? testPaperName.trim() : '',\n      modelTestNo: modelTestNo ? modelTestNo.trim() : ''";
const newCqNew = "testPaperName: testPaperName ? testPaperName.trim() : '',\n      modelTestNos: finalModels,\n      modelTestNo: finalModels[0] || (modelTestNo ? modelTestNo.trim() : '')";
if (s.includes(oldCqNew)) {
  s = s.replace(oldCqNew, newCqNew);
  console.log('Replaced CQ POST modelTestNos');
}

// CQ PUT
const targetPutStart = "app.put('/api/cqs/:id', async (req, res) => {";
const putIdx = s.indexOf(targetPutStart);
if (putIdx !== -1) {
  const nextIdx = s.indexOf('const updatedCq = await Cq.findByIdAndUpdate', putIdx);
  if (nextIdx !== -1) {
    const putBlock = s.substring(putIdx, nextIdx);
    if (!putBlock.includes('updateData.chapters')) {
      const oldDecl = 'let updateData = {};';
      const replacement = `let updateData = {};

    if (chapters && Array.isArray(chapters)) {
      updateData.chapters = chapters.map(c => String(c).trim());
      updateData.chapter = updateData.chapters[0] || '';
    }
    if (collegeNames && Array.isArray(collegeNames)) {
      updateData.collegeNames = collegeNames.map(c => String(c).trim());
      updateData.collegeName = updateData.collegeNames[0] || '';
    }
    if (boardNames && Array.isArray(boardNames)) {
      updateData.boardNames = boardNames.map(b => String(b).trim());
      updateData.boardName = updateData.boardNames[0] || '';
    }
    if (examYears && Array.isArray(examYears)) {
      updateData.examYears = examYears.map(y => String(y).trim());
      updateData.examYear = updateData.examYears[0] || '';
    }
    if (modelTestNos && Array.isArray(modelTestNos)) {
      updateData.modelTestNos = modelTestNos.map(m => String(m).trim());
      updateData.modelTestNo = updateData.modelTestNos[0] || '';
    }`;
      s = s.substring(0, putIdx) + putBlock.replace(oldDecl, replacement) + s.substring(nextIdx);
      console.log('Added multi-select handling to CQ PUT');
    }
  }
}

fs.writeFileSync('server.js', s, 'utf8');
console.log('Finished patching server.js for CQ');
