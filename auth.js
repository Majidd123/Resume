/**
 * Resumix - Supabase Email Authentication Module
 * Handles sign up, sign in, sign out, and session gating for PDF download.
 */

const SUPABASE_URL = 'https://yloxplbduxqpwtzrvzkk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsb3hwbGJkdXhxcHd0enJ2emtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODg3NjQsImV4cCI6MjEwMDQ2NDc2NH0.M5PMfMuIHMErxAzeSkh0ADHPOkFhSS_8s_dctCBPpVU';

// Initialize Supabase Client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth State
const authState = {
  user: null,
  session: null,
  loading: true
};

// ============================================================================
// AUTH MODAL MANAGEMENT
// ============================================================================

function createAuthModal() {
  const overlay = document.createElement('div');
  overlay.id = 'authOverlay';
  overlay.className = 'auth-overlay';
  overlay.innerHTML = `
    <div class="auth-modal">
      <button type="button" class="auth-close-btn" id="authCloseBtn">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="auth-modal-header">
        <div class="auth-logo">
          <i class="fa-solid fa-file-invoice"></i>
        </div>
        <h2 class="auth-title">Welcome to Resumix</h2>
        <p class="auth-subtitle">Sign in to download your professional resume as PDF</p>
      </div>

      <!-- Tab Switcher -->
      <div class="auth-tabs">
        <button type="button" class="auth-tab active" data-tab="signin" id="tabSignIn">
          <i class="fa-solid fa-right-to-bracket"></i> Sign In
        </button>
        <button type="button" class="auth-tab" data-tab="signup" id="tabSignUp">
          <i class="fa-solid fa-user-plus"></i> Sign Up
        </button>
      </div>

      <!-- Sign In Form -->
      <form class="auth-form" id="signInForm">
        <div class="auth-field">
          <label for="signInEmail"><i class="fa-solid fa-envelope"></i> Email Address</label>
          <input type="email" id="signInEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="signInPassword"><i class="fa-solid fa-lock"></i> Password</label>
          <div class="password-wrapper">
            <input type="password" id="signInPassword" placeholder="Enter your password" required minlength="6" autocomplete="current-password">
            <button type="button" class="toggle-password-btn" data-target="signInPassword">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="auth-error" id="signInError"></div>
        <button type="submit" class="auth-submit-btn" id="signInSubmitBtn">
          <i class="fa-solid fa-right-to-bracket"></i> Sign In
        </button>
      </form>

      <!-- Sign Up Form -->
      <form class="auth-form d-none" id="signUpForm">
        <div class="auth-field">
          <label for="signUpEmail"><i class="fa-solid fa-envelope"></i> Email Address</label>
          <input type="email" id="signUpEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="signUpPassword"><i class="fa-solid fa-lock"></i> Password</label>
          <div class="password-wrapper">
            <input type="password" id="signUpPassword" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password">
            <button type="button" class="toggle-password-btn" data-target="signUpPassword">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="auth-field">
          <label for="signUpConfirmPassword"><i class="fa-solid fa-shield-halved"></i> Confirm Password</label>
          <div class="password-wrapper">
            <input type="password" id="signUpConfirmPassword" placeholder="Re-enter password" required minlength="6" autocomplete="new-password">
            <button type="button" class="toggle-password-btn" data-target="signUpConfirmPassword">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="auth-error" id="signUpError"></div>
        <button type="submit" class="auth-submit-btn" id="signUpSubmitBtn">
          <i class="fa-solid fa-user-plus"></i> Create Account
        </button>
      </form>

      <!-- Success Message (post sign-up confirmation) -->
      <div class="auth-success d-none" id="authSuccess">
        <i class="fa-solid fa-circle-check"></i>
        <h3>Check Your Email!</h3>
        <p>We've sent a confirmation link to your email. Please verify to activate your account, then sign in.</p>
        <button type="button" class="auth-submit-btn" id="btnBackToSignIn">
          <i class="fa-solid fa-arrow-left"></i> Back to Sign In
        </button>
      </div>

      <div class="auth-footer">
        <i class="fa-solid fa-shield-halved"></i> Secured by Supabase Authentication
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  attachAuthEventListeners();
}

function attachAuthEventListeners() {
  const overlay = document.getElementById('authOverlay');
  const closeBtn = document.getElementById('authCloseBtn');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const authSuccess = document.getElementById('authSuccess');
  const btnBackToSignIn = document.getElementById('btnBackToSignIn');

  // Close Modal
  closeBtn.addEventListener('click', () => hideAuthModal());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideAuthModal();
  });

  // Tab Switching
  tabSignIn.addEventListener('click', () => {
    tabSignIn.classList.add('active');
    tabSignUp.classList.remove('active');
    signInForm.classList.remove('d-none');
    signUpForm.classList.add('d-none');
    authSuccess.classList.add('d-none');
    clearAuthErrors();
  });

  tabSignUp.addEventListener('click', () => {
    tabSignUp.classList.add('active');
    tabSignIn.classList.remove('active');
    signUpForm.classList.remove('d-none');
    signInForm.classList.add('d-none');
    authSuccess.classList.add('d-none');
    clearAuthErrors();
  });

  // Back to Sign In from success
  btnBackToSignIn.addEventListener('click', () => {
    tabSignIn.click();
  });

  // Toggle password visibility
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
      }
    });
  });

  // Sign In Submit
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value.trim();
    const password = document.getElementById('signInPassword').value;
    const submitBtn = document.getElementById('signInSubmitBtn');
    const errorDiv = document.getElementById('signInError');

    errorDiv.textContent = '';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;

      authState.user = data.user;
      authState.session = data.session;
      updateAuthUI();
      hideAuthModal();
      showAuthToast(`Welcome back, ${data.user.email}!`, 'success');

      // Trigger the pending PDF download
      if (window._pendingPdfDownload) {
        window._pendingPdfDownload = false;
        document.getElementById('btnDownloadPdf').click();
      }
    } catch (err) {
      errorDiv.textContent = err.message || 'Sign in failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
    }
  });

  // Sign Up Submit
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    const submitBtn = document.getElementById('signUpSubmitBtn');
    const errorDiv = document.getElementById('signUpError');

    errorDiv.textContent = '';

    if (password !== confirmPassword) {
      errorDiv.textContent = 'Passwords do not match!';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating account...';

    try {
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) throw error;

      // If email confirmation is required
      if (data.user && !data.session) {
        signUpForm.classList.add('d-none');
        authSuccess.classList.remove('d-none');
        document.querySelector('.auth-tabs').classList.add('d-none');
      } else if (data.session) {
        // Auto-confirmed (if email confirmation is disabled)
        authState.user = data.user;
        authState.session = data.session;
        updateAuthUI();
        hideAuthModal();
        showAuthToast(`Account created! Welcome, ${data.user.email}!`, 'success');
      }
    } catch (err) {
      errorDiv.textContent = err.message || 'Sign up failed. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
    }
  });
}

function showAuthModal() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    // Reset to sign in tab
    document.getElementById('tabSignIn').click();
  }
}

function hideAuthModal() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

function clearAuthErrors() {
  const signInError = document.getElementById('signInError');
  const signUpError = document.getElementById('signUpError');
  if (signInError) signInError.textContent = '';
  if (signUpError) signUpError.textContent = '';
}

// ============================================================================
// AUTH UI STATE (Header User Badge)
// ============================================================================

function createAuthHeaderUI() {
  const headerActions = document.querySelector('.header-actions');

  // Create user status container (inserted before the download button)
  const userBadge = document.createElement('div');
  userBadge.id = 'authUserBadge';
  userBadge.className = 'auth-user-badge';
  userBadge.innerHTML = `
    <button type="button" class="btn btn-secondary" id="btnAuthSignIn" title="Sign In / Sign Up">
      <i class="fa-solid fa-user-lock"></i> Sign In
    </button>
    <div class="user-info d-none" id="userInfoBadge">
      <div class="user-avatar-mini">
        <i class="fa-solid fa-user-check"></i>
      </div>
      <span class="user-email-text" id="userEmailText"></span>
      <button type="button" class="btn btn-sm btn-secondary" id="btnMyDashboard" title="My Dashboard" style="margin-right: 5px;">
        <i class="fa-solid fa-layer-group"></i> Dashboard
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger" id="btnSignOut" title="Sign Out">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  `;

  // Insert before the Download PDF button
  const downloadBtn = document.getElementById('btnDownloadPdf');
  headerActions.insertBefore(userBadge, downloadBtn);

  // Attach events
  document.getElementById('btnAuthSignIn').addEventListener('click', showAuthModal);
  document.getElementById('btnSignOut').addEventListener('click', handleSignOut);
}

