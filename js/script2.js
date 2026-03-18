/* =========================================
   1. GLOBAL STATE & SELECTORS
   ========================================= */
const card = document.getElementById("card");
const cardShifter = document.querySelector('.card-shifter');
const warning = document.getElementById('overlap-warning');

// State สำหรับการลากการ์ด 3D
let isDraggingCard = false;
let startX = 0, startY = 0;
let rotateX = 0, rotateY = 0;
let targetScrollRotate = 0, currentScrollRotate = 0;
const MAX_ROTATE_X = 70;

// State สำหรับหน้าต่าง Folder
let activeWin = null;
let winDragging = false;
let winOffsetX = 0, winOffsetY = 0;
let lastTouchTime = 0;

// State สำหรับระบบท้ายเว็บ (Warning)
let scrollAttempts = 0;
let canShowWarning = false;
let isWaiting = false;
let waitTimeout;

/* =========================================
   2. WINDOW SYSTEM (Open/Close/Drag/Resize)
   ========================================= */
const windows = [
    { id: 'folder', win: document.getElementById("folderWindow"), header: document.getElementById('folderHeader'), close: document.getElementById("closeWin") },
    { id: 'folder2', win: document.getElementById("folderWindow2"), header: document.getElementById('folderHeader2'), close: document.getElementById("closeWin2") },
    { id: 'folder3', win: document.getElementById("folderWindow3"), header: document.getElementById('folderHeader3'), close: document.getElementById("closeWin3") }
];

windows.forEach(item => {
    const folderIcon = document.getElementById(item.id);
    
    // ฟังก์ชันเปิดหน้าต่าง
    const openWin = () => {
        item.win.style.display = "flex";
        item.win.style.zIndex = "2000"; 
    };

    folderIcon.addEventListener("dblclick", openWin);
    folderIcon.addEventListener("touchend", () => {
        const now = Date.now();
        if (now - lastTouchTime < 350) openWin();
        lastTouchTime = now;
    });

    // ฟังก์ชันปิดหน้าต่าง
    item.close.addEventListener("click", (e) => {
        e.stopPropagation();
        item.win.style.display = "none";
    });

    // ระบบลากหน้าต่าง (Desktop)
    item.header.addEventListener("mousedown", (e) => {
        winDragging = true;
        activeWin = item.win;
        const rect = activeWin.getBoundingClientRect();
        activeWin.style.transform = "none";
        activeWin.style.left = rect.left + "px";
        activeWin.style.top = rect.top + "px";
        winOffsetX = e.clientX - rect.left;
        winOffsetY = e.clientY - rect.top;
    });

    // ระบบ Resize (เรียกใช้ฟังก์ชันเดิมที่คุณมี)
    enableResize(item.win);
});

// Global Mouse Move สำหรับลากหน้าต่าง
document.addEventListener("mousemove", (e) => {
    if (winDragging && activeWin) {
        activeWin.style.left = (e.clientX - winOffsetX) + "px";
        activeWin.style.top = (e.clientY - winOffsetY) + "px";
    }
});

document.addEventListener("mouseup", () => { winDragging = false; activeWin = null; });

/* =========================================
   3. CARD 3D SYSTEM
   ========================================= */
function updateCardTransform() {
    card.style.transform = `rotateX(${rotateX + currentScrollRotate}deg) rotateY(${rotateY}deg)`;
}

card.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDraggingCard = true;
    startX = e.clientX; startY = e.clientY;
    card.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDraggingCard) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    rotateY += deltaX * 0.3;
    rotateX -= deltaY * 0.3;
    rotateX = Math.max(-MAX_ROTATE_X, Math.min(MAX_ROTATE_X, rotateX));
    startX = e.clientX; startY = e.clientY;
    updateCardTransform();
});

document.addEventListener("mouseup", () => {
    isDraggingCard = false;
    card.style.cursor = "grab";
});

// Scroll หมุนการ์ด
window.addEventListener("scroll", () => {
    targetScrollRotate = -Math.min(window.scrollY * 0.15, 40);
});

