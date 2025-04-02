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

const waitTimeLabels = ["0分", "約10分", "約20分", "30分以上"];

function toggleWaitTime() {
    const waitTimeElement = document.getElementById("dragon_wait_time");
    let currentTimeText = waitTimeElement.textContent;

    // 現在の表示からインデックスを取得
    let currentIndex = waitTimeLabels.indexOf(currentTimeText);
    
    // 次のインデックスを計算
    let nextIndex = (currentIndex + 1) % waitTimeLabels.length;
    
    // 更新
    waitTimeElement.textContent = waitTimeLabels[nextIndex];
}
