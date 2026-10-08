// =====================================================================
// 알림 모달
// =====================================================================

function showNoticeModal({ emoji, title, desc }) {
    document.getElementById('modalEmoji').innerText = emoji;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('noticeModal').classList.remove('hidden');
}

function closeNoticeModal() {
    playChime("C5");
    document.getElementById('noticeModal').classList.add('hidden');
}
