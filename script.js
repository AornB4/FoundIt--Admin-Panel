/* =============================================
   FOUNDIT! — Admin Panel Script
   ============================================= */

'use strict';

// ============ DATA STORE ============
const STORAGE_KEYS = {
  POSTS: 'foundit_admin_posts',
  USERS: 'foundit_admin_users',
  REPORTS: 'foundit_admin_reports',
  LOGS: 'foundit_admin_logs',
  NOTIFICATIONS: 'foundit_admin_notifs',
  LOCATIONS: 'foundit_admin_locations',
};

const DEFAULT_LOCATIONS = [
  'MPG Building', 'Old Canteen', 'Library', 'Cafeteria',
  'Gym', 'Parking Lot A', 'Science Block', 'Admin Office',
  'Chapel', 'Guard House'
];

const CATEGORY_ICONS = {
  electronics: 'ri-smartphone-line',
  clothing: 'ri-t-shirt-line',
  accessories: 'ri-handbag-line',
  documents: 'ri-file-text-line',
  keys: 'ri-key-2-line',
  bags: 'ri-briefcase-line',
  other: 'ri-question-line',
};

function generateClaimCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `FI-${seg(4)}-${seg(4)}`;
}

function generateId(prefix = 'item') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Default dummy data
const DEFAULT_POSTS = [
  { id: 'item_001', title: 'Lost Keys', category: 'keys', description: 'Silver key ring with a blue keychain. Found near the main entrance.', status: 'lost', location: 'MPG Building', reportedBy: 'Juan Dela Cruz', date: '2026-03-28', image: '', claimCode: 'FI-XKBD-7N2P', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'item_002', title: 'Water Bottle', category: 'other', description: 'Blue Hydro Flask 32oz with stickers on it.', status: 'found', location: 'Old Canteen', reportedBy: 'Maria Santos', date: '2026-03-27', image: '', claimCode: 'FI-WB02-MNKX', createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'item_003', title: 'Headphones', category: 'electronics', description: 'Black Sony WH-1000XM4, left in a chair.', status: 'lost', location: 'Old Canteen', reportedBy: 'Pedro Reyes', date: '2026-03-26', image: '', claimCode: 'FI-HP03-AXYZ', createdAt: new Date(Date.now() - 3600000 * 10).toISOString() },
  { id: 'item_004', title: 'Planner', category: 'documents', description: 'Brown leather planner with "MR" initials.', status: 'found', location: 'Old Canteen', reportedBy: 'Ana Gonzalez', date: '2026-03-25', image: '', claimCode: 'FI-PL04-BRTX', createdAt: new Date(Date.now() - 3600000 * 18).toISOString() },
  { id: 'item_005', title: 'Umbrella', category: 'other', description: 'Red folding umbrella, forgot in the hallway.', status: 'lost', location: 'Old Canteen', reportedBy: 'Carlos Mendoza', date: '2026-03-24', image: '', claimCode: 'FI-UM05-QRST', createdAt: new Date(Date.now() - 3600000 * 25).toISOString() },
  { id: 'item_006', title: 'USB Drive', category: 'electronics', description: '32GB Kingston USB with green cap.', status: 'found', location: 'Old Canteen', reportedBy: 'Liza Torres', date: '2026-03-23', image: '', claimCode: 'FI-USB6-MNOP', createdAt: new Date(Date.now() - 3600000 * 30).toISOString() },
  { id: 'item_007', title: 'Camera', category: 'electronics', description: 'Canon EOS M50 mirrorless camera, black body.', status: 'claimed', location: 'Old Canteen', reportedBy: 'Jose Villanueva', date: '2026-03-22', image: '', claimCode: 'FI-CAM7-WXYZ', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 'item_008', title: 'Samsung Galaxy Buds', category: 'electronics', description: 'White Galaxy Buds+ with case, found near cafeteria seats.', status: 'found', location: 'Cafeteria', reportedBy: 'Rosa Aquino', date: '2026-03-21', image: '', claimCode: 'FI-GB08-LMNO', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'item_009', title: 'Student ID', category: 'documents', description: 'Student ID for Miguel Bautista, 2nd year IT.', status: 'found', location: 'Library', reportedBy: 'Staff', date: '2026-03-20', image: '', claimCode: 'FI-ID09-PQRS', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
  { id: 'item_010', title: 'Backpack', category: 'bags', description: 'Black Jansport backpack, has keychain ornament.', status: 'pending', location: 'Gym', reportedBy: 'Roberto Cruz', date: '2026-03-29', image: '', claimCode: 'FI-BP10-UVWX', createdAt: new Date(Date.now() - 3600000 * 1).toISOString() },
];

const DEFAULT_USERS = [
  { id: 'usr_001', name: 'Juan Dela Cruz', email: 'juan.delacruz@campus.edu', postsCount: 3, claimsCount: 1, joined: '2026-01-15', status: 'active', avatar: '' },
  { id: 'usr_002', name: 'Maria Santos', email: 'maria.santos@campus.edu', postsCount: 5, claimsCount: 2, joined: '2026-01-20', status: 'active', avatar: '' },
  { id: 'usr_003', name: 'Pedro Reyes', email: 'pedro.reyes@campus.edu', postsCount: 2, claimsCount: 0, joined: '2026-02-03', status: 'active', avatar: '' },
  { id: 'usr_004', name: 'Ana Gonzalez', email: 'ana.gonzalez@campus.edu', postsCount: 1, claimsCount: 3, joined: '2026-02-14', status: 'suspended', avatar: '' },
  { id: 'usr_005', name: 'Carlos Mendoza', email: 'carlos.mendoza@campus.edu', postsCount: 4, claimsCount: 1, joined: '2026-02-22', status: 'active', avatar: '' },
  { id: 'usr_006', name: 'Liza Torres', email: 'liza.torres@campus.edu', postsCount: 0, claimsCount: 5, joined: '2026-03-01', status: 'banned', avatar: '' },
  { id: 'usr_007', name: 'Jose Villanueva', email: 'jose.villanueva@campus.edu', postsCount: 7, claimsCount: 2, joined: '2025-12-10', status: 'active', avatar: '' },
  { id: 'usr_008', name: 'Rosa Aquino', email: 'rosa.aquino@campus.edu', postsCount: 2, claimsCount: 0, joined: '2026-03-10', status: 'active', avatar: '' },
];

const DEFAULT_REPORTS = [
  { id: 'rep_001', postId: 'item_003', postTitle: 'Headphones', reportedBy: 'Ana Gonzalez', reason: 'Suspicious — poster claiming ownership without proof.', date: '2026-03-27', status: 'pending' },
  { id: 'rep_002', postId: 'item_005', postTitle: 'Umbrella', reportedBy: 'Pedro Reyes', reason: 'Duplicate post. Same item posted twice.', date: '2026-03-26', status: 'pending' },
  { id: 'rep_003', postId: 'item_002', postTitle: 'Water Bottle', reportedBy: 'Carlos Mendoza', reason: 'Incorrect location listed.', date: '2026-03-24', status: 'resolved' },
  { id: 'rep_004', postId: 'item_010', postTitle: 'Backpack', reportedBy: 'Maria Santos', reason: 'Spam post, no actual item described.', date: '2026-03-29', status: 'pending' },
];

// ============ DATA LAYER ============
const Store = {
  get(key, defaultVal = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultVal;
    } catch { return defaultVal; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) this.set(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) this.set(STORAGE_KEYS.REPORTS, DEFAULT_REPORTS);
    if (!localStorage.getItem(STORAGE_KEYS.LOGS)) this.set(STORAGE_KEYS.LOGS, []);
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) this.set(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) this.set(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
  },
  reset() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.set(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.set(STORAGE_KEYS.REPORTS, DEFAULT_REPORTS);
    this.set(STORAGE_KEYS.LOGS, []);
    this.set(STORAGE_KEYS.NOTIFICATIONS, []);
    this.set(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
  },
  clear() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  },
};

