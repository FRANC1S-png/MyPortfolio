const chatWindow = document.getElementById('chatWindow');
const chatHeader = document.getElementById('chatHeader');
let offsetX = 0, offsetY = 0, isDragging = false;

// -----------------------------
// Dragging System
// -----------------------------
chatHeader.addEventListener("mousedown", (e) => {
    isDragging = true;

    // แปลง transform ตำแหน่งจริงเมื่อเริ่มลาก
    const rect = chatWindow.getBoundingClientRect();
    chatWindow.style.transform = "none";
    chatWindow.style.left = rect.left + "px";
    chatWindow.style.top = rect.top + "px";

    offsetX = e.clientX - chatWindow.offsetLeft;
    offsetY = e.clientY - chatWindow.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    chatWindow.style.left = (e.clientX - offsetX) + "px";
    chatWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// -----------------------------
// Chat System
// -----------------------------
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const closeBtn = document.getElementById('close');
const chatBody = document.getElementById('chatBody');
const composeEl = document.getElementById('compose');

closeBtn.addEventListener('click', () => {
    chatBody.classList.toggle('hidden');
});

let chatHistory = [];

function render() {
    messagesEl.innerHTML = '';
    chatHistory.forEach(m => {
        const div = document.createElement('div');
        div.className = 'msg ' + m.role;

        if (m.type === "image") {
            const img = document.createElement('img');
            img.src = m.src;
            img.style.maxWidth = "150px";
            img.style.borderRadius = "10px";
            div.appendChild(img);
        } 
        else {
            div.textContent = m.text;
        }

        messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
}


//type welcome
function showWelcomeType() {
    const scr = document.getElementById("welcomeScreen");
    scr.innerHTML = ""; //clear

    let text = "WELCOME";
    let i = 0;

    const textSpan = document.createElement("span");
    const cursorSpan = document.createElement("span");
    cursorSpan.textContent = "_";
    cursorSpan.classList.add("cursor");

    scr.appendChild(textSpan);
    scr.appendChild(cursorSpan);

    let typer = setInterval(() => {
        textSpan.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typer);
            setTimeout(() => {
                window.location.href = "resume.html";
            }, 700);
        }
    }, 120);
}

function send() {
    const text = inputEl.value.trim();
    if (!text) return;

    // user message
    chatHistory.push({ role: 'other', text });
    render();
    inputEl.value = '';

    setTimeout(() => {
        chatHistory.push({ role: 'me', text: 'Welcome'});
        render();

        // ⭐ Reset ไปกลางจอ "ด้วย px" ไม่ใช้ transform
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        chatWindow.style.left = (winW / 2 - 160) + "px";
        chatWindow.style.top = (winH / 2 - 210) + "px";
        chatWindow.style.width = "320px";
        chatWindow.style.height = "420px";

        // ⭐ ให้ browser วาดก่อนแล้วขยายเต็มจอ
        requestAnimationFrame(() => {
            chatWindow.classList.add("expanded");

        });

        // หลัง expand
        setTimeout(() => {
            // ⭐ โชว์ Welcome เต็มจอ
            const welcome = document.getElementById("welcomeScreen");
            welcome.classList.add("show");
        }, 800);

        setTimeout(() => {
            showWelcomeType();
        }, 600);


    }, 1000);
}



sendBtn.addEventListener('click', send);
inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
    }
});


/* =========================
   INTERACTIVE DOTS BACKGROUND
========================= */
const bgCanvas = document.getElementById('bgDotsCanvas');
const bgCtx = bgCanvas.getContext('2d');

let bgDots = [];
const bgMouse = { x: null, y: null, radius: 150 }; // รัศมีวงกว้างขึ้นหน่อย

window.addEventListener('mousemove', (e) => {
    bgMouse.x = e.clientX;
    bgMouse.y = e.clientY;
});

class BgDot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 1.5;
        this.density = (Math.random() * 20) + 1;
    }

    draw() {
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.closePath();
        bgCtx.fill();
    }

    update() {
        let dx = bgMouse.x - this.x;
        let dy = bgMouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bgMouse.radius) {
            let force = (bgMouse.radius - distance) / bgMouse.radius;
            let directionX = (dx / distance) * force * this.density;
            let directionY = (dy / distance) * force * this.density;
            
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                this.x -= (this.x - this.baseX) / 15;
            }
            if (this.y !== this.baseY) {
                this.y -= (this.y - this.baseY) / 15;
            }
        }
    }
}

function initBgDots() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    bgDots = [];
    
    // ปรับ Gap ให้กว้างขึ้นเพื่อไม่ให้จุดเยอะเกินจนหน่วงจอ (25-40 กำลังสวย)
    const gap = 35; 
    for (let y = 0; y < bgCanvas.height; y += gap) {
        for (let x = 0; x < bgCanvas.width; x += gap) {
            bgDots.push(new BgDot(x, y));
        }
    }
}

function connectDots() {
    for (let a = 0; a < bgDots.length; a++) {
        for (let b = a; b < bgDots.length; b++) {
            let dx = bgDots[a].x - bgDots[b].x;
            let dy = bgDots[a].y - bgDots[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // วาดเส้นเชื่อมถ้าจุดอยู่ใกล้กัน (เฉพาะจุดที่ขยับจากตำแหน่งเดิม)
            if (distance < 45) {
                let opacity = 1 - (distance / 45);
                bgCtx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                bgCtx.lineWidth = 1;
                bgCtx.beginPath();
                bgCtx.moveTo(bgDots[a].x, bgDots[a].y);
                bgCtx.lineTo(bgDots[b].x, bgDots[b].y);
                bgCtx.stroke();
            }
        }
    }
}

function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (let i = 0; i < bgDots.length; i++) {
        bgDots[i].update();
        bgDots[i].draw();
    }
    connectDots(); // วาดเส้นเชื่อม
    requestAnimationFrame(animateBg);
}

window.addEventListener('resize', initBgDots);
initBgDots();
animateBg();