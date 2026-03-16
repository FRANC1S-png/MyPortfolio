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

let lastTouchTime = 0;


const MAX_ROTATE_X = 70;


const folder = document.getElementById("folder");
const windowBox = document.getElementById("folderWindow");
const closeBtn = document.getElementById("closeWin");


const folderWindow = document.getElementById('folderWindow');
const folderHeader = document.getElementById('folderHeader');

const folder2 = document.getElementById("folder2");
const windowBox2 = document.getElementById("folderWindow2");
const closeBtn2 = document.getElementById("closeWin2");


const folderWindow2 = document.getElementById('folderWindow2');
const folderHeader2 = document.getElementById('folderHeader2');

const folder3 = document.getElementById("folder3");
const windowBox3 = document.getElementById("folderWindow3");
const closeBtn3 = document.getElementById("closeWin3");


const folderWindow3 = document.getElementById('folderWindow3');
const folderHeader3 = document.getElementById('folderHeader3');
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

// -----------------------------
// Dragging System window 2
// -----------------------------
folderHeader2.addEventListener("mousedown", (e) => {
    IsDragging = true;

    // แปลง transform ตำแหน่งจริงเมื่อเริ่มลาก
    const rect = folderWindow2.getBoundingClientRect();
    folderWindow2.style.transform = "none";
    folderWindow2.style.left = rect.left + "px";
    folderWindow2.style.top = rect.top + "px";

    offsetX = e.clientX - folderWindow2.offsetLeft;
    offsetY = e.clientY - folderWindow2.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!IsDragging) return;

    folderWindow2.style.left = (e.clientX - offsetX) + "px";
    folderWindow2.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    IsDragging = false;
});

// -----------------------------
// Dragging System window 3
// -----------------------------
folderHeader3.addEventListener("mousedown", (e) => {
    IsDragging = true;

    // แปลง transform ตำแหน่งจริงเมื่อเริ่มลาก
    const rect = folderWindow3.getBoundingClientRect();
    folderWindow3.style.transform = "none";
    folderWindow3.style.left = rect.left + "px";
    folderWindow3.style.top = rect.top + "px";

    offsetX = e.clientX - folderWindow3.offsetLeft;
    offsetY = e.clientY - folderWindow3.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!IsDragging) return;

    folderWindow3.style.left = (e.clientX - offsetX) + "px";
    folderWindow3.style.top = (e.clientY - offsetY) + "px";
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

/*==================
  LANG BUTTON
====================*/  
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

/*===========================
  Open folder DOUBLE
==============================*/


// double click เปิด
folder.addEventListener("dblclick", () => {
  windowBox.style.display = "block";
});

// ปิด window
closeBtn.addEventListener("click", () => {
  windowBox.style.display = "none";
});

folder.addEventListener("touchend", () => {
  const now = Date.now();

  if (now - lastTouchTime < 350) {
    windowBox.style.display = "block"; // double tap
  }

  lastTouchTime = now;
});



//-------------Window 2-----------------
// double click เปิด
folder2.addEventListener("dblclick", () => {
  windowBox2.style.display = "block";
});

// ปิด window
closeBtn2.addEventListener("click", () => {
  windowBox2.style.display = "none";
});

folder2.addEventListener("touchend", () => {
  const now = Date.now();

  if (now - lastTouchTime < 350) {
    windowBox2.style.display = "block"; // double tap
  }

  lastTouchTime = now;
});


//-------------Window 3-----------------
// double click เปิด
folder3.addEventListener("dblclick", () => {
  windowBox3.style.display = "block";
});

// ปิด window
closeBtn3.addEventListener("click", () => {
  windowBox3.style.display = "none";
});

folder3.addEventListener("touchend", () => {
  const now = Date.now();

  if (now - lastTouchTime < 350) {
    windowBox3.style.display = "block"; // double tap
  }

  lastTouchTime = now;
});

// =============================
// 📱 TOUCH DRAG FOR WINDOWS
// =============================
function enableTouchDrag(windowEl, headerEl) {
  let startX, startY, offsetX, offsetY, dragging = false;

  headerEl.addEventListener("touchstart", e => {
    const t = e.touches[0];
    dragging = true;

    const rect = windowEl.getBoundingClientRect();
    windowEl.style.transform = "none";
    windowEl.style.left = rect.left + "px";
    windowEl.style.top = rect.top + "px";

    offsetX = t.clientX - windowEl.offsetLeft;
    offsetY = t.clientY - windowEl.offsetTop;
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!dragging) return;
    const t = e.touches[0];
    windowEl.style.left = (t.clientX - offsetX) + "px";
    windowEl.style.top = (t.clientY - offsetY) + "px";
  }, { passive: true });

  document.addEventListener("touchend", () => {
    dragging = false;
  });
}

// ✅ เปิดใช้กับทุก window
enableTouchDrag(folderWindow, folderHeader);
enableTouchDrag(folderWindow2, folderHeader2);
enableTouchDrag(folderWindow3, folderHeader3);

// =============================
// 🖱️ RESIZE FROM EDGES (DESKTOP)
// =============================
function enableResize(win) {
  let isResizing = false;
  let dir = "";
  let startX, startY, startW, startH, startLeft, startTop;

  const EDGE = 8;

  win.addEventListener("mousemove", e => {
    if (isResizing) return;

    const r = win.getBoundingClientRect();
    const left = e.clientX - r.left < EDGE;
    const right = r.right - e.clientX < EDGE;
    const top = e.clientY - r.top < EDGE;
    const bottom = r.bottom - e.clientY < EDGE;

    win.style.cursor =
      (left && top) || (right && bottom) ? "nwse-resize" :
      (right && top) || (left && bottom) ? "nesw-resize" :
      left || right ? "ew-resize" :
      top || bottom ? "ns-resize" :
      "default";

    dir = { left, right, top, bottom };
  });

  win.addEventListener("mousedown", e => {
    if (!dir.left && !dir.right && !dir.top && !dir.bottom) return;

    isResizing = true;
    const r = win.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = r.width;
    startH = r.height;
    startLeft = r.left;
    startTop = r.top;
    e.preventDefault();
  });

  document.addEventListener("mousemove", e => {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (dir.right) win.style.width = startW + dx + "px";
    if (dir.bottom) win.style.height = startH + dy + "px";
    if (dir.left) {
      win.style.width = startW - dx + "px";
      win.style.left = startLeft + dx + "px";
    }
    if (dir.top) {
      win.style.height = startH - dy + "px";
      win.style.top = startTop + dy + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
}

// ✅ เปิดใช้กับทุก window
enableResize(folderWindow);
enableResize(folderWindow2);
enableResize(folderWindow3);

window.addEventListener('scroll', () => {
  const card = document.querySelector('.card', '.about');
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;

  // คำนวณความจาง: ยิ่งเลื่อนลง Opacity ยิ่งลดลง
  // 1 - (ระยะเลื่อน / ครึ่งหนึ่งของความสูงจอ)
  let opacity = 1 - (scrollPosition / (windowHeight * 0.5));
  
  if (opacity >= 0) {
    card.style.opacity = opacity;
    card.style.transform = `scale(${0.8 + (opacity * 0.2)})`; // ค่อยๆ ย่อตัวลง
  } else {
    card.style.opacity = 0;
  }
});