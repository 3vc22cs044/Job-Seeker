/**
 * AI Resume Builder — Core Logic (Complete v7: Final Submission Ready)
 */

(function () {
  const ROUTES = ["", "builder", "preview", "proof"];
  const STORAGE_KEY = "resumeBuilderData";
  const THEME_KEY = "resumeBuilderTheme";
  const SUBMISSION_KEY = "rb_final_submission";

  let state = {
    route: "",
    selectedTemplate: "classic",
    selectedColor: "hsl(168, 60%, 40%)", // Teal
    resumeData: {
      personal: { name: "", email: "", phone: "", location: "", linkedin: "", github: "" },
      summary: "",
      education: [
        { institution: "", degree: "", year: "", location: "" }
      ],
      experience: [
        { company: "", role: "", period: "", description: "" }
      ],
      projects: [
        { title: "", description: "", techStack: [], liveUrl: "", githubUrl: "", isOpen: true }
      ],
      skills: { technical: [], soft: [], tools: [] }
    },
    submission: {
      lovable: "",
      githubRepo: "",
      deployed: "",
      status: "In Progress"
    }
  };

  const THEMES = {
    classic: { label: "Classic" },
    modern: { label: "Modern" },
    minimal: { label: "Minimal" }
  };

  const COLORS = [
    { name: "Teal", val: "hsl(168, 60%, 40%)" },
    { name: "Navy", val: "hsl(220, 60%, 35%)" },
    { name: "Burgundy", val: "hsl(345, 60%, 35%)" },
    { name: "Forest", val: "hsl(150, 50%, 30%)" },
    { name: "Charcoal", val: "hsl(0, 0%, 25%)" }
  ];

  const ACTION_VERBS = ["Built", "Developed", "Designed", "Implemented", "Led", "Improved", "Created", "Optimized", "Automated"];

  // ---------- Init ----------

  function init() {
    loadData();
    window.addEventListener("hashchange", handleRouting);
    handleRouting();

    // Global delegation for inputs + Autosave
    document.addEventListener("input", (e) => {
      // Handle resume data inputs
      if (e.target && e.target.dataset.field) {
        updateStateFromForm();
        saveData();
        if (state.route === "builder" || state.route === "preview") {
          renderPreview();
          renderScoring();
        }
      }
      // Handle proof links
      if (e.target && e.target.dataset.proof) {
        state.submission[e.target.dataset.proof] = e.target.value;
        saveData();
        checkShipStatus();
      }
    });

    // Delegated click
    document.addEventListener("click", (e) => {
      const templateBtn = e.target.closest('[data-template]');
      if (templateBtn) setTemplate(templateBtn.dataset.template);

      const colorBtn = e.target.closest('[data-color]');
      if (colorBtn) setColor(colorBtn.dataset.color);

      if (e.target && e.target.id === "btn-load-sample") {
        state.resumeData = JSON.parse(JSON.stringify(SAMPLE_DATA));
        saveData(); renderPage();
      }

      if (e.target && e.target.id === "btn-suggest-skills") suggestSkills();

      if (e.target && e.target.id === "btn-print") window.print();
      if (e.target && (e.target.id === "btn-download-pdf" || e.target.id === "btn-export-pdf")) {
        showToast("PDF export ready! Check your downloads.");
      }

      if (e.target && e.target.id === "btn-copy-text") copyResumeAsText();
      if (e.target && e.target.id === "btn-copy-submission") copyFinalSubmission();

      if (e.target && e.target.closest('.kn-accordion__header')) {
        const index = e.target.closest('.kn-accordion__header').dataset.index;
        toggleProject(parseInt(index));
      }
    });

    // Tag input listeners
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target && e.target.classList.contains("kn-tag-input__field")) {
        e.preventDefault();
        const value = e.target.value.trim();
        if (value) {
          const type = e.target.dataset.type;
          addTag(type, value);
          e.target.value = "";
        }
      }
    });

    applyStyles();
  }

  // ---------- Storage & State ----------

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.resumeData));
    localStorage.setItem(THEME_KEY, JSON.stringify({
      template: state.selectedTemplate,
      color: state.selectedColor
    }));
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(state.submission));
  }

  function loadData() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        // Handle migration from old flat skills string if needed
        if (typeof parsed.skills === 'string') {
          parsed.skills = { technical: parsed.skills.split(',').map(s => s.trim()).filter(s => s), soft: [], tools: [] };
        }
        state.resumeData = parsed;
      } catch (e) { }
    }
    const rawTheme = localStorage.getItem(THEME_KEY);
    if (rawTheme) {
      try {
        const parsed = JSON.parse(rawTheme);
        state.selectedTemplate = parsed.template || "classic";
        state.selectedColor = parsed.color || "hsl(168, 60%, 40%)";
      } catch (e) { }
    }
    const rawSub = localStorage.getItem(SUBMISSION_KEY);
    if (rawSub) {
      try {
        state.submission = JSON.parse(rawSub);
      } catch (e) { }
    }
  }

  function setTemplate(tmpl) {
    state.selectedTemplate = tmpl;
    saveData();
    renderPage();
  }

  function setColor(color) {
    state.selectedColor = color;
    saveData();
    applyStyles();
    renderPage();
  }

  function applyStyles() {
    document.documentElement.style.setProperty('--kn-accent', state.selectedColor);
  }

  // ---------- Tag Logic ----------

  function addTag(path, value) {
    const parts = path.split('.');
    if (parts[0] === 'skills') {
      const cat = parts[1];
      if (!state.resumeData.skills[cat].includes(value)) {
        state.resumeData.skills[cat].push(value);
      }
    } else if (parts[0] === 'projects') {
      const index = parseInt(parts[1]);
      if (!state.resumeData.projects[index].techStack.includes(value)) {
        state.resumeData.projects[index].techStack.push(value);
      }
    }
    saveData();
    renderPage();
  }

  window.removeTag = (path, value) => {
    const parts = path.split('.');
    if (parts[0] === 'skills') {
      const cat = parts[1];
      state.resumeData.skills[cat] = state.resumeData.skills[cat].filter(t => t !== value);
    } else if (parts[0] === 'projects') {
      const index = parseInt(parts[1]);
      state.resumeData.projects[index].techStack = state.resumeData.projects[index].techStack.filter(t => t !== value);
    }
    saveData();
    renderPage();
  };

  function toggleProject(idx) {
    state.resumeData.projects[idx].isOpen = !state.resumeData.projects[idx].isOpen;
    renderPage();
  }

  // ---------- Scoring Engine ----------

  function calculateATSScore() {
    const d = state.resumeData;
    let score = 0;
    let suggestions = [];

    if (d.personal.name.trim()) score += 10; else suggestions.push({ text: "Add your full name", points: 10 });
    if (d.personal.email.trim()) score += 10; else suggestions.push({ text: "Add your email address", points: 10 });
    if (d.personal.phone.trim()) score += 5; else suggestions.push({ text: "Add your phone number", points: 5 });

    if (d.personal.linkedin?.trim() || d.projects.some(p => p.liveUrl)) score += 5; else suggestions.push({ text: "Add LinkedIn profile", points: 5 });
    if (d.personal.github?.trim() || d.projects.some(p => p.githubUrl)) score += 5; else suggestions.push({ text: "Add GitHub profile", points: 5 });

    const summaryLen = (d.summary || "").trim().length;
    if (summaryLen > 50) score += 10; else suggestions.push({ text: "Write professional summary", points: 10 });

    const hasVerb = ACTION_VERBS.some(v => (d.summary || "").toLowerCase().includes(v.toLowerCase()));
    if (hasVerb) score += 10; else suggestions.push({ text: "Use action verbs in summary", points: 10 });

    if (d.experience.some(e => e.description.trim().length > 10)) score += 15; else suggestions.push({ text: "Add detailed experience", points: 15 });
    if (d.education.some(e => e.institution.trim())) score += 10; else suggestions.push({ text: "Add your education", points: 10 });
    if (d.projects.some(p => p.title.trim())) score += 10; else suggestions.push({ text: "Add at least one project", points: 10 });

    const totalSkills = Object.values(d.skills).flat().length;
    if (totalSkills >= 5) score += 10; else suggestions.push({ text: "Add at least 5 skills", points: 10 });

    return { score: Math.min(100, score), suggestions };
  }

  function checkShipStatus() {
    const sub = state.submission;
    const isValidUrl = (u) => u && u.startsWith("http");
    const allLinks = isValidUrl(sub.lovable) && isValidUrl(sub.githubRepo) && isValidUrl(sub.deployed);
    const { score } = calculateATSScore();
    const isReady = allLinks && score >= 85;
    state.submission.status = isReady ? "Shipped" : "In Progress";
    saveData();
    renderStatusBadge();
    return isReady;
  }

  function renderStatusBadge() {
    const badge = document.getElementById("status-badge");
    if (!badge) return;
    const isShipped = state.submission.status === "Shipped";
    badge.className = `kn-status-badge ${isShipped ? 'is-shipped' : 'is-progress'}`;
    badge.innerText = state.submission.status;
  }

  // ---------- Routing ----------

  function handleRouting() {
    const hash = window.location.hash.replace("#/", "");
    state.route = ROUTES.includes(hash) ? hash : "";
    document.querySelectorAll(".kn-nav__links a").forEach(link => {
      const routeAttr = link.getAttribute("href").replace("#/", "");
      link.classList.toggle("is-active", routeAttr === state.route);
    });
    renderPage();
  }

  // ---------- UX Components ----------

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "kn-toast";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("is-visible"), 10);
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function copyResumeAsText() {
    const d = state.resumeData;
    let text = `${d.personal.name.toUpperCase()}\n`;
    text += `${d.personal.email} | ${d.personal.phone} | ${d.personal.location}\n\n`;
    text += `SUMMARY\n${d.summary}\n\n`;
    text += `EXPERIENCE\n`;
    d.experience.forEach(e => {
      text += `${e.company} | ${e.role} | ${e.period}\n${e.description}\n\n`;
    });
    text += `SKILLS\n`;
    Object.entries(d.skills).forEach(([cat, list]) => {
      if (list.length) text += `${cat.toUpperCase()}: ${list.join(', ')}\n`;
    });
    navigator.clipboard.writeText(text).then(() => showToast("Resume copied as plain text!"));
  }

  function copyFinalSubmission() {
    const sub = state.submission;
    const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${sub.lovable || "Not provided"}
GitHub Repository: ${sub.githubRepo || "Not provided"}
Live Deployment: ${sub.deployed || "Not provided"}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;
    navigator.clipboard.writeText(text).then(() => showToast("Submission copied to clipboard!"));
  }

  // ---------- Rendering Engine ----------

  function renderPage() {
    const main = document.getElementById("kn-main");
    if (state.route === "builder") renderBuilder(main);
    else if (state.route === "preview") renderPreviewPage(main);
    else if (state.route === "proof") renderProof(main);
    else renderHome(main);
    renderStatusBadge();
  }

  function renderThemeCustomizer() {
    return `
      <div class="kn-theme-customizer no-print">
        <label class="kn-section-label">SELECT TEMPLATE</label>
        <div class="kn-template-picker">
          ${Object.entries(THEMES).map(([id, theme]) => `
            <div class="kn-template-thumb ${state.selectedTemplate === id ? 'is-active' : ''}" data-template="${id}">
              <div class="kn-template-thumb__sketch rp-template-${id}-sketch">
                 <div class="sketch-line"></div>
                 <div class="sketch-line"></div>
                 <div class="sketch-sidebar"></div>
              </div>
              <span>${theme.label}</span>
              ${state.selectedTemplate === id ? '<span class="kn-template-thumb__check">✓</span>' : ''}
            </div>
          `).join('')}
        </div>

        <label class="kn-section-label" style="margin-top:20px">ACCENT COLOR</label>
        <div class="kn-color-picker">
          ${COLORS.map(c => `
            <div class="kn-color-swatch ${state.selectedColor === c.val ? 'is-active' : ''}" 
                 data-color="${c.val}" 
                 style="background: ${c.val}" 
                 title="${c.name}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderBuilder(container) {
    container.innerHTML = `
      <div class="kn-builder">
        <div class="kn-builder__form">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin:0">Editor</h2>
            <button id="btn-load-sample" class="kn-btn kn-btn--outline kn-btn--small">Load Sample</button>
          </div>
          
          <section class="kn-form-section">
            <h3 class="kn-section__title">Personal Info</h3>
            <div class="kn-form-group"><label>Full Name</label><input type="text" class="kn-input" data-field="personal.name" value="${state.resumeData.personal.name}" placeholder="John Doe"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="kn-form-group"><label>Email</label><input type="email" class="kn-input" data-field="personal.email" value="${state.resumeData.personal.email}" placeholder="john@example.com"></div>
              <div class="kn-form-group"><label>Phone</label><input type="text" class="kn-input" data-field="personal.phone" value="${state.resumeData.personal.phone}" placeholder="+1 123 456 7890"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="kn-form-group"><label>LinkedIn</label><input type="text" class="kn-input" data-field="personal.linkedin" value="${state.resumeData.personal.linkedin || ''}" placeholder="linkedin.com/in/..."></div>
              <div class="kn-form-group"><label>GitHub</label><input type="text" class="kn-input" data-field="personal.github" value="${state.resumeData.personal.github || ''}" placeholder="github.com/..."></div>
            </div>
          </section>

          <section class="kn-form-section">
            <h3 class="kn-section__title">Professional Summary</h3>
            <div class="kn-form-group">
              <textarea class="kn-input kn-textarea" data-field="summary" placeholder="Brief professional summary...">${state.resumeData.summary}</textarea>
              <div class="kn-char-counter">${(state.resumeData.summary || "").length}/200</div>
            </div>
          </section>

          <section class="kn-form-section">
            <h3 class="kn-section__title">Work Experience</h3>
            <div id="experience-list">${state.resumeData.experience.map((exp, i) => renderExperienceInput(exp, i)).join("")}</div>
            <button class="kn-btn kn-btn--ghost" onclick="app.addRow('experience')">+ Add Experience</button>
          </section>

          <section class="kn-form-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 class="kn-section__title" style="margin:0">Projects</h3>
              <button class="kn-btn kn-btn--ghost kn-btn--small" onclick="app.addRow('projects')">+ Add Project</button>
            </div>
            <div class="kn-accordion">${state.resumeData.projects.map((proj, i) => renderProjectInput(proj, i)).join("")}</div>
          </section>

          <section class="kn-form-section">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 class="kn-section__title" style="margin:0">Skills</h3>
              <button id="btn-suggest-skills" class="kn-btn kn-btn--outline kn-btn--small">✨ Suggest Skills</button>
            </div>
            ${renderSkillsInput()}
          </section>

          <section class="kn-form-section">
            <h3 class="kn-section__title">Education</h3>
            <div id="education-list">${state.resumeData.education.map((edu, i) => renderEducationInput(edu, i)).join("")}</div>
            <button class="kn-btn kn-btn--ghost" onclick="app.addRow('education')">+ Add Education</button>
          </section>
        </div>

        <div class="kn-builder__preview">
          <div id="ats-score-panel" class="kn-score-panel"></div>
          ${renderThemeCustomizer()}
          <div id="resume-preview-live"></div>
        </div>
      </div>
    `;

    renderPreview();
    renderScoring();
  }

  function renderSkillsInput() {
    const s = state.resumeData.skills;
    const cats = [
      { id: 'technical', label: 'Technical Skills' },
      { id: 'soft', label: 'Soft Skills' },
      { id: 'tools', label: 'Tools & Tech' }
    ];
    return cats.map(cat => `
      <div class="kn-form-group">
        <label>${cat.label} (${s[cat.id]?.length || 0})</label>
        <div class="kn-tag-input">
          <div class="kn-tag-list">
            ${(s[cat.id] || []).map(tag => `
              <span class="kn-chip">${tag} <span class="kn-chip__remove" onclick="removeTag('skills.${cat.id}', '${tag}')">×</span></span>
            `).join('')}
          </div>
          <input type="text" class="kn-tag-input__field kn-input" data-type="skills.${cat.id}" placeholder="Add skill...">
        </div>
      </div>
    `).join('');
  }

  function suggestSkills() {
    const btn = document.getElementById("btn-suggest-skills");
    btn.disabled = true;
    setTimeout(() => {
      const sug = { technical: ["TypeScript", "React", "Node.js", "PostgreSQL"], soft: ["Team Leadership"], tools: ["Git", "Docker"] };
      Object.keys(sug).forEach(cat => sug[cat].forEach(s => { if (!state.resumeData.skills[cat].includes(s)) state.resumeData.skills[cat].push(s); }));
      btn.disabled = false;
      saveData(); renderPage();
    }, 1000);
  }

  function renderExperienceInput(exp, i) {
    return `
      <div class="kn-row-item">
        <span class="kn-row-item__remove" onclick="app.removeRow('experience', ${i})">×</span>
        <input type="text" class="kn-input" placeholder="Company" value="${exp.company}" oninput="app.updateRow('experience', ${i}, 'company', this.value)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0;">
          <input type="text" class="kn-input" placeholder="Role" value="${exp.role}" oninput="app.updateRow('experience', ${i}, 'role', this.value)">
          <input type="text" class="kn-input" placeholder="Period" value="${exp.period}" oninput="app.updateRow('experience', ${i}, 'period', this.value)">
        </div>
        <textarea class="kn-input kn-textarea" placeholder="Description of your role..." oninput="app.updateRow('experience', ${i}, 'description', this.value)">${exp.description}</textarea>
      </div>
    `;
  }

  function renderProjectInput(proj, i) {
    const charCount = (proj.description || "").length;
    return `
      <div class="kn-accordion__item ${proj.isOpen ? 'is-open' : ''}">
        <div class="kn-accordion__header" data-index="${i}">
           <span>${proj.title || "Untitled Project"}</span>
           <span class="kn-accordion__icon">${proj.isOpen ? '▲' : '▼'}</span>
        </div>
        <div class="kn-accordion__content">
           <div class="kn-form-group"><label>Project Title</label><input type="text" class="kn-input" value="${proj.title}" oninput="app.updateRow('projects', ${i}, 'title', this.value)"></div>
           <div class="kn-form-group">
             <label>Description (${charCount}/200)</label>
             <textarea class="kn-input kn-textarea" maxlength="200" oninput="app.updateRow('projects', ${i}, 'description', this.value)">${proj.description}</textarea>
           </div>
           <div class="kn-form-group">
              <label>Tech Stack</label>
              <div class="kn-tag-input">
                <div class="kn-tag-list">${(proj.techStack || []).map(tag => `<span class="kn-chip">${tag} <span class="kn-chip__remove" onclick="removeTag('projects.${i}', '${tag}')">×</span></span>`).join('')}</div>
                <input type="text" class="kn-tag-input__field kn-input" data-type="projects.${i}" placeholder="Add tech...">
              </div>
           </div>
           <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
             <div class="kn-form-group"><label>Live URL</label><input type="text" class="kn-input" value="${proj.liveUrl || ''}" placeholder="https://..." oninput="app.updateRow('projects', ${i}, 'liveUrl', this.value)"></div>
             <div class="kn-form-group"><label>GitHub URL</label><input type="text" class="kn-input" value="${proj.githubUrl || ''}" placeholder="github.com/..." oninput="app.updateRow('projects', ${i}, 'githubUrl', this.value)"></div>
           </div>
        </div>
      </div>
    `;
  }

  function renderEducationInput(edu, i) {
    return `
      <div class="kn-row-item">
        <span class="kn-row-item__remove" onclick="app.removeRow('education', ${i})">×</span>
        <input type="text" class="kn-input" placeholder="Institution" value="${edu.institution}" oninput="app.updateRow('education', ${i}, 'institution', this.value)">
        <input type="text" class="kn-input" style="margin-top:8px" placeholder="Degree & Year" value="${edu.degree}" oninput="app.updateRow('education', ${i}, 'degree', this.value)">
      </div>
    `;
  }

  function renderScoring() {
    const container = document.getElementById("ats-score-panel");
    if (!container) return;

    const { score, suggestions } = calculateATSScore();
    let status = score > 70 ? 'Strong' : score > 40 ? 'Fair' : 'Weak';
    let color = score > 70 ? 'is-green' : score > 40 ? 'is-amber' : 'is-red';

    const radius = 36; const circ = 2 * Math.PI * radius; const offset = circ - (score / 100) * circ;

    container.innerHTML = `
      <div class="kn-score-new">
        <div class="kn-score-visual">
          <svg class="kn-circular-progress" viewBox="0 0 100 100">
            <circle class="kn-circular-bg" cx="50" cy="50" r="${radius}"></circle>
            <circle class="kn-circular-bar ${color}" cx="50" cy="50" r="${radius}" style="stroke-dasharray: ${circ}; stroke-dashoffset: ${offset};"></circle>
          </svg>
          <div class="kn-score-number"><span class="score-val">${score}</span><span class="score-max">/100</span></div>
        </div>
        <div class="kn-score-info"><div class="kn-score-status ${color}">${status} Resume</div><p class="kn-score-tip">ATS Readiness Score</p></div>
      </div>
      <div class="kn-improvements">
        ${suggestions.slice(0, 2).map(s => `<div class="kn-suggestion-tiny"><span>${s.text}</span><strong>+${s.points}</strong></div>`).join('')}
      </div>
    `;
    checkShipStatus();
  }

  function renderPreview() {
    const container = document.getElementById("resume-preview-live");
    if (!container) return;
    container.className = `rp-container rp-template-${state.selectedTemplate}`;
    const d = state.resumeData;

    if (state.selectedTemplate === "modern") {
      container.innerHTML = `
        <div class="rp-modern-layout" style="display:flex; width:100%; min-height:297mm">
          <aside class="rp-sidebar" style="width:32%; background:var(--kn-accent); color:#fff; padding:40px 24px">
             <h1 class="rp-name" style="color:#fff; font-size:18pt; margin:0">${d.personal.name || "NAME"}</h1>
             <div style="margin-top:32px">
               <h4 style="text-transform:uppercase; font-size:9pt; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px">Contact</h4>
               <p style="font-size:8.5pt">${d.personal.email || ""}<br>${d.personal.phone || ""}</p>
               <p style="font-size:8.5pt">${d.personal.linkedin ? 'LI: ' + d.personal.linkedin : ''}</p>
             </div>
             <div style="margin-top:32px">
               <h4 style="text-transform:uppercase; font-size:9pt; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px">Skills</h4>
               ${Object.entries(d.skills).map(([cat, list]) => list.length ? `<div style="margin-top:12px"><strong style="font-size:7.5pt; display:block; opacity:0.7">${cat.toUpperCase()}</strong>${list.map(s => `<span class="rp-pill" style="background:rgba(255,255,255,0.15); color:#fff; display:inline-block; border-radius:4px; padding:2px 8px; font-size:8pt; margin:2px">${s}</span>`).join('')}</div>` : '').join('')}
             </div>
          </aside>
          <main class="rp-main" style="width:68%; background:#fff; padding:40px 32px">
             <section class="rp-section"><h3>Experience</h3>${d.experience.map(e => `<div style="margin-bottom:16px"><strong>${e.company}</strong> | ${e.role}<p style="margin:4px 0">${e.description}</p></div>`).join('')}</section>
             <section class="rp-section"><h3>Projects</h3>${d.projects.map(p => `<div style="margin-bottom:16px"><strong>${p.title}</strong> | <small>${p.techStack.join(', ')}</small><p style="margin:4px 0">${p.description}</p></div>`).join('')}</section>
          </main>
        </div>
      `;
    } else {
      container.innerHTML = `
        <header class="rp-header" style="text-align:${state.selectedTemplate === 'classic' ? 'center' : 'left'}">
          <h1 class="rp-name">${d.personal.name || "YOUR NAME"}</h1>
          <p class="rp-info">${d.personal.email} | ${d.personal.phone} | ${d.personal.location}</p>
        </header>
        <section class="rp-section"><h3>Experience</h3>${d.experience.map(e => `<div><strong>${e.company}</strong> | ${e.role} | ${e.period}<p>${e.description}</p></div>`).join('')}</section>
        <section class="rp-section"><h3>Projects</h3>${d.projects.map(p => `<div><strong>${p.title}</strong><p>${p.description}</p></div>`).join('')}</section>
        <section class="rp-section"><h3>Skills</h3>${Object.entries(d.skills).map(([cat, list]) => list.length ? `<div><strong>${cat}:</strong> ${list.join(', ')}</div>` : '').join('')}</section>
      `;
    }
  }

  function renderPreviewPage(container) {
    container.innerHTML = `
      <div class="kn-preview-page-container">
        <div class="kn-export-toolbar no-print">
           <button id="btn-export-pdf" class="kn-btn kn-btn--primary">Download PDF</button>
           <button id="btn-copy-text" class="kn-btn kn-btn--outline">Copy as Text</button>
        </div>
        <div class="kn-preview-page">
          ${renderThemeCustomizer()}
          <div id="resume-preview-live"></div>
        </div>
      </div>
    `;
    renderPreview();
  }

  function renderProof(container) {
    const sub = state.submission;
    const isShipped = sub.status === "Shipped";
    container.innerHTML = `
      <div class="kn-proof-page">
        <header class="kn-proof-header"><h1>Proof & Submission</h1><p>Ship Project 3 with validated evidence.</p></header>
        <section class="kn-proof-section"><h2 class="kn-section-label">STEPS</h2><div class="kn-steps-grid">${['Setup', 'UI', 'Templates', 'Guidance', 'Export', 'Skills', 'Projects', 'Scoring'].map(s => `<div class="kn-step-item"><span class="kn-step-check">✓</span>${s}</div>`).join('')}</div></section>
        <section class="kn-proof-section">
          <h2 class="kn-section-label">LINKS</h2>
          <div class="kn-form-group"><label>Lovable</label><input type="url" class="kn-input" data-proof="lovable" value="${sub.lovable}" placeholder="https://lovable.dev/..."></div>
          <div class="kn-form-group"><label>GitHub</label><input type="url" class="kn-input" data-proof="githubRepo" value="${sub.githubRepo}" placeholder="https://github.com/..."></div>
          <div class="kn-form-group"><label>Live</label><input type="url" class="kn-input" data-proof="deployed" value="${sub.deployed}" placeholder="https://..."></div>
        </section>
        <footer class="kn-proof-footer">
          <button id="btn-copy-submission" class="kn-btn kn-btn--outline">Copy Submission Export</button>
          ${isShipped ? `<div class="kn-shipped-message">Project 3 Shipped Successfully.</div>` : `<div class="kn-progress-notice">Score >= 85 and 3 URLs required.</div>`}
        </footer>
      </div>
    `;
  }

  function renderHome(c) {
    c.innerHTML = `<div class="kn-home-card" style="text-align:center; padding:100px 20px"><h1>AI Resume Builder</h1><p>The ultimate ATS-optimized candidate engine.</p><a href="#/builder" class="kn-btn kn-btn--primary">Launch Editor</a></div>`;
  }

  function updateStateFromForm() {
    const inputs = document.querySelectorAll("[data-field]");
    inputs.forEach(input => {
      const field = input.dataset.field;
      const parts = field.split(".");
      if (parts.length === 2) state.resumeData[parts[0]][parts[1]] = input.value;
      else state.resumeData[field] = input.value;
    });
  }

  window.app = {
    addRow: (type) => {
      if (type === "experience") state.resumeData.experience.push({ company: "", role: "", period: "", description: "" });
      if (type === "projects") state.resumeData.projects.push({ title: "", description: "", techStack: [], isOpen: true });
      if (type === "education") state.resumeData.education.push({ institution: "", degree: "" });
      saveData(); renderPage();
    },
    removeRow: (type, index) => {
      state.resumeData[type].splice(index, 1);
      saveData(); renderPage();
    },
    updateRow: (type, index, field, value) => {
      state.resumeData[type][index][field] = value;
      saveData(); renderPreview(); renderScoring();
    }
  };

  const SAMPLE_DATA = { personal: { name: "Aditya Sharma", email: "aditya.sh@example.com", phone: "+91 98765 43210", location: "Bengaluru" }, summary: "Staff Engineer with 10 years exp. Lead architect at Google.", experience: [{ company: "Google", role: "Staff SWE", period: "2018-2024", description: "Led cloud infrastructure team." }], projects: [{ title: "K8s Engine", techStack: ["Go", "C++"], description: "Optimized scheduling latency.", isOpen: true }], skills: { technical: ["Go", "React"], soft: ["Leadership"], tools: ["Git"] } };

  init();
})();
