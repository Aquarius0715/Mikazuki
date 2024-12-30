const https = require('https');
const querystring = require('querystring');
const { JSDOM } = require('jsdom');

// ログイン用データ
const loginData = querystring.stringify({
    username: 'rezya-bu@mikazuki.co.jp', // ログイン用のユーザー名
    password: 'rezya7116', // ログイン用のパスワード
});

// ログインリクエストのオプション
const loginOptions = {
    hostname: 'mikazuki.urkt.in',
    path: '/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(loginData),
    },
};

// スクレイピング対象のURL
const targetDate = new Date().toISOString().split('T')[0]; // 現在の日付
const targetPath = `/reservation_ledgers/${targetDate}`;

// ログイン処理
function loginAndScrape() {
    const req = https.request(loginOptions, (res) => {
        let loginBody = '';

        res.on('data', (chunk) => {
            loginBody += chunk;
        });

        res.on('end', () => {
            console.log('ログイン成功');
            const cookies = res.headers['set-cookie']; // Cookieを取得
            if (!cookies) {
                console.error('Cookieが取得できませんでした');
                return;
            }

            // ログイン後のページをスクレイピング
            accessProtectedPage(cookies);
        });
    });

    req.on('error', (error) => {
        console.error('ログインエラー:', error);
    });

    req.write(loginData);
    req.end();
}

// 保護されたページへのアクセスとスクレイピング
function accessProtectedPage(cookies) {
    const options = {
        hostname: 'mikazuki.urkt.in',
        path: targetPath,
        method: 'GET',
        headers: {
            'Cookie': cookies.join('; '), // ログイン時に取得したCookieを設定
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    };

    const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('保護ページ取得成功');
            scrapeTable(body);
        });
    });

    req.on('error', (error) => {
        console.error('保護ページ取得エラー:', error);
    });

    req.end();
}

// HTMLを解析してテーブルデータを取得
function scrapeTable(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // XPathで指定されたテーブルの取得
    const xpath = '/html/body/div[2]/div[2]/div/div[3]/div[2]/div/div[1]/table/tbody';
    const xpathResult = document.evaluate(xpath, document, null, dom.window.XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    const tableBody = xpathResult.singleNodeValue;
    if (!tableBody) {
        console.error('指定されたテーブルが見つかりません');
        return;
    }

    // テーブルデータを取得
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        console.log(`Row ${index + 1}:`, [...cells].map(cell => cell.textContent.trim()));
    });
}

// ログインしてスクレイピング開始
loginAndScrape();
