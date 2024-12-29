const https = require('https');
const querystring = require('querystring');

// ログイン用データ
const loginData = querystring.stringify({
    username: 'your-username', // ログイン情報を入力
    password: 'your-password',
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

// ログイン処理
const loginRequest = https.request(loginOptions, (loginResponse) => {
    let loginBody = '';

    loginResponse.on('data', (chunk) => {
        loginBody += chunk;
    });

    loginResponse.on('end', () => {
        console.log('ログイン成功');
        const cookies = loginResponse.headers['set-cookie']; // Cookieを取得

        if (!cookies) {
            console.error('Cookieが取得できませんでした');
            return;
        }

        // ログイン後のページへアクセス
        accessProtectedPage(cookies);
    });
});

loginRequest.on('error', (error) => {
    console.error('ログインエラー:', error);
});

loginRequest.write(loginData);
loginRequest.end();

// 認証後に保護されたページへアクセス
function accessProtectedPage(cookies) {
    const targetDate = new Date().toISOString().split('T')[0]; // 現在の日付
    const targetPath = `/reservation_ledgers/${targetDate}`;

    const protectedOptions = {
        hostname: 'mikazuki.urkt.in',
        path: targetPath,
        method: 'GET',
        headers: {
            'Cookie': cookies.join('; '), // ログイン時に取得したCookieを送信
        },
    };

    const protectedRequest = https.request(protectedOptions, (protectedResponse) => {
        let protectedBody = '';

        protectedResponse.on('data', (chunk) => {
            protectedBody += chunk;
        });

        protectedResponse.on('end', () => {
            console.log('保護されたページ取得成功');

            // HTML解析してテーブルデータを抽出
            parseHTML(protectedBody);
        });
    });

    protectedRequest.on('error', (error) => {
        console.error('保護ページアクセスエラー:', error);
    });

    protectedRequest.end();
}

// HTMLを解析してテーブルデータを取得
function parseHTML(html) {
    const { JSDOM } = require('jsdom'); // HTML解析のために必要
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
