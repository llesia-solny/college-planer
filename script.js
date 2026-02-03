let editingHomeworkId = null;

// ================= NAVIGATION =================
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

const STORAGE_KEY = 'college_planner_state';

let state = {
  schedule: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: []
  },
  homeworks: []
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

loadState();
renderSchedule();
renderHomeworks();

const addHomeworkBtn = document.querySelector('.add-btn');
const homeworkModal = document.getElementById('homeworkModal');

addHomeworkBtn.addEventListener('click', () => {
  homeworkModal.classList.remove('hidden');

  // очистка полей
  subject.value = '';
  task.value = '';
  deadline.value = '';
  editingHomeworkId = null;
});


document.querySelectorAll('.add-lesson-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const day = btn.closest('.day-card').dataset.day;

    if (state.schedule[day].length >= 4) {
      alert('Максимум 4 пары');
      return;
    }

    openLessonModal(day);
  });
});

let currentDay = null;
let editingLessonId = null;

function openLessonModal(day, lesson = null) {
  currentDay = day;
  editingLessonId = lesson?.id || null;

  lessonName.value = lesson?.name || '';
  lessonStart.value = lesson?.start || '';
  lessonEnd.value = lesson?.end || '';

  lessonModal.classList.remove('hidden');
}

saveLesson.addEventListener('click', () => {
  const name = lessonName.value.trim();
  const start = lessonStart.value;
  const end = lessonEnd.value;

  if (!name || !start || !end) {
    alert('Заполните все поля');
    return;
  }

  if (editingLessonId) {
    const lesson = state.schedule[currentDay].find(l => l.id === editingLessonId);
    lesson.name = name;
    lesson.start = start;
    lesson.end = end;
  } else {
    state.schedule[currentDay].push({
      id: Date.now().toString(),
      name,
      start,
      end
    });
  }

  saveState();
  renderSchedule();
  lessonModal.classList.add('hidden');
});

deleteLesson.addEventListener('click', () => {
  state.schedule[currentDay] =
    state.schedule[currentDay].filter(l => l.id !== editingLessonId);

  saveState();
  renderSchedule();
  lessonModal.classList.add('hidden');
});

function renderSchedule() {
  document.querySelectorAll('.day-card').forEach(card => {
    const day = card.dataset.day;
    const list = card.querySelector('.lesson-list');
    list.innerHTML = '';

    state.schedule[day].forEach(lesson => {
      const li = document.createElement('li');
      li.className = 'lesson';
      li.dataset.time = `${lesson.start}`;
      li.innerHTML = `<span>${lesson.name}</span>`;

      li.addEventListener('click', () => {
        openLessonModal(day, lesson);
      });

      list.appendChild(li);
    });
  });
}


saveHomework.addEventListener('click', () => {
  if (!subject.value || !task.value || !deadline.value) {
    alert('Заполните все поля');
    return;
  }

  if (editingHomeworkId) {
    const hw = state.homeworks.find(h => h.id === editingHomeworkId);
    hw.subject = subject.value;
    hw.task = task.value;
    hw.deadline = deadline.value;
  } else {
    state.homeworks.push({
      id: Date.now().toString(),
      subject: subject.value,
      task: task.value,
      deadline: deadline.value,
      done: false
    });
  }

  saveState();
  renderHomeworks();
  homeworkModal.classList.add('hidden');
});


function renderHomeworks() {
  let container = document.querySelector('.homework-list');
  if (!container) {
    container = document.createElement('div');
    container.className = 'homework-list';
    document.getElementById('homework').appendChild(container);
  }

  container.innerHTML = '';

  state.homeworks.forEach(hw => {
    const div = document.createElement('div');
    div.className = 'card';
    if (hw.done) div.classList.add('done');

   div.innerHTML = `
  <div class="hw-subject">
    <input type="checkbox" ${hw.done ? 'checked' : ''}>
    <span>${hw.subject}</span>
  </div>

  <div class="hw-task">${hw.task}</div>

  <div class="hw-deadline">📅 ${hw.deadline}</div>

  <div class="hw-footer">
    <button class="edit-btn">✏️</button>
    <button class="delete-btn">✕</button>
  </div>
`;



    // ✔ выполнено
    div.querySelector('input').addEventListener('change', (e) => {
      hw.done = e.target.checked;
      saveState();
      renderHomeworks();
    });

    // ✏️ редактирование
    div.querySelector('.edit-btn').addEventListener('click', () => {
      subject.value = hw.subject;
      task.value = hw.task;
      deadline.value = hw.deadline;

      editingHomeworkId = hw.id;
      homeworkModal.classList.remove('hidden');
    });

    // ❌ удалить
    div.querySelector('.delete-btn').addEventListener('click', () => {
      state.homeworks = state.homeworks.filter(h => h.id !== hw.id);
      saveState();
      renderHomeworks();
    });

    container.appendChild(div);
  });
}


const dayMap = {
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
  0: 'sun'
};

const today = dayMap[new Date().getDay()];
const todayCard = document.querySelector(`.day-card[data-day="${today}"]`);

if (todayCard) {
  todayCard.classList.add('today');
}
