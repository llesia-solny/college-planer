// ================= НАВИГАЦИЯ =================
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

// ================= LOCAL STORAGE =================
let schedule = JSON.parse(localStorage.getItem('schedule')) || {};
let homeworkList = JSON.parse(localStorage.getItem('homework')) || [];

// ================= ПАРЫ =================
const lessonModal = document.getElementById('lessonModal');
const lessonNameInput = document.getElementById('lessonName');
const saveLessonBtn = document.getElementById('saveLesson');
const deleteLessonBtn = document.getElementById('deleteLesson');

let currentLesson = null;

document.querySelectorAll('.lesson').forEach(lesson => {
  lesson.addEventListener('click', () => {
    currentLesson = lesson;
    lessonNameInput.value = lesson.dataset.name || '';
    lessonModal.classList.remove('hidden');
  });
});

saveLessonBtn.addEventListener('click', () => {
  if (!currentLesson) return;

  const name = lessonNameInput.value.trim();
  if (!name) return;

  const color = randomPink();
  const key = currentLesson.dataset.day + currentLesson.dataset.time;

  schedule[key] = { name, color };
  localStorage.setItem('schedule', JSON.stringify(schedule));

  currentLesson.textContent = name;
  currentLesson.dataset.name = name;
  currentLesson.style.borderLeft = `6px solid ${color}`;

  createHomework(name, color);

  lessonModal.classList.add('hidden');
  lessonNameInput.value = '';
});

deleteLessonBtn.addEventListener('click', () => {
  if (!currentLesson) return;

  const key = currentLesson.dataset.day + currentLesson.dataset.time;
  delete schedule[key];
  localStorage.setItem('schedule', JSON.stringify(schedule));

  deleteHomework(currentLesson.dataset.name);

  currentLesson.textContent = '';
  currentLesson.dataset.name = '';
  currentLesson.style.borderLeft = 'none';

  lessonModal.classList.add('hidden');
});

// ================= ДОМАШНИЕ ЗАДАНИЯ =================
const homeworkSection = document.getElementById('homework');

function createHomework(subject, color) {
  const hw = {
    id: Date.now(),
    subject,
    text: 'Домашнее задание',
    color,
    done: false
  };

  homeworkList.push(hw);
  saveHomework();
  renderHomework();
}

function renderHomework() {
  document.querySelectorAll('.homework-card').forEach(e => e.remove());

  homeworkList.forEach(hw => {
    const card = document.createElement('div');
    card.className = `card homework homework-card ${hw.done ? 'done' : ''}`;
    card.style.borderLeft = `6px solid ${hw.color}`;

    card.innerHTML = `
      <div class="hw-top">
        <label>
          <input type="checkbox" ${hw.done ? 'checked' : ''}>
          <span class="subject">${hw.subject}</span>
        </label>
        <div>
          <button class="edit-btn">✏️</button>
          <button class="delete-btn">✖</button>
        </div>
      </div>
      <p class="task">${hw.text}</p>
    `;

    card.querySelector('input').addEventListener('change', e => {
      hw.done = e.target.checked;
      saveHomework();
      renderHomework();
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      const newText = prompt('Редактировать задание:', hw.text);
      if (newText !== null) {
        hw.text = newText;
        saveHomework();
        renderHomework();
      }
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      homeworkList = homeworkList.filter(h => h.id !== hw.id);
      saveHomework();
      renderHomework();
    });

    homeworkSection.appendChild(card);
  });
}

function deleteHomework(subject) {
  homeworkList = homeworkList.filter(hw => hw.subject !== subject);
  saveHomework();
  renderHomework();
}

function saveHomework() {
  localStorage.setItem('homework', JSON.stringify(homeworkList));
}

// ================= ВОССТАНОВЛЕНИЕ =================
function restoreSchedule() {
  document.querySelectorAll('.lesson').forEach(lesson => {
    const key = lesson.dataset.day + lesson.dataset.time;
    const data = schedule[key];

    if (data) {
      lesson.textContent = data.name;
      lesson.dataset.name = data.name;
      lesson.style.borderLeft = `6px solid ${data.color}`;
    }
  });
}

// ================= АНИМАЦИИ =================
document.querySelectorAll('.lesson').forEach(l => {
  l.style.opacity = '0';
  l.style.transform = 'translateY(10px)';
  setTimeout(() => {
    l.style.opacity = '1';
    l.style.transform = 'translateY(0)';
    l.style.transition = '0.4s';
  }, 200);
});

// ================= ВСПОМОГАТЕЛЬНОЕ =================
function randomPink() {
  const colors = ['#ff6fae', '#ff9acb', '#ff4f9a', '#ffc1dd'];
  return colors[Math.floor(Math.random() * colors.length)];
}

document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) m.classList.add('hidden');
  });
});

// ================= СТАРТ =================
restoreSchedule();
renderHomework();

