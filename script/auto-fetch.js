(async () => {
    const loginURL = 'https://mikazuki.urkt.in/login';
    const targetDate = new Date().toISOString().split('T')[0]; // 現在の日付
    const targetURL = `https://mikazuki.urkt.in/reservation_ledgers/${targetDate}`;

    // ログイン情報
    const loginData = {
        username: 'rezya-bu@mikazuki.co.jp', // ユーザー名
        password: 'rezya7116', // パスワード
    };

    try {
        // ログインリクエスト
        const loginResponse = await fetch(loginURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(loginData), // フォームデータをエンコード
        });

        if (!loginResponse.ok) {
            throw new Error(`ログイン失敗: HTTP ${loginResponse.status}`);
        }

        // Cookieを取得
        const cookies = loginResponse.headers.get('set-cookie');
        if (!cookies) {
            throw new Error('ログイン成功しましたが、Cookieが見つかりません');
        }

        // 認証済みリクエストで対象ページにアクセス
        const targetResponse = await fetch(targetURL, {
            method: 'GET',
            headers: {
                'Cookie': cookies, // ログイン時に取得したCookieを使用
            },
        });

        if (!targetResponse.ok) {
            throw new Error(`対象ページの取得に失敗: HTTP ${targetResponse.status}`);
        }

        // ページHTMLを取得
        const htmlText = await targetResponse.text();

        // HTMLをパースしてXPathでテーブルを取得
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const xpath = '/html/body/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/table/tbody';
        const xpathResult = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        const tableBody = xpathResult.singleNodeValue;
        if (!tableBody) {
            throw new Error('指定されたテーブルが見つかりません');
        }

        // テーブルデータを解析
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td, th');
            console.log(`Row ${index + 1}:`, [...cells].map(cell => cell.textContent.trim()));
        });
    } catch (error) {
        console.error('エラー:', error);
    }
})();
