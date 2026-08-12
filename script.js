
const { jsPDF } = window.jspdf;

function hideAll() {
  document.querySelectorAll('.form-box').forEach(b => b.style.display='none');
  document.getElementById('output').innerHTML='';
}

function showCV() { hideAll(); document.getElementById('cv-form').style.display='block'; }
function showCover() { hideAll(); document.getElementById('cover-form').style.display='block'; genCover(); }
function showEmail() { hideAll(); show("📧 Job Email\nSubject: Application for [Role] - [Your Name]\n\nHello Hiring Manager,\n\nAttached is my CV for the [Role] position.\n\nBest,\n[Your Name]"); }
function showInterview() { hideAll(); show("🎤 Interview Q: Tell me about yourself\nA: Past → Present → Future. Keep it 1 min."); }

function show(text) { document.getElementById('output').innerText = text; }

function checkATS() {
  let score = 0;
  let feedback = [];
  if(document.getElementById('name').value) score+=10; else feedback.push("Add Name");
  if(document.getElementById('email').value) score+=10; else feedback.push("Add Email");
  if(document.getElementById('skills').value) score+=20; else feedback.push("Add Skills");
  if(document.getElementById('experience').value) score+=20; else feedback.push("Add Experience");
  if(document.getElementById('education').value) score+=20; else feedback.push("Add Education");
  if(document.getElementById('summary').value) score+=20; else feedback.push("Add Summary");
  
  document.getElementById('ats-result').innerHTML = 
    `<h3>ATS Score: ${score}%</h3><p>${feedback.join(', ')}</p>`;
}

function downloadPDF() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(document.getElementById('name').value, 10, 20);
  doc.setFontSize(11);
  doc.text(document.getElementById('email').value + " | " + document.getElementById('phone').value, 10, 30);
  doc.text(document.getElementById('address').value, 10, 40);
  doc.text("SUMMARY", 10, 55); doc.text(document.getElementById('summary').value, 10, 65);
  doc.text("EXPERIENCE", 10, 85); doc.text(document.getElementById('experience').value, 10, 95);
  doc.text("EDUCATION", 10, 115); doc.text(document.getElementById('education').value, 10, 125);
  doc.text("SKILLS", 10, 145); doc.text(document.getElementById('skills').value, 10, 155);
  doc.save("CareerPilot_CV.pdf");
}

function genCover() {
  let name = document.getElementById('c-name').value || "[Your Name]";
  let company = document.getElementById('c-company').value || "[Company]";
  let role = document.getElementById('c-role').value || "[Role]";
  let text = `Dear Hiring Manager,\n\nI am excited to apply for the ${role} position at ${company}. With my experience and skills, I am confident I can contribute to your team.\n\nSincerely,\n${name}`;
  document.getElementById('c-text').value = text;
}

function downloadCover() {
  const doc = new jsPDF();
  doc.text(document.getElementById('c-text').value, 10, 20);
  doc.save("Cover_Letter.pdf");
}
