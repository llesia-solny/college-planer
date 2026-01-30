const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

buttons.forEach (btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.page).classList.add('active');
    });
});

const addBtn = document.querySelector('.add-btn');
const modal = document.querySelector('.modal');
const saveBtn = document.getElementById('save');
const homeworkPage = document.getElementById('homework');

let homeworkList = JSON.parse(localStorage.getItem('homework')) || [];

addBtn.onclick = () => modal.classList.remove('hidden');

saveBtn.onclick = () => {
  const subject = document.getElementById('subject').value;
  const task = document.getElementById('task').value;
  const deadline = document.getElementById('deadline').value;

  if (!subject || !task || !deadline) return;

  const hw = { subject,
   task,
   deadline,
    done: false
    };
  homeworkList.push(hw);

  localStorage.setItem('homework', JSON.stringify(homeworkList));
  modal.classList.add('hidden');

  renderHomework();
};

function renderHomework() {
  document.querySelectorAll('.homework-card').forEach(e => e.remove());

  homeworkList.forEach((hw, index) => {
    const div = document.createElement('div');
    div.className = 'card homework homework-card';

    if (hw.done) {
      div.classList.add('done');
    }

    div.innerHTML = `
      <div class="hw-top">
        <label>
          <input type="checkbox" ${hw.done ? 'checked' : ''}>
          <span class="subject">${hw.subject}</span>
        </label>
        <button class="delete-btn">✖</button>
      </div>

      <p class="task">${hw.task}</p>
      <span class="deadline">до ${hw.deadline}</span>
    `;


    // чекбокс "выполнено"
    div.querySelector('input').addEventListener('change', () => {
      hw.done = !hw.done;
      localStorage.setItem('homework', JSON.stringify(homeworkList));
      renderHomework();
    });

    // удаление
    div.querySelector('.delete-btn').addEventListener('click', () => {
      homeworkList.splice(index, 1);
      localStorage.setItem('homework', JSON.stringify(homeworkList));
      renderHomework();
    });


    homeworkPage.appendChild(div);
  });
}

renderHomework();

const lessonModal = document.getElementById('lessonModal');
const lessonNameInput = document.getElementById('lessonName');
const saveLessonBtn = document.getElementById('saveLesson');
const deleteLessonBtn = document.getElementById('deleteLesson');

let schedule = JSON.parse(localStorage.getItem('schedule')) || {};
let currentLesson = null;

document.querySelectorAll('.lesson').forEach(lesson => {
  const day = lesson.closest('.day-card').dataset.day;
  const time = lesson.dataset.time;
  const key = day + '_' + time;

  if (schedule[key]) {
    lesson.textContent = schedule[key];
  }

  lesson.addEventListener('click', () => {
    currentLesson = { lesson, key };
    document.getElementById('lessonName').value = lesson.textContent;
    document.getElementById('lessonModal').classList.remove('hidden');
  });
});

document.getElementById('saveLesson').onclick = () => {
  if (!currentLesson) return;

  const value = document.getElementById('lessonName').value;
  currentLesson.lesson.textContent = value;
  schedule[currentLesson.key] = value;

  localStorage.setItem('schedule', JSON.stringify(schedule));
  document.getElementById('lessonModal').classList.add('hidden');
};

document.getElementById('deleteLesson').onclick = () => {
  if (!currentLesson) return;

  currentLesson.lesson.textContent = '';
  delete schedule[currentLesson.key];

  localStorage.setItem('schedule', JSON.stringify(schedule));
  document.getElementById('lessonModal').classList.add('hidden');
};

