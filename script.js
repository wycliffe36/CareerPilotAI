const { jsPDF } = window.jspdf;
let lastMissingKeywords = [];

function hideAll() {
  document.querySelectorAll('.form-box').forEach(b => b.style.display='none');
  document.getElementById('output').innerHTML='';
}

function showCV() { hideAll(); document.getElementById('cv-form').style.display='block'; }
function showCover() { hideAll(); document.getElementById('cover-form').style.display='block'; genCover(); }
function showEmail() { 
  hideAll(); 
  show("📧 Job Email Template\nSubject: Application for [Role] - [Your Name]\n\nDear Hiring Manager,\n\nI am writing to apply for the [Role] position at [Company]. Please find my CV attached.\n\nI am excited about the opportunity to contribute to your team.\n\nBest regards,\n[Your Name]\n[Phone]"); 
}
function showInterview() { 
  hideAll(); 
  const q = [
    "Q: Tell me about yourself\nA: Use Past-Present-Future. 1 minute max.",
    "Q: What's your biggest weakness?\nA: Name a real one + what you're doing to improve it.",
    "Q: Why should we hire you?\nA: Match 3 of your skills directly to the job description."
  ];
  show("🎤 Interview Coach\n" + q[Math.floor(Math.random()*q.length)]); 
}

function show(text) { document.getElementById('output').innerText = text; }

function checkATS() {
  let score = 0;
  let feedback = [];
  let cvText = (document.getElementById('summary').value + " + document.getElementById('skills').value + " + document.getElementById('experience').value).toLowerCase();
  let jobDesc = document.getElementById('jobdesc').value.toLowerCase();
  
  // Base sections check
  if(document.getElementById('name').value) score+=10; else feedback.push("Add Name");
  if(document.getElementById('email').value) score+=10; else feedback.push("Add Email");
  if(document.getElementById('skills').value) score+=10; else feedback.push("Add Skills");
  if(document.getElementById('experience').value) score+=10; else feedback.push("Add Experience");
  if(document.getElementById('education').value) score+=10; else feedback.push("Add Education");
  if(document.getElementById('summary').value) score+=10; else feedback.push("Add Summary");
  
  // Keyword Scanner
  lastMissingKeywords = [];
  let keywords = [];
  if(jobDesc) {
    let commonWords = ["the","and","to","a","for","of","in","with","on","is","are","you","your","that","this","we","will"];
    keywords = jobDesc.split(/[\s,.\n]+/).filter(w => w.length > 4 &&!commonWords.includes(w));
    keywords = [...new Set(keywords)].slice(0,20);
    
    let matched = keywords.filter(k => cvText.includes(k));
    lastMissingKeywords = keywords.filter(k =>!cvText.includes(k)).slice(0,8);
    let keywordScore = keywords.length > 0? Math.round((matched.length / keywords.length) * 40) : 0;
    score += keywordScore;
    
    feedback.push(`Matched ${matched.length}/${keywords.length} keywords`);
    if(lastMissingKeywords.length > 0) feedback.push(`Missing: ${lastMissingKeywords.join(", ")}`);
  }

  document.getElementById('ats-result').innerHTML = 
    `<h3>ATS Score: ${score}%</h3>
     <p><b>Keywords Found:</b> ${keywords.filter(k => cvText.includes(k)).join(", ") || "Paste Job Description first"}</p>
     <p><b>Next Steps:</b> ${feedback.join(" | ")}</p>`;
}

function aiRewrite() {
  if(lastMissingKeywords.length === 0) {
    alert("Click '1. Check ATS Score' first so I know which keywords are missing");
    return;
  }
  
  let exp = document.getElementById('experience').value;
  let skills = document.getElementById('skills').value;
  
  // AI Rewrite: Add missing keywords to experience and skills
  let keywordLine = "\n• Leveraged " + lastMissingKeywords.join(", ") + " to achieve key objectives";
  document.getElementById('experience').value = exp + keywordLine;
  
  document.getElementById('skills').value = skills + ", " + lastMissingKeywords.join(", ");
  
  alert("✅ CV Rewritten! Missing keywords added. Now click '1. Check ATS Score' again");
  checkATS(); // auto re-check
}

function downloadPDF() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(document.getElementById('name').value, 10, 20);
  doc.setFontSize(11);
  doc.text(document.getElementById('email').value + " | " + document.getElementById('phone').value, 10, 30);
  doc.text(document.getElementById('address').value, 10, 40);
  doc.text("PROFESSIONAL SUMMARY", 10, 55); doc.text(document.getElementById('summary').value, 10, 65, {maxWidth: 190});
  doc.text("WORK EXPERIENCE", 10, 90); doc.text(document.getElementById('experience').value, 10, 100, {maxWidth: 190});
  doc.text("EDUCATION", 10, 130); doc.text(document.getElementById('education').value, 10, 140, {maxWidth: 190});
  doc.text("SKILLS", 10, 160); doc.text(document.getElementById('skills').value, 10, 170, {maxWidth: 190});
  doc.text("REFERENCES", 10, 185); doc.text(document.getElementById('refs').value, 10, 195, {maxWidth: 190});
  doc.save("CareerPilot_CV.pdf");
}

function genCover() {
  let name = document.getElementById('c-name').value || "[Your Name]";
  let company = document.getElementById('c-company').value || "[Company]";
  let role = document.getElementById('c-role').value || "[Role]";
  let text = `Dear Hiring Manager,\n\nI am excited to apply for the ${role} position at ${company}. With my background and skills, I am confident I can contribute to your team's success and help achieve company goals.\n\nI would welcome the opportunity to discuss how my experience aligns with this role.\n\nSincerely,\n${name}`;
  document.getElementById('c-text').value = text;
}

function downloadCover() {
  const doc = new jsPDF();
  const text = document.getElementById('c-text').value;
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 20);
  doc.save("Cover_Letter.pdf");
}
