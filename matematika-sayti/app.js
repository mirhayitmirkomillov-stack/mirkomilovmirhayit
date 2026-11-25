const STORAGE = {
  users: 'mathsite_users_v1',
  session: 'mathsite_session_v1',
  results: 'mathsite_results_v1',
  studentId: 'mathsite_student_id_v1',
  adminKey: 'mathsite_admin_key_v1'
};

const LOCAL_API = 'http://localhost:3000/api';
const IS_LOCAL_PAGE = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
const IS_STATIC_PAGE = /(^|\.)github\.io$/i.test(location.hostname);
const API = IS_STATIC_PAGE ? '' : (IS_LOCAL_PAGE && location.port !== '3000' ? LOCAL_API : '/api');

const TEST_SECONDS = 30 * 60;
const ADMIN_INPUT_STYLE = 'width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:#fbfcff;color:var(--ink);font:inherit';

let TOPICS_DATA = TOPICS;
let currentUser = null;
let activeTopic = null;
let testState = null;
let lastResult = null;
let lastResultTopicId = null;
let timerId = null;
let toastTimer = null;
let adminKey = null;
let serverResultsSyncAt = 0;

const el = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStudentId() {
  let id = null;
  try {
    id = localStorage.getItem(STORAGE.studentId);
  } catch (error) {
    id = null;
  }
  if (id) return id;
  id = window.crypto && typeof window.crypto.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : 'stu-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  try {
    localStorage.setItem(STORAGE.studentId, id);
  } catch (error) {}
  return id;
}

const studentId = getStudentId();

async function hashPassword(password, salt) {
  const input = salt + ':' + password;
  if (window.crypto && window.crypto.subtle) {
    const bytes = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) | 0;
  return 'f' + (hash >>> 0).toString(16);
}

function newSalt() {
  const bytes = new Uint8Array(16);
  if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function showView(id) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === id));
  window.scrollTo(0, 0);
}

function toast(message) {
  const box = el('toast');
  box.textContent = message;
  box.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('show'), 2600);
}

function setError(id, message) {
  el(id).textContent = message;
}

function formatTime(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  const mins = String(Math.floor(value / 60)).padStart(2, '0');
  const secs = String(value % 60).padStart(2, '0');
  return mins + ':' + secs;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function questionCount(topic) {
  return Number(topic.questionCount) || (topic.questions || []).length || 30;
}

function allQuestions() {
  const list = [];
  TOPICS_DATA.forEach((topic) => {
    (topic.questions || []).forEach((question, index) => {
      list.push({
        ...question,
        id: question.id || topic.id + '-' + (index + 1),
        topicId: topic.id
      });
    });
  });
  return list;
}

function getResults() {
  return read(STORAGE.results, {});
}

function userResults() {
  if (!currentUser) return [];
  const all = getResults();
  return Array.isArray(all[currentUser.username]) ? all[currentUser.username] : [];
}

function mergeResults(incoming) {
  if (!currentUser || !Array.isArray(incoming)) return;
  const all = getResults();
  const key = currentUser.username;
  const byId = new Map();
  (Array.isArray(all[key]) ? all[key] : []).forEach((result) => {
    if (result && result.id !== undefined && result.id !== null) byId.set(String(result.id), result);
  });
  incoming.forEach((result) => {
    if (!result || result.id === undefined || result.id === null) return;
    const id = String(result.id);
    const existing = byId.get(id);
    byId.set(id, existing ? { ...existing, ...result } : result);
  });
  all[key] = Array.from(byId.values());
  save(STORAGE.results, all);
}

function getBestScore(topicId) {
  const scores = userResults().filter((r) => r.topicId === topicId && Number(r.total)).map((r) => Math.round(r.score / r.total * 100));
  return scores.length ? Math.max.apply(null, scores) : null;
}

function updateHomeStats() {
  const results = userResults();
  const totalScore = results.reduce((sum, r) => sum + (Number(r.score) || 0), 0);
  const totalQuestions = results.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
  const percents = results.filter((r) => Number(r.total)).map((r) => Math.round(r.score / r.total * 100));
  el('stat-tests').textContent = String(results.length);
  el('stat-avg').textContent = percents.length
    ? Math.round(percents.reduce((sum, value) => sum + value, 0) / percents.length) + '%'
    : '0%';
  el('stat-best').textContent = percents.length ? Math.max.apply(null, percents) + '%' : '0%';
  el('stat-accuracy').textContent = totalQuestions ? Math.round(totalScore / totalQuestions * 100) + '%' : '0%';
}

function saveResultLocally(result) {
  if (!currentUser) return;
  const all = getResults();
  if (!Array.isArray(all[currentUser.username])) all[currentUser.username] = [];
  if (!all[currentUser.username].some((item) => String(item.id) === String(result.id))) {
    all[currentUser.username].push(result);
  }
  save(STORAGE.results, all);
  updateHomeStats();
  if (el('view-home').classList.contains('active')) renderHome();
}

async function loadContent() {
  if (!API) return;
  try {
    const response = await fetch(API + '/content');
    if (!response || !response.ok) return;
    const data = await response.json();
    if (!data || !Array.isArray(data.topics)) return;
    TOPICS_DATA = data.topics;
    if (currentUser && el('view-home').classList.contains('active')) renderHome();
    if (adminKey && !el('admin-panel').classList.contains('hidden')) renderAdminTopics();
  } catch (error) {}
}

async function loadServerResults(force) {
  if (!API || !currentUser) return;
  const now = Date.now();
  if (!force && now - serverResultsSyncAt < 1500) return;
  serverResultsSyncAt = now;
  try {
    const response = await fetch(API + '/results?studentId=' + encodeURIComponent(studentId));
    if (!response || !response.ok) return;
    const data = await response.json();
    if (!data || !Array.isArray(data.results)) return;
    mergeResults(data.results);
    updateHomeStats();
    if (el('view-home').classList.contains('active')) renderHome();
  } catch (error) {}
}

async function register(event) {
  event.preventDefault();
  setError('reg-error', '');

  const name = el('reg-name').value.trim();
  const email = el('reg-email').value.trim().toLowerCase();
  const username = el('reg-username').value.trim();
  const password = el('reg-password').value;
  const confirm = el('reg-confirm').value;
  const users = read(STORAGE.users, []);

  if (name.length < 3) return setError('reg-error', 'Ismingizni to\'liq yozing (kamida 3 belgi).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('reg-error', 'To\'g\'ri email manzilini kiriting.');
  if (!/^[A-Za-z0-9_]{4,}$/.test(username)) return setError('reg-error', 'Foydalanuvchi nomi kamida 4 belgi bo\'lib, faqat harf, raqam va _ dan ibarat bo\'lsin.');
  if (password.length < 6) return setError('reg-error', 'Parol kamida 6 belgidan ibarat bo\'lsin.');
  if (password !== confirm) return setError('reg-error', 'Parollar mos kelmadi.');
  if (users.some((u) => u.email === email)) return setError('reg-error', 'Bu email allaqachon ro\'yxatdan o\'tgan.');
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) return setError('reg-error', 'Bu foydalanuvchi nomi band qilingan.');

  const salt = newSalt();
  users.push({
    name, email, username, salt,
    passwordHash: await hashPassword(password, salt),
    studentId,
    createdAt: new Date().toISOString()
  });
  save(STORAGE.users, users);
  save(STORAGE.session, username);
  currentUser = users[users.length - 1];
  serverResultsSyncAt = 0;
  el('register-form').reset();
  toast('Ro\'yxatdan o\'tdingiz. Testlarni boshlash mumkin!');
  renderHome();
}

