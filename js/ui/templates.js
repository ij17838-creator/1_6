// =====================================================================
// 화면 템플릿: scenario.js 데이터를 받아 화면 HTML을 만듭니다.
// 버튼은 data-action 속성으로 동작을 지정합니다 (main.js에서 처리).
// =====================================================================

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// {name}, {words} 자리에 학생 이름과 따라 쓴 글자를 넣습니다.
function fillText(text, nameClass) {
    const words = state.completedWords.map(w => `'${w}'`).join(', ');
    return text
        .replace(/\{name\}/g, `<span class="${nameClass}">${escapeHtml(state.studentName)}</span>`)
        .replace(/\{words\}/g, `<span class="text-amber-700 font-black">${escapeHtml(words)}</span>`);
}

// 단계 진행 표시줄 (badgeId를 주면 tracing.js가 배지 글자를 바꿀 수 있음)
function renderProgressBar(badge, title, badgeId) {
    const idAttr = badgeId ? ` id="${badgeId}"` : '';
    return `
        <div class="bg-amber-100 border-3 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-3">
                <span${idAttr} class="bg-amber-500 text-white font-black text-xl px-4 py-1.5 rounded-xl">${badge}</span>
                <span class="text-xl sm:text-2xl font-black text-amber-950 font-gaegu">${title}</span>
            </div>
            <div class="text-lg font-black text-amber-800 hidden sm:block">
                학생: <span class="text-amber-950 underline decoration-amber-400">${escapeHtml(state.studentName)}</span>
            </div>
        </div>`;
}

// 질문 배너
function renderQuestionBanner(label, question, prompt) {
    return `
        <div class="bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-3">
            <div class="inline-flex items-center gap-2 bg-amber-200 text-amber-950 text-lg font-black px-5 py-1.5 rounded-full">
                <span>${label}</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-black text-slate-800 leading-snug">
                ${question}
            </h2>
            <p class="text-xl sm:text-2xl text-amber-900 font-extrabold">
                ${prompt}
            </p>
        </div>`;
}

// 상황 그림: emoji(큰 이모지 하나) 또는 art(직접 만든 HTML)
function renderScene(scene) {
    const bg = scene.bg || 'from-amber-100 to-amber-200';
    const art = scene.art || `<div class="text-8xl sm:text-9xl ${scene.anim || ''} my-2">${scene.emoji}</div>`;
    return `
        <div class="bg-gradient-to-b ${bg} border-4 border-amber-400 rounded-3xl p-6 shadow-inner flex flex-col items-center justify-center min-h-[200px] text-center relative overflow-hidden">
            ${art}
            <p class="text-lg sm:text-xl font-black text-amber-950 bg-white/90 px-6 py-2 rounded-2xl border-2 border-amber-300 shadow-xs mt-2">
                ${scene.caption}
            </p>
        </div>`;
}

function renderChoiceButton(option, isGood) {
    const style = isGood
        ? { btn: 'bg-emerald-400 hover:bg-emerald-500 active:bg-emerald-600 text-emerald-950 border-b-8 border-emerald-600 shadow-xl',
            sub: 'text-emerald-900 bg-emerald-100' }
        : { btn: 'bg-rose-100 hover:bg-rose-200 active:bg-rose-300 text-rose-950 border-4 border-rose-300 border-b-8 border-rose-400 shadow-md',
            sub: 'text-rose-800 bg-white' };
    return `
        <button data-action="choose" data-good="${isGood}" class="${style.btn} rounded-3xl p-6 sm:p-8 transition transform active:scale-95 flex flex-col items-center gap-3 text-center min-h-[160px] justify-center">
            <span class="text-5xl">${option.emoji}</span>
            <span class="text-2xl sm:text-3xl font-black">${option.label}</span>
            <span class="text-base sm:text-lg font-bold ${style.sub} px-4 py-1 rounded-full">${option.sub}</span>
        </button>`;
}