function updateAuthUI() {
  const signInBtn = document.getElementById('btnAuthSignIn');
  const userInfo = document.getElementById('userInfoBadge');
  const emailText = document.getElementById('userEmailText');
  const btnSaveResume = document.getElementById('btnSaveResume');

  if (authState.user) {
    signInBtn.classList.add('d-none');
    userInfo.classList.remove('d-none');
    emailText.textContent = authState.user.email;
    if (btnSaveResume) btnSaveResume.classList.remove('d-none');
  } else {
    signInBtn.classList.remove('d-none');
    userInfo.classList.add('d-none');
    emailText.textContent = '';
    if (btnSaveResume) btnSaveResume.classList.add('d-none');
  }
}

async function handleSignOut() {
  try {
    await supabaseClient.auth.signOut();
    authState.user = null;
    authState.session = null;
    updateAuthUI();
    showAuthToast('Signed out successfully', 'info');
  } catch (err) {
    showAuthToast('Error signing out: ' + err.message, 'error');
  }
}

// ============================================================================
// DOWNLOAD GATE - Intercept PDF Download
// ============================================================================

function setupDownloadGate() {
  const downloadBtn = document.getElementById('btnDownloadPdf');

  // Store original click handler reference
  const originalHandler = downloadBtn.onclick;

  // Remove all existing click listeners by cloning
  const newBtn = downloadBtn.cloneNode(true);
  downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

  // Attach gated click handler
  newBtn.addEventListener('click', (e) => {
    if (!authState.user) {
      e.preventDefault();
      e.stopPropagation();
      window._pendingPdfDownload = true;
      showAuthModal();
      showAuthToast('Please sign in to download your resume as PDF', 'info');
      return;
    }
    // User is authenticated — trigger the original PDF generation
    // We dispatch a custom event that app.js listens to
    window.dispatchEvent(new CustomEvent('resumix-generate-pdf'));
  });
}

