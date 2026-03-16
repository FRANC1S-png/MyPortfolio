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

// --- อนิเมชั่นจางหายสำหรับทุก Section ---
const sections = document.querySelectorAll('.about, .learning, .folder-con, .contact');

window.addEventListener('scroll', () => {
    const cardShifter = document.querySelector('.card-shifter');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    /* =========================================
       1. อนิเมชั่นการ์ด (Fade Out - ธรรมชาติ)
       ========================================= */
    // จองพื้นที่ 50% ของหน้าจอแรกเพื่อให้การ์ดค่อยๆ จาง
    const cardFadeStart = 0; 
    const cardFadeEnd = windowHeight * 0.5;
    
    // คำนวณ Scroll Progress (0 ถึง 1)
    let cardProgress = (scrollPosition - cardFadeStart) / (cardFadeEnd - cardFadeStart);
    cardProgress = Math.max(0, Math.min(1, cardProgress)); // Limit 0-1

    // 🌟 พระเอก: ฟังก์ชัน Easing (Ease-In-Out Quad)
    // ทำให้การเปลี่ยนค่าดูนุ่มนวล ไม่แข็งแบบเส้นตรง
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    let smoothedProgress = easeInOutQuad(cardProgress);

    // คำนวณ Opacity และ Scale โดยใช้ค่าที่นุ่มนวลแล้ว
    let cardOpacity = 1 - smoothedProgress;
    let cardScale = 1 - (smoothedProgress * 0.2); // ย่อลงสูงสุด 20% (เหลือ 0.8)

    // สั่งการทำงาน CSS
    if (cardOpacity > 0.01) { // ถ้ายังไม่หายสนิท
        cardShifter.style.opacity = cardOpacity;
        cardShifter.style.transform = `translate(-50%, -50%) scale(${cardScale})`;
        cardShifter.style.visibility = 'visible';
        cardShifter.style.pointerEvents = 'auto';
    } else { // ถ้าหายไปแล้ว
        cardShifter.style.opacity = 0;
        cardShifter.style.visibility = 'hidden';
        cardShifter.style.pointerEvents = 'none';
    }


    /* =========================================
       2. อนิเมชั่น Section อื่นๆ (Fade In/Out)
       ========================================= */
    const sections = document.querySelectorAll('.about, .learning, .folder-con, .contact');
    
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const secHeight = rect.height;
        
        // จุดที่ Section จะเริ่มจางหายเมื่อเลื่อนพ้นขอบบน
        const fadeOutPoint = windowHeight * 0.1; 

        // คำนวณความจางเมื่อเลื่อนพ้นขอบบน (Ease-Out)
        if (rect.top < fadeOutPoint) {
            // คำนวณ Progress (0 เมื่ออยู่จุดเริ่มจาง, 1 เมื่อหายสนิท)
            let outProgress = (fadeOutPoint - rect.top) / (secHeight * 0.6);
            outProgress = Math.max(0, Math.min(1, outProgress));
            
            // ใช้ Ease-Out เพื่อให้ตอนหายมันนุ่มนวล
            const easeOutQuad = t => t * (2 - t);
            let smoothedOut = easeOutQuad(outProgress);
            
            sec.style.opacity = 1 - smoothedOut;
        } else {
            sec.style.opacity = 1;
        }
    });


let scrollAttempts = 0;
let canShowWarning = false;
let isWaiting = false;
let waitTimeout;

window.addEventListener('wheel', (e) => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 15;
    const warning = document.getElementById('overlap-warning');

    if (isAtBottom && e.deltaY > 0) {
        // --- ขั้นตอนที่ 1: ชนกำแพงแล้วต้องรอ 2 วิ ---
        if (!isWaiting && !canShowWarning) {
            isWaiting = true;
            console.log("Collision! Wait 2 seconds...");
            
            // เริ่มนับถอยหลัง 2 วินาที
            waitTimeout = setTimeout(() => {
                canShowWarning = true;
                isWaiting = false;
                console.log("Ready to show after 2-3 more scrolls");
            }, 2000); 
        }

        // --- ขั้นตอนที่ 2: หลังจาก 2 วิแล้ว ต้องไถอีก 3 ครั้ง ---
        if (canShowWarning) {
            scrollAttempts++;
            
            // เอฟเฟกต์การไถแต่ละครั้ง (ค่อยๆ ชัดขึ้น)
            warning.style.opacity = (scrollAttempts / 3) * 0.5;
            warning.style.transform = `translateY(${-scrollAttempts * 15}px)`;

            if (scrollAttempts >= 3) {
                warning.style.opacity = 1;
                warning.style.transform = 'translateY(-30px) scale(1.2)';
                warning.style.color = '#ff0000';
                warning.style.textShadow = '0 0 10px rgba(255,0,0,0.8)';
            }
        }
    } else if (e.deltaY < 0) {
        // --- รีเซ็ตทุกอย่างเมื่อเลื่อนขึ้น ---
        clearTimeout(waitTimeout);
        scrollAttempts = 0;
        canShowWarning = false;
        isWaiting = false;
        
        warning.style.opacity = 0;
        warning.style.transform = 'translateY(20px) scale(1)';
    }
}, { passive: false });
// สำหรับมือถือ (Touch)
let touchStartY = 0;
window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', e => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
    const touchY = e.touches[0].clientY;
    
    if (isAtBottom && touchY < touchStartY) { // ปัดขึ้นเพื่อเลื่อนลงล่าง
        scrollAttempts++;
        if (scrollAttempts >= 15) { // มือถือค่าจะขึ้นไวหน่อย เลยใช้ 15
            document.getElementById('overlap-warning').style.opacity = 1;
        }
    }
}, { passive: true });
});