async function login(event) {
  event.preventDefault();
  setError('login-error', '');

  const identifier = el('login-identifier').value.trim().toLowerCase();
  const password = el('login-password').value;
  const user = read(STORAGE.users, []).find(
    (u) => u.email === identifier || u.username.toLowerCase() === identifier
  );

  if (!user || await hashPassword(password, user.salt) !== user.passwordHash) {
    return setError('login-error', 'Login yoki parol noto\'g\'ri.');
  }

  save(STORAGE.session, user.username);
  currentUser = user;
  serverResultsSyncAt = 0;
  el('login-form').reset();
  toast('Xush kelibsiz, ' + user.name + '!');
  renderHome();
}

function logout() {
  localStorage.removeItem(STORAGE.session);
  currentUser = null;
  serverResultsSyncAt = 0;
  stopTimer();
  el('register-form').reset();
  el('login-form').reset();
  setError('reg-error', '');
  setError('login-error', '');
  switchAuthTab('register');
  showView('view-auth');
}

function switchAuthTab(tab) {
  const isRegister = tab === 'register';
  el('tab-register').classList.toggle('active', isRegister);
  el('tab-login').classList.toggle('active', !isRegister);
  el('register-form').classList.toggle('hidden', !isRegister);
  el('login-form').classList.toggle('hidden', isRegister);
}

