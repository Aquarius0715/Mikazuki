// すべてのボタンを指定された状態にする
function setAllButtons(state) {
    const screenId = currentScreenIndex % screens.length ? "buggy_time" : "argo_time";
    const buttons = document.querySelectorAll("#" + screenId);
    buttons.forEach(button => {
        button.textContent = state;
        button.style.backgroundColor = state === "〇" ? "#8f8" : "#f88";
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