const openBtn = document.getElementById('openBtn');
const cover = document.getElementById('cover');
const content = document.getElementById('content');
const scratchCard = document.getElementById('scratchCard');
const scratchLayer = document.getElementById('scratchLayer');
const dateReveal = document.getElementById('dateReveal');
const petals = document.getElementById('petals');
const bgMusic = document.getElementById('bgMusic');
const wishesForm = document.getElementById('wishesForm');
const wishesSuccess = document.getElementById('wishesSuccess');


openBtn.addEventListener('click', async () => {
  document.body.classList.add('open');
  cover.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    await bgMusic.play();
  } catch (e) {
    console.log('Music could not autoplay yet');
  }
});
openBtn.addEventListener('click', () => {
  document.body.classList.add('open');
  cover.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

let revealed = false;
const revealDate = () => {
  if (revealed) return;
  revealed = true;
  scratchCard.classList.add('revealed');
  dateReveal.classList.add('show');
  burstPetals();
};

function burstPetals(){
  const count = 20;
  for(let i=0;i<count;i++){
    const p = document.createElement('i');
    p.className = 'petal';
    const x = 15 + Math.random()*70;
    const dx = (Math.random()*2-1) * 120 + 'px';
    const rot = (Math.random()*720 - 360) + 'deg';
    p.style.left = x + '%';
    p.style.top = '40%';
    p.style.setProperty('--dx', dx);
    p.style.setProperty('--rot', rot);
    p.style.animationDelay = (Math.random()*0.12) + 's';
    petals.appendChild(p);
    setTimeout(() => p.remove(), 1800);
  }
}

['pointermove','pointerdown','touchmove'].forEach(evt => {
  scratchCard.addEventListener(evt, (e) => {
    const t = e.touches ? e.touches[0] : e;
    const r = scratchCard.getBoundingClientRect();
    const x = ((t.clientX - r.left) / r.width) * 100;
    const y = ((t.clientY - r.top) / r.height) * 100;
    scratchLayer.style.setProperty('--x', x + '%');
    scratchLayer.style.setProperty('--y', y + '%');
    if (e.type !== 'pointermove' && e.type !== 'touchmove') revealDate();
  }, { passive:true });
});
scratchCard.addEventListener('click', revealDate);

const weddingDate = new Date('2026-09-07T09:30:00');
const dd = document.getElementById('dd');
const hh = document.getElementById('hh');
const mm = document.getElementById('mm');
const ss = document.getElementById('ss');

function tick(){
  const now = new Date();
  const diff = Math.max(0, weddingDate - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  dd.textContent = d;
  hh.textContent = h;
  mm.textContent = m;
  ss.textContent = s;
}
tick();
setInterval(tick, 1000);
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwmDeMDNzEirRZuronqZ_N6UQgSnCHkb2R0ddUSZtcLFQmErRQO2VKKUBIofGcGLJQM/exec';

if (wishesForm) {
  wishesForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const wish = document.getElementById('guestWish').value.trim();
    const submitButton = wishesForm.querySelector('button[type="submit"]');

    if (!name || !wish) {
      alert('Please enter your name and wishes.');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const formData = new URLSearchParams();

    formData.append('name', name);
    formData.append('wish', wish);
    formData.append('userAgent', navigator.userAgent);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      wishesSuccess.hidden = false;
      wishesForm.reset();
      submitButton.textContent = 'Sent';

    } catch (error) {
      console.error(error);
      alert('Sorry, your wishes could not be sent. Please try again.');
      submitButton.disabled = false;
      submitButton.textContent = 'Send Wishes';
    }
  });
}
