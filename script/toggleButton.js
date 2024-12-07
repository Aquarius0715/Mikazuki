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