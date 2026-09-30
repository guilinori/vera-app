// ====================================================
// VERA.ai - Standalone Companion Script (GitHub Pages)
// ====================================================

// Default initial data structure
const defaultData = {
  profile: {
    name: '',
    gender: '',
    age: '',
    birthday: '',
    attachment_style: '',
    childhood_notes: ''
  },
  logs: [
    {
      id: 1,
      month: "07",
      year: "2026",
      title: "Daily Reflection - Growth",
      content: "Spent time outside today. Noticed how small steps add up over time."
    }
  ]
};

// Initialize localStorage if empty
function initStorage() {
  if (!localStorage.getItem('vera_profile')) {
    localStorage.setItem('vera_profile', JSON.stringify(defaultData.profile));
  }
  if (!localStorage.getItem('vera_logs')) {
    localStorage.setItem('vera_logs', JSON.stringify(defaultData.logs));
  }
}

// ----------------------------------------------------
// 1. Navigation & Tab Switcher
// ----------------------------------------------------
function switchTab(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Activate selected view
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update header title
  const windowTitle = document.getElementById('window-title');
  if (windowTitle) {
    windowTitle.innerText = `VERA - ${viewName.toUpperCase()}`;
  }

  // Load section-specific data
  if (viewName === 'library') loadLogs();
  if (viewName === 'profile') loadProfile();
}

// ----------------------------------------------------
// 2. Real-Time Clock
// ----------------------------------------------------
function updateClock() {
  const now = new Date();
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    clockElement.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
setInterval(updateClock, 1000);

// ----------------------------------------------------
// 3. Companion Chat Logic
// ----------------------------------------------------
const chatForm = document.getElementById('chat-form');

if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();

    if (!message) return;

    // Render user message immediately
    chatBox.innerHTML += `
      <div class="msg">
        <strong>You:</strong> ${escapeHTML(message)}
      </div>
    `;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate VERA's reflection response directly in browser JS
    setTimeout(() => {
      const response = generateVeraResponse(message);
      chatBox.innerHTML += `
        <div class="msg vera-msg">
          🌱 <strong>VERA:</strong> ${response}
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 450);
  });
}

function generateVeraResponse(userMsg) {
  const lowerMsg = userMsg.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return "Hello! I'm here and listening. What's on your mind today?";
  }
  if (lowerMsg.includes('sad') || lowerMsg.includes('upset') || lowerMsg.includes('tired')) {
    return "I hear you. It sounds like things feel heavy right now. Do you want to unpack what brought on that feeling?";
  }
  if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('great')) {
    return "It's wonderful to hear that! What was the highlight of your day?";
  }
  
  return `I hear you. When you reflect on '${escapeHTML(userMsg)}', how does that make you feel overall?`;
}

// ----------------------------------------------------
// 4. Profile Management (localStorage)
// ----------------------------------------------------
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('vera_profile')) || defaultData.profile;
  
  if (document.getElementById('prof-name')) document.getElementById('prof-name').value = profile.name || '';
  if (document.getElementById('prof-gender')) document.getElementById('prof-gender').value = profile.gender || '';
  if (document.getElementById('prof-age')) document.getElementById('prof-age').value = profile.age || '';
  if (document.getElementById('prof-birthday')) document.getElementById('prof-birthday').value = profile.birthday || '';
  if (document.getElementById('prof-attachment')) document.getElementById('prof-attachment').value = profile.attachment_style || '';
  if (document.getElementById('prof-childhood')) document.getElementById('prof-childhood').value = profile.childhood_notes || '';
}

const profileForm = document.getElementById('profile-form');

if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const statusSpan = document.getElementById('profile-status');
    
    const updatedProfile = {
      name: document.getElementById('prof-name')?.value.trim() || '',
      gender: document.getElementById('prof-gender')?.value.trim() || '',
      age: document.getElementById('prof-age')?.value.trim() || '',
      birthday: document.getElementById('prof-birthday')?.value.trim() || '',
      attachment_style: document.getElementById('prof-attachment')?.value.trim() || '',
      childhood_notes: document.getElementById('prof-childhood')?.value.trim() || ''
    };

    localStorage.setItem('vera_profile', JSON.stringify(updatedProfile));

    if (statusSpan) {
      statusSpan.style.color = '#27ae60';
      statusSpan.innerText = 'Saved!';
      setTimeout(() => { statusSpan.innerText = ''; }, 2500);
    }
  });
}

// ----------------------------------------------------
// 5. Library Logs Management
// ----------------------------------------------------
function loadLogs() {
  const logsContainer = document.getElementById('logs-list');
  if (!logsContainer) return;

  const logs = JSON.parse(localStorage.getItem('vera_logs')) || defaultData.logs;

  if (logs.length === 0) {
    logsContainer.innerHTML = '<p>No journal entries found.</p>';
    return;
  }

  logsContainer.innerHTML = logs.map(log => `
    <div style="border: 2px solid #000; padding: 10px; margin-bottom: 10px; background: #fff;">
      <strong>${escapeHTML(log.title)}</strong> (${escapeHTML(log.month)}/${escapeHTML(log.year)})
      <p style="margin-top: 6px;">${escapeHTML(log.content)}</p>
    </div>
  `).join('');
}

// Helper to escape special HTML characters and prevent XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  updateClock();
});
