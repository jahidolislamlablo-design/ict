const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'server.js');
let s = fs.readFileSync(serverPath, 'utf8');

// Update POST /api/mcqs
const postMcqTarget = `    const {
      categoryTypes,
      categoryType,
      chapter,
      serialNo,
      image,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      liveExamNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;`;

const postMcqReplace = `    const {
      categoryTypes,
      categoryType,
      chapters,
      chapter,
      serialNo,
      image,
      collegeNames,
      collegeName,
      boardNames,
      boardName,
      examYears,
      examYear,
      testPaperName,
      modelTestNos,
      modelTestNo,
      liveExamNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;

    const finalChapters = Array.isArray(chapters) && chapters.length > 0 ? chapters.map(c => String(c).trim()) : (chapter ? [String(chapter).trim()] : []);
    const finalColleges = Array.isArray(collegeNames) && collegeNames.length > 0 ? collegeNames.map(c => String(c).trim()) : (collegeName ? [String(collegeName).trim()] : []);
    const finalBoards = Array.isArray(boardNames) && boardNames.length > 0 ? boardNames.map(b => String(b).trim()) : (boardName ? [String(boardName).trim()] : []);
    const finalYears = Array.isArray(examYears) && examYears.length > 0 ? examYears.map(y => String(y).trim()) : (examYear ? [String(examYear).trim()] : []);
    const finalModels = Array.isArray(modelTestNos) && modelTestNos.length > 0 ? modelTestNos.map(m => String(m).trim()) : (modelTestNo ? [String(modelTestNo).trim()] : []);`;

if (s.includes(postMcqTarget)) {
  s = s.replace(postMcqTarget, postMcqReplace);
  console.log("Updated POST /api/mcqs destruct");
}

// In new Mcq({ ... })
const newMcqTarget = `    const newMcq = new Mcq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Chapter Practice',
      chapter: chapter.trim(),
      collegeName: collegeName ? collegeName.trim() : '',
      boardName: boardName ? boardName.trim() : '',
      examYear: examYear ? String(examYear).trim() : '',
      testPaperName: testPaperName ? testPaperName.trim() : '',
      modelTestNo: modelTestNo ? modelTestNo.trim() : '',`;

const newMcqReplace = `    const newMcq = new Mcq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Chapter Practice',
      chapters: finalChapters,
      chapter: finalChapters[0] || (chapter ? chapter.trim() : ''),
      collegeNames: finalColleges,
      collegeName: finalColleges[0] || (collegeName ? collegeName.trim() : ''),
      boardNames: finalBoards,
      boardName: finalBoards[0] || (boardName ? boardName.trim() : ''),
      examYears: finalYears,
      examYear: finalYears[0] || (examYear ? String(examYear).trim() : ''),
      testPaperName: testPaperName ? testPaperName.trim() : '',
      modelTestNos: finalModels,
      modelTestNo: finalModels[0] || (modelTestNo ? modelTestNo.trim() : ''),`;

if (s.includes(newMcqTarget)) {
  s = s.replace(newMcqTarget, newMcqReplace);
  console.log("Updated new Mcq constructor");
}

// Update PUT /api/mcqs/:id
const putMcqTarget = `    const {
      serialNo,
      image,
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      liveExamNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;`;

const putMcqReplace = `    const {
      serialNo,
      image,
      categoryTypes,
      categoryType,
      chapters,
      chapter,
      collegeNames,
      collegeName,
      boardNames,
      boardName,
      examYears,
      examYear,
      testPaperName,
      modelTestNos,
      modelTestNo,
      liveExamNo,
      question,
      options,
      correctAnswer,
      explanation
    } = req.body;

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

if (s.includes(putMcqTarget)) {
  s = s.replace(putMcqTarget, putMcqReplace);
  console.log("Updated PUT /api/mcqs/:id");
}

// In POST /api/cqs
const postCqTarget = `    const {
      serialNo,
      image,
      categoryTypes,
      categoryType,
      chapter,
      collegeName,
      boardName,
      examYear,
      testPaperName,
      modelTestNo,
      liveExamNo,
      stem,
      q_ka,
      a_ka,
      q_kha,
      a_kha,
      q_ga,
      a_ga,
      q_gha,
      a_gha
    } = req.body;`;

const postCqReplace = `    const {
      serialNo,
      image,
      categoryTypes,
      categoryType,
      chapters,
      chapter,
      collegeNames,
      collegeName,
      boardNames,
      boardName,
      examYears,
      examYear,
      testPaperName,
      modelTestNos,
      modelTestNo,
      liveExamNo,
      stem,
      q_ka,
      a_ka,
      q_kha,
      a_kha,
      q_ga,
      a_ga,
      q_gha,
      a_gha
    } = req.body;

    const finalChapters = Array.isArray(chapters) && chapters.length > 0 ? chapters.map(c => String(c).trim()) : (chapter ? [String(chapter).trim()] : []);
    const finalColleges = Array.isArray(collegeNames) && collegeNames.length > 0 ? collegeNames.map(c => String(c).trim()) : (collegeName ? [String(collegeName).trim()] : []);
    const finalBoards = Array.isArray(boardNames) && boardNames.length > 0 ? boardNames.map(b => String(b).trim()) : (boardName ? [String(boardName).trim()] : []);
    const finalYears = Array.isArray(examYears) && examYears.length > 0 ? examYears.map(y => String(y).trim()) : (examYear ? [String(examYear).trim()] : []);
    const finalModels = Array.isArray(modelTestNos) && modelTestNos.length > 0 ? modelTestNos.map(m => String(m).trim()) : (modelTestNo ? [String(modelTestNo).trim()] : []);`;

if (s.includes(postCqTarget)) {
  s = s.replace(postCqTarget, postCqReplace);
  console.log("Updated POST /api/cqs destruct");
}

const newCqTarget = `    const newCq = new Cq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Board Question',
      chapter: chapter.trim(),
      collegeName: collegeName ? collegeName.trim() : '',
      boardName: boardName ? boardName.trim() : '',
      examYear: examYear ? String(examYear).trim() : '',`;

const newCqReplace = `    const newCq = new Cq({
      categoryTypes: finalCategoryTypes,
      categoryType: finalCategoryTypes[0] || 'Board Question',
      chapters: finalChapters,
      chapter: finalChapters[0] || (chapter ? chapter.trim() : ''),
      collegeNames: finalColleges,
      collegeName: finalColleges[0] || (collegeName ? collegeName.trim() : ''),
      boardNames: finalBoards,
      boardName: finalBoards[0] || (boardName ? boardName.trim() : ''),
      examYears: finalYears,
      examYear: finalYears[0] || (examYear ? String(examYear).trim() : ''),`;

if (s.includes(newCqTarget)) {
  s = s.replace(newCqTarget, newCqReplace);
  console.log("Updated new Cq constructor");
}

fs.writeFileSync(serverPath, s, 'utf8');
console.log("Done patching multi fields in server.js");
