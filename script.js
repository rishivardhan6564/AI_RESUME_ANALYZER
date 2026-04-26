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

function analyzeResume(){

  let text = document.getElementById("resumeText").value.toLowerCase();

  let score = 0;
  let feedback = "";

  let requiredSections = ["education","skills","experience","project"];
  let requiredSkills = ["html","css","javascript","react","python","sql","java"];

  let foundSkills = [];
  let missingSkills = [];

  for(let section of requiredSections){
    if(text.includes(section)){
      score += 15;
    } else {
      feedback += "Missing section: " + section + "\n";
    }
  }

  for(let skill of requiredSkills){
    if(text.includes(skill)){
      score += 5;
      foundSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  let words = text.split(/\s+/).length;

  if(words > 180){
    score += 10;
  } else {
    feedback += "Resume content looks short\n";
  }

  if(score > 100) score = 100;

  document.getElementById("progressBar").style.width = score + "%";

  finalReport =
`Resume Score: ${score}/100

Detected Skills:
${foundSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Suggestions:
${feedback || "Strong resume structure."}
`;

  document.getElementById("result").innerText = finalReport;
}

function downloadReport(){

  let blob = new Blob([finalReport], {type:"text/plain"});

  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "resume_report.txt";
  a.click();
}