// ============ TOAST ============
const Toast = {
  el: null,
  timer: null,
  init() { this.el = document.getElementById('toast'); },
  show(msg, type = 'success', icon = '') {
    if (!this.el) return;
    const icons = { success: 'ri-checkbox-circle-line', error: 'ri-close-circle-line', info: 'ri-information-line' };
    this.el.innerHTML = `<i class="${icons[type] || icons.success}"></i><span>${msg}</span>`;
    this.el.className = `toast ${type} show`;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.el.className = 'toast'; }, 3200);
  }
};

// ============ AUDIT LOG ============
const AuditLog = {
  add(action, detail, type = 'edit') {
    const logs = Store.get(STORAGE_KEYS.LOGS);
    logs.unshift({ id: generateId('log'), action, detail, type, timestamp: new Date().toISOString() });
    if (logs.length > 200) logs.pop();
    Store.set(STORAGE_KEYS.LOGS, logs);
    LogsManager.render();
    Dashboard.renderActivity();
  }
};

// ============ NOTIFICATIONS ============
const Notifications = {
  add(msg, type = 'new-post') {
    const notifs = Store.get(STORAGE_KEYS.NOTIFICATIONS);
    notifs.unshift({ id: generateId('notif'), msg, type, timestamp: new Date().toISOString() });
    Store.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    this.updateDot();
    this.renderList();
  },
  updateDot() {
    const notifs = Store.get(STORAGE_KEYS.NOTIFICATIONS);
    document.getElementById('notifDot').classList.toggle('visible', notifs.length > 0);
  },
  renderList() {
    const list = document.getElementById('notifList');
    const notifs = Store.get(STORAGE_KEYS.NOTIFICATIONS);
    if (!notifs.length) {
      list.innerHTML = '<li class="notif-empty"><i class="ri-notification-off-line" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.4;"></i>No new notifications</li>';
      return;
    }
    const icons = { 'new-post': 'ri-file-add-line', 'claim': 'ri-checkbox-circle-line', 'report': 'ri-flag-line' };
    list.innerHTML = notifs.map(n => `
      <li class="notif-item">
        <div class="notif-icon ${n.type}"><i class="${icons[n.type] || 'ri-bell-line'}"></i></div>
        <div>
          <div class="notif-text">${n.msg}</div>
          <div class="notif-time">${timeAgo(n.timestamp)}</div>
        </div>
      </li>
    `).join('');
  }
};

