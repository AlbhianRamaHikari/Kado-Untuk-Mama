document.addEventListener('DOMContentLoaded', () => {
    // Otomatis Mengisi Tanggal & Hari Berdasarkan Perangkat secara Live (Bahasa Indonesia)
    const dateElement = document.getElementById('jb-current-date');
    if (dateElement) {
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        };
        const todayStr = new Date().toLocaleDateString('id-ID', options);
        dateElement.textContent = todayStr;
    }
    const playPopSound = () => {
        try {
            const ctx = new(window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300 + Math.random() * 200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    };
    const createHeartParticle = (x, y) => {
        const heart = document.createElement('span');
        heart.innerHTML = '♥';
        heart.style.cssText = `
position: fixed;
left: ${x}px;
top: ${y}px;
color: #e8336d;
font-size: ${16 + Math.random() * 16}px;
pointer-events: none;
z-index: 9999;
transform: translate(-50%, -50%);
animation: jbSplash 800ms ease-out forwards;
--dx: ${(Math.random() - 0.5) * 60}px;
--dy: ${-30 - Math.random() * 50}px;
`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 800);
    };
    let lastX = 0;
    let lastY = 0;
    let throttleTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - throttleTime > 80) {
            const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            if (distance > 25) {
                lastX = e.clientX;
                lastY = e.clientY;
                throttleTime = now;
                const cursorHeart = document.createElement('span');
                cursorHeart.innerHTML = '♥';
                cursorHeart.style.cssText = `
position: fixed;
left: ${e.clientX}px;
top: ${e.clientY}px;
color: #e8336d;
font-size: ${12 + Math.random() * 14}px;
pointer-events: none;
z-index: 99999;
transform: translate(-50%, -50%);
animation: jbSplash 700ms ease-out forwards;
--dx: ${(Math.random() - 0.5) * 50}px;
--dy: ${-20 - Math.random() * 40}px;
`;
                document.body.appendChild(cursorHeart);
                setTimeout(() => cursorHeart.remove(), 700);
            }
        }
    });
    const envContainer = document.getElementById('jb-envelope-wrapper');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    if (envContainer) {
        envContainer.addEventListener('mousedown', (e) => {
            if (isOpen) return;
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            envContainer.style.transition = 'none';
            envContainer.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging || isOpen) return;
            currentX = e.clientX - startX;
            currentY = e.clientY - startY;
            envContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            if (envContainer) {
                envContainer.style.cursor = 'grab';
                envContainer.style.transition = 'transform 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                currentX = 0;
                currentY = 0;
                envContainer.style.transform = `translate(0px, 0px)`;
            }
        });
    }
    const triggerConfetti = () => {
        const colors = ['#e8336d', '#ff7a9e', '#ffd1dc', '#ffffff', '#f59e0b', '#ff2e63'];
        for (let i = 0; i < 80; i++) {
            const p = document.createElement('div');
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const size = 5 + Math.random() * 9;
            const isHeart = Math.random() > 0.65;
            const angle = Math.random() * Math.PI * 2;
            const distance = 120 + Math.random() * 380;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const duration = 1000 + Math.random() * 500;
            if (isHeart) {
                p.innerHTML = '♥';
                p.style.cssText = `
position: fixed;
left: 50vw;
top: 50vh;
font-size: ${10 + Math.random() * 12}px;
color: ${randomColor};
pointer-events: none;
z-index: 9999;
opacity: 1;
transform: translate(-50%, -50%) scale(0.2);
animation: jbEnvelopeBurst ${duration}ms cubic-bezier(0.12, 0.8, 0.25, 1) forwards;
--dx: ${dx}px;
--dy: ${dy}px;
--rot: ${(Math.random() - 0.5) * 540}deg;
`;
            } else {
                p.style.cssText = `
position: fixed;
left: 50vw;
top: 50vh;
width: ${size}px;
height: ${size}px;
background-color: ${randomColor};
border-radius: ${Math.random() > 0.4 ? '50%' : '2px'};
pointer-events: none;
z-index: 9999;
opacity: 1;
transform: translate(-50%, -50%) scale(0.2);
animation: jbEnvelopeBurst ${duration}ms cubic-bezier(0.12, 0.8, 0.25, 1) forwards;
--dx: ${dx}px;
--dy: ${dy}px;
--rot: ${(Math.random() - 0.5) * 540}deg;
`;
            }
            document.body.appendChild(p);
            setTimeout(() => p.remove(), duration);
        }
    };
    const envelope = document.getElementById('jb-envelope');
    const letterSection = document.getElementById('jb-letter-section');
    const envelopeHint = document.getElementById('jb-envelope-hint');
    let isOpen = false;
    const openEnvelope = () => {
        if (isOpen) return;
        isOpen = true;
        playPopSound();
        envelope.classList.add('envelope-open');
        envelopeHint.style.opacity = '0';
        setTimeout(() => {
            triggerConfetti();
            if (envContainer) {
                envContainer.style.opacity = '0';
                envContainer.style.display = 'none';
            }
            letterSection.style.display = 'block';
            letterSection.style.opacity = '1';
        }, 400);
    };
    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
    });
    const bwGrid = document.getElementById('jb-bw-grid');
    const poppedCountElem = document.getElementById('jb-popped-count');
    const progressBar = document.getElementById('jb-progress-bar');
    const TOTAL_BUBBLES = 25;
    let poppedCount = 0;
    const renderBubbles = () => {
        bwGrid.innerHTML = '';
        poppedCount = 0;
        updateProgress();
        for (let i = 0; i < TOTAL_BUBBLES; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', 'bubble');
            btn.style.cssText = `
aspect-ratio: 1 / 1;
border-radius: 50%;
border: none;
cursor: pointer;
background: radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.55) 18%, rgba(255, 220, 232, 0.7) 45%, rgba(232, 51, 109, 0.45) 100%);
box-shadow: rgba(232, 51, 109, 0.35) 0px -4px 8px inset, rgba(255, 255, 255, 0.85) 0px 3px 6px inset, rgba(232, 51, 109, 0.35) 0px 4px 10px -2px;
padding: 0px;
display: grid;
place-items: center;
color: transparent;
font: 800 13px/1 "DM Serif Display", serif;
position: relative;
overflow: visible;
transition: transform 150ms ease, background 200ms ease;
`;
            const shine = document.createElement('span');
            shine.setAttribute('aria-hidden', 'true');
            shine.style.cssText = `
position: absolute; top: 14%; left: 22%; width: 22%; height: 14%;
background: rgba(255, 255, 255, 0.85); border-radius: 50%;
filter: blur(0.3px); pointer-events: none;
`;
            btn.appendChild(shine);
            const popBubble = (e) => {
                if (btn.classList.contains('popped')) return;
                btn.classList.add('popped', 'jb-bubble-popped');
                playPopSound();
                const rect = btn.getBoundingClientRect();
                createHeartParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
                btn.style.background = 'rgba(232, 51, 109, 0.12)';
                btn.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                btn.style.color = '#e8336d';
                const note = document.createElement('span');
                note.innerHTML = 'I Love You';
                note.style.cssText = 'font-size: 8px; font-weight: 700; text-align: center; line-height: 1.1; padding: 0 2px;';
                btn.appendChild(note);
                poppedCount++;
                updateProgress();
                if (poppedCount === TOTAL_BUBBLES) {
                    setTimeout(triggerConfetti, 200);
                }
            };
            btn.addEventListener('click', popBubble);
            bwGrid.appendChild(btn);
        }
    };
    const updateProgress = () => {
        poppedCountElem.textContent = poppedCount;
        const percentage = (poppedCount / TOTAL_BUBBLES) * 100;
        progressBar.style.width = `${percentage}%`;
        const finalMessage = document.getElementById('jb-final-message');
        if (finalMessage) {
            if (poppedCount === TOTAL_BUBBLES) {
                finalMessage.style.display = 'block';
            } else {
                finalMessage.style.display = 'none';
            }
        }
    };
    document.getElementById('jb-reset-btn').addEventListener('click', () => {
        renderBubbles();
        playPopSound();
    });
    document.getElementById('jb-copy-btn').addEventListener('click', function () {
        const letterText = `Just because.
Buat Mama,
Lewat tulisan ini, aku cuma ingin bilang betapa bersyukurnya aku punya Mama. Terima kasih ya sudah jadi tempat paling nyaman untuk pulang, selalu sabar, dan mendukung setiap langkahku. Kehadiran Mama selalu bikin hari-hariku jadi lebih hangat dan penuh semangat.
Aku sangat menghargai setiap obrolan santai kita, tawa kita, dan semua pengorbanan Mama yang nggak pernah ada habisnya—bahkan di saat-saat sibukku. Mama selalu punya cara hebat buat bikin hal-hal berat terasa jauh lebih ringan.
Aku beruntung banget bisa jadi anak Mama. Terima kasih sudah merawat dan mendidikku dengan penuh cinta. Tetap jadi Mama yang hebat, sehat, dan bahagia terus ya, Ma.
Dari,
— Albhian Rama Hikari`;
        navigator.clipboard.writeText(letterText).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Tersalin ♥';
            this.style.background = '#e8336d';
            this.style.color = 'white';
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = 'white';
                this.style.color = '#1a1225';
            }, 10000);
        });
    });
    document.getElementById('jb-scroll-to-bw').addEventListener('click', () => {
        document.getElementById('jb-bw-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    renderBubbles();
});