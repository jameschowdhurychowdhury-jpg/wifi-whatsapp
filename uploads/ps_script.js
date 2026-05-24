const introMessages = ["Hey...", "I made something for you 💙", "Just a few questions...", "Answer honestly 😊"];
let introIndex = 0, charIndex = 0, step = 0;

// ADD YOUR USERNAME HERE
const IG_LINK = "https://ig.me/m/ame1432025";

document.getElementById("startScreen").onclick = () => {
    document.getElementById("startScreen").classList.add('hidden');
    document.getElementById("intro").classList.remove('hidden');
    const music = document.getElementById("bgMusic");
    music.play().catch(e => console.log("Audio needs user interaction"));
    typeIntro();
};

function typeIntro() {
    const text = document.getElementById("introText");
    if (charIndex < introMessages[introIndex].length) {
        text.textContent += introMessages[introIndex][charIndex++];
        setTimeout(typeIntro, 50);
    } else {
        setTimeout(() => {
            text.textContent = ""; charIndex = 0; introIndex++;
            introIndex < introMessages.length ? typeIntro() : startMainSite();
        }, 1000);
    }
}

function startMainSite() {
    document.getElementById("intro").classList.add('hidden');
    document.getElementById("mainContent").classList.remove('hidden');
    loadStep();
}

function loadStep() {
    const q = document.getElementById("question"), opt = document.getElementById("options");
    opt.innerHTML = "";
    const steps = [
        { q: "Do you want to talk with me? 😊", img: "images/hi.png", opts: [["Yes 💙", 1], ["Maybe 🤔", 1]] },
        { q: "Can I tell you something special? 💫", img: "images/tk.jpg", opts: [["Okay 😄", 2], ["Tell me 😌", 2]] },
        { q: "I really enjoy talking to you 💖", img: "images/tlk.jpeg", opts: [["Aww 😊", 3], ["That's sweet 💕", 3]] },
        { q: "I think I like you... a lot 💙", img: "images/shy.jpeg", opts: [["Really? 😳", 4], ["I know 😏", 4]] },
        { q: "Will you be mine? 💍", img: "images/yn.jpeg", opts: [["Yes 💙", 5], ["Let me think 😅", 6, true], ["Never! 😤", 7]] },
        { q: "You made me the happiest! 😍", img: "images/yes.jpeg", link: IG_LINK },
        { q: "I'll wait for you forever 💙", img: "images/photo7.jpg", link: IG_LINK },
        { q: "Even if it's no, you're still special, let atleast talk 💙", img: "images/no.jpeg", link: IG_LINK }
    ];

    const current = steps[step];
    q.textContent = current.q;
    document.getElementById("mainImage").src = current.img;

    if (current.link) {
        opt.innerHTML = `<a href="${current.link}" target="_blank"><button>Click here to talk with me on Instagram    ,   "but this is devloper james insta"💬</button></a>`;
    } else {
        current.opts.forEach(o => {
            const btn = document.createElement("button");
            btn.textContent = o[0];
            if (o[2]) {
                btn.className = "run-away";
                const move = () => {
                    const maxX = window.innerWidth - btn.offsetWidth - 20;
                    const maxY = window.innerHeight - btn.offsetHeight - 20;
                    btn.style.left = Math.max(10, Math.random() * maxX) + "px";
                    btn.style.top = Math.max(10, Math.random() * maxY) + "px";
                };
                btn.onmouseover = btn.ontouchstart = move;
            } else {
                btn.onclick = () => { step = o[1]; loadStep(); };
            }
            opt.appendChild(btn);
        });
    }
}