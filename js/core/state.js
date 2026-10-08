// =====================================================================
// 앱 전체가 함께 쓰는 상태
// =====================================================================

const state = {
    studentName: DEFAULT_STUDENT_NAME,
    currentScreen: START_SCREEN,
    previousScreen: START_SCREEN,
    completedWords: []   // 3단계에서 따라 쓴 글자 (성공 화면에 표시)
};
