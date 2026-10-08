// =====================================================================
// 로그인(시작) 화면: 이름 입력 + 오늘 할 일 목록
// =====================================================================

function renderStageRoadmap() {
    return STAGES.map((stage, i) => {
        const isFirst = i === 0;
        const box = isFirst ? 'bg-amber-200 border-amber-400' : 'bg-white border-amber-200';
        const num = isFirst ? 'bg-amber-500 text-white' : 'bg-amber-300 text-amber-950';
        const text = isFirst ? 'text-amber-950' : 'text-slate-800';
        return `
            <div class="${box} border-3 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
                <div class="w-10 h-10 rounded-xl ${num} font-black flex items-center justify-center text-xl flex-shrink-0">${stage.num}</div>
                <div class="text-lg font-black ${text}">${stage.label}</div>
            </div>`;
    }).join('');
}

function renderLogin() {
    return `
        <div class="space-y-6">
            <!-- Friendly Mascot Greeting -->
            <div class="bg-white border-4 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center gap-6">
                <div class="w-24 h-24 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-amber-400 shadow-inner text-5xl">
                    🐥
                </div>
                <div class="text-center sm:text-left">
                    <div class="inline-block bg-amber-400 text-amber-950 text-base font-black px-4 py-1.5 rounded-full mb-2">
                        선생님과 약속해요
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black text-slate-800">
                        "반가워요! 이름을 적고 학교로 가볼까요?"
                    </h2>
                    <p class="text-base sm:text-lg text-slate-600 mt-1 font-bold">
                        내 이름을 적은 후, 아래 [학교로 출발!] 버튼을 눌러주세요.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
                <!-- Left: Student Name Form -->
                <section class="md:col-span-6 bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[380px]">
                    <div class="space-y-6">
                        <div class="border-b-4 border-amber-100 pb-4">
                            <h3 class="text-2xl sm:text-3xl font-black font-gaegu text-amber-900 flex items-center gap-2">
                                <span class="w-10 h-10 bg-amber-400 text-amber-950 rounded-2xl flex items-center justify-center text-xl font-black">1</span>
                                내 이름 적기
                            </h3>
                        </div>

                        <div class="pt-2">
                            <label for="studentName" class="block text-lg sm:text-xl font-black text-slate-700 mb-3 flex items-center gap-2">
                                <i class="fa-solid fa-pen-to-square text-amber-500 text-2xl"></i>
                                이름을 입력하세요
                            </label>
                            <input type="text" id="studentName" placeholder="예: ${DEFAULT_STUDENT_NAME}" value="${escapeHtml(state.studentName)}" maxlength="6"
                                   class="w-full bg-amber-50/60 border-4 border-amber-300 rounded-2xl px-5 py-4 text-2xl sm:text-3xl font-black text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-500 transition text-center sm:text-left">
                        </div>
                    </div>

                    <button data-action="start" class="w-full mt-8 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 font-black text-2xl sm:text-3xl py-6 rounded-2xl shadow-lg border-b-8 border-amber-600 transition transform active:scale-98 flex items-center justify-center gap-3 animate-pulse-gentle min-h-[72px]">
                        <span class="text-4xl">🎒</span>
                        <span>학교로 출발!</span>
                        <i class="fa-solid fa-arrow-right text-2xl"></i>
                    </button>
                </section>

                <!-- Right: Stage Roadmap -->
                <section class="md:col-span-6 bg-amber-50/80 border-4 border-amber-300 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
                    <div>
                        <div class="border-b-4 border-amber-200 pb-3 mb-4 flex items-center justify-between">
                            <h3 class="font-gaegu text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2">
                                <i class="fa-solid fa-list-check text-amber-600"></i>
                                오늘 할 일 (${STAGES.length}단계)
                            </h3>
                        </div>
                        <div class="space-y-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                            ${renderStageRoadmap()}
                        </div>
                    </div>
                </section>
            </div>
        </div>`;
}

function startSchoolDay() {
    const nameInput = document.getElementById('studentName');
    state.studentName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : DEFAULT_STUDENT_NAME;
    saveStudentName(state.studentName);

    playSuccessFanfare();
    goToScreen(FIRST_STAGE_SCREEN);
}
