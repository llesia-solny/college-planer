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

  const hw = { subject, task, deadline };
  homeworkList.push(hw);

  localStorage.setItem('homework', JSON.stringify(homeworkList));
  modal.classList.add('hidden');

  renderHomework();
};

function renderHomework() {
  document.querySelectorAll('.homework-card').forEach(e => e.remove());

  homeworkList.forEach(hw => {
    const div = document.createElement('div');
    div.className = 'card homework homework-card';

    div.innerHTML = `
      <p class="subject">${hw.subject}</p>
      <p class="task">${hw.task}</p>
      <span class="deadline">до ${hw.deadline}</span>
    `;

    homeworkPage.appendChild(div);
  });
}

renderHomework();
