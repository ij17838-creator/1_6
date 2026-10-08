// =====================================================================
// 효과음 (Tone.js)
// =====================================================================

let audioEnabled = false;
let synth = null;
let audioInitialized = false;

function initAudio() {
    if (!audioInitialized && typeof Tone !== 'undefined') {
        try {
            synth = new Tone.Synth().toDestination();
            audioInitialized = true;
        } catch(e) {
            console.log("Audio init error:", e);
        }
    }
}

// Toggle Sound Effects On/Off
function toggleAudio() {
    if (typeof Tone !== 'undefined') {
        Tone.start();
    }
    audioEnabled = !audioEnabled;
    const bgmIcon = document.getElementById('bgmIcon');
    const bgmText = document.getElementById('bgmText');

    if (audioEnabled) {
        initAudio();
        if (bgmIcon) bgmIcon.className = "fa-solid fa-volume-high text-emerald-600 text-lg sm:text-xl";
        if (bgmText) bgmText.innerText = "소리 켬";
        playChime("C5");
    } else {
        if (bgmIcon) bgmIcon.className = "fa-solid fa-volume-xmark text-red-500 text-lg sm:text-xl";
        if (bgmText) bgmText.innerText = "소리 끔";
    }
}

// 음 목록 [음, 길이, 시작 시각(초)]을 차례대로 연주
function playNotes(notes) {
    if (!audioEnabled) return;
    try {
        if (typeof Tone !== 'undefined') {
            Tone.start();
            initAudio();
            if (synth) {
                const now = Tone.now();
                notes.forEach(([note, length, offset]) => {
                    synth.triggerAttackRelease(note, length, now + offset);
                });
            }
        }
    } catch (e) {
        console.log("Sound play error:", e);
    }
}

// Play Short Button Chime
function playChime(note = "C5") {
    playNotes([[note, "8n", 0]]);
}

// Play Success Sound Sequence
function playSuccessFanfare() {
    playNotes([
        ["C5", "8n", 0],
        ["E5", "8n", 0.12],
        ["G5", "8n", 0.24],
        ["C6", "4n", 0.36]
    ]);
}

// Play Failure/Try Again Sound Sequence
function playSadTone() {
    playNotes([
        ["G4", "8n", 0],
        ["E4", "8n", 0.18],
        ["C4", "4n", 0.36]
    ]);
}
