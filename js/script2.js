const card = document.getElementById("card");

/* =========================
   STATE
========================= */
let isDragging = false;
let startX = 0;
let startY = 0;

let rotateX = 0;
let rotateY = 0;

let targetScrollRotate = 0;
let currentScrollRotate = 0;

const MAX_ROTATE_X = 70;

/* =========================
   UPDATE TRANSFORM
========================= */
function updateCardTransform() {
  card.style.transform = `
    rotateX(${rotateX + currentScrollRotate}deg)
    rotateY(${rotateY}deg)
  `;
}

/* =========================
   START DRAG
========================= */
function startDrag(x, y) {
  isDragging = true;
  startX = x;
  startY = y;
  card.style.cursor = "grabbing";
}

/* =========================
   DRAG MOVE
========================= */
function dragMove(x, y) {
  if (!isDragging) return;

  const deltaX = x - startX;
  const deltaY = y - startY;

  rotateY += deltaX * 0.3;
  rotateX -= deltaY * 0.3;

  rotateX = Math.max(-MAX_ROTATE_X, Math.min(MAX_ROTATE_X, rotateX));

  startX = x;
  startY = y;

  updateCardTransform();
}

/* =========================
   END DRAG
========================= */
function endDrag() {
  isDragging = false;
  card.style.cursor = "grab";
}

/* =========================
   MOUSE EVENTS
========================= */
card.addEventListener("mousedown", (e) => {
  e.preventDefault();
  startDrag(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
  dragMove(e.clientX, e.clientY);
});

document.addEventListener("mouseup", endDrag);

/* =========================
   TOUCH EVENTS (มือถือ)
========================= */
card.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  startDrag(touch.clientX, touch.clientY);
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  e.preventDefault(); // 🚫 ปิด scroll
  const touch = e.touches[0];
  dragMove(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchend", endDrag);

/* =========================
   SCROLL → หมุนการ์ด
========================= */
window.addEventListener("scroll", () => {
  targetScrollRotate = -Math.min(window.scrollY * 0.15, 40);
});

/* =========================
   SMOOTH LOOP
========================= */
function animate() {
  currentScrollRotate += (targetScrollRotate - currentScrollRotate) * 0.08;
  updateCardTransform();
  requestAnimationFrame(animate);
}

animate();

/* =========================
   INIT
========================= */
card.style.cursor = "grab";
updateCardTransform();


function toggleLang() {
  const menu = document.getElementById("langMenu");
  menu.style.display =
    menu.style.display === "block" ? "none" : "block";
}


document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".lang-dropdown");
  const menu = document.getElementById("langMenu");

  if (!dropdown.contains(e.target)) {
    menu.style.display = "none";
  }
});

