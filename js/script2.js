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

const folder = document.getElementById("folder1");
const windowBox = document.getElementById("folderWindow");
const closeBtn = document.getElementById("closeWin");


const chatWindow = document.getElementById('folderWindow');
const chatHeader = document.getElementById('folderHeader');
let offsetX = 0, offsetY = 0, IsDragging = false; 

// -----------------------------
// Dragging System
// -----------------------------
folderHeader.addEventListener("mousedown", (e) => {
    IsDragging = true;

    // แปลง transform ตำแหน่งจริงเมื่อเริ่มลาก
    const rect = folderWindow.getBoundingClientRect();
    folderWindow.style.transform = "none";
    folderWindow.style.left = rect.left + "px";
    folderWindow.style.top = rect.top + "px";

    offsetX = e.clientX - folderWindow.offsetLeft;
    offsetY = e.clientY - folderWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!IsDragging) return;

    folderWindow.style.left = (e.clientX - offsetX) + "px";
    folderWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    IsDragging = false;
});

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


// double click เปิด
folder.addEventListener("dblclick", () => {
  windowBox.style.display = "block";
});

// ปิด window
closeBtn.addEventListener("click", () => {
  windowBox.style.display = "none";
});
