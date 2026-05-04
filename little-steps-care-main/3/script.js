// Año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Gradiente interactivo del hero
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', (e) => {
  const rect = hero.getBoundingClientRect();
  hero.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  hero.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
});

// Diálogo de contacto
const dialog = document.getElementById('dialog');
const dialogLabel = document.getElementById('dialog-label');
const dialogTitle = document.getElementById('dialog-title');
const dialogCall = document.getElementById('dialog-call');
const dialogWa = document.getElementById('dialog-wa');
const dialogClose = document.getElementById('dialog-close');

function openDialog(btn) {
  dialogLabel.textContent = btn.dataset.label;
  dialogTitle.textContent = btn.dataset.number;
  dialogCall.href = `tel:${btn.dataset.tel}`;
  dialogWa.href = btn.dataset.whatsapp;
  dialog.hidden = false;
}
function closeDialog() { dialog.hidden = true; }

document.querySelectorAll('.contact-btn').forEach(btn => {
  btn.addEventListener('click', () => openDialog(btn));
});
dialogClose.addEventListener('click', closeDialog);
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeDialog(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dialog.hidden) closeDialog(); });
