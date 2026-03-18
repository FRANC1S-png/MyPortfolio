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

// State สำหรับหน้าต่าง Folder (สำคัญ: แยกออกมาให้ชัดเจน)
let activeWin = null;
let isWinDragging = false;
let winOffsetX = 0, winOffsetY = 0;
let lastTouchTime = 0;

/* =========================================
   WINDOW SYSTEM (ฉบับแก้ไขจุดบอดเรื่องการปิด)
   ========================================= */
const windowConfigs = [
    { folderId: 'folder', winId: 'folderWindow', closeId: 'closeWin' },
    { folderId: 'folder2', winId: 'folderWindow2', closeId: 'closeWin2' },
    { folderId: 'folder3', winId: 'folderWindow3', closeId: 'closeWin3' }
];

windowConfigs.forEach(conf => {
    const folderIcon = document.getElementById(conf.folderId);
    const winEl = document.getElementById(conf.winId);
    const closeBtn = document.getElementById(conf.closeId);

    // --- ฟังก์ชันเปิดหน้าต่าง ---
    const openWin = (e) => {
        if (e) e.stopPropagation(); // หยุดไม่ให้คำสั่งส่งต่อไปที่อื่น
        winEl.style.display = "flex";
        winEl.style.zIndex = "3000"; // ดันขึ้นมาหน้าสุด
        console.log("Opening: " + conf.winId);
    };

    // เปิดด้วย Double Click (Desktop)
    folderIcon.addEventListener("dblclick", openWin);
    
    // เปิดด้วย Double Tap (Mobile)
    folderIcon.addEventListener("touchend", (e) => {
        const now = Date.now();
        if (now - lastTouchTime < 350) {
            openWin(e);
        }
        lastTouchTime = now;
    });

    // --- ฟังก์ชันปิดหน้าต่าง (จุดที่ต้องแก้) ---
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();   // ป้องกันพฤติกรรมเริ่มต้นของปุ่ม
        e.stopPropagation();  //สำคัญมาก! หยุดไม่ให้คลิกนี้ทะลุไปโดน Folder ที่อยู่ข้างหลัง
        
        winEl.style.display = "none"; // สั่งปิดหน้าต่าง
        console.log("Closed: " + conf.winId);
    });
    
    // กันเหนียว: ถ้าเผลอคลิกโดน Header ก็ให้หน้าต่างอยู่บนสุด
    winEl.addEventListener("mousedown", () => {
        winEl.style.zIndex = "3000";
    });
});
    // ระบบลากหน้าต่าง (ปรับ Logic ใหม่ไม่ให้เอ๋อ)
    headerEl.addEventListener("mousedown", (e) => {
        isWinDragging = true;
        activeWin = winEl;
        
        // เคลียร์ transform เพื่อใช้ left/top อย่างเดียวในการลาก
        const rect = activeWin.getBoundingClientRect();
        activeWin.style.transform = "none"; 
        activeWin.style.margin = "0"; // ป้องกัน margin ดีด
        activeWin.style.left = rect.left + "px";
        activeWin.style.top = rect.top + "px";

        winOffsetX = e.clientX - rect.left;
        winOffsetY = e.clientY - rect.top;
        
        activeWin.style.zIndex = "3001";
        document.body.style.userSelect = "none"; // กันลากโดนตัวอักษรข้างหลัง
    });


// Global Mouse Move สำหรับลาก (ลื่นขึ้น)
document.addEventListener("mousemove", (e) => {
    if (!isWinDragging || !activeWin) return;
    
    activeWin.style.left = (e.clientX - winOffsetX) + "px";
    activeWin.style.top = (e.clientY - winOffsetY) + "px";
});

document.addEventListener("mouseup", () => { 
    isWinDragging = false; 
    activeWin = null; 
    document.body.style.userSelect = "auto";
});

/* =========================================
   3. CARD 3D SYSTEM (คงเดิม)
   ========================================= */
function updateCardTransform() {
    card.style.transform = `rotateX(${rotateX + currentScrollRotate}deg) rotateY(${rotateY}deg)`;
}

card.addEventListener("mousedown", (e) => {
    if(e.target.closest('.window')) return; // ถ้ากดในหน้าต่าง ไม่ต้องหมุนการ์ด
    isDraggingCard = true;
    startX = e.clientX; startY = e.clientY;
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

document.addEventListener("mouseup", () => isDraggingCard = false);

/* =========================================
   4. SCROLL SYSTEM & SECTIONS (ปรับแก้เพื่อไม่ให้ทับ Window)
   ========================================= */
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // การจางของการ์ด
    const cardFadeEnd = windowHeight * 0.5;
    let cardProgress = Math.max(0, Math.min(1, scrollPosition / cardFadeEnd));
    cardShifter.style.opacity = 1 - cardProgress;
    cardShifter.style.visibility = (1 - cardProgress < 0.01) ? 'hidden' : 'visible';

    // การจางของ Section (เช็คการเปิดหน้าต่าง)
    const sections = document.querySelectorAll('.about, .learning, .folder-con, .contact');
    
    // เช็คว่ามีหน้าต่างไหนเปิดอยู่บ้าง
    const openWindows = document.querySelectorAll('.window, .window2, .window3');
    let isAnyWinVisible = false;
    openWindows.forEach(w => { if(w.style.display === "flex") isAnyWinVisible = true; });

    sections.forEach(sec => {
        if (isAnyWinVisible && sec.classList.contains('folder-con')) {
            sec.style.opacity = "1";
            sec.style.pointerEvents = "auto";
            return;
        }

        const rect = sec.getBoundingClientRect();
        if (rect.top < windowHeight * 0.1) {
            let outProgress = Math.max(0, Math.min(1, (windowHeight * 0.1 - rect.top) / (rect.height * 0.6)));
            sec.style.opacity = 1 - outProgress;
            sec.style.pointerEvents = (1 - outProgress < 0.1) ? "none" : "auto";
        } else {
            sec.style.opacity = 1;
            sec.style.pointerEvents = "auto";
        }
    });
});

/* =========================================
   5. REMAINDER (Warning & Loops)
   ========================================= */
// ระบบ Warning ท้ายเว็บ (Logic เดิมที่ใช้งานได้)
let scrollAttempts = 0;
let canShowWarning = false;
let isWaiting = false;
let waitTimeout;

window.addEventListener('wheel', (e) => {
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20;
    const warningEl = document.getElementById('overlap-warning');
    if (isAtBottom && e.deltaY > 0) {
        if (!isWaiting && !canShowWarning) {
            isWaiting = true;
            waitTimeout = setTimeout(() => { canShowWarning = true; isWaiting = false; }, 1000); 
        }
        if (canShowWarning) {
            scrollAttempts++;
            warningEl.style.opacity = (scrollAttempts / 3);
            if (scrollAttempts >= 3) warningEl.classList.add('active');
        }
    } else if (e.deltaY < 0) {
        clearTimeout(waitTimeout);
        scrollAttempts = 0; canShowWarning = false;
        warningEl.style.opacity = 0; warningEl.classList.remove('active');
    }
}, { passive: false });

function animate() {
    currentScrollRotate += (targetScrollRotate - currentScrollRotate) * 0.08;
    updateCardTransform();
    requestAnimationFrame(animate);
}

// Initial Call
animate();
window.addEventListener("scroll", () => {
    targetScrollRotate = -Math.min(window.scrollY * 0.15, 40);
});