const tabs = document.querySelectorAll('[data-tab]');
const sections = {
  list: document.getElementById('list-section'),
  follow: document.getElementById('follow-section'),
  detail: document.getElementById('detail-section'),
};

const searchInput = document.getElementById('search');
const callListEl = document.getElementById('call-list');
const followListEl = document.getElementById('follow-list');
const emptyListEl = document.getElementById('empty-list');
const emptyFollowEl = document.getElementById('empty-follow');
const totalCountEl = document.getElementById('total-count');

const detailNameEl = document.getElementById('detail-name');
const detailDateEl = document.getElementById('detail-date');
const archivedBadgeEl = document.getElementById('archived-badge');
const summaryEl = document.getElementById('summary');
const aiInsightEl = document.getElementById('ai-insight');
const sourcesEl = document.getElementById('sources');
const followToggle = document.getElementById('follow-toggle');
const backBtn = document.getElementById('back-btn');

const FOLLOW_KEY = 'follows';
let calls = [];
let contents = [];
let follows = new Set(JSON.parse(localStorage.getItem(FOLLOW_KEY) || '[]'));
let activeTab = 'list';
let activeCallId = null;

function saveFollows() {
  localStorage.setItem(FOLLOW_KEY, JSON.stringify(Array.from(follows)));
}

function formatDate(iso) {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function isArchived(iso) {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  return new Date(iso + 'T00:00:00') < ninetyDaysAgo;
}

function createCard(call) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-1">
        <p class="card-title">${call.stock_name} <span class="text-slate-400">(${call.stock_code})</span></p>
        <p class="text-sm text-slate-600">法說日期：${formatDate(call.call_date)}</p>
      </div>
      <div class="flex flex-col items-end gap-2">
        ${isArchived(call.call_date) ? '<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Archived</span>' : ''}
        <button class="follow-btn inline-flex items-center gap-2 rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50">
          ${follows.has(call.id) ? '取消關注' : '加入關注'}
        </button>
      </div>
    </div>
  `;

  const followBtn = card.querySelector('.follow-btn');
  followBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFollow(call.id);
    renderLists();
    if (activeCallId === call.id) {
      updateDetailFollow(call.id);
    }
  });

  card.addEventListener('click', () => openDetail(call.id));
  return card;
}

function renderGroupedList(sourceCalls, container, emptyEl) {
  container.innerHTML = '';
  if (!sourceCalls.length) {
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');

  const sorted = [...sourceCalls].sort((a, b) => new Date(b.call_date) - new Date(a.call_date));
  const groups = sorted.reduce((acc, call) => {
    acc[call.call_date] = acc[call.call_date] || [];
    acc[call.call_date].push(call);
    return acc;
  }, {});

  Object.entries(groups)
    .sort(([a], [b]) => new Date(b) - new Date(a))
    .forEach(([date, items]) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'space-y-2';

      const heading = document.createElement('div');
      heading.className = 'flex items-center gap-2 text-sm font-semibold text-slate-600';
      heading.innerHTML = `<span class="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-500">${formatDate(date)}</span> <span>共 ${items.length} 檔</span>`;

      const list = document.createElement('div');
      list.className = 'space-y-2';
      items.forEach((call) => list.appendChild(createCard(call)));

      wrapper.appendChild(heading);
      wrapper.appendChild(list);
      container.appendChild(wrapper);
    });
}

function toggleFollow(callId) {
  if (follows.has(callId)) {
    follows.delete(callId);
  } else {
    follows.add(callId);
  }
  saveFollows();
}

function renderLists() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = calls.filter((call) =>
    call.stock_name.toLowerCase().includes(keyword) || call.stock_code.includes(keyword)
  );
  totalCountEl.textContent = filtered.length.toString();
  renderGroupedList(filtered, callListEl, emptyListEl);

  const followCalls = calls.filter((call) => follows.has(call.id));
  renderGroupedList(followCalls, followListEl, emptyFollowEl);
}

function openDetail(callId) {
  const call = calls.find((c) => c.id === callId);
  const content = contents.find((c) => c.call_id === callId);
  if (!call || !content) return;
  activeCallId = callId;

  detailNameEl.textContent = `${call.stock_name} (${call.stock_code})`;
  detailDateEl.textContent = `法說會日期：${formatDate(call.call_date)}`;
  archivedBadgeEl.classList.toggle('hidden', !isArchived(call.call_date));

  summaryEl.innerHTML = content.summary_html;
  aiInsightEl.innerHTML = content.ai_insight_html;

  sourcesEl.innerHTML = '';
  content.sources.forEach((src) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = src;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.textContent = src;
    li.appendChild(a);
    sourcesEl.appendChild(li);
  });

  updateDetailFollow(callId);
  showSection('detail');
}

function updateDetailFollow(callId) {
  const isFollowing = follows.has(callId);
  followToggle.classList.toggle('bg-indigo-600', !isFollowing);
  followToggle.classList.toggle('bg-slate-700', isFollowing);
  followToggle.textContent = isFollowing ? '取消關注' : '加入關注';
}

function showSection(target) {
  if (target !== 'detail') {
    activeTab = target;
  }
  Object.entries(sections).forEach(([key, section]) => {
    section.classList.toggle('hidden', key !== target);
  });
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === target;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function attachEvents() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      showSection(tab.dataset.tab);
    });
  });

  searchInput.addEventListener('input', () => renderLists());

  followToggle.addEventListener('click', () => {
    if (!activeCallId) return;
    toggleFollow(activeCallId);
    updateDetailFollow(activeCallId);
    renderLists();
  });

  backBtn.addEventListener('click', () => {
    showSection(activeTab);
  });
}

async function init() {
  const [callData, contentData] = await Promise.all([
    fetch('./data/earnings_calls.json').then((res) => res.json()),
    fetch('./data/earnings_contents.json').then((res) => res.json()),
  ]);
  calls = callData;
  contents = contentData;
  totalCountEl.textContent = calls.length.toString();
  renderLists();
  attachEvents();
}

init().catch((err) => {
  console.error('初始化失敗', err);
  emptyListEl.classList.remove('hidden');
  emptyListEl.textContent = '載入靜態資料時發生錯誤';
});
