const fs = require('fs');

const testWords = ['ID', 'Name', 'City', 'S01', 'Mim', 'Dhaka', 'Sub', 'Marks', 'Math', 'ICT'];
const regex = /\b(id|name|city|dhaka|khulna|sylhet|tinni|arif|mim|student|result|sub|marks|math|ict|class|section|morning|five|table|mr|manager|officer|date|address|mobile|salary|tk|sunamganj|raj|richi|bir|arjun|ctg|dha|com|dob|roll|gpa|atik|abir|asif|s01|s02|s03|e-101|e-102|e-103|e-104)\b/i;

testWords.forEach(w => {
    console.log(w, 'matches:', regex.test(w));
});
