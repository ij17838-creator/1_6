// =====================================================================
// 학생 이름 저장·불러오기 (localStorage)
// 사생활 보호 모드 등에서 localStorage를 쓸 수 없어도 앱은 동작합니다.
// =====================================================================

const STORAGE_KEY_NAME = 'elementary_student_name';

function loadStudentName() {
    try {
        return localStorage.getItem(STORAGE_KEY_NAME);
    } catch (e) {
        return null;
    }
}

function saveStudentName(name) {
    try {
        localStorage.setItem(STORAGE_KEY_NAME, name);
    } catch (e) {
        console.log("Name save error:", e);
    }
}
