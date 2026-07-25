/**
 * Resumix - Modern Interactive Resume Builder Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    activeTemplate: 'modern', // 'modern' | 'classic'
    zoomLevel: 1.0,
    photoUrl: null,
    photoZoom: 100,
    photoRotate: 0,
    photoOffsetX: 0,
    photoOffsetY: 0,
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: '',
    languages: ''
  };

  // Sample Preset Data
  const sampleData = {
    personal: {
      fullName: 'Md Majid',
      jobTitle: 'AI Full Stack Software Engineer',
      email: 'khanmdmajid161@gmail.com',
      phone: '+91 7004624465',
      location: 'Delhi, India',
      website: 'https://reactmajid.netlify.app/',
      linkedin: 'linkedin.com/in/mdmajid',
      github: 'github.com/mdmajid'
    },
    summary: 'Results-driven AI Full Stack Developer. Passionate about UI/UX polish, high performance, and mentoring engineering teams.',
    experience: [
      {
        id: 'exp-1',
        title: 'UI/UX Designer',
        company: 'Elevate Lab',
        location: 'India',
        startDate: 'may 2025',
        endDate: 'july 2025',
        desc: '• Completed multiple real-world UI/UX and full-stack development projects.Created wireframes, high-fidelity mockups, and interactive prototypes using Figma, and Developed responsive web applications using the MERN stack and Next.js.everaged AI-powered tools for UI generation, coding assistance, testing, and documentation.'
      },
      {
        id: 'exp-2',
        title: 'Full Stack Developer',
        company: 'Off beat',
        location: 'Mohali',
        startDate: 'Aug 2025',
        endDate: 'Oct 2025',
        desc: '• Worked on multiple real-world UI/UX and full-stack development projects.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science',
        institution: 'IKG Punjab Technical University, Punjab',
        location: 'Punjab, India',
        startDate: 'June 2021',
        endDate: 'May 2025',
        desc: 'Graduated with Honors (CGPA 7.84). Specialization in UI/UX and MERN Stack.'
      }
    ],
    skills: [
      { id: 'sk-1', name: 'JavaScript / TypeScript', level: 'Expert' },
      { id: 'sk-2', name: 'React / React.js', level: 'Expert' },
      { id: 'sk-3', name: 'Node.js / Express', level: 'Intermediate' },
      { id: 'sk-4', name: 'UI / UX', level: 'Advanced' },
      { id: 'sk-5', name: 'PostgreSQL & MongoDB', level: 'Intermideate' },
      { id: 'sk-6', name: 'Docker & AWS', level: 'Intermediate' }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'CloudFlow Workflow Engine',
        tech: 'React, Node.js, WebSockets, Redis',
        link: 'github.com/majid-code/cloudflow',
        desc: 'Built a real-time visual workflow automation tool allowing non-technical users to drag-and-drop automation nodes.'
      },
      {
        id: 'proj-2',
        title: 'DevPulse Code Analytics',
        tech: 'TypeScript, Docker',
        link: 'devpulse-app.io',
        desc: 'Created a developer productivity insights CLI tool summarizing git commits and code coverage metrics.'
      }
    ],
    certifications: 'AWS Certified Solutions Architect – Associate (2024)\nCertified ScrumMaster (CSM)',
    languages: 'English , Hindi (Fluent), Urdu (Fluent)'
  };

  // Sample Avatar Image (Clean Plain Base64 SVG Data URI - 100% Cross-Browser)
  const sampleAvatarSvg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmOGZhZmMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIxOCIgZmlsbD0iI2NiZDVlMSIvPjxwYXRoIGQ9Ik0gMjIgODIgQyAyMiA2MiwgNzggNjIsIDc4IDgyIFoiIGZpbGw9IiNjYmQ1ZTEiLz48L3N2Zz4=';

  // UI Elements
  const resumeDocument = document.getElementById('resumeDocument');
  const btnTemplateModern = document.getElementById('btnTemplateModern');
  const btnTemplateClassic = document.getElementById('btnTemplateClassic');
  const btnLoadDemo = document.getElementById('btnLoadDemo');
  const btnClearForm = document.getElementById('btnClearForm');
  const btnDownloadPdf = document.getElementById('btnDownloadPdf');

  // Photo Elements
  const inputPhoto = document.getElementById('inputPhoto');
  const photoPreview = document.getElementById('photoPreview');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');

  // Dynamic Lists Containers
  const experienceList = document.getElementById('experienceList');
  const educationList = document.getElementById('educationList');
  const skillsList = document.getElementById('skillsList');
  const projectsList = document.getElementById('projectsList');

  // Zoom Controls
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const zoomLevelText = document.getElementById('zoomLevelText');

  // Init Accordions
  initAccordions();

  // Attach Event Listeners
  attachInputListeners();
  attachTemplateSwitchers();
  attachDynamicListAdders();
  attachPhotoHandlers();
  attachZoomControls();

  // Load Initial Demo Data so user sees instant preview
  loadPresetData();

  /* ==========================================================================
     1. DATA BINDING & LIVE PREVIEW ENGINE
     ========================================================================== */

  function updateStateFromInputs() {
    state.personal.fullName = document.getElementById('fullName').value;
    state.personal.jobTitle = document.getElementById('jobTitle').value;
    state.personal.email = document.getElementById('email').value;
    state.personal.phone = document.getElementById('phone').value;
    state.personal.location = document.getElementById('location').value;
    state.personal.website = document.getElementById('website').value;
    state.personal.linkedin = document.getElementById('linkedin').value;
    state.personal.github = document.getElementById('github').value;

    state.summary = document.getElementById('summary').value;
    state.certifications = document.getElementById('certifications').value;
    state.languages = document.getElementById('languages').value;

    // Dynamic Lists State
    state.experience = getDynamicListData(experienceList, ['title', 'company', 'location', 'startDate', 'endDate', 'desc']);
    state.education = getDynamicListData(educationList, ['degree', 'institution', 'location', 'startDate', 'endDate', 'desc']);
    state.skills = getDynamicListData(skillsList, ['name', 'level']);
    state.projects = getDynamicListData(projectsList, ['title', 'tech', 'link', 'desc']);

    renderResume();
  }

  function renderResume() {
    if (state.activeTemplate === 'modern') {
      resumeDocument.className = 'paper-page tmpl-modern';
      resumeDocument.innerHTML = renderModernHtml(state);
    } else {
      resumeDocument.className = 'paper-page tmpl-classic';
      resumeDocument.innerHTML = renderClassicHtml(state);
    }
  }

  /* ==========================================================================
     2. TEMPLATE RENDERERS
     ========================================================================== */

  function getPhotoTransformStyle() {
    return `transform: scale(${state.photoZoom / 100}) rotate(${state.photoRotate}deg) translate(${state.photoOffsetX}px, ${state.photoOffsetY}px); transform-origin: center center;`;
  }

  // Template 1: Modern Creative (Blue Theme, Profile Photo, 2-Column Body)
  function renderModernHtml(data) {
    const p = data.personal;
    const photoHtml = data.photoUrl
      ? `<img src="${data.photoUrl}" alt="${escapeHtml(p.fullName)}" style="${getPhotoTransformStyle()}">`
      : `<i class="fa-solid fa-user"></i>`;

    const contactItems = [];
    if (p.email) contactItems.push(`<div class="contact-bar-item"><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</div>`);
    if (p.phone) contactItems.push(`<div class="contact-bar-item"><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</div>`);
    if (p.location) contactItems.push(`<div class="contact-bar-item"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</div>`);
    if (p.website) contactItems.push(`<div class="contact-bar-item"><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website)}</div>`);
    if (p.linkedin) contactItems.push(`<div class="contact-bar-item"><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedin)}</div>`);
    if (p.github) contactItems.push(`<div class="contact-bar-item"><i class="fa-brands fa-github"></i> ${escapeHtml(p.github)}</div>`);

    // Experience Items
    const expHtml = data.experience.map(item => `
      <div class="timeline-item">
        <div class="item-header">
          <div>
            <div class="item-title">${escapeHtml(item.title || 'Job Position')}</div>
            <div class="item-sub">${escapeHtml(item.company || 'Company Name')}${item.location ? ` | ${escapeHtml(item.location)}` : ''}</div>
          </div>
          <div class="item-date">${escapeHtml(item.startDate || '')} ${item.endDate ? `- ${escapeHtml(item.endDate)}` : ''}</div>
        </div>
        ${item.desc ? `<div class="item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </div>
    `).join('');

    // Education Items
    const eduHtml = data.education.map(item => `
      <div class="timeline-item">
        <div class="item-header">
          <div>
            <div class="item-title">${escapeHtml(item.degree || 'Degree / Major')}</div>
            <div class="item-sub">${escapeHtml(item.institution || 'School / University')}</div>
          </div>
          <div class="item-date">${escapeHtml(item.startDate || '')} ${item.endDate ? `- ${escapeHtml(item.endDate)}` : ''}</div>
        </div>
        ${item.desc ? `<div class="item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </div>
    `).join('');

    // Skills Pills
    const skillsHtml = data.skills.map(sk => `
      <span class="skill-tag">
        ${escapeHtml(sk.name || 'Skill')}
        ${sk.level ? `<span class="skill-level">(${escapeHtml(sk.level)})</span>` : ''}
      </span>
    `).join('');

    // Projects
    const projHtml = data.projects.map(proj => `
      <div class="side-item">
        <div class="side-item-title">${escapeHtml(proj.title || 'Project Title')}</div>
        ${proj.tech ? `<div class="side-item-sub"><strong>Tech:</strong> ${escapeHtml(proj.tech)}</div>` : ''}
        ${proj.link ? `<div class="side-item-sub"><i class="fa-solid fa-link"></i> ${escapeHtml(proj.link)}</div>` : ''}
        ${proj.desc ? `<div class="item-desc" style="font-size: 0.78rem;">${escapeHtml(proj.desc)}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="modern-header">
        <div class="header-avatar">${photoHtml}</div>
        <div class="header-meta">
          <h1>${escapeHtml(p.fullName || 'Your Name')}</h1>
          <h2>${escapeHtml(p.jobTitle || 'Your Professional Title')}</h2>
          <div class="contact-bar">${contactItems.join('')}</div>
        </div>
      </div>

      <div class="modern-body">
        <div class="main-col">
          ${data.summary ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-user"></i> Professional Summary</div>
              <div class="summary-text">${escapeHtml(data.summary)}</div>
            </div>
          ` : ''}

          ${data.experience.length ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
              <div class="experience-list">${expHtml}</div>
            </div>
          ` : ''}

          ${data.education.length ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
              <div class="education-list">${eduHtml}</div>
            </div>
          ` : ''}
        </div>

        <div class="side-col">
          ${data.skills.length ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-code"></i> Skills</div>
              <div class="skills-grid">${skillsHtml}</div>
            </div>
          ` : ''}

          ${data.projects.length ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-diagram-project"></i> Key Projects</div>
              <div class="side-list">${projHtml}</div>
            </div>
          ` : ''}

          ${data.certifications ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-certificate"></i> Certifications</div>
              <div class="summary-text" style="white-space: pre-line; font-size: 0.8rem;">${escapeHtml(data.certifications)}</div>
            </div>
          ` : ''}

          ${data.languages ? `
            <div class="section-block">
              <div class="section-title"><i class="fa-solid fa-language"></i> Languages</div>
              <div class="summary-text" style="font-size: 0.8rem;">${escapeHtml(data.languages)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Template 2: Classic Plain (Monochrome, Black/White, Serif Typography)
  function renderClassicHtml(data) {
    const p = data.personal;
    const contactParts = [];
    if (p.email) contactParts.push(`<span>${escapeHtml(p.email)}</span>`);
    if (p.phone) contactParts.push(`<span>${escapeHtml(p.phone)}</span>`);
    if (p.location) contactParts.push(`<span>${escapeHtml(p.location)}</span>`);
    if (p.website) contactParts.push(`<span>${escapeHtml(p.website)}</span>`);
    if (p.linkedin) contactParts.push(`<span>${escapeHtml(p.linkedin)}</span>`);

    const expHtml = data.experience.map(item => `
      <div class="classic-item">
        <div class="classic-item-header">
          <div>
            <span>${escapeHtml(item.title || 'Position')}</span>, 
            <span class="classic-item-company">${escapeHtml(item.company || 'Company')}</span>
            ${item.location ? `, ${escapeHtml(item.location)}` : ''}
          </div>
          <div class="classic-item-date">${escapeHtml(item.startDate || '')} ${item.endDate ? `- ${escapeHtml(item.endDate)}` : ''}</div>
        </div>
        ${item.desc ? `<div class="classic-item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </div>
    `).join('');

    const eduHtml = data.education.map(item => `
      <div class="classic-item">
        <div class="classic-item-header">
          <div>
            <span>${escapeHtml(item.degree || 'Degree')}</span> - 
            <span class="classic-item-company">${escapeHtml(item.institution || 'University')}</span>
          </div>
          <div class="classic-item-date">${escapeHtml(item.startDate || '')} ${item.endDate ? `- ${escapeHtml(item.endDate)}` : ''}</div>
        </div>
        ${item.desc ? `<div class="classic-item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </div>
    `).join('');

    const skillsString = data.skills.map(s => escapeHtml(s.name)).join(' • ');

    const projHtml = data.projects.map(proj => `
      <div class="classic-item">
        <div class="classic-item-header">
          <span>${escapeHtml(proj.title || 'Project')}</span>
          ${proj.link ? `<span class="classic-item-date">${escapeHtml(proj.link)}</span>` : ''}
        </div>
        ${proj.tech ? `<div style="font-size: 0.8rem; font-style: italic;">Technologies: ${escapeHtml(proj.tech)}</div>` : ''}
        ${proj.desc ? `<div class="classic-item-desc">${escapeHtml(proj.desc)}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="classic-header">
        <h1>${escapeHtml(p.fullName || 'YOUR NAME')}</h1>
        ${p.jobTitle ? `<h2>${escapeHtml(p.jobTitle)}</h2>` : ''}
        <div class="classic-contact">${contactParts.join('')}</div>
      </div>

      ${data.summary ? `
        <div class="classic-section">
          <div class="classic-section-title">Summary</div>
          <div class="classic-summary">${escapeHtml(data.summary)}</div>
        </div>
      ` : ''}

      ${data.experience.length ? `
        <div class="classic-section">
          <div class="classic-section-title">Experience</div>
          ${expHtml}
        </div>
      ` : ''}

      ${data.education.length ? `
        <div class="classic-section">
          <div class="classic-section-title">Education</div>
          ${eduHtml}
        </div>
      ` : ''}

      ${data.skills.length ? `
        <div class="classic-section">
          <div class="classic-section-title">Skills & Expertise</div>
          <div class="classic-skills">${skillsString}</div>
        </div>
      ` : ''}

      ${data.projects.length ? `
        <div class="classic-section">
          <div class="classic-section-title">Projects</div>
          ${projHtml}
        </div>
      ` : ''}

      ${data.certifications ? `
        <div class="classic-section">
          <div class="classic-section-title">Certifications</div>
          <div class="classic-summary" style="white-space: pre-line;">${escapeHtml(data.certifications)}</div>
        </div>
      ` : ''}

      ${data.languages ? `
        <div class="classic-section">
          <div class="classic-section-title">Languages</div>
          <div class="classic-summary">${escapeHtml(data.languages)}</div>
        </div>
      ` : ''}
    `;
  }

  /* ==========================================================================
     3. DYNAMIC FORM MANAGERS
     ========================================================================== */

  function createDynamicCard(type, data = {}) {
    const card = document.createElement('div');
    card.className = 'dynamic-card';
    const itemId = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    card.dataset.id = itemId;

    let fieldsHtml = '';

    if (type === 'experience') {
      fieldsHtml = `
        <div class="dynamic-card-header">
          <span class="card-title-text"><i class="fa-solid fa-briefcase"></i> Experience Entry</span>
          <button type="button" class="btn-remove-item"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" class="form-control field-title" value="${escapeHtml(data.title || '')}" placeholder="Software Engineer">
          </div>
          <div class="form-group">
            <label>Company</label>
            <input type="text" class="form-control field-company" value="${escapeHtml(data.company || '')}" placeholder="Acme Inc">
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="text" class="form-control field-startDate" value="${escapeHtml(data.startDate || '')}" placeholder="Jan 2021">
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="text" class="form-control field-endDate" value="${escapeHtml(data.endDate || '')}" placeholder="Present">
          </div>
          <div class="form-group full-width">
            <label>Location</label>
            <input type="text" class="form-control field-location" value="${escapeHtml(data.location || '')}" placeholder="City, State">
          </div>
          <div class="form-group full-width">
            <label>Description / Bullet Points</label>
            <textarea class="form-control field-desc" rows="3" placeholder="Key responsibilities and metrics...">${escapeHtml(data.desc || '')}</textarea>
          </div>
        </div>
      `;
    } else if (type === 'education') {
      fieldsHtml = `
        <div class="dynamic-card-header">
          <span class="card-title-text"><i class="fa-solid fa-graduation-cap"></i> Education Entry</span>
          <button type="button" class="btn-remove-item"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Degree / Major</label>
            <input type="text" class="form-control field-degree" value="${escapeHtml(data.degree || '')}" placeholder="B.Tech. Computer Science">
          </div>
          <div class="form-group">
            <label>Institution</label>
            <input type="text" class="form-control field-institution" value="${escapeHtml(data.institution || '')}" placeholder="IKG Punjab Technical University">
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="text" class="form-control field-startDate" value="${escapeHtml(data.startDate || '')}" placeholder="2021">
          </div>
          <div class="form-group">
            <label>Graduation Date</label>
            <input type="text" class="form-control field-endDate" value="${escapeHtml(data.endDate || '')}" placeholder="2025">
          </div>
          <div class="form-group full-width">
            <label>CGPA / Honors / Details</label>
            <input type="text" class="form-control field-desc" value="${escapeHtml(data.desc || '')}" placeholder="CGPA 7.84">
          </div>
        </div>
      `;
    } else if (type === 'skill') {
      fieldsHtml = `
        <div class="dynamic-card-header">
          <span class="card-title-text"><i class="fa-solid fa-screwdriver-wrench"></i> Skill Entry</span>
          <button type="button" class="btn-remove-item"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Skill Name</label>
            <input type="text" class="form-control field-name" value="${escapeHtml(data.name || '')}" placeholder="JavaScript">
          </div>
          <div class="form-group">
            <label>Level / Tag</label>
            <input type="text" class="form-control field-level" value="${escapeHtml(data.level || '')}" placeholder="Expert / Advanced">
          </div>
        </div>
      `;
    } else if (type === 'project') {
      fieldsHtml = `
        <div class="dynamic-card-header">
          <span class="card-title-text"><i class="fa-solid fa-diagram-project"></i> Project Entry</span>
          <button type="button" class="btn-remove-item"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" class="form-control field-title" value="${escapeHtml(data.title || '')}" placeholder="Portfolio Website">
          </div>
          <div class="form-group">
            <label>Technologies Used</label>
            <input type="text" class="form-control field-tech" value="${escapeHtml(data.tech || '')}" placeholder="React, Node.js, MongoDB">
          </div>
          <div class="form-group full-width">
            <label>Project Link / URL</label>
            <input type="text" class="form-control field-link" value="${escapeHtml(data.link || '')}" placeholder="github.com/myusername/project">
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <textarea class="form-control field-desc" rows="2" placeholder="Brief summary of project outcomes...">${escapeHtml(data.desc || '')}</textarea>
          </div>
        </div>
      `;
    }

    card.innerHTML = fieldsHtml;

    // Attach Remove Event
    const removeBtn = card.querySelector('.btn-remove-item');
    removeBtn.addEventListener('click', () => {
      card.remove();
      updateStateFromInputs();
    });

    // Attach Input Change Events
    card.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', updateStateFromInputs);
    });

    return card;
  }

  function getDynamicListData(container, fields) {
    const cards = container.querySelectorAll('.dynamic-card');
    const list = [];
    cards.forEach(card => {
      const item = {};
      fields.forEach(field => {
        const input = card.querySelector(`.field-${field}`);
        item[field] = input ? input.value : '';
      });
      list.push(item);
    });
    return list;
  }

  function attachDynamicListAdders() {
    document.getElementById('btnAddExperience').addEventListener('click', () => {
      experienceList.appendChild(createDynamicCard('experience'));
      updateStateFromInputs();
    });

    document.getElementById('btnAddEducation').addEventListener('click', () => {
      educationList.appendChild(createDynamicCard('education'));
      updateStateFromInputs();
    });

    document.getElementById('btnAddSkill').addEventListener('click', () => {
      skillsList.appendChild(createDynamicCard('skill'));
      updateStateFromInputs();
    });

    document.getElementById('btnAddProject').addEventListener('click', () => {
      projectsList.appendChild(createDynamicCard('project'));
      updateStateFromInputs();
    });
  }

  /* ==========================================================================
     4. EVENT LISTENERS & HANDLERS
     ========================================================================== */

  function attachInputListeners() {
    const inputs = document.querySelectorAll('.editor-pane input, .editor-pane textarea');
    inputs.forEach(input => {
      input.addEventListener('input', updateStateFromInputs);
    });
  }

  function attachTemplateSwitchers() {
    btnTemplateModern.addEventListener('click', () => {
      state.activeTemplate = 'modern';
      btnTemplateModern.classList.add('active');
      btnTemplateClassic.classList.remove('active');
      renderResume();
      showToast('Switched to Modern Creative template', 'info');
    });

    btnTemplateClassic.addEventListener('click', () => {
      state.activeTemplate = 'classic';
      btnTemplateClassic.classList.add('active');
      btnTemplateModern.classList.remove('active');
      renderResume();
      showToast('Switched to Classic Plain monochrome template', 'info');
    });

    btnLoadDemo.addEventListener('click', () => {
      loadPresetData();
      showToast('Loaded sample data successfully!', 'success');
    });

    btnClearForm.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset and clear all resume fields?')) {
        clearForm();
        showToast('Form cleared', 'info');
      }
    });

    btnDownloadPdf.addEventListener('click', generatePdf);

    // Also listen for custom event from auth module
    window.addEventListener('resumix-generate-pdf', generatePdf);
  }

  function updatePhotoPreviewElement() {
    if (state.photoUrl) {
      photoPreview.innerHTML = `<img src="${state.photoUrl}" alt="Photo Preview" style="${getPhotoTransformStyle()}">`;
      btnEditPhoto.classList.remove('d-none');
      btnRemovePhoto.classList.remove('d-none');
    } else {
      photoPreview.innerHTML = `<i class="fa-solid fa-camera placeholder-icon"></i>`;
      btnEditPhoto.classList.add('d-none');
      btnRemovePhoto.classList.add('d-none');
      photoAdjustPanel.classList.add('d-none');
    }
  }

  function attachPhotoHandlers() {
    const btnEditPhoto = document.getElementById('btnEditPhoto');
    const photoAdjustPanel = document.getElementById('photoAdjustPanel');
    const btnCloseAdjust = document.getElementById('btnCloseAdjust');
    const photoZoom = document.getElementById('photoZoom');
    const photoZoomVal = document.getElementById('photoZoomVal');
    const photoOffsetY = document.getElementById('photoOffsetY');
    const photoOffsetX = document.getElementById('photoOffsetX');
    const btnRotatePhoto = document.getElementById('btnRotatePhoto');
    const btnResetPhotoAdjust = document.getElementById('btnResetPhotoAdjust');

    inputPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.photoUrl = event.target.result;
          updatePhotoPreviewElement();
          photoAdjustPanel.classList.remove('d-none'); // Auto open adjust panel when new photo uploaded!
          renderResume();
          showToast('Photo uploaded! Use sliders below to adjust fit.', 'info');
        };
        reader.readAsDataURL(file);
      }
    });

    btnEditPhoto.addEventListener('click', () => {
      photoAdjustPanel.classList.toggle('d-none');
    });

    if (btnCloseAdjust) {
      btnCloseAdjust.addEventListener('click', () => {
        photoAdjustPanel.classList.add('d-none');
      });
    }

    // Zoom Slider
    photoZoom.addEventListener('input', (e) => {
      state.photoZoom = parseInt(e.target.value, 10);
      photoZoomVal.textContent = `${state.photoZoom}%`;
      updatePhotoPreviewElement();
      renderResume();
    });

    // Vertical Offset Slider
    photoOffsetY.addEventListener('input', (e) => {
      state.photoOffsetY = parseInt(e.target.value, 10);
      updatePhotoPreviewElement();
      renderResume();
    });

    // Horizontal Offset Slider
    photoOffsetX.addEventListener('input', (e) => {
      state.photoOffsetX = parseInt(e.target.value, 10);
      updatePhotoPreviewElement();
      renderResume();
    });

    // Rotate 90 deg
    btnRotatePhoto.addEventListener('click', () => {
      state.photoRotate = (state.photoRotate + 90) % 360;
      updatePhotoPreviewElement();
      renderResume();
    });

    // Reset Adjustments
    btnResetPhotoAdjust.addEventListener('click', () => {
      state.photoZoom = 100;
      state.photoRotate = 0;
      state.photoOffsetX = 0;
      state.photoOffsetY = 0;
      photoZoom.value = 100;
      photoZoomVal.textContent = '100%';
      photoOffsetY.value = 0;
      photoOffsetX.value = 0;
      updatePhotoPreviewElement();
      renderResume();
      showToast('Photo adjustments reset', 'info');
    });

    btnRemovePhoto.addEventListener('click', () => {
      state.photoUrl = null;
      inputPhoto.value = '';
      updatePhotoPreviewElement();
      renderResume();
    });
  }

  function attachZoomControls() {
    btnZoomIn.addEventListener('click', () => {
      if (state.zoomLevel < 1.4) {
        state.zoomLevel += 0.1;
        applyZoom();
      }
    });

    btnZoomOut.addEventListener('click', () => {
      if (state.zoomLevel > 0.6) {
        state.zoomLevel -= 0.1;
        applyZoom();
      }
    });

    btnZoomReset.addEventListener('click', () => {
      state.zoomLevel = 1.0;
      applyZoom();
    });
  }

  function applyZoom() {
    resumeDocument.style.transform = `scale(${state.zoomLevel})`;
    zoomLevelText.textContent = `${Math.round(state.zoomLevel * 100)}%`;
  }

  function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        item.classList.toggle('open');
      });
    });
  }

  /* ==========================================================================
     5. DATA LOADING & CLEARING
     ========================================================================== */

  function loadPresetData() {
    loadData(sampleData, sampleAvatarSvg);
  }

  function loadData(dataToLoad, customPhoto = null) {
    document.getElementById('fullName').value = dataToLoad.personal.fullName || '';
    document.getElementById('jobTitle').value = dataToLoad.personal.jobTitle || '';
    document.getElementById('email').value = dataToLoad.personal.email || '';
    document.getElementById('phone').value = dataToLoad.personal.phone || '';
    document.getElementById('location').value = dataToLoad.personal.location || '';
    document.getElementById('website').value = dataToLoad.personal.website || '';
    document.getElementById('linkedin').value = dataToLoad.personal.linkedin || '';
    document.getElementById('github').value = dataToLoad.personal.github || '';

    document.getElementById('summary').value = dataToLoad.summary || '';
    document.getElementById('certifications').value = dataToLoad.certifications || '';
    document.getElementById('languages').value = dataToLoad.languages || '';

    // Clear dynamic lists
    experienceList.innerHTML = '';
    educationList.innerHTML = '';
    skillsList.innerHTML = '';
    projectsList.innerHTML = '';

    // Load Experience
    if (dataToLoad.experience) {
      dataToLoad.experience.forEach(item => {
        experienceList.appendChild(createDynamicCard('experience', item));
      });
    }

    // Load Education
    if (dataToLoad.education) {
      dataToLoad.education.forEach(item => {
        educationList.appendChild(createDynamicCard('education', item));
      });
    }

    // Load Skills
    if (dataToLoad.skills) {
      dataToLoad.skills.forEach(item => {
        skillsList.appendChild(createDynamicCard('skill', item));
      });
    }

    // Load Projects
    if (dataToLoad.projects) {
      dataToLoad.projects.forEach(item => {
        projectsList.appendChild(createDynamicCard('project', item));
      });
    }

    // Set photo if provided, else keep existing or clear
    if (customPhoto !== null) {
      state.photoUrl = customPhoto;
    } else if (dataToLoad.photoUrl !== undefined) {
      state.photoUrl = dataToLoad.photoUrl;
    }
    
    // Set template if available
    if (dataToLoad.activeTemplate) {
      state.activeTemplate = dataToLoad.activeTemplate;
      if (state.activeTemplate === 'modern') {
        btnTemplateModern.click();
      } else {
        btnTemplateClassic.click();
      }
    }

    updatePhotoPreviewElement();
    updateStateFromInputs();
  }

  // Overwrite the original logic of loadPresetData
  function _oldLoadPresetData() {
    document.getElementById('fullName').value = sampleData.personal.fullName;
    document.getElementById('jobTitle').value = sampleData.personal.jobTitle;
    document.getElementById('email').value = sampleData.personal.email;
    document.getElementById('phone').value = sampleData.personal.phone;
    document.getElementById('location').value = sampleData.personal.location;
    document.getElementById('website').value = sampleData.personal.website;
    document.getElementById('linkedin').value = sampleData.personal.linkedin;
    document.getElementById('github').value = sampleData.personal.github;

    document.getElementById('summary').value = sampleData.summary;
    document.getElementById('certifications').value = sampleData.certifications;
    document.getElementById('languages').value = sampleData.languages;

    // Clear dynamic lists
    experienceList.innerHTML = '';
    educationList.innerHTML = '';
    skillsList.innerHTML = '';
    projectsList.innerHTML = '';

    // Load Experience
    sampleData.experience.forEach(item => {
      experienceList.appendChild(createDynamicCard('experience', item));
    });

    // Load Education
    sampleData.education.forEach(item => {
      educationList.appendChild(createDynamicCard('education', item));
    });

    // Load Skills
    sampleData.skills.forEach(item => {
      skillsList.appendChild(createDynamicCard('skill', item));
    });

    // Load Projects
    sampleData.projects.forEach(item => {
      projectsList.appendChild(createDynamicCard('project', item));
    });

    // Set sample photo
    state.photoUrl = sampleAvatarSvg;
    updatePhotoPreviewElement();

    updateStateFromInputs();
  }

  function clearForm() {
    document.querySelectorAll('.editor-pane input, .editor-pane textarea').forEach(input => {
      input.value = '';
    });
    experienceList.innerHTML = '';
    educationList.innerHTML = '';
    skillsList.innerHTML = '';
    projectsList.innerHTML = '';
    state.photoUrl = null;
    state.photoZoom = 100;
    state.photoRotate = 0;
    state.photoOffsetX = 0;
    state.photoOffsetY = 0;
    updatePhotoPreviewElement();
    updateStateFromInputs();
  }

  /* ==========================================================================
     6. PDF GENERATION ENGINE
     ========================================================================== */

  function generatePdf() {
    showToast('Generating high quality PDF...', 'info');

    // Reset zoom temporary for pixel-perfect PDF capture
    const currentScale = state.zoomLevel;
    resumeDocument.style.transform = 'scale(1)';

    const nameSlug = (state.personal.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    const opt = {
      margin: 0,
      filename: `${nameSlug}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeDocument).save().then(() => {
      resumeDocument.style.transform = `scale(${currentScale})`;
      showToast('Resume downloaded successfully!', 'success');
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      resumeDocument.style.transform = `scale(${currentScale})`;
      // Fallback: Trigger browser window print dialog if html2pdf fails
      window.print();
    });
  }

  function generatePdfBlob() {
    return new Promise((resolve, reject) => {
      const currentScale = state.zoomLevel;
      resumeDocument.style.transform = 'scale(1)';

      const nameSlug = (state.personal.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
      const opt = {
        margin: 0,
        filename: `${nameSlug}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(resumeDocument).output('blob').then(blob => {
        resumeDocument.style.transform = `scale(${currentScale})`;
        resolve({ blob, filename: opt.filename });
      }).catch(err => {
        resumeDocument.style.transform = `scale(${currentScale})`;
        reject(err);
      });
    });
  }

  /* ==========================================================================
     7. UTILITIES
     ========================================================================== */

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${escapeHtml(message)}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Expose state and functions for Dashboard/Auth module
  window.resumixApp = {
    getState: () => state,
    loadData: loadData,
    showToast: showToast,
    generatePdfBlob: generatePdfBlob
  };
});
