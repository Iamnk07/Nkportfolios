/* main.js - shared across pages
   - Loader shows only on first visit using localStorage flag 'nk_loader_done'
   - Animated loader progress to 99-100%
   - Particle background
   - Cursor glow
   - Tilt interactions
   - Render projects, skills, certificates, experience
*/

/* -------- Configuration: edit these arrays to add your content ------- */
const ASSETS = {
  resume: 'assets/resume.pdf',
  profile: 'assets/profile.jpg'
};

const PROJECTS = [
  { image:'assets/project1.jpg', title:'Bike-Time — Immersive Experience', desc:'Interactive front-end with fluid animations.', tags:['React','Tailwind','Animations'], link:'#' },
  { image:'assets/project2.jpg', title:'3D Portfolio — Interactive', desc:'Three.js + GSAP interactive portfolio.', tags:['Three.js','React'], link:'#' },
  { image:'assets/project1.jpg', title:'Landing Page — Animated', desc:'Modern animated landing page.', tags:['HTML','CSS','JS'], link:'#' }
];

const CERTIFICATES = [
  { id:1, title:'Web Dev Certificate', desc:'Foundations of web development', type:'image', data:'assets/cert1.jpg' },
  { id:2, title:'Cloud Basics', desc:'Intro to cloud', type:'pdf', data:'assets/cert1.pdf' },
  // add more
];

const SKILLS = [
  { name:'HTML5', icon:'fab fa-html5' },
  { name:'CSS3', icon:'fab fa-css3-alt' },
  { name:'JavaScript', icon:'fab fa-js' },
  { name:'React', icon:'fab fa-react' },
  { name:'Node.js', icon:'fab fa-node-js' },
  { name:'Python', icon:'fab fa-python' },
  { name:'MongoDB', icon:'fas fa-database' },
  { name:'Docker', icon:'fab fa-docker' },
  { name:'Kubernetes', icon:'fas fa-server' },
  { name:'AWS', icon:'fab fa-aws' },
  { name:'Git', icon:'fab fa-git' }
];

const EXPERIENCES = [
  { role:'Data Annalytic ', org:'Deloitte.', period:'Jul 2025 – Present', desc:'Builte a Dta sheet and Data source Connect Using Tableau and many Tools ' },
  { role:'Software Engineer Virtual Internship ', org:'J.P Morgan', period:'2025', desc:'Contributed to docs and small libraries.' }
];
/* ------------------------------------------------------------------- */

/* small helpers */
const $id = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const escapeHtml = s => (s+'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

/* ---------- Loader: show only once using localStorage ---------- */
(function handleLoader(){
  const wrap = $id('loaderWrap');
  // If no loader element on page just exit
  if(!wrap) return;

  const progressEl = $id('loaderProgress');
  const percentEl = $id('loaderPercent');

  const flag = localStorage.getItem('nk_loader_done'); // 'yes' if already shown
  if(flag){
    // Hide immediately
    wrap.style.display = 'none';
    if(progressEl) progressEl.style.width = '100%';
    if(percentEl) percentEl.textContent = '100%';
    return;
  }

  // Show loader (first visit)
  wrap.style.display = 'flex';

  // Animate progress to ~95-99 then finalize after 3000ms
  let p = 0;
  const tick = () => {
    // fast initial, slower later
    const step = (p < 60) ? (Math.random()*8 + 6) : (Math.random()*4 + 1);
    p = Math.min(98, p + step);
    if(progressEl) progressEl.style.width = p + '%';
    if(percentEl) percentEl.textContent = Math.round(p) + '%';
  };
  const interval = setInterval(tick, 120);

  // Ensure loader visible for 3000ms then finish
  setTimeout(()=> {
    clearInterval(interval);
    if(progressEl) progressEl.style.width = '100%';
    if(percentEl) percentEl.textContent = '100%';
    // small delay then hide
    setTimeout(()=> {
      wrap.classList.add('loader-hidden');
      setTimeout(()=> { wrap.style.display = 'none'; }, 520);
    }, 220);
    localStorage.setItem('nk_loader_done','yes');
  }, 3000);
})();

/* ---------- Particles (light) ---------- */
(function particles(){
  const canvas = $id('particles'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth, h = canvas.height = innerHeight;
  let parts = [];
  const N = Math.max(20, Math.floor((w*h)/180000));
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function init(){ parts=[]; for(let i=0;i<N;i++) parts.push({x:rand(0,w), y:rand(0,h), r:rand(0.6,2.6), vx:rand(-0.3,0.3), vy:rand(-0.3,0.3)}); }
  init();
  addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; init(); });
  (function frame(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = w; if(p.x > w) p.x = 0; if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
      ctx.beginPath(); ctx.fillStyle = 'rgba(155,89,255,0.04)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(frame);
  })();
})();

/* ---------- Cursor glow ---------- */
(function cursor(){
  const el = $id('cursorGlow'); if(!el) return;
  el.style.background = 'radial-gradient(circle, rgba(155,89,255,0.18), rgba(111,43,216,0.08) 40%, transparent 60%)';
  el.style.opacity = '0';
  let t;
  window.addEventListener('mousemove', e=>{
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.width = '120px'; el.style.height = '120px'; el.style.opacity = '1';
    clearTimeout(t); t = setTimeout(()=>{ el.style.width='36px'; el.style.height='36px'; el.style.opacity='0.6'; }, 900);
  });
  window.addEventListener('mouseout', ()=> el.style.opacity='0');
})();

