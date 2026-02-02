// ================= NAVIGATION =================
const buttons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

// ================= SCHEDULE =================
const lessonModal = document.getElementById('lessonModal');
const lessonNameInput = document.getElementById('lessonName');
const lessonStartInput = document.getElementById('lessonStart');
const lessonEndInput = document.getElementById('lessonEnd');
const saveLessonBtn = document.getElementById('saveLesson');
const deleteLessonBtn = document.getElementById('deleteLesson');
let currentLesson = null;

let schedule = JSON.parse(localStorage.getItem('schedule')) || {};

document.querySelectorAll('.day-card').forEach(card => {
  const ul = card.querySelector('.lesson-list');
  const addBtn = card.querySelector('.add-lesson-btn');

  addBtn.addEventListener('click', () => {
    const li = document.createElement('li');
    li.classList.add('lesson');
    li.dataset.id = 'lesson-' + Date.now();
    li.dataset.day = card.dataset.day;
    li.dataset.name = '';
    li.dataset.start = '';
    li.dataset.end = '';
    ul.appendChild(li);

    if (!schedule[card.dataset.day]) schedule[card.dataset.day] = [];
    schedule[card.dataset.day].push({id: li.dataset.id, name:'', start:'', end:''});
    localStorage.setItem('schedule', JSON.stringify(schedule));

    li.addEventListener('click', () => openLessonModal(li));
  });
});

function openLessonModal(lesson){
  currentLesson = lesson;
  lessonModal.classList.remove('hidden');
  lessonNameInput.value = lesson.dataset.name || '';
  lessonStartInput.value = lesson.dataset.start || '';
  lessonEndInput.value = lesson.dataset.end || '';
}

saveLessonBtn.addEventListener('click', () => {
  const name = lessonNameInput.value.trim();
  const start = lessonStartInput.value;
  const end = lessonEndInput.value;
  if(!name || !start || !end) return alert('Заполните все поля!');

  currentLesson.dataset.name = name;
  currentLesson.dataset.start = start;
  currentLesson.dataset.end = end;
  currentLesson.textContent = `${start} - ${end} ${name}`;

  const day = currentLesson.dataset.day;
  const index = schedule[day].findIndex(l=>l.id===currentLesson.dataset.id);
  schedule[day][index] = {id:currentLesson.dataset.id, name, start, end};
  localStorage.setItem('schedule', JSON.stringify(schedule));
  lessonModal.classList.add('hidden');
});

deleteLessonBtn.addEventListener('click', () => {
  const day = currentLesson.dataset.day;
  schedule[day] = schedule[day].filter(l => l.id !== currentLesson.dataset.id);
  localStorage.setItem('schedule', JSON.stringify(schedule));
  currentLesson.remove();
  lessonModal.classList.add('hidden');
});

function renderSchedule(){
  document.querySelectorAll('.lesson').forEach(lesson=>{
    const day = lesson.dataset.day;
    const id = lesson.dataset.id;
    if(schedule[day]){
      const found = schedule[day].find(l=>l.id===id);
      if(found && found.name){
        lesson.dataset.name = found.name;
        lesson.dataset.start = found.start;
        lesson.dataset.end = found.end;
        lesson.textContent = `${found.start} - ${found.end} ${found.name}`;
      }
    }
  });
}

renderSchedule();

// ================= HOMEWORK =================
const homeworkAddBtn = document.querySelector('#homework .add-btn');
const homeworkModal = document.getElementById('homeworkModal');
const homeworkSubject = document.getElementById('subject');
const homeworkTask = document.getElementById('task');
const homeworkDeadline = document.getElementById('deadline');
const homeworkSaveBtn = document.getElementById('saveHomework');

let homeworkList = JSON.parse(localStorage.getItem('homework')) || [];

homeworkAddBtn.addEventListener('click', () => {
  homeworkModal.classList.remove('hidden');
  homeworkSubject.value = '';
  homeworkTask.value = '';
  homeworkDeadline.value = '';
});

homeworkSaveBtn.addEventListener('click', () => {
  if(!homeworkSubject.value || !homeworkTask.value || !homeworkDeadline.value) return alert('Заполните все поля!');
  homeworkList.push({subject: homeworkSubject.value, task: homeworkTask.value, deadline: homeworkDeadline.value});
  localStorage.setItem('homework', JSON.stringify(homeworkList));
  homeworkModal.classList.add('hidden');
  renderHomework();
});

function renderHomework(){
  let container = document.querySelector('#homework .homework-list');
  if(!container){
    container = document.createElement('div');
    container.classList.add('homework-list');
    document.querySelector('#homework').appendChild(container);
  }
  container.innerHTML='';
  homeworkList.forEach((hw,index)=>{
    const div=document.createElement('div');
    div.classList.add('card');
    div.innerHTML=`
      <div>
        <div class="subject">${hw.subject}</div>
        <div class="task">${hw.task}</div>
        <div class="time">${hw.deadline}</div>
      </div>
      <button class="delete-btn">Удалить</button>
    `;
    div.querySelector('.delete-btn').addEventListener('click',()=>{
      homeworkList.splice(index,1);
      localStorage.setItem('homework', JSON.stringify(homeworkList));
      renderHomework();
    });
    container.appendChild(div);
  });
}

renderHomework();
