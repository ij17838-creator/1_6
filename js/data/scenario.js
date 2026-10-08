// =====================================================================
// 시나리오 데이터: 모든 단계·질문·선택지·결과 화면의 내용
// ---------------------------------------------------------------------
// 화면 종류(type)
//   choice   : 질문 + 그림 + 선택지 2개 (good: 바른 행동 / bad: 잘못된 행동)
//   gameover : 잘못된 선택 결과 → retry 화면으로 다시 도전
//   success  : 단계 완성 → next 화면으로 이동
//   tracing  : 한글 따라 쓰기 (js/features/tracing.js)
//
// 공통 필드
//   back : [이전으로] 버튼을 눌렀을 때 갈 화면 (gameover는 생략 시 retry)
//
// 글자 안의 {name} 은 학생 이름, {words} 는 따라 쓴 글자 목록으로 바뀝니다.
// 글자에는 <br> 같은 HTML 태그를 쓸 수 있습니다.
// =====================================================================

const START_SCREEN = 'screenLogin';
const FIRST_STAGE_SCREEN = 'screenStage1_Bus';
const DEFAULT_STUDENT_NAME = '김민수';

// 로그인 화면의 '오늘 할 일' 목록
const STAGES = [
    { num: 1, label: '🚌 1단계: 등교하기' },
    { num: 2, label: '👟 2단계: 교실 들어가기' },
    { num: 3, label: '✏️ 3단계: 한글 공부' },
    { num: 4, label: '🔔 4단계: 쉬는 시간' },
    { num: 5, label: '⚽ 5단계: 체육 시간' },
    { num: 6, label: '🍱 6단계: 점심 시간' }
];

