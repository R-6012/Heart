document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('heart-container');

    // ----------------------------------------------------
    // 第一阶段：画心形 (变得非常慢且优雅，每个弹窗都写温馨提醒)
    // ----------------------------------------------------
    let t = 0;
    const step = 0.032; // 稍微放宽一点点步长
    const maxT = 2 * Math.PI;

    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2 - 20;

    let minDim = Math.min(window.innerWidth, window.innerHeight);
    let scale = minDim / 40;

    window.addEventListener('resize', () => {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2 - 20;
        minDim = Math.min(window.innerWidth, window.innerHeight);
        scale = minDim / 40;
    });

    const heartTexts = [
        "天天开心", "好好吃饭", "注意休息", "早点睡觉", "多喝热水", "不要熬夜", "开心快乐", "保持好心情", "我想你了", "好好爱自己"
    ];

    const drawInterval = setInterval(() => {
        if (t > maxT) {
            clearInterval(drawInterval);
            setTimeout(phase2Disappear, 2500); // 画完停留得更久一点
            return;
        }

        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        const popupX = centerX + x * scale;
        const popupY = centerY - y * scale;

        createHeartPopup(popupX, popupY);
        t += step;
    }, 75); // ！！！爱心画得非常慢，75ms 是之前 28ms 的近三倍，足够看清每一次弹出

    function createHeartPopup(x, y) {
        const win = document.createElement('div');
        win.className = 'heart-popup';
        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
        const randomText = heartTexts[Math.floor(Math.random() * heartTexts.length)];

        // 每个弹窗标题改成“温馨提醒”，并且身体有短文字
        win.innerHTML = `
            <div class="header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
                <div class="title">温馨提醒</div>
            </div>
            <div class="body">${randomText}</div>
        `;
        container.appendChild(win);
    }

    // ----------------------------------------------------
    // 第二阶段：心形散去消失
    // ----------------------------------------------------
    function phase2Disappear() {
        const hearts = document.querySelectorAll('.heart-popup');
        hearts.forEach((win, index) => {
            const dx = (Math.random() - 0.5) * window.innerWidth * 1.5;
            const dy = (Math.random() - 0.5) * window.innerHeight * 1.5;
            const rot = (Math.random() - 0.5) * 180;
            win.style.setProperty('--dx', `${dx}px`);
            win.style.setProperty('--dy', `${dy}px`);
            win.style.setProperty('--rot', `${rot}deg`);

            setTimeout(() => {
                win.classList.add('disappear');
            }, Math.random() * 800);
        });

        setTimeout(phase3Messages, 1500);
    }

    // ----------------------------------------------------
    // 第三阶段：随机位置！并且铺满全屏！
    // ----------------------------------------------------

    const messages = [
        { title: "温馨提醒", content: "<p>天天开心。</p>" },
        { title: "温馨提醒", content: "<p>好好吃饭。</p>" },
        { title: "温馨提醒", content: "<p>注意休息。</p>" },
        { title: "温馨提醒", content: "<p>早点睡觉。</p>" },
        { title: "温馨提醒", content: "<p>多喝热水。</p>" },
        { title: "温馨提醒", content: "<p>不要熬夜。</p>" },
        { title: "温馨提醒", content: "<p>我想你了。</p>" },
        { title: "温馨提醒", content: "<p>好好爱自己。</p>" },
        { title: "温馨提醒", content: "<p>保持好心情。</p>" }
    ];

    function phase3Messages() {
        const isMobile = window.innerWidth <= 768;
        const w = isMobile ? 160 : 300;
        const h = isMobile ? 120 : 160;

        let count = 0;
        const maxPopups = 100; // 大量子弹窗连续弹出，足够带来填满屏幕的视觉震撼

        const msgInterval = setInterval(() => {
            if (count >= maxPopups) {
                clearInterval(msgInterval);
                return;
            }

            // 【完全随机】生成坐标！不再是整齐的网格
            // 并稍微限制一下边距，防止超出屏幕完全隐藏
            const x = w / 2 + Math.random() * (window.innerWidth - w);
            const y = h / 2 + Math.random() * (window.innerHeight - h);

            const data = messages[count % messages.length];

            createMessagePopup(x, y, w, h, data);
            count++;
        }, 120); // 您满意的旧速度，原封不动！
    }

    let highestZIndex = 10;
    function createMessagePopup(x, y, w, h, data) {
        const win = document.createElement('div');
        win.className = 'message-popup';
        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
        win.style.width = `${w}px`;
        win.style.height = `${h}px`;

        highestZIndex++;
        win.style.zIndex = highestZIndex;

        win.innerHTML = `
            <div class="popup-header">
                <div class="dot-container">
                    <div class="dot red"></div>
                    <div class="dot yellow"></div>
                    <div class="dot green"></div>
                </div>
                <div class="popup-title">${data.title}</div>
            </div>
            <div class="popup-body">
                ${data.content}
            </div>
        `;
        document.body.appendChild(win);
        makeDraggable(win);
    }

    // 拖拽逻辑不变
    function makeDraggable(el) {
        const header = el.querySelector('.popup-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseFloat(el.style.left) || e.clientX;
            initialTop = parseFloat(el.style.top) || e.clientY;

            highestZIndex++;
            el.style.zIndex = highestZIndex;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('mouseleave', () => { isDragging = false; });
    }
});
