const screens = document.querySelectorAll('.screen');
const switchIntervalTime = 10000;
let currentScreenIndex = 0;
let interval = setInterval(switchScreen, switchIntervalTime);

function switchScreen() {
    // 現在の画面を非表示
    screens[currentScreenIndex].classList.remove('active');

    // 次の画面を計算
    currentScreenIndex = (currentScreenIndex + 1) % screens.length;

    // 次の画面を表示
    screens[currentScreenIndex].classList.add('active');
}

function toggleSwitchScreen(element) {
    if (element.textContent === "自動遷移を停止") {
        clearInterval(interval)
        element.textContent = "自動遷移を再開"
    } else {
        interval = setInterval(switchScreen, switchIntervalTime)
        element.textContent = "自動遷移を停止"
    }
}