const SCENARIO = {

    // -----------------------------------------------------------------
    // 1단계: 등교하기
    // -----------------------------------------------------------------
    screenStage1_Bus: {
        type: 'choice', back: 'screenLogin',
        badge: '1단계 (1/2)', title: '🚌 1단계: 등교하기 (학교 버스 타기)',
        question: '"빵빵! 노란색 학교 버스가 도착했어요."',
        prompt: '학교에 가기 위해 버스를 탈까요?',
        scene: { emoji: '🚌', anim: 'animate-pulse-gentle', caption: '🚏 정류장에 노란 버스가 기다리고 있어요!' },
        good: { emoji: '🚌', label: '버스를 타요!', sub: '학교로 출발해요', next: 'screenStage1_Greet' },
        bad: { emoji: '❌', label: '버스를 타지 않아요', sub: '집에 있을래요', next: 'screenGameOver_Bus' }
    },
    screenStage1_Greet: {
        type: 'choice', back: 'screenStage1_Bus',
        badge: '1단계 (2/2)', title: '🏫 1단계: 등교하기 (선생님께 인사하기)',
        question: '"학교 교문에 도착했어요! 교문 앞에서 선생님을 만났어요."',
        prompt: '선생님을 보고 어떻게 인사할까요?',
        scene: { emoji: '👩‍🏫', anim: 'animate-bounce', caption: '선생님: "안녕! 반가워요!"' },
        good: { emoji: '😃👋', label: '선생님, 안녕하세요!', sub: '예의 바르게 인사해요', next: 'screenStage1_Success' },
        bad: { emoji: '🙈', label: '인사하지 않고 그냥 가요', sub: '고개를 숙이고 지나쳐요', next: 'screenGameOver_Greet' }
    },
    screenGameOver_Bus: {
        type: 'gameover', retry: 'screenStage1_Bus', retryLabel: '다시 버스 타기',
        emoji: '😢', tag: '아쉬워요!', title: '"학교에 못 가버렸어!"',
        desc: '버스를 타지 않아서 오늘 학교에 갈 수 없게 되었어요.<br>괜찮아요, 다시 버스를 타고 출발해볼까요?'
    },
    screenGameOver_Greet: {
        type: 'gameover', retry: 'screenStage1_Greet', retryLabel: '다시 인사하기',
        emoji: '😢', tag: '선생님이 아쉬워해요!', title: '"선생님이 슬퍼하세요!"',
        desc: '인사를 하지 않고 지나쳐서 선생님이 슬픈 얼굴을 하셨어요.<br>선생님을 마주치면 밝게 "안녕하세요!" 하고 인사해 봐요.'
    },
    screenStage1_Success: {
        type: 'success', back: 'screenStage1_Greet',
        emoji: '🥰', tag: '🎉 1단계 완성! (등교 성공)', title: '"선생님이 활짝 웃어주셨어요!"',
        desc: '{name} 학생이 예의 바르게 인사하자 선생님도 기분 좋게 웃으시며 인사해주셨어요!',
        speaker: { emoji: '👩‍🏫', name: '선생님', line: '"안녕, {name}야! 오늘 하루도 재미있게 공부해보자!"' },
        next: 'screenStage2_Shoes', nextLabel: '👟 2단계: 교실 들어가기로 가기'
    },

    // -----------------------------------------------------------------
    // 2단계: 교실 들어가기
    // -----------------------------------------------------------------
    screenStage2_Shoes: {
        type: 'choice', back: 'screenStage1_Success',
        badge: '2단계 (1/2)', title: '👟 2단계: 교실 들어가기 (실내화 갈아신기)',
        question: '"학교 현관 신발장에 도착했어요."',
        prompt: '교실로 들어가기 전에 신발을 어떻게 할까요?',
        scene: { emoji: '👟👟', anim: 'animate-pulse-gentle', caption: '👟 내 신발장에 하얀 실내화가 있어요!' },
        good: { emoji: '👟✨', label: '실내화로 갈아신어요!', sub: '깨끗하게 갈아신고 들어가요', next: 'screenStage2_EnterClass' },
        bad: { emoji: '👞❌', label: '밖에서 신던 신발을 그냥 신어요', sub: '갈아신지 않고 들어갈래요', next: 'screenGameOver_Shoes' }
    },
    screenStage2_EnterClass: {
        type: 'choice', back: 'screenStage2_Shoes',
        badge: '2단계 (2/2)', title: '🏫 2단계: 교실 들어가기 (교실 안으로 들어가기)',
        question: '"실내화를 예쁘게 갈아신고 교실 문 앞에 왔어요!"',
        prompt: '이제 어떻게 할까요?',
        scene: { emoji: '🚪✨', anim: 'animate-bounce', caption: '1학년 1반 교실 문이 보여요!' },
        good: { emoji: '🚪🏃‍♂️', label: '똑똑! 교실 안으로 들어가요', sub: '내 자리를 찾아가요', next: 'screenStage2_Success' },
        bad: { emoji: '🚶‍♂️', label: '교실에 들어가지 않고 서 있어요', sub: '복도에 계속 있을래요', next: 'screenGameOver_EnterClass' }
    },
    screenGameOver_Shoes: {
        type: 'gameover', retry: 'screenStage2_Shoes', retryLabel: '다시 실내화 갈아신기',
        emoji: '👞❌', tag: '아쉬워요!', title: '"교실 바닥이 더러워져요!"',
        desc: '밖에서 신던 흙이 묻은 신발을 신고 들어가면 교실이 더러워져요.<br>깨끗한 실내화로 갈아신고 교실로 가볼까요?'
    },
    screenGameOver_EnterClass: {
        type: 'gameover', retry: 'screenStage2_EnterClass', retryLabel: '다시 교실 들어가기',
        emoji: '😢', tag: '수업이 시작돼요!', title: '"교실로 들어오세요!"',
        desc: '수업 시간이 다 되었는데 복도에 계속 있으면 공부를 할 수 없어요.<br>용기를 내어 씩씩하게 교실 문을 열고 들어가 볼까요?'
    },
    screenStage2_Success: {
        type: 'success', back: 'screenStage2_EnterClass',
        emoji: '👟🎉', tag: '🎉 2단계 완성! (교실 들어가기 성공)', title: '"교실에 잘 들어왔어요!"',
        desc: '{name} 학생이 깨끗한 실내화로 갈아신고 교실 안으로 씩씩하게 잘 들어왔어요!',
        speaker: { emoji: '👩‍🏫', name: '선생님', line: '"참 잘했어요, {name}야! 이제 자기 자리에 예쁘게 앉아서 공부 준비를 해볼까?"' },
        next: 'screenStage3_Tracing', nextLabel: '✏️ 3단계: 한글 공부로 가기'
    },

    // -----------------------------------------------------------------
    // 3단계: 한글 공부
    // -----------------------------------------------------------------
    screenStage3_Tracing: {
        type: 'tracing', back: 'screenStage2_Success',
        title: '✏️ 3단계: 한글 공부 (글자 따라 쓰기)',
        words: ['학교', '친구', '선생님', '공부', '기쁨'],
        next: 'screenStage3_Success'
    },
    screenStage3_Success: {
        type: 'success', back: 'screenStage3_Tracing',
        emoji: '✏️🎉', tag: '🎉 3단계 완성! (한글 공부 성공)', title: '"글씨를 정말 예쁘게 썼어요!"',
        desc: '{name} 학생이 {words} 글자를 모두 따라 썼어요!',
        speaker: { emoji: '👩‍🏫', name: '선생님', line: '"열심히 공부했구나, {name}야! 딩동댕~ 이제 쉬는 시간이에요!"' },
        next: 'screenStage4_Recess', nextLabel: '🔔 4단계: 쉬는 시간으로 가기'
    },

    // -----------------------------------------------------------------
    // 4단계: 쉬는 시간
    // -----------------------------------------------------------------
    screenStage4_Recess: {
        type: 'choice', back: 'screenStage3_Success',
        badge: '4단계 (1/2)', title: '🔔 4단계: 쉬는 시간 (장난감 함께 놀기)',
        question: '"장난감 자동차를 가지고 놀고 있는데 친구가 다가왔어요."',
        prompt: '친구가 "나도 같이 놀아도 돼?" 하고 물어봐요. 어떻게 할까요?',
        scene: {
            art: `<div class="flex items-end justify-center gap-6 my-2">
                    <div class="text-7xl sm:text-8xl animate-toy-bounce">🧸</div>
                    <div class="text-6xl sm:text-7xl animate-toy-slide">🚗</div>
                    <div class="text-7xl sm:text-8xl animate-friend-play">🧒</div>
                  </div>`,
            caption: '친구: "우와, 멋진 자동차다! 나도 같이 놀아도 돼?"'
        },
        good: { emoji: '🤝😊', label: '"그래, 같이 놀자!"', sub: '장난감을 사이좋게 나눠요', next: 'screenStage4_Fall' },
        bad: { emoji: '🙅', label: '"싫어, 내 거야!"', sub: '혼자서만 가지고 놀래요', next: 'screenGameOver_Recess' }
    },
    screenStage4_Fall: {
        type: 'choice', back: 'screenStage4_Recess',
        badge: '4단계 (2/2)', title: '🔔 4단계: 쉬는 시간 (넘어진 친구 돕기)',
        question: '"앗! 함께 놀던 친구가 쿵! 하고 넘어졌어요."',
        prompt: '친구가 무릎을 잡고 아파해요. 어떻게 할까요?',
        scene: { emoji: '🤕', anim: 'animate-pulse-gentle', caption: '친구: "아야야... 무릎이 아파..."' },
        good: { emoji: '🫶', label: '"괜찮아?" 하고 도와줘요', sub: '일으켜 주고 선생님께 알려요', next: 'screenStage4_Success' },
        bad: { emoji: '🏃💨', label: '못 본 척 혼자 놀아요', sub: '친구를 두고 다른 데로 가요', next: 'screenGameOver_Recess_Fall' }
    },
    screenGameOver_Recess: {
        type: 'gameover', retry: 'screenStage4_Recess', retryLabel: '다시 선택하기',
        emoji: '😞', tag: '친구가 속상해요!', title: '"같이 놀면 더 재미있어요!"',
        desc: '혼자만 장난감을 가지고 놀아서 친구가 시무룩해졌어요.<br>장난감을 사이좋게 나누면 친구와 더 즐겁게 놀 수 있어요.'
    },
    screenGameOver_Recess_Fall: {
        type: 'gameover', retry: 'screenStage4_Fall', retryLabel: '다시 선택하기',
        emoji: '😢', tag: '친구가 혼자 아파해요!', title: '"친구를 도와주세요!"',
        desc: '넘어진 친구를 그냥 두고 가서 친구가 혼자 울고 있어요.<br>"괜찮아?" 하고 물어보고, 다쳤으면 선생님께 꼭 알려요.'
    },
    screenStage4_Success: {
        type: 'success', back: 'screenStage4_Fall',
        emoji: '🤝🎉', tag: '🎉 4단계 완성! (쉬는 시간 성공)', title: '"친구를 아끼는 마음이 최고예요!"',
        desc: '{name} 학생이 장난감을 사이좋게 나누고, 넘어진 친구도 따뜻하게 도와줬어요!',
        speaker: { emoji: '🧒', name: '친구', line: '"고마워, {name}! 너랑 노니까 정말 재미있어!"' },
        next: 'screenStage5_Warmup', nextLabel: '⚽ 5단계: 체육 시간으로 가기'
    },

    // -----------------------------------------------------------------
    // 5단계: 체육 시간
    // -----------------------------------------------------------------
    screenStage5_Warmup: {
        type: 'choice', back: 'screenStage4_Success',
        badge: '5단계 (1/2)', title: '⚽ 5단계: 체육 시간 (다치지 않게 준비운동하기)',
        question: '"넓은 운동장에 다 함께 모였어요!"',
        prompt: '선생님께서 "다치지 않게 다 함께 준비운동을 합시다!" 하고 말씀하세요. 어떻게 할까요?',
        scene: {
            bg: 'from-amber-100 via-emerald-50 to-amber-200',
            art: `<div class="flex items-center justify-center gap-6 my-2">
                    <div class="text-7xl sm:text-8xl animate-bounce flex flex-col items-center">
                        <span>🤸‍♂️</span>
                        <span class="text-xs sm:text-sm font-black bg-amber-300 text-amber-950 px-3 py-0.5 rounded-full mt-1 border border-amber-400">체육 선생님</span>
                    </div>
                    <div class="text-5xl sm:text-6xl animate-pulse">🎵 1, 2, 3, 4!</div>
                  </div>`,
            caption: '선생님: "하나, 둘, 셋, 넷! 손목 발목을 시원하게 풀어주세요!"'
        },
        good: { emoji: '🙆‍♂️✨', label: '선생님을 따라 준비운동해요!', sub: '하나! 둘! 셋! 넷! 열심히 몸을 풀어줘요', next: 'screenStage5_Fall' },
        bad: { emoji: '🧍‍♂️❌', label: '따라하지 않고 가만히 서 있어요', sub: '귀찮아서 멍하게 서 있어볼래요', next: 'screenGameOver_PE_Warmup' }
    },
    screenStage5_Fall: {
        type: 'choice', back: 'screenStage5_Warmup',
        badge: '5단계 (2/2)', title: '⚽ 5단계: 체육 시간 (넘어졌을 때 다시 일어나기)',
        question: '"신나게 달리기를 하다가 발이 꼬여서 쿵! 넘어졌어요."',
        prompt: '무릎에 흙이 조금 묻었어요. 이때 어떻게 해야 할까요?',
        scene: {
            bg: 'from-amber-100 via-rose-50 to-amber-200',
            art: `<div class="flex items-center justify-center gap-6 my-2">
                    <div class="text-7xl sm:text-8xl animate-bounce flex flex-col items-center">
                        <span>🏃‍♂️💥</span>
                        <span class="text-xs sm:text-sm font-black bg-amber-300 text-amber-950 px-3 py-0.5 rounded-full mt-1 border border-amber-400">나</span>
                    </div>
                    <div class="text-5xl sm:text-6xl animate-pulse">💨 쿵!</div>
                  </div>`,
            caption: '"어쿠! 달리기하다 넘어졌네! 아프지만 살짝 찍힌 거 같아!"'
        },
        good: { emoji: '🙋‍♂️💪', label: '흙을 툴툴 털고 씩씩하게 일어나요!', sub: '다시 용기를 내어 결승선까지 달려요', next: 'screenStage5_Success' },
        bad: { emoji: '😭❌', label: '안 일어나고 바닥에 누워 떼를 써요', sub: '계속 누워서 울고만 있을래요', next: 'screenGameOver_PE_Fall' }
    },
    screenGameOver_PE_Warmup: {
        type: 'gameover', retry: 'screenStage5_Warmup', retryLabel: '다시 준비운동 따라하기',
        emoji: '🤕', tag: '몸을 다칠 수 있어요!', title: '"갑자기 뛰면 몸이 다쳐요!"',
        desc: '준비운동을 하지 않고 갑자기 달리면 다리 근육이 아프거나 다칠 수 있어요.<br>선생님과 함께 준비운동을 1, 2, 3, 4! 열심히 따라 해봐요!'
    },
    screenGameOver_PE_Fall: {
        type: 'gameover', retry: 'screenStage5_Fall', retryLabel: '다시 용기 내어 일어나기',
        emoji: '😭', tag: '다시 도전해보아요!', title: '"툭툭 털고 다시 일어나볼까요?"',
        desc: '누워서 울기만 하면 재미있는 달리기를 계속할 수 없어요.<br>넘어져도 툴툴 털고 용기 있게 일어나는 모습이 멋진 1학년이랍니다!'
    },
    screenStage5_Success: {
        type: 'success', back: 'screenStage5_Fall',
        emoji: '⚽🏆', tag: '🎉 5단계 완성! (체육 시간 성공)', title: '"튼튼하고 용감한 1학년 어린이!"',
        desc: '{name} 학생이 준비운동도 다치지 않게 열심히 하고, 넘어져도 씩씩하게 일어나 결승선까지 잘 완주했어요!',
        speaker: { emoji: '🤸‍♂️', name: '체육 선생님', line: '"무릎을 툴툴 털고 용기 있게 일어난 {name} 모습이 정말 자랑스러워요! 최고예요!"' },
        next: 'screenStage6_Line', nextLabel: '🍱 6단계: 점심 시간으로 가기'
    },

    // -----------------------------------------------------------------
    // 6단계: 점심 시간
    // -----------------------------------------------------------------
    screenStage6_Line: {
        type: 'choice', back: 'screenStage5_Success',
        badge: '6단계 (1/2)', title: '🍱 6단계: 점심 시간 (급식 줄 차례대로 기다리기)',
        question: '"신나는 점심시간! 급식실 앞에 친구들이 줄을 서 있어요."',
        prompt: '배가 조금 고픈데, 음식을 받기 위해 어떻게 줄을 서야 할까요?',
        scene: {
            bg: 'from-amber-100 via-amber-50 to-amber-200',
            art: `<div class="flex items-center justify-center gap-4 sm:gap-6 my-2 text-6xl sm:text-7xl">
                    <span class="animate-pulse">🧒</span>
                    <span>➡️</span>
                    <span class="animate-pulse">👧</span>
                    <span>➡️</span>
                    <span class="animate-bounce">👦</span>
                    <span>🍱</span>
                  </div>`,
            caption: '친구들이 질서 있게 차례차례 줄을 서서 기다리고 있어요!'
        },
        good: { emoji: '🚶‍♂️🚶‍♀️✨', label: '차례차례 줄을 서서 기다려요!', sub: '내 순서가 올 때까지 차분히 기다려요', next: 'screenStage6_Eat' },
        bad: { emoji: '🏃‍♂️💨❌', label: '친구 앞으로 새치기해서 들어가요', sub: '빨리 먹으려고 중간에 끼어들어요', next: 'screenGameOver_LunchLine' }
    },
    screenStage6_Eat: {
        type: 'choice', back: 'screenStage6_Line',
        badge: '6단계 (2/2)', title: '🍱 6단계: 점심 시간 (골고루 먹기)',
        question: '"맛있는 급식이 나왔어요! 식판에 고기 반찬과 시금치 나물이 있어요."',
        prompt: '건강하고 튼튼해지기 위해 급식을 어떻게 먹어야 할까요?',
        scene: {
            bg: 'from-amber-100 via-emerald-50 to-amber-200',
            art: `<div class="flex items-center justify-center gap-6 my-2 text-7xl sm:text-8xl animate-pulse">
                    <span>🍱</span>
                    <span>🥬</span>
                    <span>🥩</span>
                  </div>`,
            caption: '급식 선생님: "나물과 채소, 고기 모두 골고루 먹으면 키가 쑥쑥 자라요!"'
        },
        good: { emoji: '🥗😋✨', label: '골고루 먹기', sub: '모든 반찬을 남기지 않고 맛있게 먹어요', next: 'screenStage6_Success' },
        bad: { emoji: '🤢❌', label: '골고루 먹지 않기', sub: '좋아하는 반찬만 먹고 남겨요', next: 'screenGameOver_LunchEat' }
    },
    screenGameOver_LunchLine: {
        type: 'gameover', retry: 'screenStage6_Line', retryLabel: '다시 차례대로 줄 서기',
        emoji: '😢', tag: '새치기하면 안 돼요!', title: '"친구들이 속상해해요!"',
        desc: '새치기를 하면 줄을 기다리던 친구들이 속상해해요.<br>모두 다 함께 맛있게 먹을 수 있도록 차례차례 줄을 서서 기다려 볼까요?'
    },
    screenGameOver_LunchEat: {
        type: 'gameover', retry: 'screenStage6_Eat', retryLabel: '다시 골고루 먹기',
        emoji: '🥦❌', tag: '골고루 먹어야 해요!', title: '"골고루 먹어야 키가 쑥쑥!"',
        desc: '좋아하는 반찬만 먹으면 키가 잘 자라지 않고 감기에 쉽게 걸려요.<br>튼튼한 1학년이 되기 위해 여러 반찬을 골고루 먹어볼까요?'
    },
    screenStage6_Success: {
        type: 'success', back: 'screenStage6_Eat',
        emoji: '🍱🥗✨', tag: '🎉 6단계 완성! 오늘의 학교생활 모두 성공!', title: '"줄도 잘 서고 반찬도 골고루 먹었어요!"',
        desc: '{name} 학생이 차례대로 줄도 예쁘게 서고, 몸에 좋은 여러 반찬을 골고루 먹어 멋진 1학년의 모습을 보여줬어요!',
        speaker: { emoji: '👩‍🍳', name: '급식 선생님', line: '"줄도 순서대로 차례차례 잘 서고, 음식을 남김없이 골고루 다 먹었군요! 참 잘했어요, {name} 어린이!"' },
        next: 'screenLogin', nextLabel: '처음으로 돌아가기', final: true
    }
};