function renderHome() {
  if (!currentUser) return;
  const activeTopics = TOPICS_DATA.filter((topic) => topic.active);
  el('user-name').textContent = currentUser.name;
  el('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
  el('stat-topics').textContent = String(activeTopics.length);
  updateHomeStats();

  el('topics-grid').innerHTML = TOPICS_DATA.map((topic) => {
    const best = topic.active ? getBestScore(topic.id) : null;
    const count = questionCount(topic);
    const bestLine = best === null ? '' : '<div class="topic-best">Eng yaxshi natija: ' + best + '% · ' + Math.round(best * count / 100) + ' / ' + count + '</div>';
    return '<article class="topic-card' + (topic.active ? '' : ' locked') + '">' +
      '<div class="topic-top">' +
        '<span class="topic-index">' + (topic.active ? '∠' : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>') + '</span>' +
        '<span class="status-pill' + (topic.active ? '' : ' soon') + '">' + (topic.active ? 'Faol' : 'Tez kunda') + '</span>' +
      '</div>' +
      '<h3>' + escapeHtml(topic.title) + '</h3>' +
      '<p>' + escapeHtml(topic.description) + '&nbsp;·&nbsp;' + count + ' savol</p>' +
      bestLine +
      (topic.active
        ? '<button type="button" class="btn btn-primary" data-start="' + escapeHtml(topic.id) + '">Testni boshlash</button>'
        : '<button type="button" class="btn btn-secondary" disabled>Hali ochilmagan</button>') +
    '</article>';
  }).join('');

  const results = userResults().slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  el('history-list').innerHTML = results.length
    ? results.map((result) => {
        const topic = TOPICS_DATA.find((t) => t.id === result.topicId);
        const title = topic ? topic.title : (result.topicTitle || result.topic || 'Geometriya testi');
        return '<div class="history-item">' +
          '<div><strong>' + escapeHtml(title) + '</strong><br><span class="muted">' + escapeHtml(formatDate(result.date)) + '</span></div>' +
          '<div class="history-score">' + Number(result.score) + ' / ' + Number(result.total) + '</div>' +
          '<button type="button" class="btn btn-secondary" data-result="' + escapeHtml(result.id) + '">Natijani ko\'rish</button>' +
        '</div>';
      }).join('')
    : '<div class="empty">Hali test ishlamadingiz. Birinchi mavzudan boshlang!</div>';

  showView('view-home');
  loadServerResults();
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function shuffleQuestions(questions) {
  return shuffle(questions.map((question) => {
    const order = (question.options || []).map((_, index) => index);
    const mixed = shuffle(order);
    return {
      ...question,
      options: mixed.map((index) => question.options[index]),
      answer: mixed.indexOf(question.answer)
    };
  }));
}

function startTest(topicId) {
  if (!currentUser) {
    switchAuthTab('register');
    showView('view-auth');
    return;
  }
  const topic = TOPICS_DATA.find((t) => t.id === topicId && t.active);
  if (!topic) return toast('Bu mavzu hali ochilmagan.');
  const questions = allQuestions().filter((question) => question.topicId === topic.id);
  if (!questions.length) return toast('Bu mavzuda savol topilmadi.');
  startQuestionSet(questions, topic.title, topic.id);
}

function startQuestionSet(questions, title, topicId) {
  if (!currentUser || !questions || !questions.length) return;
  const prepared = questions.map((question, index) => ({
    ...question,
    id: question.id || topicId + '-' + (index + 1),
    options: (question.options || []).slice()
  }));
  activeTopic = {
    id: topicId,
    title,
    questions: shuffleQuestions(prepared)
  };
  stopTimer();
  testState = {
    answers: new Array(activeTopic.questions.length).fill(null),
    index: 0,
    startedAt: Date.now(),
    elapsed: 0
  };
  el('test-topic-title').textContent = title;
  el('timer').textContent = formatTime(TEST_SECONDS);
  el('timer').classList.remove('urgent');
  el('timer').style.color = '';
  el('timer').style.background = '';
  startTimer();
  renderQuestion();
  showView('view-test');
}

function renderQuestion() {
  if (!testState || !activeTopic) return;
  const question = activeTopic.questions[testState.index];
  const total = activeTopic.questions.length;
  const answered = testState.answers.filter((a) => a !== null).length;

  el('question-number').textContent = String(testState.index + 1);
  el('question-text').textContent = question.q;
  el('question-diagram').innerHTML = question.diagram || '';
  el('progress-text').textContent = (testState.index + 1) + ' / ' + total;
  el('answered-text').textContent = answered + ' ta javob berildi';
  el('progress-fill').style.width = ((testState.index + 1) / total * 100) + '%';

  el('options').innerHTML = question.options.map((option, index) =>
    '<div class="option' + (testState.answers[testState.index] === index ? ' selected' : '') + '" data-option="' + index + '">' +
      '<span class="option-letter">' + 'ABCD'[index] + '</span><span>' + escapeHtml(option) + '</span>' +
    '</div>'
  ).join('');

  el('prev-btn').disabled = testState.index === 0;
  el('next-btn').disabled = testState.index === total - 1;

  const remaining = total - answered;
  el('finish-hint').textContent = remaining === 0
    ? 'Barcha savollar javoblandi. Testni yakunlashingiz mumkin.'
    : 'Yakunlash uchun yana ' + remaining + ' ta savolga javob bering.';
  el('finish-btn').disabled = remaining !== 0;

  el('palette').innerHTML = testState.answers.map((answer, index) => {
    const classes = ['palette-btn'];
    if (answer !== null) classes.push('answered');
    if (index === testState.index) classes.push('current');
    return '<button type="button" class="' + classes.join(' ') + '" data-question="' + index + '">' + (index + 1) + '</button>';
  }).join('');
}

function answerQuestion(index) {
  testState.answers[testState.index] = index;
  renderQuestion();
}

function goToQuestion(index) {
  if (index < 0 || index >= activeTopic.questions.length) return;
  testState.index = index;
  renderQuestion();
}

function startTimer() {
  stopTimer();
  const tickTimer = () => {
    if (!testState) {
      stopTimer();
      return;
    }
    const remaining = Math.max(0, TEST_SECONDS - Math.floor((Date.now() - testState.startedAt) / 1000));
    testState.elapsed = TEST_SECONDS - remaining;
    el('timer').textContent = formatTime(remaining);
    const urgent = remaining < 300;
    el('timer').classList.toggle('urgent', urgent);
    el('timer').style.color = urgent ? '#d93a4a' : '';
    el('timer').style.background = urgent ? '#fdecef' : '';
    if (remaining === 0) finishTest(true);
  };
  tickTimer();
  timerId = setInterval(tickTimer, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function finishTest(auto) {
  if (!testState || !activeTopic) return;
  if (!auto && testState.answers.some((answer) => answer === null)) {
    return toast('Avval barcha savollarga javob bering.');
  }
  stopTimer();
  const elapsed = Math.min(TEST_SECONDS, Math.floor((Date.now() - testState.startedAt) / 1000));
  const questions = activeTopic.questions;
  let correct = 0;
  const wrongIds = [];
  questions.forEach((question, index) => {
    if (testState.answers[index] === question.answer) correct++;
    else wrongIds.push(question.id);
  });
  const result = {
    id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 7),
    topicId: activeTopic.id,
    topicTitle: activeTopic.title,
    studentId,
    score: correct,
    total: questions.length,
    elapsed,
    date: new Date().toISOString(),
    answers: testState.answers.slice(),
    wrongIds,
    questionIds: questions.map((question) => question.id),
    questions: questions.map((question) => ({ ...question, options: question.options.slice() }))
  };
  saveResultLocally(result);
  sendResultToTelegram(result);
  showResult(result);
}

async function sendResultToTelegram(result) {
  const topic = TOPICS_DATA.find((item) => item.id === result.topicId);
  const payload = {
    user: {
      name: currentUser.name,
      email: currentUser.email,
      username: currentUser.username
    },
    studentId,
    topic: result.topicTitle || (topic && topic.title) || 'Geometriya testi',
    topicId: result.topicId,
    score: result.score,
    total: result.total,
    percent: result.total ? Math.round(result.score / result.total * 100) : 0,
    elapsed: result.elapsed,
    date: result.date,
    wrongIds: result.wrongIds.slice(),
    answers: result.answers.slice()
  };
  if (!API) {
    saveResultLocally(result);
    toast('Natija qurilmangizda saqlandi.');
    updateHomeStats();
    return;
  }
  try {
    const response = await fetch(API + '/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response || !response.ok) throw new Error('Server xatoligi');
    saveResultLocally(result);
    toast('Natija Telegramga yuborildi.');
  } catch (error) {
    saveResultLocally(result);
    toast('Natija saqlandi, lekin Telegramga yuborilmadi.');
  }
  updateHomeStats();
  loadServerResults(true);
}

function showResult(result) {
  lastResult = result;
  lastResultTopicId = result.topicId;
  const topic = TOPICS_DATA.find((item) => item.id === result.topicId);
  const bank = allQuestions();
  const byId = new Map(bank.map((question) => [question.id, question]));
  const snapshot = result.questions && result.questions.length
    ? result.questions
    : (result.questionIds || []).map((id) => byId.get(id)).filter(Boolean);
  const questions = snapshot.length ? snapshot : (topic ? topic.questions || [] : []);
  const percent = result.total ? Math.round(result.score / result.total * 100) : 0;
  const wrongCount = Number(result.total) - Number(result.score);
  const grade = percent >= 90 ? 5 : percent >= 70 ? 4 : percent >= 50 ? 3 : 2;
  const wrongIds = result.wrongIds && result.wrongIds.length
    ? result.wrongIds
    : questions.filter((question, index) => result.answers[index] !== question.answer).map((question) => question.id);

  el('score-value').textContent = String(result.score);
  el('score-ring').style.background = 'conic-gradient(var(--primary) ' + (percent * 3.6) + 'deg, #e9ecf5 0deg)';
  el('result-title').textContent = percent >= 90 ? 'Ajoyib natija!' : percent >= 70 ? 'Yaxshi ishladingiz!' : percent >= 50 ? 'Yaxshi, lekin takrorlash kerak' : 'Ko\'proq mashq qiling';
  el('result-detail').textContent = (topic ? topic.title : (result.topicTitle || 'Geometriya testi')) + ' mavzusi bo\'yicha ' + result.total + ' ta savolning ' + result.score + ' tasiga to\'g\'ri javob berdingiz (' + percent + '%).';
  el('result-correct').textContent = result.score;
  el('result-wrong').textContent = wrongCount;
  el('result-time').textContent = formatTime(result.elapsed);
  el('result-grade').textContent = grade;
  el('mistake-count').textContent = String(wrongCount);
  el('correct-count').textContent = String(result.score);
  el('retry-wrong-btn').disabled = wrongIds.length === 0;

  const mistakes = [];
  const corrects = [];
  questions.forEach((question, index) => {
    const chosen = result.answers[index];
    const item = { number: index + 1, question, chosen };
    if (chosen === question.answer) corrects.push(item);
    else mistakes.push(item);
  });

  el('mistake-list').innerHTML = mistakes.length
    ? mistakes.map((item) => {
        const chosenText = item.chosen === null || item.chosen === undefined
          ? 'Javob berilmagan'
          : item.question.options[item.chosen];
        return '<article class="mistake-card">' +
          '<div class="mistake-head"><span class="mistake-no">' + item.number + '-savol</span><h3>' + escapeHtml(item.question.q) + '</h3></div>' +
          '<div class="mini-diagram">' + (item.question.diagram || '') + '</div>' +
          '<div class="answer-row">' +
            '<span>Sizning javobingiz: <strong class="wrong">' + escapeHtml(chosenText) + '</strong></span>' +
            '<span>To\'g\'ri javob: <strong class="right">' + escapeHtml(item.question.options[item.question.answer]) + '</strong></span>' +
          '</div>' +
          '<div class="explain">' + escapeHtml(item.question.explain) + '</div>' +
        '</article>';
      }).join('')
    : '<div class="empty">Tabriklaymiz! Hech qanday xato qilmadingiz.</div>';

  el('correct-list').innerHTML = corrects.length
    ? corrects.map((item) => '<div class="correct-item"><span>' + item.number + '.</span>' + escapeHtml(item.question.q) + '</div>').join('')
    : '<div class="empty">To\'g\'ri javob bo\'lmadi.</div>';

  testState = null;
  showView('view-result');
}

function openSavedResult(id) {
  const result = userResults().find((item) => String(item.id) === String(id));
  if (result) showResult(result);
}

function retryWrongQuestions() {
  if (!lastResult || !currentUser) return;
  const wrongIds = lastResult.wrongIds || [];
  if (!wrongIds.length) return toast('Xato savol qolmadi.');
  const ids = new Set(wrongIds.map(String));
  const questions = allQuestions().filter((question) => ids.has(String(question.id)));
  if (!questions.length) return toast('Xato savollar topilmadi.');
  const topic = TOPICS_DATA.find((item) => item.id === lastResultTopicId);
  startQuestionSet(questions, 'Xatolarni takrorlash' + (topic ? ' · ' + topic.title : ''), lastResultTopicId);
}

function downloadCertificate() {
  if (!lastResult) return;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return toast('Sertifikat yaratib bo\'lmadi.');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 700);
    ctx.strokeStyle = '#5146e5';
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, 1152, 652);
    ctx.strokeStyle = '#d9d5ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, 1112, 612);

    ctx.fillStyle = '#5146e5';
    ctx.beginPath();
    ctx.moveTo(600, 70);
    ctx.lineTo(655, 168);
    ctx.lineTo(545, 168);
    ctx.closePath();
    ctx.strokeStyle = '#5146e5';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(600, 70, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#5146e5';
    ctx.font = 'bold 20px Segoe UI, sans-serif';
    ctx.fillText('PUZA GEOMETRIYA 1 (TR-YÖS)', 600, 215);
    ctx.fillStyle = '#18233b';
    ctx.font = 'bold 54px Segoe UI, sans-serif';
    ctx.fillText('SERTIFIKAT', 600, 295);
    ctx.fillStyle = '#66728a';
    ctx.font = '22px Segoe UI, sans-serif';
    ctx.fillText('Geometriya testi muvaffaqiyatli yakunlandi', 600, 345);

    ctx.fillStyle = '#18233b';
    ctx.font = 'bold 38px Segoe UI, sans-serif';
    ctx.fillText(lastResult && currentUser ? currentUser.name : '', 600, 420);
    ctx.fillStyle = '#66728a';
    ctx.font = '24px Segoe UI, sans-serif';
    ctx.fillText('Mavzu: ' + (lastResult.topicTitle || 'Geometriya testi'), 600, 465);

    ctx.fillStyle = '#18233b';
    ctx.font = 'bold 30px Segoe UI, sans-serif';
    ctx.fillText(lastResult.score + ' / ' + lastResult.total + '  ·  ' + (lastResult.total ? Math.round(lastResult.score / lastResult.total * 100) : 0) + '%', 600, 520);
    ctx.fillStyle = '#66728a';
    ctx.font = '22px Segoe UI, sans-serif';
    ctx.fillText('Baho: ' + el('result-grade').textContent + '  ·  Sana: ' + formatDate(lastResult.date), 600, 560);

    ctx.fillStyle = '#5146e5';
    ctx.font = 'bold 18px Segoe UI, sans-serif';
    ctx.fillText('Matematika va geometriya testlari', 600, 620);

    const link = document.createElement('a');
    link.download = 'matematika-sertifikat-' + lastResult.id + '.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast('Sertifikat yuklab olindi.');
  } catch (error) {
    toast('Sertifikat yaratib bo\'lmadi.');
  }
}

function getAdminKey() {
  try {
    return sessionStorage.getItem(STORAGE.adminKey) || null;
  } catch (error) {
    return null;
  }
}

function setAdminKey(key) {
  try {
    sessionStorage.setItem(STORAGE.adminKey, key);
  } catch (error) {}
}

function clearAdminKey() {
  try {
    sessionStorage.removeItem(STORAGE.adminKey);
  } catch (error) {}
  adminKey = null;
}

async function openAdminPanel() {
  showView('view-admin');
  const stored = getAdminKey();
  if (!stored) {
    adminKey = null;
    el('admin-login-form').classList.remove('hidden');
    el('admin-panel').classList.add('hidden');
    setError('admin-error', '');
    return;
  }
  adminKey = stored;
  try {
    await adminFetch('/admin/stats', { method: 'GET' });
    showAdminPanel();
    loadAdminData();
  } catch (error) {
    clearAdminKey();
    el('admin-login-form').classList.remove('hidden');
    el('admin-panel').classList.add('hidden');
    setError('admin-error', 'Saqlangan kalit ishlamadi. Yangi kalitni kiriting.');
  }
}

async function adminFetch(path, options) {
  const config = { ...(options || {}) };
  config.headers = { ...(config.headers || {}), 'x-admin-key': adminKey };
  const response = await fetch(API + path, config);
  if (!response || !response.ok) throw new Error('Admin xatoligi (' + (response && response.status ? response.status : 'tarmoq') + ')');
  return response.json();
}

function showAdminPanel() {
  el('admin-login-form').classList.add('hidden');
  el('admin-panel').classList.remove('hidden');
}

async function adminLogin(event) {
  event.preventDefault();
  setError('admin-error', '');
  const key = el('admin-password').value.trim();
  if (!key) return setError('admin-error', 'Admin kalitini kiriting.');
  const previousKey = adminKey;
  adminKey = key;
  try {
    await adminFetch('/admin/stats', { method: 'GET' });
    setAdminKey(key);
    el('admin-password').value = '';
    showAdminPanel();
    toast('Admin paneli ochildi.');
    loadAdminData();
  } catch (error) {
    adminKey = previousKey;
    setError('admin-error', 'Admin kaliti noto\'g\'ri yoki serverga ulanib bo\'lmadi. ' + error.message);
  }
}

function switchAdminTab(tab) {
  const tabs = ['topics', 'questions', 'results', 'stats'];
  tabs.forEach((name) => {
    el('admin-tab-' + name).classList.toggle('active', name === tab);
    el('admin-' + name).classList.toggle('hidden', name !== tab);
  });
}

function renderAdminTopics() {
  el('admin-topic-list').innerHTML = TOPICS_DATA.map((topic, index) =>
    '<article class="topic-card">' +
      '<label class="field"><span>Nomi</span><input data-topic-index="' + index + '" data-topic-field="title" value="' + escapeHtml(topic.title) + '"></label>' +
      '<label class="field"><span>Tavsif</span><input data-topic-index="' + index + '" data-topic-field="description" value="' + escapeHtml(topic.description) + '"></label>' +
      '<label class="field"><span>Faol</span><input type="checkbox" data-topic-index="' + index + '" data-topic-field="active"' + (topic.active ? ' checked' : '') + '></label>' +
      '<p>' + questionCount(topic) + ' savol</p>' +
    '</article>'
  ).join('') || '<div class="empty">Mavzu topilmadi.</div>';
}

async function saveAdminTopics() {
  const topics = TOPICS_DATA.map((topic) => ({ ...topic }));
  el('admin-topic-list').querySelectorAll('[data-topic-field]').forEach((input) => {
    const index = Number(input.dataset.topicIndex);
    const field = input.dataset.topicField;
    if (!topics[index]) return;
    topics[index][field] = field === 'active' ? input.checked : input.value;
  });
  topics.forEach((topic) => {
    topic.questionCount = (topic.questions || []).length || Number(topic.questionCount) || 30;
  });
  try {
    const response = await fetch(API + '/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ topics })
    });
    if (!response || !response.ok) throw new Error('Admin xatoligi');
    TOPICS_DATA = topics;
    renderAdminTopics();
    renderAdminQuestionTopicOptions();
    renderAdminQuestions();
    if (currentUser && el('view-home').classList.contains('active')) renderHome();
    toast('Mavzular saqlandi.');
  } catch (error) {
    toast('Mavzularni saqlab bo\'lmadi.');
  }
}

function currentAdminTopic() {
  const id = el('admin-question-topic').value;
  return TOPICS_DATA.find((topic) => topic.id === id) || TOPICS_DATA[0] || null;
}

function renderAdminQuestionTopicOptions() {
  const select = el('admin-question-topic');
  const previous = select.value;
  select.innerHTML = TOPICS_DATA.map((topic) =>
    '<option value="' + escapeHtml(topic.id) + '">' + escapeHtml(topic.title) + '</option>'
  ).join('');
  if (previous && TOPICS_DATA.some((topic) => topic.id === previous)) select.value = previous;
}

function renderAdminQuestions() {
  const topic = currentAdminTopic();
  if (!topic) {
    el('admin-question-list').innerHTML = '<div class="empty">Mavzu topilmadi.</div>';
    return;
  }
  const questions = topic.questions || [];
  el('admin-question-list').innerHTML = questions.map((question, index) => {
    const options = (question.options || []).slice(0, 4);
    while (options.length < 4) options.push('');
    return '<article class="topic-card">' +
      '<label class="field"><span>Savol</span><input data-q-index="' + index + '" data-q-field="q" value="' + escapeHtml(question.q) + '" style="' + ADMIN_INPUT_STYLE + '"></label>' +
      options.map((option, optionIndex) =>
        '<label class="field"><span>' + 'ABCD'[optionIndex] + ' varianti</span><input data-q-index="' + index + '" data-q-field="option" data-option-index="' + optionIndex + '" value="' + escapeHtml(option) + '" style="' + ADMIN_INPUT_STYLE + '"></label>'
      ).join('') +
      '<label class="field"><span>To\'g\'ri javob</span><select data-q-index="' + index + '" data-q-field="answer" style="' + ADMIN_INPUT_STYLE + '">' +
        [0, 1, 2, 3].map((answerIndex) => '<option value="' + answerIndex + '"' + (question.answer === answerIndex ? ' selected' : '') + '>' + 'ABCD'[answerIndex] + '</option>').join('') +
      '</select></label>' +
      '<label class="field"><span>Izoh</span><textarea data-q-index="' + index + '" data-q-field="explain" rows="3" style="' + ADMIN_INPUT_STYLE + '">' + escapeHtml(question.explain) + '</textarea></label>' +
      '<button type="button" class="btn btn-secondary" data-delete-question="' + index + '">O\'chirish</button>' +
    '</article>';
  }).join('') || '<div class="empty">Bu mavzuda savol yo\'q. "Savol qo\'shish" tugmasini bosing.</div>';
}

function addAdminQuestion() {
  const topic = currentAdminTopic();
  if (!topic) return;
  if (!Array.isArray(topic.questions)) topic.questions = [];
  topic.questions.push({
    id: topic.id + '-q-' + (topic.questions.length + 1) + '-' + Date.now().toString(36),
    q: 'Yangi geometriya savoli?',
    options: ['Variant A', 'Variant B', 'Variant C', 'Variant D'],
    answer: 0,
    explain: 'Izoh yozing.'
  });
  renderAdminQuestions();
}

function deleteAdminQuestion(index) {
  const topic = currentAdminTopic();
  if (!topic || !Array.isArray(topic.questions)) return;
  topic.questions.splice(index, 1);
  renderAdminQuestions();
}

async function saveAdminQuestions() {
  const topic = currentAdminTopic();
  if (!topic) return;
  const oldQuestions = topic.questions || [];
  const questions = oldQuestions.map((question) => ({ ...question, options: (question.options || []).slice(0, 4) }));
  el('admin-question-list').querySelectorAll('[data-q-field]').forEach((input) => {
    const index = Number(input.dataset.qIndex);
    const field = input.dataset.qField;
    if (!questions[index]) return;
    if (field === 'option') questions[index].options[Number(input.dataset.optionIndex)] = input.value;
    else if (field === 'answer') questions[index].answer = Number(input.value);
    else questions[index][field] = input.value;
  });
  questions.forEach((question) => {
    while (question.options.length < 4) question.options.push('');
  });
  topic.questions = questions;
  topic.questionCount = questions.length;
  try {
    const response = await fetch(API + '/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ topics: TOPICS_DATA })
    });
    if (!response || !response.ok) throw new Error('Admin xatoligi');
    renderAdminQuestions();
    renderAdminTopics();
    if (currentUser && el('view-home').classList.contains('active')) renderHome();
    toast('Savollar saqlandi.');
  } catch (error) {
    toast('Savollarni saqlab bo\'lmadi.');
  }
}

async function loadAdminResults() {
  try {
    const data = await adminFetch('/admin/results', { method: 'GET' });
    const results = Array.isArray(data.results) ? data.results : [];
    el('admin-results').innerHTML = results.length
      ? '<table style="width:100%;border-collapse:collapse;background:var(--surface);border-radius:14px;overflow:hidden;">' +
        '<thead><tr><th>Sana</th><th>Foydalanuvchi</th><th>Mavzu</th><th>Natija</th><th>Foiz</th></tr></thead><tbody>' +
        results.map((result) => {
          const user = result.user || {};
          const name = user.name || user.username || 'Noma\'lum';
          return '<tr>' +
            '<td>' + escapeHtml(formatDate(result.date)) + '</td>' +
            '<td>' + escapeHtml(name) + '</td>' +
            '<td>' + escapeHtml(result.topic || (result.topicTitle || '')) + '</td>' +
            '<td>' + escapeHtml(result.score) + ' / ' + escapeHtml(result.total) + '</td>' +
            '<td>' + escapeHtml(result.percent !== undefined ? result.percent : (result.total ? Math.round(result.score / result.total * 100) : 0)) + '%</td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>'
      : '<div class="empty">Hali natija yo\'q.</div>';
  } catch (error) {
    el('admin-results').innerHTML = '<div class="empty">Natijalarni yuklab bo\'lmadi.</div>';
  }
}

async function loadAdminStats() {
  try {
    const data = await adminFetch('/admin/stats', { method: 'GET' });
    const top = Array.isArray(data.top) ? data.top : [];
    el('admin-stats').innerHTML =
      '<div class="topics-grid">' +
        '<article class="topic-card"><h3>Jami natijalar</h3><p style="font-size:28px;font-weight:800;">' + escapeHtml(data.total) + '</p></article>' +
        '<article class="topic-card"><h3>Foydalanuvchilar</h3><p style="font-size:28px;font-weight:800;">' + escapeHtml(data.users) + '</p></article>' +
        '<article class="topic-card"><h3>Mavzular</h3><p style="font-size:28px;font-weight:800;">' + escapeHtml(data.topics) + '</p></article>' +
        '<article class="topic-card"><h3>O\'rtacha foiz</h3><p style="font-size:28px;font-weight:800;">' + escapeHtml(data.averagePercent) + '%</p></article>' +
      '</div>' +
      '<div class="section-title"><div><h2>Eng yaxshi 5 talaba</h2></div></div>' +
      (top.length
        ? '<div class="history-list">' + top.map((item, index) =>
            '<div class="history-item"><div><strong>' + (index + 1) + '. ' + escapeHtml(item.name || item.username || item.user) + '</strong></div>' +
            '<div class="history-score">' + escapeHtml(item.percent !== undefined ? item.percent : item.score) + '%</div></div>'
          ).join('') + '</div>'
        : '<div class="empty">Top natijalar yo\'q.</div>');
  } catch (error) {
    el('admin-stats').innerHTML = '<div class="empty">Statistikani yuklab bo\'lmadi.</div>';
  }
}

async function sendWeeklyReport() {
  try {
    const response = await fetch(API + '/admin/report', {
      method: 'POST',
      headers: { 'x-admin-key': adminKey }
    });
    if (!response || !response.ok) throw new Error('Admin xatoligi');
    toast('Haftalik hisobot yuborildi.');
  } catch (error) {
    toast('Hisobotni yuborib bo\'lmadi.');
  }
}

function loadAdminData() {
  renderAdminTopics();
  renderAdminQuestionTopicOptions();
  renderAdminQuestions();
  loadAdminResults();
  loadAdminStats();
}

function init() {
  el('register-form').addEventListener('submit', register);
  el('login-form').addEventListener('submit', login);
  el('logout-btn').addEventListener('click', logout);
  el('tab-register').addEventListener('click', () => switchAuthTab('register'));
  el('tab-login').addEventListener('click', () => switchAuthTab('login'));

  el('topics-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-start]');
    if (button) startTest(button.dataset.start);
  });
  el('history-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-result]');
    if (button) openSavedResult(button.dataset.result);
  });

  el('options').addEventListener('click', (event) => {
    const option = event.target.closest('[data-option]');
    if (option) answerQuestion(Number(option.dataset.option));
  });
  el('palette').addEventListener('click', (event) => {
    const button = event.target.closest('[data-question]');
    if (button) goToQuestion(Number(button.dataset.question));
  });
  el('prev-btn').addEventListener('click', () => goToQuestion(testState.index - 1));
  el('next-btn').addEventListener('click', () => goToQuestion(testState.index + 1));
  el('finish-btn').addEventListener('click', () => finishTest(false));
  el('test-back').addEventListener('click', () => { stopTimer(); renderHome(); });
  el('retake-btn').addEventListener('click', () => startTest(lastResultTopicId));
  el('retry-wrong-btn').addEventListener('click', retryWrongQuestions);
  el('certificate-btn').addEventListener('click', downloadCertificate);
  el('result-home').addEventListener('click', renderHome);
  el('result-home-2').addEventListener('click', renderHome);

  if (IS_STATIC_PAGE) el('admin-btn').classList.add('hidden');
  el('admin-btn').addEventListener('click', openAdminPanel);
  el('admin-home-btn').addEventListener('click', renderHome);
  el('admin-reset-btn').addEventListener('click', () => {
    clearAdminKey();
    el('admin-login-form').classList.remove('hidden');
    el('admin-panel').classList.add('hidden');
    setError('admin-error', '');
    el('admin-password').value = '';
  });
  el('admin-login-form').addEventListener('submit', adminLogin);
  el('admin-tab-topics').addEventListener('click', () => switchAdminTab('topics'));
  el('admin-tab-questions').addEventListener('click', () => switchAdminTab('questions'));
  el('admin-tab-results').addEventListener('click', () => switchAdminTab('results'));
  el('admin-tab-stats').addEventListener('click', () => switchAdminTab('stats'));
  el('admin-save-topics').addEventListener('click', saveAdminTopics);
  el('admin-question-topic').addEventListener('change', renderAdminQuestions);
  el('admin-question-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-question]');
    if (button) deleteAdminQuestion(Number(button.dataset.deleteQuestion));
  });
  el('admin-add-question').addEventListener('click', addAdminQuestion);
  el('admin-save-questions').addEventListener('click', saveAdminQuestions);
  el('weekly-report-btn').addEventListener('click', sendWeeklyReport);

  const session = read(STORAGE.session, null);
  const user = session && read(STORAGE.users, []).find((u) => u.username === session);
  if (user) {
    currentUser = user;
    renderHome();
  } else {
    switchAuthTab('register');
    showView('view-auth');
  }
  loadContent();
}

document.addEventListener('DOMContentLoaded', init);
