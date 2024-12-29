const https = require('https');
const querystring = require('querystring');

// ログイン用データとURL
const loginURL = '/login';
const targetPath = '/reservation_ledgers/2024-12-27';

function sendLoginRequest() {
    const loginData = querystring.stringify({
        username: 'your-username',
        password: 'your-password',
    });

    const loginOptions = {
        hostname: 'mikazuki.urkt.in',
        path: loginURL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(loginData),
        },
    };

    const req = https.request(loginOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
            console.log('レスポンス:', body);
            console.log('レスポンスヘッダー:', res.headers);
            const cookies = res.headers['set-cookie'];
            if (!cookies) {
                console.error('Cookieが取得できませんでした。');
                return;
            }
            accessProtectedPage(cookies);
        });
    });

    req.on('error', (e) => console.error('ログインエラー:', e));
    req.write(loginData);
    req.end();
}

function accessProtectedPage(cookies) {
    const options = {
        hostname: 'mikazuki.urkt.in',
        path: targetPath,
        method: 'GET',
        headers: {
            'Cookie': cookies.join('; '),
        },
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
            console.log('保護ページのHTML:', body);
        });
    });

    req.on('error', (e) => console.error('保護ページ取得エラー:', e));
    req.end();
}

// ログインを実行
sendLoginRequest();