/* ---------- 3D tilt for elements with data-tilt ---------- */
(function tilt(){
  function apply(el,e){
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / r.width, dy = (e.clientY - cy) / r.height;
    const rx = (dy * 10).toFixed(2), ry = (dx * -10).toFixed(2);
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }
  function reset(el){ el.style.transform = ''; }
  document.addEventListener('mousemove', e=>{
    qsa('[data-tilt]').forEach(el=>apply(el,e));
    qsa('.proj-card').forEach(el=>apply(el,e));
  });
  document.addEventListener('mouseout', ()=>{ qsa('[data-tilt]').forEach(reset); qsa('.proj-card').forEach(reset); });
})();

/* ---------- Render functions for pages ---------- */
function renderProjects(){
  const grid = $id('projectsGrid'); if(!grid) return;
  grid.innerHTML = '';
  PROJECTS.forEach(p=>{
    const card = document.createElement('div'); card.className = 'proj-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.title)}" />
      <div class="p-body">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="muted">${escapeHtml(p.desc)}</p>
        <div class="proj-tags">${p.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>
        <div style="margin-top:10px"><a class="btn gradient" href="${p.link}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> View Project</a></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderCertificates(){
  const grid = $id('certGrid'); if(!grid) return;
  grid.innerHTML = '';
  CERTIFICATES.forEach(c=>{
    const d = document.createElement('div'); d.className = 'cert-card';
    const thumb = c.type === 'image' ? `<img src="${c.data}" alt="${escapeHtml(c.title)}">` : `<div style="height:120px;display:flex;align-items:center;justify-content:center"><i class="fas fa-file-pdf" style="font-size:44px;color:#cfe7d0"></i></div>`;
    d.innerHTML = `
      ${thumb}
      <div style="font-weight:800;margin-top:8px">${escapeHtml(c.title)}</div>
      <div class="muted" style="font-size:13px">${escapeHtml(c.desc)}</div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:center">
        <button class="btn gradient" onclick="viewCert('${c.data}')"><i class="fas fa-eye"></i> View</button>
        ${c.type === 'pdf' ? `<button class="btn outline" onclick="downloadFile('${c.data}','${c.title}.pdf')"><i class="fas fa-download"></i> Download</button>` : ''}
      </div>
    `;
    grid.appendChild(d);
  });
}

function renderSkills(){
  const grid = $id('skillsGrid'); if(!grid) return;
  grid.innerHTML = '';
  SKILLS.forEach(s=>{
    const card = document.createElement('div'); card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-icon"><i class="${s.icon}"></i></div>
      <div style="font-weight:800;margin-top:6px">${escapeHtml(s.name)}</div>
    `;
    grid.appendChild(card);
  });
}

function renderExperience(){
  const el = $id('experienceList'); if(!el) return;
  el.innerHTML = '';
  EXPERIENCES.forEach(ex=>{
    const d = document.createElement('div'); d.className = 'exp-item';
    d.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><strong>${escapeHtml(ex.role)}</strong><div class="muted">${escapeHtml(ex.org)}</div></div>
        <div class="muted">${escapeHtml(ex.period)}</div>
      </div>
      <div style="margin-top:8px" class="muted">${escapeHtml(ex.desc)}</div>
    `;
    el.appendChild(d);
  });
}

/* ---------- Utilities & actions ---------- */
function viewCert(url){ window.open(url,'_blank'); }
function downloadFile(url, name){ const a = document.createElement('a'); a.href = url; a.download = name || ''; document.body.appendChild(a); a.click(); a.remove(); }
function downloadResume(){ downloadFile(ASSETS.resume || 'assets/resume.pdf', 'Niyaz_Khan_Resume.pdf'); }
function sendMessage(e){
  e.preventDefault();
  const name = $id('cname') && $id('cname').value.trim();
  const email = $id('cemail') && $id('cemail').value.trim();
  const msg = $id('cmsg') && $id('cmsg').value.trim();
  const subject = encodeURIComponent('Portfolio contact from ' + (name || 'Someone'));
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  location.href = `mailto:niyaz@example.com?subject=${subject}&body=${body}`;
}

/* ---------- Init page on DOM ready ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // wire resume buttons (if present)
  const vr = document.querySelector('#viewResumeBtn'); if(vr) vr.setAttribute('href', ASSETS.resume);
  const dr = document.querySelector('#downloadResumeBtn'); if(dr) dr.addEventListener('click', e=>{ e.preventDefault(); downloadResume(); });

  // Render content depending on page
  const page = document.body.getAttribute('data-page') || '';
  if(page === 'projects') setTimeout(renderProjects, 60);
  if(page === 'certificates') setTimeout(renderCertificates, 60);
  if(page === 'skills') setTimeout(renderSkills, 60);
  if(page === 'experience') setTimeout(renderExperience, 60);

  // Add tilt attr to project cards after render
  setTimeout(()=>{ qsa('.proj-card').forEach(el=>el.setAttribute('data-tilt','')); }, 300);

  // mark active nav link visually
  qsa('.site-nav nav a').forEach(a=>{
    try {
      if(a.getAttribute('href').includes(page) || (page === 'index' && a.getAttribute('href') === 'index.html')) a.classList.add('active');
    } catch(e){}
  });
});

/* expose for inline handler */
window.viewCert = viewCert;
window.downloadFile = downloadFile;
window.downloadResume = downloadResume;
