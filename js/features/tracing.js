// =====================================================================
// 3단계: 한글 따라 쓰기 (캔버스 + 음성 읽기)
// =====================================================================

const BRUSH_COLORS = [
    { color: '#f59e0b', cls: 'bg-amber-500', label: '노란색' },
    { color: '#3b82f6', cls: 'bg-blue-500', label: '파란색' },
    { color: '#10b981', cls: 'bg-emerald-500', label: '초록색' },
    { color: '#ef4444', cls: 'bg-red-500', label: '빨간색' }
];

const tracing = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    hasDrawn: false,
    brushColor: BRUSH_COLORS[0].color,
    words: [],
    wordIndex: 0,
    nextScreen: null
};

function renderTracing(screen) {
    const brushButtons = BRUSH_COLORS.map(b =>
        `<button data-action="brush" data-color="${b.color}" class="w-14 h-14 rounded-full ${b.cls} border-4 border-white shadow-md" aria-label="${b.label}"></button>`
    ).join('');

    return `
        <div class="space-y-6">
            ${renderProgressBar('', screen.title, 'wordStepBadge')}
            ${renderQuestionBanner('💡 따라 써 볼까요?',
                '"<span id="currentWordTitle" class="text-amber-700"></span>"',
                '회색 글자 위를 손가락이나 마우스로 따라 써 보세요.')}

            <!-- Tracing Canvas -->
            <div class="bg-white border-4 border-amber-400 rounded-3xl shadow-inner overflow-hidden" style="height: 320px;">
                <canvas id="hangulCanvas" class="w-full h-full block touch-none cursor-crosshair"></canvas>
            </div>

            <!-- Tools: Brush Colors, Listen, Erase -->
            <div class="flex flex-wrap items-center justify-center gap-3">
                ${brushButtons}

                <button data-action="speak" class="bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-sky-950 border-4 border-sky-300 font-black text-xl px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 min-h-[56px]">
                    <i class="fa-solid fa-volume-high"></i>
                    <span>소리 듣기</span>
                </button>
                <button data-action="clear" class="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border-4 border-slate-300 font-black text-xl px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 min-h-[56px]">
                    <i class="fa-solid fa-eraser"></i>
                    <span>지우기</span>
                </button>
            </div>

            <!-- Submit Button -->
            <button data-action="submitTracing" class="w-full bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 text-emerald-950 font-black text-2xl sm:text-3xl py-5 rounded-2xl shadow-lg border-b-8 border-emerald-600 transition transform active:scale-95 flex items-center justify-center gap-3 min-h-[72px]">
                <i class="fa-solid fa-check text-2xl"></i>
                <span>다 썼어요!</span>
            </button>
        </div>`;
}

// 화면이 그려진 직후 router.js가 호출: 첫 글자부터 다시 시작
function startTracing(screen) {
    tracing.words = screen.words.slice();
    tracing.wordIndex = 0;
    tracing.nextScreen = screen.next;

    const canvas = document.getElementById('hangulCanvas');
    if (!canvas) return;
    tracing.canvas = canvas;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 300;
    tracing.ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });

    renderCanvasBackground();
    speakCurrentWord();
}

function renderCanvasBackground() {
    const { canvas, ctx } = tracing;
    if (!ctx || !canvas) return;

    tracing.hasDrawn = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const word = tracing.words[tracing.wordIndex] || tracing.words[0];
    const wordTitleEl = document.getElementById('currentWordTitle');
    const wordBadgeEl = document.getElementById('wordStepBadge');

    if (wordTitleEl) wordTitleEl.innerText = word;
    if (wordBadgeEl) wordBadgeEl.innerText = `${tracing.wordIndex + 1}번째 글자 (${tracing.wordIndex + 1}/${tracing.words.length})`;

    const w = canvas.width;
    const h = canvas.height;
    const letterCount = word.length;
    const boxWidth = Math.min(w / letterCount - 30, h - 40);

    for (let i = 0; i < letterCount; i++) {
        const centerX = (w / letterCount) * (i + 0.5);
        const centerY = h / 2;
        const left = centerX - boxWidth / 2;
        const top = centerY - boxWidth / 2;

        ctx.strokeStyle = '#fcd34d';
        ctx.lineWidth = 4;
        ctx.strokeRect(left, top, boxWidth, boxWidth);

        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(left, centerY);
        ctx.lineTo(left + boxWidth, centerY);
        ctx.moveTo(centerX, top);
        ctx.lineTo(centerX, top + boxWidth);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = `900 ${boxWidth * 0.68}px 'Noto Sans KR', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(word[i], centerX, centerY + 5);
    }
}

function setBrushColor(color) {
    tracing.brushColor = color;
    playChime("C5");
}

function clearTracingCanvas() {
    playChime("E4");
    renderCanvasBackground();
}

function getCanvasCoordinates(e) {
    const { canvas } = tracing;
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startDrawing(e) {
    const { canvas, ctx } = tracing;
    if (!canvas || !ctx) return;
    const coords = getCanvasCoordinates(e);

    tracing.isDrawing = true;
    tracing.hasDrawn = true;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = tracing.brushColor;
}

function draw(e) {
    if (!tracing.isDrawing || !tracing.ctx) return;
    const coords = getCanvasCoordinates(e);

    tracing.ctx.lineTo(coords.x, coords.y);
    tracing.ctx.stroke();
}

function stopDrawing() {
    tracing.isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
}

function handleTouchMove(e) {
    e.preventDefault();
    draw(e);
}

function speakCurrentWord() {
    const word = tracing.words[tracing.wordIndex];
    if ('speechSynthesis' in window && word) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.75;
        window.speechSynthesis.speak(utterance);
    } else {
        playChime("G5");
    }
}

function submitTracingWord() {
    if (!tracing.hasDrawn) {
        playSadTone();
        showNoticeModal({
            emoji: "✏️",
            title: "글자를 연습해보세요!",
            desc: "손가락이나 마우스로 글자를 예쁘게 따라 쓴 후에 [다 썼어요!] 버튼을 눌러주세요."
        });
        return;
    }

    playSuccessFanfare();

    if (tracing.wordIndex < tracing.words.length - 1) {
        tracing.wordIndex++;
        renderCanvasBackground();
        speakCurrentWord();
    } else {
        state.completedWords = tracing.words.slice();
        goToScreen(tracing.nextScreen);
    }
}
