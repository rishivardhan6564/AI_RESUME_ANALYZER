// script.js

let finalReport = "";

document.getElementById("fileInput").addEventListener("change", function(e){

let file = e.target.files[0];

if(file){
let reader = new FileReader();

reader.onload = function(event){
document.getElementById("resumeText").value = event.target.result;
};

reader.readAsText(file);
}

});

function countWord(text, word){
let regex = new RegExp("\\b" + word + "\\b","gi");
let matches = text.match(regex);
return matches ? matches.length : 0;
}

function analyzeResume(){

let resume = document.getElementById("resumeText").value.toLowerCase();
let role = document.getElementById("jobRole").value;
let jd = document.getElementById("jobDesc").value.toLowerCase();

let roleSkills = {
frontend:["html","css","javascript","react","git","api","responsive"],
java:["java","spring","sql","oop","hibernate","api"],
python:["python","django","flask","sql","api","pandas"],
data:["excel","sql","python","power bi","tableau"]
};

let skills = roleSkills[role];

if(jd.trim() !== ""){
let extra = jd.split(/\W+/).filter(word => word.length > 3);
skills = [...new Set([...skills,...extra])];
}

let found = [];
let missing = [];
let keywordScore = 0;

for(let skill of skills){

let count = countWord(resume, skill);

if(count > 0){
found.push(skill);
keywordScore += Math.min(count * 4, 6);
}else{
missing.push(skill);
}

}

if(keywordScore > 30) keywordScore = 30;

// Sections Score
let sections = ["education","skills","experience","project"];
let sectionScore = 0;

for(let sec of sections){
if(resume.includes(sec)) sectionScore += 5;
}
if(sectionScore > 20) sectionScore = 20;

// Formatting Score
let formattingScore = 0;
let words = resume.split(/\s+/).length;

if(words > 180) formattingScore += 10;
if(words < 800) formattingScore += 10;

// Readability Score
let readabilityScore = 0;
if(resume.includes(",")) readabilityScore += 5;
if(resume.includes(".")) readabilityScore += 5;
if(words > 150) readabilityScore += 5;

// File Compatibility
let fileScore = 15;

let total =
keywordScore +
sectionScore +
formattingScore +
readabilityScore +
fileScore;

if(total > 100) total = 100;

document.getElementById("progressBar").style.width = total + "%";

let color = "#ef4444";
if(total >= 70) color = "#22c55e";
else if(total >= 40) color = "#facc15";

document.getElementById("progressBar").style.background = color;

document.getElementById("scoreCards").innerHTML =

`<div class="card"><h3>Keyword Match</h3><p>${keywordScore}/30</p></div>

<div class="card"><h3>Sections</h3><p>${sectionScore}/20</p></div>

<div class="card"><h3>Formatting</h3><p>${formattingScore}/20</p></div>

<div class="card"><h3>Readability</h3><p>${readabilityScore}/15</p></div>

<div class="card"><h3>Compatibility</h3><p>${fileScore}/15</p></div>`;

let verdict = "";

if(total >= 80) verdict = "Excellent ATS Ready Resume";
else if(total >= 60) verdict = "Good Resume";
else if(total >= 40) verdict = "Average Resume";
else verdict = "Needs Improvement";

finalReport =
`ATS Score: ${total}/100

Status: ${verdict}

Matched Skills:
${found.join(", ") || "None"}

Missing Skills:
${missing.join(", ") || "None"}

Suggestions:
${missing.length === 0 ? "Excellent fit for selected role." : "Add missing skills, improve formatting and align with job description."}
`;

document.getElementById("result").innerHTML =

`<h2>Overall ATS Score: ${total}/100</h2>

<b>Status:</b> ${verdict}<br><br>

<b>Matched Skills:</b><br>
${found.join(", ") || "None"}<br><br>

<b>Missing Skills:</b><br>
${missing.join(", ") || "None"}<br><br>

<b>Suggestions:</b><br>
${missing.length === 0 ? "Excellent fit for selected role." : "Add missing skills, improve formatting and tailor resume to role."}`;

}

function downloadReport(){

let blob = new Blob([finalReport], {type:"text/plain"});
let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "resume_report.txt";
a.click();

}