// ============================================================================
// TOAST HELPER (uses existing toast system)
// ============================================================================

function showAuthToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const iconMap = {
    success: 'fa-circle-check',
    info: 'fa-circle-info',
    error: 'fa-circle-exclamation'
  };
  const iconClass = iconMap[type] || 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================================================
// DASHBOARD & RESUME SAVING MODULE
// ============================================================================

function initDashboard() {
  const btnMyDashboard = document.getElementById('btnMyDashboard');
  const btnSaveResume = document.getElementById('btnSaveResume');
  const dashboardOverlay = document.getElementById('dashboardOverlay');
  const dashboardCloseBtn = document.getElementById('dashboardCloseBtn');

  if (btnMyDashboard) {
    btnMyDashboard.addEventListener('click', openDashboard);
  }

  if (dashboardCloseBtn && dashboardOverlay) {
    dashboardCloseBtn.addEventListener('click', () => {
      dashboardOverlay.classList.remove('visible');
    });
    dashboardOverlay.addEventListener('click', (e) => {
      if (e.target === dashboardOverlay) dashboardOverlay.classList.remove('visible');
    });
  }

  if (btnSaveResume) {
    btnSaveResume.addEventListener('click', handleSaveResume);
  }
}

async function handleSaveResume() {
  if (!authState.user) return showAuthToast('Please sign in to save your resume', 'error');

  const title = prompt('Enter a title for this resume (e.g., "Software Engineer Resume"):', 'My Resume');
  if (!title) return; // user cancelled

  if (!window.resumixApp || !window.resumixApp.generatePdfBlob) {
    return showAuthToast('App engine not fully loaded.', 'error');
  }

  const btnSaveResume = document.getElementById('btnSaveResume');
  const originalHtml = btnSaveResume.innerHTML;
  btnSaveResume.disabled = true;
  btnSaveResume.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  showAuthToast('Generating PDF and saving to cloud...', 'info');

  try {
    const resumeState = window.resumixApp.getState();
    const pdfData = await window.resumixApp.generatePdfBlob();

    const filePath = `${authState.user.id}/${Date.now()}_${pdfData.filename}`;
    const { error: uploadError } = await supabaseClient.storage
      .from('resumes_pdfs')
      .upload(filePath, pdfData.blob, { contentType: 'application/pdf' });
    
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabaseClient.storage
      .from('resumes_pdfs')
      .getPublicUrl(filePath);

    const pdfUrl = publicUrlData.publicUrl;

    const { error } = await supabaseClient
      .from('resumes')
      .insert({
        user_id: authState.user.id,
        title: title,
        resume_data: resumeState,
        pdf_url: pdfUrl
      });

    if (error) throw error;
    showAuthToast('Resume and PDF saved to dashboard!', 'success');
  } catch (err) {
    showAuthToast('Error saving resume: ' + err.message, 'error');
    console.error(err);
  } finally {
    btnSaveResume.disabled = false;
    btnSaveResume.innerHTML = originalHtml;
  }
}

