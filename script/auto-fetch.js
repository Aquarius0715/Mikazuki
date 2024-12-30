const https = require('https');
const querystring = require('querystring');

// ログイン用データ
const loginData = querystring.stringify({
    username: 'your-username',
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // User-Agentを追加
    },
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
            console.log('レスポンスヘッダー:', res.headers);

            // Set-Cookieヘッダーを取得
            const cookies = res.headers['set-cookie'];
            if (!cookies) {
                console.error('Cookieが取得できませんでした。');
                return;
            }

            console.log('取得したCookie:', cookies);

            // 保護されたページへアクセス
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
            'Cookie': cookies.join('; '), // Cookieを設定
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
            console.log('HTML:', body); // 必要に応じて解析
        });
    });

    req.on('error', (error) => {
        console.error('保護ページ取得エラー:', error);
    });

    req.end();
}

// ログインしてスクレイピング開始
loginAndScrape();
