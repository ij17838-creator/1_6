// =====================================================================
// 화면 이동: 현재 화면 ID에 맞는 템플릿을 골라 <main id="app">에 그립니다.
// 화면 목록과 [이전으로] 연결은 모두 scenario.js 데이터에서 가져옵니다.
// =====================================================================

const SCREEN_RENDERERS = {
    choice: renderChoice,
    gameover: renderGameOver,
    success: renderSuccess,
    tracing: renderTracing
};

function getScreen(screenId) {
    return screenId === START_SCREEN ? { type: 'login' } : SCENARIO[screenId];
}

function goToScreen(screenId) {
    playChime("E5");

    // 존재하지 않는 화면이면 빈 화면 대신 처음 화면으로 이동
    if (!getScreen(screenId)) screenId = START_SCREEN;
    const screen = getScreen(screenId);

    state.previousScreen = state.currentScreen;
    state.currentScreen = screenId;

    const app = document.getElementById('app');
    app.innerHTML = screen.type === 'login' ? renderLogin() : SCREEN_RENDERERS[screen.type](screen);

    if (screen.type === 'tracing') startTracing(screen);

    const globalBackBtn = document.getElementById('globalBackBtn');
    if (globalBackBtn) globalBackBtn.classList.toggle('hidden', screenId === START_SCREEN);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    const screen = SCENARIO[state.currentScreen];
    goToScreen(screen ? (screen.back || screen.retry) : START_SCREEN);
}

// 선택지 처리: 바른 행동이면 다음 화면, 아니면 게임오버 화면
// (다음 화면이 성공 화면이면 팡파레, 아니면 짧은 효과음)
function choose(isGood) {
    const option = SCENARIO[state.currentScreen][isGood ? 'good' : 'bad'];
    if (!isGood) {
        playSadTone();
    } else if (SCENARIO[option.next].type === 'success') {
        playSuccessFanfare();
    } else {
        playChime("G5");
    }
    goToScreen(option.next);
}
