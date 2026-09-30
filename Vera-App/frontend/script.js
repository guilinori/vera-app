// Base URL for your Python Flask backend
// Change this to your live Render/Railway URL once you deploy your backend online!
const API_BASE = 'http://127.0.0.1:5000/api';

// ====================================================
// 1. NAVIGATION & TAB SWITCHING
// ====================================================

function switchTab(viewName) {
  // Hide all view sections
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  // Activate the selected section
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update window header title
  const windowTitle = document.getElementById('window-title');
  if (windowTitle) {
    windowTitle.innerText = `VERA - ${viewName.toUpperCase()}`;
  }

  // Load backend data dynamically based on selected tab
  if (viewName === 'library') {
    loadLogs();
  } else if (viewName === 'profile') {
    loadProfile();
  }
}

// ====================================================
// 2. LIVE CLOCK BAR
// ====================================================

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    clockElement.innerText = timeString;
  }
}

setInterval(updateClock, 1000);

// ====================================================
// 3. CHAT ROOM HANDLER
// ====================================================

const chatForm = document.getElementById('chat-form');

if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();

    if (!message) return;

    // Display user's message in chat window immediately
    chatBox.innerHTML += `
      <div class="msg">
        <strong>You:</strong> ${escapeHTML(message)}
      </div>
    `;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      // Send message to Flask backend
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      // Display VERA's response
      chatBox.innerHTML += `
        <div class="msg vera-msg">
          🌱 <strong>VERA:</strong> ${escapeHTML(data.reply)}
        </div>
      `;
    } catch (err) {
      // Error handling when backend is unreachable
      chatBox.innerHTML += `
        <div class="msg vera-msg" style="color: #c0392b;">
          🌱 <strong>VERA:</strong> (System) Unable to reach companion server. Is app.py running?
        </div>
      `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// ====================================================
// 4. USER PROFILE HANDLER (FETCH & SAVE)
// ====================================================

async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');

    const data = await res.json();
    
    // Populate form fields with existing data
    if (document.getElementById('prof-name')) document.getElementById('prof-name').value = data.name || '';
    if (document.getElementById('prof-gender')) document.getElementById('prof-gender').value = data.gender || '';
    if (document.getElementById('prof-age')) document.getElementById('prof-age').value = data.age || '';
    if (document.getElementById('prof-birthday')) document.getElementById('prof-birthday').value = data.birthday || '';
    if (document.getElementById('prof-attachment')) document.getElementById('prof-attachment').value = data.attachment_style || '';
    if (document.getElementById('prof-childhood')) document.getElementById('prof-childhood').value = data.childhood_notes || '';
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

const profileForm = document.getElementById('profile-form');

if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusSpan = document.getElementById('profile-status');
    if (statusSpan) statusSpan.innerText = 'Saving...';

    const updatedProfile = {
      name: document.getElementById('prof-name')?.value.trim() || '',
      gender: document.getElementById('prof-gender')?.value.trim() || '',
      age: document.getElementById('prof-age')?.value.trim() || '',
      birthday: document.getElementById('prof-birthday')?.value.trim() || '',
      attachment_style: document.getElementById('prof-attachment')?.value.trim() || '',
      childhood_notes: document.getElementById('prof-childhood')?.value.trim() || ''
    };

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });

      const data = await res.json();
      if (data.status === 'success') {
        if (statusSpan) {
          statusSpan.style.color = '#27ae60';
          statusSpan.innerText = 'Saved!';
          setTimeout(() => { statusSpan.innerText = ''; }, 2500);
        }
      }
    } catch (err) {
      if (statusSpan) {
        statusSpan.style.color = '#c0392b';
        statusSpan.innerText = 'Error saving profile.';
      }
    }
  });
}

// ====================================================
// 5. LIBRARY LOGS HANDLER
// ====================================================

async function loadLogs() {
  const logsContainer = document.getElementById('logs-list');
  if (!logsContainer) return;

  try {
    const res = await fetch(`${API_BASE}/logs`);
    if (!res.ok) throw new Error('Failed to fetch logs');

    const data = await res.json();

    if (!data.logs || data.logs.length === 0) {
      logsContainer.innerHTML = '<p>No journal entries found.</p>';
      return;
    }

    // Render log entries
    logsContainer.innerHTML = data.logs.map(log => `
      <div style="border: 2px solid #000; padding: 10px; margin-bottom: 10px; background: #fff;">
        <strong>${escapeHTML(log.title)}</strong> (${escapeHTML(log.month)}/${escapeHTML(log.year)})
        <p style="margin-top: 6px;">${escapeHTML(log.content)}</p>
      </div>
    `).join('');
  } catch (err) {
    logsContainer.innerHTML = '<p style="color: #c0392b;">Error loading logs from server.</p>';
  }
}

// Helper utility to sanitize user inputs and prevent XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialize clock on page load
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
});