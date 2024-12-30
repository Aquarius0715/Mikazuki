const https = require('https');
const querystring = require('querystring');

// ログインデータ
const loginData = querystring.stringify({
    'authenticity_token': 'cJZXclAs8HyYi_Dj49QfegTNlBkotwGRaTo44HG5769MPN2BW7e3iqm50qRcP5hK3B6jssQdOOZAo0QB-Rmgwg', // HTMLから取得
    'user_session[login]': 'rezya-bu@mikazuki.co.jp', // ログインIDを設定
    'user_session[password]': 'rezya7116', // パスワードを設定
    'user_session[remember_me]': '0', // ログイン状態を保持するか
});

// リクエストオプション
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

// ログインリクエスト
const req = https.request(options, (res) => {
    let body = '';

    // レスポンスデータを収集
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('ログインリクエスト完了');
        console.log('ステータスコード:', res.statusCode);
        console.log('レスポンスヘッダー:', res.headers);

        // レスポンスボディの内容を確認
        console.log('レスポンスボディ:', body);

        // Cookieを取得
        const cookies = res.headers['set-cookie'];
        if (cookies) {
            console.log('取得したCookie:', cookies);

            // 次のリクエストにCookieを使用してアクセス
            accessProtectedPage(cookies);
        } else {
            console.error('ログインに失敗しました。Cookieが取得できません。');
        }
    });
});

req.on('error', (e) => {
    console.error('エラーが発生しました:', e.message);
});

// データを送信
req.write(loginData);
req.end();

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
            console.log('保護されたページにアクセス成功');
            console.log('HTML:', body); // 必要に応じてHTMLを解析
        });
    }).on('error', (e) => {
        console.error('保護ページアクセスエラー:', e.message);
    });
}
