const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true }); // ヘッドレスモードを有効化
    const page = await browser.newPage();

    // 1. ログインページにアクセス
    await page.goto('https://mikazuki.urkt.in/login', { waitUntil: 'networkidle2' });

    // 2. ログイン情報を入力して送信
    await page.type('input[name="user_session[login]"]', 'rezya-bu@mikazuki.co.jp'); // ログインID
    await page.type('input[name="user_session[password]"]', 'rezya7116'); // パスワード
    await page.click('input[type="submit"]'); // ログインボタンをクリック
    await page.waitForNavigation(); // 次のページに移動するまで待機

    console.log('ログイン成功！');

    // 3. 保護されたページに移動
    const targetDate = new Date().toISOString().split('T')[0]; // 今日の日付を自動で設定
    const targetURL = `https://mikazuki.urkt.in/reservation_ledgers/${targetDate}`;
    await page.goto(targetURL, { waitUntil: 'networkidle2' });

    // 4. 特定のクラスのテーブルを抽出
    const tableData = await page.evaluate(() => {
        const table = document.querySelector('table.ui.celled.unstackable.table'); // クラス名でテーブルを選択
        if (!table) return null; // テーブルが存在しない場合はnullを返す

        return [...table.querySelectorAll('tr')].map(row =>
            [...row.querySelectorAll('td, th')].map(cell => cell.textContent.trim())
        );
    });

    if (!tableData) {
        console.error('指定されたクラスのテーブルが見つかりませんでした');
    } else {
        console.log('取得したテーブルデータ:', tableData);
    }
    // 5. ブラウザを閉じる
    await browser.close();

    const buttons = document.querySelectorAll('#argo_screen .time-item');
    
})();