// ============ APP CORE ============
const App = {
  currentSection: 'dashboard',
  confirmCallback: null,

  init() {
    Store.init();
    Toast.init();
    this.bindSidebar();
    this.bindNavLinks();
    this.bindNotifBtn();
    this.updateDate();
    Dashboard.render();
    Notifications.updateDot();
    Notifications.renderList();
    this.populateLocationDropdown();
  },

  bindSidebar() {
    const btn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && !sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  },

  bindNavLinks() {
    document.querySelectorAll('[data-section]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(el.dataset.section);
      });
    });
  },

  navigate(section) {
    this.currentSection = section;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.section === section);
    });
    const sectionEl = document.getElementById(`section-${section}`);
    if (sectionEl) sectionEl.classList.add('active');
    const titles = { dashboard: 'Dashboard', posts: 'Posts', users: 'Users', reports: 'Reports', logs: 'Activity Logs', settings: 'Settings' };
    document.getElementById('topbarTitle').textContent = titles[section] || section;

    if (section === 'dashboard') Dashboard.render();
    if (section === 'posts') PostsManager.render();
    if (section === 'users') UsersManager.render();
    if (section === 'reports') ReportsManager.render();
    if (section === 'logs') LogsManager.render();
    if (section === 'settings') Settings.render();

    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
  },

  bindNotifBtn() {
    document.getElementById('notifBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('notifPanel').classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('notifPanel');
      if (!panel.contains(e.target) && e.target !== document.getElementById('notifBtn')) {
        panel.classList.remove('open');
      }
    });
  },

  clearNotifications() {
    Store.set(STORAGE_KEYS.NOTIFICATIONS, []);
    Notifications.updateDot();
    Notifications.renderList();
    document.getElementById('notifPanel').classList.remove('open');
    Toast.show('Notifications cleared', 'info', 'ri-notification-off-line');
  },

  updateDate() {
    const el = document.getElementById('dateDisplay');
    if (el) {
      el.textContent = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  },

  confirm(title, msg, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = msg;
    document.getElementById('confirmModal').style.display = 'flex';
    this.confirmCallback = callback;
    document.getElementById('confirmBtn').onclick = () => {
      this.closeConfirm();
      if (callback) callback();
    };
  },

  closeConfirm() {
    document.getElementById('confirmModal').style.display = 'none';
    this.confirmCallback = null;
  },

  refresh() {
    this.navigate(this.currentSection);
    Toast.show('Refreshed', 'info');
  },

  updateBadges() {
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const reports = Store.get(STORAGE_KEYS.REPORTS).filter(r => r.status === 'pending');
    document.getElementById('nav-badge-posts').textContent = posts.length;
    document.getElementById('nav-badge-reports').textContent = reports.length;
  },

  populateLocationDropdown() {
    const locs = Store.get(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
    const selects = document.querySelectorAll('#pLocation, #filterLocation');
    selects.forEach(sel => {
      if (!sel) return;
      const val = sel.value;
      if (sel.id === 'filterLocation') {
        sel.innerHTML = '<option value="">All Locations</option>';
      } else {
        sel.innerHTML = '<option value="">Select location</option>';
      }
      locs.forEach(loc => {
        sel.innerHTML += `<option value="${loc}">${loc}</option>`;
      });
      if (val) sel.value = val;
    });
  }
};

// ============ DASHBOARD ============
const Dashboard = {
  chart: null,

  render() {
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const users = Store.get(STORAGE_KEYS.USERS);
    const lost = posts.filter(p => p.status === 'lost').length;
    const found = posts.filter(p => p.status === 'found').length;
    const claimed = posts.filter(p => p.status === 'claimed').length;
    const active = users.filter(u => u.status === 'active').length;

    document.getElementById('stat-lost').textContent = lost;
    document.getElementById('stat-found').textContent = found;
    document.getElementById('stat-claimed').textContent = claimed;
    document.getElementById('stat-users').textContent = active;

    this.renderChart(lost, found, claimed);
    this.renderRecentPosts(posts);
    this.renderActivity();
    App.updateBadges();
  },

  renderChart(lost, found, claimed) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = lost + found + claimed || 1;
    const data = [lost, found, claimed];
    const colors = ['#C0392B', '#2D6A4F', '#B8601A'];
    const labels = ['Lost', 'Found', 'Claimed'];

    // Simple canvas donut chart
    canvas.width = 180; canvas.height = 180;
    const cx = 90, cy = 90, r = 70, innerR = 44;
    let start = -Math.PI / 2;
    ctx.clearRect(0, 0, 180, 180);

    data.forEach((val, i) => {
      const slice = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      start += slice;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#FAFAF7';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 22px Jost, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lost + found + claimed, cx, cy + 4);
    ctx.font = '10px Jost, sans-serif';
    ctx.fillStyle = '#8A8478';
    ctx.fillText('Total', cx, cy + 18);

    // Legend
    const legend = document.getElementById('chartLegend');
    legend.innerHTML = data.map((val, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${colors[i]}"></span>
        <span class="legend-label">${labels[i]}</span>
        <span class="legend-val">${val}</span>
      </div>
    `).join('');
  },

  renderRecentPosts(posts) {
    const tbody = document.querySelector('#dashPostsTable tbody');
    const recent = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    tbody.innerHTML = recent.map(p => `
      <tr>
        <td>
          <div class="item-cell">
            <div class="item-img-placeholder"><i class="${CATEGORY_ICONS[p.category] || 'ri-question-line'} cat-icon"></i></div>
            <div><div class="item-name">${esc(p.title)}</div><div class="item-id">${p.id}</div></div>
          </div>
        </td>
        <td>${capitalize(p.category)}</td>
        <td><span class="status-badge ${p.status}">${capitalize(p.status)}</span></td>
        <td>${esc(p.location)}</td>
        <td>${formatDate(p.date)}</td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" title="View" onclick="PostsManager.viewPost('${p.id}')"><i class="ri-eye-line"></i></button>
            <button class="btn-icon" title="Edit" onclick="PostsManager.openEditModal('${p.id}')"><i class="ri-edit-line"></i></button>
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="6"><div class="empty-state"><i class="ri-inbox-line"></i>No posts yet</div></td></tr>`;
  },

  renderActivity() {
    const logs = Store.get(STORAGE_KEYS.LOGS).slice(0, 8);
    const list = document.getElementById('dashActivityList');
    if (!list) return;
    const typeMap = {
      edit: { cls: 'edit', icon: 'ri-edit-line' },
      delete: { cls: 'delete', icon: 'ri-delete-bin-line' },
      verify: { cls: 'verify', icon: 'ri-shield-check-line' },
      status: { cls: 'status', icon: 'ri-refresh-line' },
      user: { cls: 'user', icon: 'ri-user-settings-line' },
      post: { cls: 'post', icon: 'ri-file-add-line' },
    };
    list.innerHTML = logs.map(l => {
      const t = typeMap[l.type] || typeMap.edit;
      return `<li class="activity-item">
        <span class="activity-dot ${t.cls}"></span>
        <div><div class="activity-text">${esc(l.action)}</div><div class="activity-time">${timeAgo(l.timestamp)}</div></div>
      </li>`;
    }).join('') || '<li class="activity-item"><div class="activity-text" style="color:var(--warm-gray)">No activity yet</div></li>';
  }
};

// ============ POSTS MANAGER ============
const PostsManager = {
  currentTab: 'all',
  selectedIds: new Set(),

  render() {
    this.applyFilters();
    App.updateBadges();
    App.populateLocationDropdown();
  },

  applyFilters() {
    const search = (document.getElementById('postsSearch')?.value || '').toLowerCase();
    const status = document.getElementById('filterStatus')?.value || '';
    const category = document.getElementById('filterCategory')?.value || '';
    const location = document.getElementById('filterLocation')?.value || '';
    let posts = Store.get(STORAGE_KEYS.POSTS);

    if (this.currentTab !== 'all') posts = posts.filter(p => p.status === this.currentTab);
    if (status) posts = posts.filter(p => p.status === status);
    if (category) posts = posts.filter(p => p.category === category);
    if (location) posts = posts.filter(p => p.location === location);
    if (search) posts = posts.filter(p =>
      p.title.toLowerCase().includes(search) ||
      (p.description || '').toLowerCase().includes(search) ||
      (p.location || '').toLowerCase().includes(search) ||
      (p.reportedBy || '').toLowerCase().includes(search)
    );

    this.renderTable(posts);
  },

  setTab(btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    this.currentTab = btn.dataset.tab;
    this.applyFilters();
  },

  renderTable(posts) {
    const tbody = document.querySelector('#postsTable tbody');
    tbody.innerHTML = posts.map(p => `
      <tr class="${this.selectedIds.has(p.id) ? 'selected' : ''}">
        <td><input type="checkbox" class="post-cb" data-id="${p.id}" onchange="PostsManager.toggleSelect(this)" ${this.selectedIds.has(p.id) ? 'checked' : ''} /></td>
        <td>
          <div class="item-cell">
            ${p.image ? `<img src="${esc(p.image)}" class="item-img" onerror="this.style.display='none'" />` :
              `<div class="item-img-placeholder"><i class="${CATEGORY_ICONS[p.category] || 'ri-question-line'} cat-icon"></i></div>`}
            <div><div class="item-name">${esc(p.title)}</div><div class="item-id">${p.id}</div></div>
          </div>
        </td>
        <td>${capitalize(p.category)}</td>
        <td><span class="status-badge ${p.status}">${capitalize(p.status)}</span></td>
        <td>${esc(p.location)}</td>
        <td>${esc(p.reportedBy || '—')}</td>
        <td><span class="claim-code">${p.claimCode}</span></td>
        <td>${formatDate(p.date)}</td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" title="View" onclick="PostsManager.viewPost('${p.id}')"><i class="ri-eye-line"></i></button>
            <button class="btn-icon" title="Edit" onclick="PostsManager.openEditModal('${p.id}')"><i class="ri-edit-line"></i></button>
            <button class="btn-icon success" title="Mark Claimed" onclick="PostsManager.markStatus('${p.id}','claimed')"><i class="ri-checkbox-circle-line"></i></button>
            <button class="btn-icon danger" title="Delete" onclick="PostsManager.deletePost('${p.id}')"><i class="ri-delete-bin-line"></i></button>
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="9"><div class="empty-state"><i class="ri-inbox-line"></i>No posts found</div></td></tr>`;
  },

  toggleSelect(cb) {
    if (cb.checked) this.selectedIds.add(cb.dataset.id);
    else this.selectedIds.delete(cb.dataset.id);
    this.updateBulkBar();
  },

  toggleSelectAll(masterCb) {
    document.querySelectorAll('.post-cb').forEach(cb => {
      cb.checked = masterCb.checked;
      if (masterCb.checked) this.selectedIds.add(cb.dataset.id);
      else this.selectedIds.delete(cb.dataset.id);
    });
    this.updateBulkBar();
  },

  updateBulkBar() {
    const bar = document.getElementById('bulkBar');
    const count = this.selectedIds.size;
    document.getElementById('bulkCount').textContent = `${count} selected`;
    bar.classList.toggle('visible', count > 0);
    document.querySelectorAll('#postsTable tbody tr').forEach(row => {
      const cb = row.querySelector('.post-cb');
      if (cb) row.classList.toggle('selected', this.selectedIds.has(cb.dataset.id));
    });
  },

  bulkDelete() {
    if (!this.selectedIds.size) return;
    App.confirm('Delete Selected', `Delete ${this.selectedIds.size} selected post(s)? This cannot be undone.`, () => {
      let posts = Store.get(STORAGE_KEYS.POSTS);
      posts = posts.filter(p => !this.selectedIds.has(p.id));
      Store.set(STORAGE_KEYS.POSTS, posts);
      AuditLog.add(`Bulk deleted ${this.selectedIds.size} post(s)`, '', 'delete');
      this.selectedIds.clear();
      this.render();
      Dashboard.render();
      Toast.show(`Posts deleted`, 'success');
    });
  },

  bulkMarkClaimed() {
    if (!this.selectedIds.size) return;
    let posts = Store.get(STORAGE_KEYS.POSTS);
    posts = posts.map(p => this.selectedIds.has(p.id) ? { ...p, status: 'claimed' } : p);
    Store.set(STORAGE_KEYS.POSTS, posts);
    AuditLog.add(`Bulk marked ${this.selectedIds.size} post(s) as claimed`, '', 'status');
    this.selectedIds.clear();
    this.render();
    Dashboard.render();
    Toast.show(`Posts marked as claimed`, 'success');
  },

  openAddModal() {
    document.getElementById('postModalTitle').textContent = 'Add New Post';
    document.getElementById('postForm').reset();
    document.getElementById('pId').value = '';
    document.getElementById('pDate').value = new Date().toISOString().slice(0, 10);
    App.populateLocationDropdown();
    document.getElementById('postModal').style.display = 'flex';
  },

  openEditModal(id) {
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const post = posts.find(p => p.id === id);
    if (!post) return;
    document.getElementById('postModalTitle').textContent = 'Edit Post';
    document.getElementById('pId').value = post.id;
    document.getElementById('pTitle').value = post.title;
    document.getElementById('pCategory').value = post.category;
    document.getElementById('pDescription').value = post.description;
    document.getElementById('pStatus').value = post.status;
    document.getElementById('pDate').value = post.date;
    document.getElementById('pReportedBy').value = post.reportedBy || '';
    document.getElementById('pImage').value = post.image || '';
    App.populateLocationDropdown();
    document.getElementById('pLocation').value = post.location;
    document.getElementById('postModal').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('postModal').style.display = 'none';
  },

  savePost(e) {
    e.preventDefault();
    const id = document.getElementById('pId').value;
    const postData = {
      title: document.getElementById('pTitle').value.trim(),
      category: document.getElementById('pCategory').value,
      description: document.getElementById('pDescription').value.trim(),
      status: document.getElementById('pStatus').value,
      location: document.getElementById('pLocation').value,
      date: document.getElementById('pDate').value,
      reportedBy: document.getElementById('pReportedBy').value.trim(),
      image: document.getElementById('pImage').value.trim(),
    };

    let posts = Store.get(STORAGE_KEYS.POSTS);
    if (id) {
      posts = posts.map(p => p.id === id ? { ...p, ...postData } : p);
      Store.set(STORAGE_KEYS.POSTS, posts);
      AuditLog.add(`Edited post: "${postData.title}"`, `Status: ${postData.status}`, 'edit');
      Toast.show('Post updated successfully', 'success');
    } else {
      const newPost = { ...postData, id: generateId('item'), claimCode: generateClaimCode(), createdAt: new Date().toISOString() };
      posts.unshift(newPost);
      Store.set(STORAGE_KEYS.POSTS, posts);
      AuditLog.add(`Added new post: "${postData.title}"`, '', 'post');
      Notifications.add(`New post submitted: "${postData.title}"`, 'new-post');
      Toast.show('Post added successfully', 'success');
    }

    this.closeModal();
    this.render();
    Dashboard.render();
  },

  deletePost(id) {
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const post = posts.find(p => p.id === id);
    App.confirm('Delete Post', `Are you sure you want to delete "${post?.title}"? This cannot be undone.`, () => {
      Store.set(STORAGE_KEYS.POSTS, posts.filter(p => p.id !== id));
      AuditLog.add(`Deleted post: "${post?.title}"`, '', 'delete');
      this.render();
      Dashboard.render();
      Toast.show('Post deleted', 'error');
    });
  },

  markStatus(id, status) {
    let posts = Store.get(STORAGE_KEYS.POSTS);
    const post = posts.find(p => p.id === id);
    posts = posts.map(p => p.id === id ? { ...p, status } : p);
    Store.set(STORAGE_KEYS.POSTS, posts);
    AuditLog.add(`Marked "${post?.title}" as ${status}`, '', 'status');
    this.render();
    Dashboard.render();
    Toast.show(`Status updated to ${status}`, 'success');
  },

  viewPost(id) {
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const p = posts.find(post => post.id === id);
    if (!p) return;
    const content = document.getElementById('viewPostContent');
    content.innerHTML = `
      <h2 class="modal-title" style="margin-bottom:20px;">${esc(p.title)}</h2>
      <div class="view-post-grid">
        ${p.image
          ? `<img src="${esc(p.image)}" class="view-post-img" onerror="this.parentElement.innerHTML='<div class=\\'view-post-img-placeholder\\'><i class=\\'${CATEGORY_ICONS[p.category]} cat-icon\\'></i></div>'" />`
          : `<div class="view-post-img-placeholder"><i class="${CATEGORY_ICONS[p.category] || 'ri-question-line'}" style="font-size:48px;"></i></div>`}
        <div>
          <div class="view-post-meta">
            <div class="meta-item"><label>Status</label><p><span class="status-badge ${p.status}">${capitalize(p.status)}</span></p></div>
            <div class="meta-item"><label>Category</label><p>${capitalize(p.category)}</p></div>
            <div class="meta-item"><label>Location</label><p>${esc(p.location)}</p></div>
            <div class="meta-item"><label>Date</label><p>${formatDate(p.date)}</p></div>
            <div class="meta-item"><label>Reported By</label><p>${esc(p.reportedBy || '—')}</p></div>
            <div class="meta-item"><label>Post ID</label><p style="font-family:monospace;font-size:11px;">${p.id}</p></div>
          </div>
          <div style="margin-top:14px;">
            <div class="meta-item"><label>Description</label><p style="margin-top:4px;">${esc(p.description)}</p></div>
          </div>
          <div class="view-claim-box">
            <label>Claim Code</label>
            <div class="view-claim-code">${p.claimCode}</div>
          </div>
        </div>
      </div>
      <div class="view-post-actions">
        <button class="btn-primary btn-sm" onclick="PostsManager.closeViewModal(); PostsManager.openEditModal('${p.id}')"><i class="ri-edit-line"></i> Edit Post</button>
        <button class="btn-outline btn-sm" onclick="PostsManager.closeViewModal(); PostsManager.markStatus('${p.id}','found')"><i class="ri-map-pin-line"></i> Mark Found</button>
        <button class="btn-outline btn-sm" onclick="PostsManager.closeViewModal(); PostsManager.markStatus('${p.id}','claimed')"><i class="ri-checkbox-circle-line"></i> Mark Claimed</button>
        <button class="btn-outline btn-sm" onclick="PostsManager.closeViewModal(); PostsManager.markStatus('${p.id}','pending')"><i class="ri-time-line"></i> Mark Pending</button>
        <button class="btn-danger btn-sm" onclick="PostsManager.closeViewModal(); PostsManager.deletePost('${p.id}')"><i class="ri-delete-bin-line"></i> Delete</button>
      </div>
    `;
    document.getElementById('viewPostModal').style.display = 'flex';
  },

  closeViewModal() {
    document.getElementById('viewPostModal').style.display = 'none';
  }
};

// ============ USERS MANAGER ============
const UsersManager = {
  render() { this.applyFilters(); },

  applyFilters() {
    const search = (document.getElementById('usersSearch')?.value || '').toLowerCase();
    const status = document.getElementById('filterUserStatus')?.value || '';
    let users = Store.get(STORAGE_KEYS.USERS);
    if (status) users = users.filter(u => u.status === status);
    if (search) users = users.filter(u =>
      u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
    );
    this.renderTable(users);
  },

  renderTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="item-cell">
            <div class="user-big-avatar" style="width:32px;height:32px;font-size:14px;">${u.name.charAt(0)}</div>
            <div class="item-name">${esc(u.name)}</div>
          </div>
        </td>
        <td style="color:var(--warm-gray)">${esc(u.email)}</td>
        <td>${u.postsCount}</td>
        <td>${u.claimsCount}</td>
        <td>${formatDate(u.joined)}</td>
        <td><span class="user-status-badge ${u.status}">${capitalize(u.status)}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" title="View" onclick="UsersManager.viewUser('${u.id}')"><i class="ri-eye-line"></i></button>
            ${u.status !== 'suspended' ? `<button class="btn-icon" title="Suspend" onclick="UsersManager.setStatus('${u.id}','suspended')"><i class="ri-pause-circle-line"></i></button>` : `<button class="btn-icon success" title="Restore" onclick="UsersManager.setStatus('${u.id}','active')"><i class="ri-play-circle-line"></i></button>`}
            ${u.status !== 'banned' ? `<button class="btn-icon danger" title="Ban" onclick="UsersManager.setStatus('${u.id}','banned')"><i class="ri-forbid-line"></i></button>` : ''}
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="7"><div class="empty-state"><i class="ri-group-line"></i>No users found</div></td></tr>`;
  },

  setStatus(id, status) {
    const users = Store.get(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === id);
    const actionName = { suspended: 'Suspend', banned: 'Ban', active: 'Restore' };
    App.confirm(`${actionName[status]} User`, `Are you sure you want to ${actionName[status].toLowerCase()} ${user?.name}?`, () => {
      const updated = users.map(u => u.id === id ? { ...u, status } : u);
      Store.set(STORAGE_KEYS.USERS, updated);
      AuditLog.add(`Changed user "${user?.name}" status to ${status}`, '', 'user');
      this.render();
      Toast.show(`User ${status}`, status === 'active' ? 'success' : 'error');
    });
  },

  viewUser(id) {
    const users = Store.get(STORAGE_KEYS.USERS);
    const u = users.find(user => user.id === id);
    if (!u) return;
    const posts = Store.get(STORAGE_KEYS.POSTS).filter(p => p.reportedBy === u.name);
    document.getElementById('userModalTitle').textContent = 'User Profile';
    document.getElementById('userModalContent').innerHTML = `
      <div class="user-detail-header">
        <div class="user-big-avatar">${u.name.charAt(0)}</div>
        <div>
          <div class="user-detail-name">${esc(u.name)}</div>
          <div class="user-detail-email">${esc(u.email)}</div>
          <div style="margin-top:6px;"><span class="user-status-badge ${u.status}">${capitalize(u.status)}</span></div>
        </div>
      </div>
      <div class="user-stats-row">
        <div class="user-stat"><div class="val">${u.postsCount}</div><div class="lbl">Posts</div></div>
        <div class="user-stat"><div class="val">${u.claimsCount}</div><div class="lbl">Claims</div></div>
        <div class="user-stat"><div class="val">${formatDate(u.joined)}</div><div class="lbl">Joined</div></div>
      </div>
      <h4 style="font-family:var(--font-display);font-size:1rem;margin-bottom:12px;color:var(--charcoal);">Recent Posts (${posts.length})</h4>
      ${posts.length ? `<div style="display:flex;flex-direction:column;gap:8px;max-height:160px;overflow-y:auto;">
        ${posts.slice(0, 5).map(p => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--cream);font-size:13px;">
            <span>${esc(p.title)}</span>
            <span class="status-badge ${p.status}">${capitalize(p.status)}</span>
          </div>
        `).join('')}
      </div>` : `<p style="font-size:13px;color:var(--warm-gray);">No posts from this user.</p>`}
      <div class="user-actions" style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-light);">
        ${u.status !== 'suspended' ? `<button class="btn-outline btn-sm" onclick="UsersManager.closeModal();UsersManager.setStatus('${u.id}','suspended')"><i class="ri-pause-circle-line"></i> Suspend</button>` : `<button class="btn-outline btn-sm" onclick="UsersManager.closeModal();UsersManager.setStatus('${u.id}','active')"><i class="ri-play-circle-line"></i> Restore</button>`}
        ${u.status !== 'banned' ? `<button class="btn-danger btn-sm" onclick="UsersManager.closeModal();UsersManager.setStatus('${u.id}','banned')"><i class="ri-forbid-line"></i> Ban User</button>` : ''}
      </div>
    `;
    document.getElementById('userModal').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('userModal').style.display = 'none';
  }
};

// ============ REPORTS MANAGER ============
const ReportsManager = {
  render() { this.applyFilters(); App.updateBadges(); },

  applyFilters() {
    const search = (document.getElementById('reportsSearch')?.value || '').toLowerCase();
    const status = document.getElementById('filterReportStatus')?.value || '';
    let reports = Store.get(STORAGE_KEYS.REPORTS);
    if (status) reports = reports.filter(r => r.status === status);
    if (search) reports = reports.filter(r =>
      r.postTitle.toLowerCase().includes(search) ||
      r.reportedBy.toLowerCase().includes(search) ||
      r.reason.toLowerCase().includes(search)
    );
    this.renderTable(reports);
  },

  renderTable(reports) {
    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = reports.map(r => `
      <tr>
        <td>
          <div class="item-name">${esc(r.postTitle)}</div>
          <div class="item-id">${r.postId}</div>
        </td>
        <td>${esc(r.reportedBy)}</td>
        <td style="max-width:220px;color:var(--warm-gray);font-size:13px;">${esc(r.reason)}</td>
        <td>${formatDate(r.date)}</td>
        <td><span class="report-status ${r.status}">${capitalize(r.status)}</span></td>
        <td>
          <div class="action-btns">
            ${r.status === 'pending' ? `
              <button class="btn-icon success" title="Resolve" onclick="ReportsManager.setStatus('${r.id}','resolved')"><i class="ri-checkbox-circle-line"></i></button>
              <button class="btn-icon" title="Ignore" onclick="ReportsManager.setStatus('${r.id}','ignored')"><i class="ri-eye-off-line"></i></button>
              <button class="btn-icon danger" title="Delete Post" onclick="ReportsManager.deleteReportedPost('${r.id}','${r.postId}')"><i class="ri-delete-bin-line"></i></button>
            ` : `<button class="btn-icon danger" title="Remove Report" onclick="ReportsManager.removeReport('${r.id}')"><i class="ri-close-line"></i></button>`}
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="6"><div class="empty-state"><i class="ri-flag-line"></i>No reports found</div></td></tr>`;
  },

  setStatus(id, status) {
    let reports = Store.get(STORAGE_KEYS.REPORTS);
    const report = reports.find(r => r.id === id);
    reports = reports.map(r => r.id === id ? { ...r, status } : r);
    Store.set(STORAGE_KEYS.REPORTS, reports);
    AuditLog.add(`Report on "${report?.postTitle}" marked as ${status}`, '', 'status');
    this.render();
    App.updateBadges();
    Toast.show(`Report ${status}`, 'success');
  },

  deleteReportedPost(reportId, postId) {
    App.confirm('Delete Reported Post', 'Delete the reported post and resolve this report?', () => {
      let posts = Store.get(STORAGE_KEYS.POSTS);
      const post = posts.find(p => p.id === postId);
      posts = posts.filter(p => p.id !== postId);
      Store.set(STORAGE_KEYS.POSTS, posts);
      this.setStatus(reportId, 'resolved');
      AuditLog.add(`Deleted post "${post?.title}" via report action`, '', 'delete');
      Dashboard.render();
      Toast.show('Post deleted and report resolved', 'success');
    });
  },

  removeReport(id) {
    let reports = Store.get(STORAGE_KEYS.REPORTS);
    reports = reports.filter(r => r.id !== id);
    Store.set(STORAGE_KEYS.REPORTS, reports);
    this.render();
    App.updateBadges();
    Toast.show('Report removed', 'info');
  }
};

// ============ LOGS MANAGER ============
const LogsManager = {
  render() {
    const logs = Store.get(STORAGE_KEYS.LOGS);
    const list = document.getElementById('logList');
    if (!list) return;
    const typeMap = {
      edit: { cls: 'edit', icon: 'ri-edit-line' },
      delete: { cls: 'delete', icon: 'ri-delete-bin-line' },
      verify: { cls: 'verify', icon: 'ri-shield-check-line' },
      status: { cls: 'status', icon: 'ri-refresh-line' },
      user: { cls: 'user', icon: 'ri-user-settings-line' },
      post: { cls: 'post', icon: 'ri-file-add-line' },
    };
    list.innerHTML = logs.length
      ? logs.map(l => {
          const t = typeMap[l.type] || typeMap.edit;
          return `<div class="log-item">
            <div class="log-icon ${t.cls}"><i class="${t.icon}"></i></div>
            <div style="flex:1;">
              <div class="log-text"><strong>${esc(l.action)}</strong>${l.detail ? ` — ${esc(l.detail)}` : ''}</div>
              <div class="log-time">${timeAgo(l.timestamp)} · ${new Date(l.timestamp).toLocaleString('en-PH')}</div>
            </div>
          </div>`;
        }).join('')
      : `<div class="log-empty"><i class="ri-history-line"></i>No activity logged yet</div>`;
  },

  clearLogs() {
    App.confirm('Clear Logs', 'Are you sure you want to clear all activity logs?', () => {
      Store.set(STORAGE_KEYS.LOGS, []);
      this.render();
      Dashboard.renderActivity();
      Toast.show('Logs cleared', 'info');
    });
  }
};

// ============ SETTINGS ============
const Settings = {
  render() {
    this.renderLocations();
  },

  verifyClaim() {
    const code = document.getElementById('claimCodeInput').value.trim().toUpperCase();
    const result = document.getElementById('claimResult');
    if (!code) {
      result.className = 'claim-result error';
      result.textContent = 'Please enter a claim code.';
      return;
    }
    const posts = Store.get(STORAGE_KEYS.POSTS);
    const match = posts.find(p => p.claimCode === code);
    if (match) {
      result.className = 'claim-result success';
      result.innerHTML = `<strong>✓ Valid claim code.</strong><br>Item: <strong>${esc(match.title)}</strong> — ${capitalize(match.status)}<br>Location: ${esc(match.location)}<br><br><button class="btn-primary btn-sm" onclick="Settings.claimItem('${match.id}','${code}')"><i class="ri-checkbox-circle-line"></i> Mark as Claimed</button>`;
      AuditLog.add(`Verified claim code for "${match.title}"`, `Code: ${code}`, 'verify');
      Notifications.add(`Claim code verified for "${match.title}"`, 'claim');
    } else {
      result.className = 'claim-result error';
      result.textContent = '✗ Invalid claim code. No matching item found.';
      AuditLog.add(`Failed claim verification: code ${code}`, '', 'verify');
    }
  },

  claimItem(id, code) {
    let posts = Store.get(STORAGE_KEYS.POSTS);
    const post = posts.find(p => p.id === id);
    posts = posts.map(p => p.id === id ? { ...p, status: 'claimed' } : p);
    Store.set(STORAGE_KEYS.POSTS, posts);
    AuditLog.add(`Marked "${post?.title}" as claimed via code verification`, `Code: ${code}`, 'verify');
    Dashboard.render();
    document.getElementById('claimResult').innerHTML = `<strong>✓ Item successfully marked as claimed!</strong>`;
    document.getElementById('claimCodeInput').value = '';
    Toast.show(`"${post?.title}" marked as claimed`, 'success');
  },

  resetData() {
    App.confirm('Reset Data', 'This will restore all default dummy data. Continue?', () => {
      Store.reset();
      Dashboard.render();
      App.updateBadges();
      App.populateLocationDropdown();
      Notifications.updateDot();
      Notifications.renderList();
      Toast.show('Data reset to defaults', 'info');
    });
  },

  clearAllData() {
    App.confirm('Clear All Data', 'This will permanently delete ALL posts, users, reports and logs. Are you sure?', () => {
      Store.clear();
      Dashboard.render();
      App.updateBadges();
      App.populateLocationDropdown();
      Toast.show('All data cleared', 'error');
    });
  },

  renderLocations() {
    const locs = Store.get(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
    const list = document.getElementById('locationList');
    if (!list) return;
    list.innerHTML = locs.map((loc, i) => `
      <div class="location-item">
        <span>${esc(loc)}</span>
        <button onclick="Settings.removeLocation(${i})" title="Remove"><i class="ri-close-line"></i></button>
      </div>
    `).join('') || '<p style="font-size:13px;color:var(--warm-gray);">No locations added.</p>';
  },

  addLocation() {
    const input = document.getElementById('newLocationInput');
    const val = input.value.trim();
    if (!val) return;
    const locs = Store.get(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
    if (locs.includes(val)) { Toast.show('Location already exists', 'error'); return; }
    locs.push(val);
    Store.set(STORAGE_KEYS.LOCATIONS, locs);
    input.value = '';
    this.renderLocations();
    App.populateLocationDropdown();
    Toast.show('Location added', 'success');
  },

  removeLocation(index) {
    const locs = Store.get(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
    locs.splice(index, 1);
    Store.set(STORAGE_KEYS.LOCATIONS, locs);
    this.renderLocations();
    App.populateLocationDropdown();
    Toast.show('Location removed', 'info');
  }
};

// ============ HELPERS ============
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============ SIMULATE INCOMING EVENTS ============
function simulateIncomingActivity() {
  // Every 45s, simulate a new post notification
  setInterval(() => {
    const notifNewPost = document.getElementById('notifNewPost');
    if (notifNewPost && notifNewPost.checked) {
      const items = ['Lost Wallet', 'Found Glasses', 'Lost Notebook', 'Found Watch', 'Lost Jacket'];
      const locs = Store.get(STORAGE_KEYS.LOCATIONS, DEFAULT_LOCATIONS);
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const randomLoc = locs[Math.floor(Math.random() * locs.length)];
      Notifications.add(`New post: "${randomItem}" at ${randomLoc}`, 'new-post');
    }
  }, 45000);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  simulateIncomingActivity();

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });

  // Enter key on location input
  document.getElementById('newLocationInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); Settings.addLocation(); }
  });

  // Enter key on claim code
  document.getElementById('claimCodeInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); Settings.verifyClaim(); }
  });
});