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

        function disablePastButtons() {
            const now = new Date(); // 現在時刻を取得
            let buttons = document.querySelectorAll(".toggle-btn-unavailable, .toggle-btn");
            buttons.forEach(button => {
                const buttonTime = button.getAttribute("date-time");
                if (buttonTime) {
                    const [hour, minute] = buttonTime.split(":").map(Number);
                    let buttonDate = new Date();
                    buttonDate.setHours(hour, minute, 0, 0);

                    if (button.getAttribute("id") === "buggy_time") {
                        if (buttonTime === "10:15") {
                            buttonDate -= 13 * 60 * 1000;
                        } else {
                            buttonDate -= 15 * 60 * 1000;
                        }
                    }
        
                    if (now > buttonDate) {
                        button.textContent = "ー";
                        button.style.backgroundColor = "#fff";
                        button.classList.add("toggle-btn-unavailable"); // クラスを追加
                        button.onclick = null; // ボタンのクリックを無効化
                    }
                }
            });
        }

        function toggleFullScreen(element = document.documentElement) {
            if (!document.fullscreenElement) {
                // フルスクリーンにする
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) { // Safari用
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) { // IE11用
                    element.msRequestFullscreen();
                }
            } else {
                // フルスクリーンを終了する
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { // Safari用
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE11用
                    document.msExitFullscreen();
                }
            }
        }
setInterval(disablePastButtons, 6000); // 60秒ごとにチェック
disablePastButtons(); // 初期実行