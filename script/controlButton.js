// すべてのボタンを指定された状態にする
function setAllButtons(state) {
    const screenId = currentScreenIndex % screens.length ? "buggy_time" : "argo_time";
    const buttons = document.querySelectorAll("#" + screenId);
    buttons.forEach(button => {
        button.textContent = state;
        if (state === "〇") {
            button.style.backgroundColor = "#8f8";    
        } else if (state === "×") {
            button.style.backgroundColor = "#f88";
        } else if (state === "ー") {
            button.style.backgroundColor = "#fff";
        }
    });
}

// ボタンを表示/非表示に切り替え
function toggleVisibility() {
    const screenName = currentScreenIndex % screens.length ? "argo_screen" : "buggy_screen";
    const buttons = document.querySelectorAll("#" + screenName);
    buttons.forEach(button => {
        button.style.display = button.style.display === "none" ? "inline-block" : "none";
    });
}

        // グローバルスコープで変数を宣言
        const controlButtons = document.getElementById('controlButtons');
        const container = document.getElementById('container');

        function toggleControlButtons() {
            const isHidden = controlButtons.classList.toggle('hidden'); // hiddenクラスをトグル

            // コンテナ全体を上に移動するクラスのトグル
            if (isHidden) {
                container.classList.add('shifted');
            } else {
                container.classList.remove('shifted');
            }
        }