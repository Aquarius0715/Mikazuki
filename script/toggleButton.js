// ボタンの状態を切り替え
function toggleStateBuggy(element) {
    if (element.textContent === "〇") {
        element.textContent = "×";
        element.style.backgroundColor = "#f88";
    } else if (element.textContent === "×") {
        element.textContent = "△";
        element.style.backgroundColor = "#ff0";
    } else if (element.textContent === "△") {
        element.textContent = "ー";
        element.style.backgroundColor = "#fff";
    } else if (element.textContent === "ー") {
        element.textContent = "〇";
        element.style.backgroundColor = "#8f8"
    }
}

function toggleStateArgo(element) {
    if (element.textContent === "〇") {
        element.textContent = "×";
        element.style.backgroundColor = "#f88";
    } else if (element.textContent === "×") {
        element.textContent = "ー";
        element.style.backgroundColor = "#fff";
    } else if (element.textContent === "ー") {
        element.textContent = "〇";
        element.style.backgroundColor = "#8f8"
    }
}

const waitTimes = [0, 5, 15, 30];

function toggleWaitTime() {
    const waitTimeElement = document.getElementById("dragon_wait_time");
    let currentTime = parseInt(waitTimeElement.textContent.replace("分待ち", ""), 10);

    // 次の待ち時間を取得
    let nextIndex = (waitTimes.indexOf(currentTime) + 1) % waitTimes.length;
    let nextTime = waitTimes[nextIndex];

    // 更新
    waitTimeElement.textContent = nextTime + "分待ち";
}