const https = require('https');
const querystring = require('querystring');
const HttpsProxyAgent = require('https-proxy-agent');
const { JSDOM } = require('jsdom');

// プロキシサーバーの設定
const proxyURL = 'https://www.croxyproxy.com/'; // プロキシURLを指定
const agent = new HttpsProxyAgent(proxyURL);

// ログインデータ
const loginData = querystring.stringify({
    username: 'your-username', // ユーザー名を入力
    password: 'your-password', // パスワードを入力
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
    agent, // プロキシエージェントを設定
};

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
    const targetDate = new Date().toISOString().split('T')[0]; // 現在の日付
    const targetPath = `/reservation_ledgers/${targetDate}`;

    const options = {
        hostname: 'mikazuki.urkt.in',
        path: targetPath,
        method: 'GET',
        headers: {
            'Cookie': cookies.join('; '), // ログイン時のCookieを設定
        },
        agent, // プロキシエージェントを設定
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