async function openDashboard() {
  const dashboardOverlay = document.getElementById('dashboardOverlay');
  if (!dashboardOverlay) return;

  dashboardOverlay.classList.add('visible');
  await fetchAndRenderDashboard();
}

async function fetchAndRenderDashboard() {
  const loading = document.getElementById('dashboardLoading');
  const empty = document.getElementById('dashboardEmpty');
  const list = document.getElementById('dashboardList');

  loading.classList.remove('d-none');
  empty.classList.add('d-none');
  list.classList.add('d-none');
  list.innerHTML = '';

  try {
    const { data, error } = await supabaseClient
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    loading.classList.add('d-none');

    if (!data || data.length === 0) {
      empty.classList.remove('d-none');
    } else {
      list.classList.remove('d-none');
      data.forEach(resume => {
        const card = document.createElement('div');
        card.className = 'resume-card';
        card.innerHTML = `
          <div class="resume-card-header">
            <div class="resume-card-icon"><i class="fa-solid fa-file-lines"></i></div>
          </div>
          <div class="resume-card-title">${escapeHtmlStr(resume.title)}</div>
          <div class="resume-card-date">Saved on: ${new Date(resume.created_at).toLocaleDateString()}</div>
          <div class="resume-card-actions mt-3">
            <button class="btn-load" data-id="${resume.id}">Load</button>
            ${resume.pdf_url ? `<a href="${resume.pdf_url}" target="_blank" class="btn-delete" style="border-color: var(--primary-600); color: var(--primary-600); text-decoration: none; display: flex; align-items: center;" title="View PDF"><i class="fa-solid fa-file-pdf"></i></a>` : ''}
            <button class="btn-delete" data-id="${resume.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;
        list.appendChild(card);

        // Load handler
        card.querySelector('.btn-load').addEventListener('click', () => {
          if (confirm(`Load "${escapeHtmlStr(resume.title)}" into the editor? Any unsaved changes will be lost.`)) {
            if (window.resumixApp) {
              window.resumixApp.loadData(resume.resume_data);
              document.getElementById('dashboardOverlay').classList.remove('visible');
              showAuthToast('Resume loaded successfully!', 'success');
            }
          }
        });

        // Delete handler
        card.querySelector('.btn-delete').addEventListener('click', async () => {
          if (confirm(`Are you sure you want to delete "${escapeHtmlStr(resume.title)}"?`)) {
            try {
              const { error: delError } = await supabaseClient.from('resumes').delete().eq('id', resume.id);
              if (delError) throw delError;
              card.remove();
              showAuthToast('Resume deleted', 'info');
              if (list.children.length === 0) {
                list.classList.add('d-none');
                empty.classList.remove('d-none');
              }
            } catch (err) {
              showAuthToast('Error deleting resume: ' + err.message, 'error');
            }
          }
        });
      });
    }
  } catch (err) {
    loading.classList.add('d-none');
    showAuthToast('Error fetching resumes: ' + err.message, 'error');
  }
}

function escapeHtmlStr(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initAuth() {
  // Create UI components
  createAuthModal();
  createAuthHeaderUI();
  initDashboard();

  // Check for existing session
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      authState.user = session.user;
      authState.session = session;
    }
  } catch (err) {
    console.error('Auth session check failed:', err);
  }

  authState.loading = false;
  updateAuthUI();

  // Setup download gate AFTER app.js has initialized
  setupDownloadGate();

  // Listen for auth state changes (e.g., token refresh, sign out from another tab)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    authState.user = session?.user || null;
    authState.session = session || null;
    updateAuthUI();
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