/* =========================================
   4. SCROLL ANIMATION (Fade In/Out & Warning)
   ========================================= */
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // 4.1 การจางของการ์ด (นุ่มนวลขึ้น)
    const cardFadeEnd = windowHeight * 0.5;
    let cardProgress = Math.max(0, Math.min(1, scrollPosition / cardFadeEnd));
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    let smoothedProgress = easeInOutQuad(cardProgress);

    if (smoothedProgress < 0.99) {
        cardShifter.style.opacity = 1 - smoothedProgress;
        cardShifter.style.transform = `translate(-50%, -50%) scale(${1 - (smoothedProgress * 0.2)})`;
        cardShifter.style.visibility = 'visible';
        cardShifter.style.pointerEvents = 'auto';
    } else {
        cardShifter.style.opacity = 0;
        cardShifter.style.visibility = 'hidden';
        cardShifter.style.pointerEvents = 'none';
    }

    // 4.2 การจางของ Section อื่นๆ
    const sections = document.querySelectorAll('.about, .learning, .folder-con, .contact');
    const isAnyWinOpen = windows.some(w => w.win.style.display === "flex");

    sections.forEach(sec => {
        // ถ้าหน้าต่างเปิดอยู่ ไม่ต้องให้ folder-con จาง เพื่อให้กดได้
        if (isAnyWinOpen && sec.classList.contains('folder-con')) {
            sec.style.opacity = 1;
            sec.style.pointerEvents = "auto";
            return;
        }

        const rect = sec.getBoundingClientRect();
        if (rect.top < windowHeight * 0.1) {
            let outProgress = Math.max(0, Math.min(1, (windowHeight * 0.1 - rect.top) / (rect.height * 0.6)));
            const easeOutQuad = t => t * (2 - t);
            sec.style.opacity = 1 - easeOutQuad(outProgress);
            sec.style.pointerEvents = (1 - outProgress < 0.1) ? "none" : "auto";
        } else {
            sec.style.opacity = 1;
            sec.style.pointerEvents = "auto";
        }
    });
});

/* =========================================
   5. OVERLAP WARNING SYSTEM (Bottom of Page)
   ========================================= */
window.addEventListener('wheel', (e) => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20;
    if (isAtBottom && e.deltaY > 0) {
        if (!isWaiting && !canShowWarning) {
            isWaiting = true;
            waitTimeout = setTimeout(() => { canShowWarning = true; isWaiting = false; }, 1000); 
        }
        if (canShowWarning) {
            scrollAttempts++;
            warning.style.opacity = (scrollAttempts / 3);
            warning.style.transform = `translateY(${-scrollAttempts * 15}px)`;
            if (scrollAttempts >= 3) warning.classList.add('active'), warning.style.opacity = 1;
        }
    } else if (e.deltaY < 0) {
        clearTimeout(waitTimeout);
        scrollAttempts = 0; canShowWarning = false; isWaiting = false;
        warning.style.opacity = 0; warning.classList.remove('active');
    }
}, { passive: false });

/* =========================================
   6. UTILS & HELPERS
   ========================================= */
function enableResize(win) {
    let isResizing = false;
    let dir = "";
    const EDGE = 10;

    win.addEventListener("mousedown", e => {
        const r = win.getBoundingClientRect();
        const left = e.clientX - r.left < EDGE;
        const right = r.right - e.clientX < EDGE;
        const top = e.clientY - r.top < EDGE;
        const bottom = r.bottom - e.clientY < EDGE;

        if (left || right || top || bottom) {
            isResizing = true;
            dir = { left, right, top, bottom };
            const startW = r.width, startH = r.height, startX = e.clientX, startY = e.clientY, startL = r.left, startT = r.top;

            const onMouseMove = (me) => {
                if (!isResizing) return;
                if (dir.right) win.style.width = startW + (me.clientX - startX) + "px";
                if (dir.bottom) win.style.height = startH + (me.clientY - startY) + "px";
                if (dir.left) { win.style.width = startW - (me.clientX - startX) + "px"; win.style.left = startL + (me.clientX - startX) + "px"; }
                if (dir.top) { win.style.height = startH - (me.clientY - startY) + "px"; win.style.top = startT + (me.clientY - startY) + "px"; }
            };
            const onMouseUp = () => { isResizing = false; document.removeEventListener("mousemove", onMouseMove); };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    });
}

function animate() {
    currentScrollRotate += (targetScrollRotate - currentScrollRotate) * 0.08;
    updateCardTransform();
    requestAnimationFrame(animate);
}

// Language Toggle
function toggleLang() {
    const menu = document.getElementById("langMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

animate();