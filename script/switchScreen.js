const screens = document.querySelectorAll('.screen');
const screenIntervals = {
    "argo_screen": 10000,
    "buggy_screen": 10000,
    "dragon_circuit_screen": 5000
};
let currentScreenIndex = 0;
let timeoutId;

function switchScreen() {
    stopSwitching()
    // 現在の画面を非表示
    screens[currentScreenIndex].classList.remove('active');

    // 次の画面を計算
    currentScreenIndex = (currentScreenIndex + 1) % screens.length;
    const nextScreen = screens[currentScreenIndex];

    // 次の画面を表示
    nextScreen.classList.add('active');

    // 次の画面の切り替え時間を取得
    const nextInterval = screenIntervals[nextScreen.id] || 10000; // デフォルト10秒

    // 次の切り替えをスケジュール
    timeoutId = setTimeout(switchScreen, nextInterval);
}

// 自動遷移の開始
function startSwitching() {
    if (!timeoutId) {
        switchScreen();
    }
}

// 自動遷移の停止
function stopSwitching() {
    clearTimeout(timeoutId);
    timeoutId = null;
}

// 自動遷移のON/OFF切り替え
function toggleSwitchScreen(element) {
    if (timeoutId) {
        stopSwitching();
        element.textContent = "自動遷移を再開";
    } else {
        startSwitching();
        element.textContent = "自動遷移を停止";
    }
}

// 初回スタート
startSwitching();
