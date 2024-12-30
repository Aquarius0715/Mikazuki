const https = require('https');
const { JSDOM } = require('jsdom');
const querystring = require('querystring');

// ログインページからCSRFトークンを取得
function getCsrfToken() {
    const options = {
        hostname: 'mikazuki.urkt.in',
        path: '/login',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    };

    https.get(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('ログインページ取得成功');
            const csrfToken = extractCsrfToken(body);
            if (csrfToken) {
                console.log('取得したCSRFトークン:', csrfToken);
                sendLoginRequest(csrfToken);
            } else {
                console.error('CSRFトークンの取得に失敗しました');
            }
        });
    }).on('error', (err) => {
        console.error('ログインページ取得エラー:', err);
    });
}

// HTMLからCSRFトークンを抽出
function extractCsrfToken(html) {
    const dom = new JSDOM(html);
    const tokenElement = dom.window.document.querySelector('input[name="authenticity_token"]');
    return tokenElement ? tokenElement.value : null;
}

// CSRFトークンを使用してログインリクエストを送信
function sendLoginRequest(csrfToken) {
    const loginData = querystring.stringify({
        'authenticity_token': csrfToken,
        'user_session[login]': 'rezya-bu@mikazuki.co.jp', // ログインIDを設定
        'user_session[password]': 'rezya7116', // パスワードを設定
        'user_session[remember_me]': '0', // ログイン状態を保持するか
    });

    const options = {
        hostname: 'mikazuki.urkt.in',
        path: '/user_session',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(loginData),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://mikazuki.urkt.in/login',
        },
    };

    const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('ログインリクエスト完了');
            console.log('ステータスコード:', res.statusCode);
            console.log('レスポンスヘッダー:', res.headers);

            const cookies = res.headers['set-cookie'];
            if (res.statusCode === 200 && cookies) {
                console.log('ログイン成功！取得したCookie:', cookies);
                accessProtectedPage(cookies);
            } else {
                console.error('ログイン失敗。レスポンスボディ:', body);
            }
        });
    });

    req.on('error', (err) => {
        console.error('ログインリクエストエラー:', err);
    });

    req.write(loginData);
    req.end();
}

// 保護されたページにアクセス
function accessProtectedPage(cookies) {
    const targetDate = new Date().toISOString().split('T')[0]; // 現在の日付
    const path = `/reservation_ledgers/${targetDate}`;

    const options = {
        hostname: 'mikazuki.urkt.in',
        path: path,
        method: 'GET',
        headers: {
            'Cookie': cookies.join('; '),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    };

    https.get(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            console.log('保護されたページ取得成功');
            console.log('HTML:', body);
        });
    }).on('error', (err) => {
        console.error('保護ページアクセスエラー:', err);
    });
}

// トークンを取得してログイン処理を開始
getCsrfToken();
