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

let score = 0;

for(let skill of skills){

let count = countWord(resume, skill);

if(count > 0){
found.push(skill + " (" + count + ")");
score += Math.min(count * 6, 15);
}
else{
missing.push(skill);
}

}

let sections = ["education","skills","experience","project"];

for(let sec of sections){
if(resume.includes(sec)){
score += 5;
}
}

let words = resume.split(/\s+/).length;

if(words > 180){
score += 10;
}

if(score > 100) score = 100;

document.getElementById("progressBar").style.width = score + "%";

let color = "#ef4444";

if(score >= 70) color = "#22c55e";
else if(score >= 40) color = "#facc15";

document.getElementById("progressBar").style.background = color;

let verdict = "";

if(score >= 80) verdict = "Excellent Match";
else if(score >= 60) verdict = "Good Match";
else if(score >= 40) verdict = "Average Match";
else verdict = "Needs Improvement";

finalReport =
`ATS Match Score: ${score}%

Status: ${verdict}

Matched Skills:
${found.join(", ") || "None"}

Missing Skills:
${missing.join(", ") || "None"}

Suggestions:
${missing.length === 0 ? "Excellent profile for selected role." : "Add missing skills, projects and align resume with job description."}
`;

document.getElementById("result").innerHTML =
`<h2>ATS Match Score: ${score}%</h2>
<b>Status:</b> ${verdict}<br><br>

<b>Matched Skills:</b><br>
${found.join(", ") || "None"}<br><br>

<b>Missing Skills:</b><br>
${missing.join(", ") || "None"}<br><br>

<b>Suggestions:</b><br>
${missing.length === 0 ? "Excellent profile for selected role." : "Add missing skills, projects and align resume with JD."}`;

}

function downloadReport(){

let blob = new Blob([finalReport], {type:"text/plain"});

let a = document.createElement("a");

a.href = URL.createObjectURL(blob);
a.download = "resume_report.txt";
a.click();

}