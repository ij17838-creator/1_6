// =====================================================================
// 시작점: 저장된 이름 불러오기 → 처음 화면 그리기 → 버튼 동작 연결
// =====================================================================

// data-action 값에 따라 실행할 동작
const ACTIONS = {
    start: () => startSchoolDay(),
    choose: (el) => choose(el.dataset.good === 'true'),
    go: (el) => goToScreen(el.dataset.target),
    back: () => goBack(),
    toggleAudio: () => toggleAudio(),
    brush: (el) => setBrushColor(el.dataset.color),
    speak: () => speakCurrentWord(),
    clear: () => clearTracingCanvas(),
    submitTracing: () => submitTracingWord(),
    closeModal: () => closeNoticeModal()
};

document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = ACTIONS[el.dataset.action];
    if (action) action(el);
});

window.addEventListener('resize', () => {
    if (SCENARIO[state.currentScreen] && SCENARIO[state.currentScreen].type === 'tracing') {
        renderCanvasBackground();
    }
});

// index.html 맨 아래에서 불러오므로 이 시점에 화면 요소가 이미 있습니다.
const savedName = loadStudentName();
if (savedName) state.studentName = savedName;
document.getElementById('app').innerHTML = renderLogin();