// 선택 화면: 진행 표시줄 + 질문 + 그림 + 선택지 2개
function renderChoice(screen) {
    return `
        <div class="space-y-6">
            ${renderProgressBar(screen.badge, screen.title)}
            ${renderQuestionBanner('💡 어떻게 할까요?', screen.question, screen.prompt)}
            ${renderScene(screen.scene)}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                ${renderChoiceButton(screen.good, true)}
                ${renderChoiceButton(screen.bad, false)}
            </div>
        </div>`;
}

// 게임오버 화면: 다시 도전 / 처음으로
function renderGameOver(screen) {
    return `
        <div class="space-y-6">
            <div class="bg-rose-50 border-4 border-rose-300 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
                <div class="w-32 h-32 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-7xl mx-auto border-4 border-rose-400 shadow-inner animate-bounce">
                    ${screen.emoji}
                </div>

                <div class="space-y-3">
                    <span class="bg-rose-500 text-white font-black text-lg px-5 py-2 rounded-full inline-block">
                        ${screen.tag}
                    </span>
                    <h2 class="text-3xl sm:text-5xl font-black text-rose-950 font-gaegu tracking-wide">
                        ${screen.title}
                    </h2>
                    <p class="text-xl sm:text-2xl font-bold text-slate-700 max-w-xl mx-auto leading-relaxed">
                        ${fillText(screen.desc, 'text-rose-900 font-black')}
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button data-action="go" data-target="${screen.retry}" class="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black text-2xl px-8 py-5 rounded-2xl border-b-6 border-amber-600 shadow-lg flex items-center justify-center gap-3 min-h-[68px]">
                        <i class="fa-solid fa-rotate-left text-2xl"></i>
                        <span>${screen.retryLabel}</span>
                    </button>

                    <button data-action="go" data-target="${START_SCREEN}" class="w-full sm:w-auto bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xl px-6 py-5 rounded-2xl border-2 border-slate-300 flex items-center justify-center gap-2 min-h-[68px]">
                        <i class="fa-solid fa-house text-xl"></i>
                        <span>처음으로 돌아가기</span>
                    </button>
                </div>
            </div>
        </div>`;
}

// 성공 화면: 칭찬 + 말풍선 + 다음 단계 버튼
function renderSuccess(screen) {
    const nextButtonInner = screen.final
        ? `<i class="fa-solid fa-house text-2xl"></i><span>${screen.nextLabel}</span>`
        : `<span>${screen.nextLabel}</span><i class="fa-solid fa-arrow-right text-2xl"></i>`;
    return `
        <div class="space-y-6">
            <div class="bg-emerald-50 border-4 border-emerald-300 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6">
                <div class="w-36 h-36 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center text-8xl mx-auto border-4 border-emerald-400 shadow-md animate-pulse-gentle">
                    ${screen.emoji}
                </div>

                <div class="space-y-3">
                    <span class="bg-emerald-500 text-white font-black text-xl px-6 py-2 rounded-full inline-block">
                        ${screen.tag}
                    </span>
                    <h2 class="text-3xl sm:text-5xl font-black text-emerald-950 font-gaegu tracking-wide">
                        ${screen.title}
                    </h2>
                    <p class="text-xl sm:text-2xl font-bold text-slate-700 max-w-2xl mx-auto leading-relaxed">
                        ${fillText(screen.desc, 'text-emerald-900 font-black')}
                    </p>
                </div>

                <div class="bg-white border-3 border-emerald-300 rounded-2xl p-5 max-w-lg mx-auto flex items-center gap-4 text-left shadow-sm">
                    <div class="text-5xl flex-shrink-0">${screen.speaker.emoji}</div>
                    <div>
                        <div class="font-black text-emerald-900 text-lg">${screen.speaker.name}</div>
                        <div class="text-slate-800 font-bold text-lg sm:text-xl">
                            ${fillText(screen.speaker.line, 'text-amber-700 font-black')}
                        </div>
                    </div>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button data-action="go" data-target="${screen.next}" class="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black text-2xl px-10 py-5 rounded-2xl border-b-6 border-amber-600 shadow-xl flex items-center justify-center gap-3 animate-pulse-gentle min-h-[68px]">
                        ${nextButtonInner}
                    </button>
                </div>
            </div>
        </div>`;
}
