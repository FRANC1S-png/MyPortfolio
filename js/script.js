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
