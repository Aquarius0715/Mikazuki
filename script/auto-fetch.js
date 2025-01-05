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

    // 4. ページのデータを取得
    const data = await page.evaluate(() => {
        // テーブルデータを抽出
        return [...document.querySelectorAll('table tr')].map(row =>
            [...row.querySelectorAll('td, th')].map(cell => cell.textContent.trim())
        );
    });

    console.log('取得したデータ:', data);

    // 5. ブラウザを閉じる
    await browser.close();
})();
