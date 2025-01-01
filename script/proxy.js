(async () => {
    const proxyBaseURL = 'http://localhost:3000'; // プロキシサーバーのURL
    const loginPath = '/login';
    const sessionPath = '/user_session';
    const targetDate = new Date().toISOString().split('T')[0];
    const protectedPath = `/reservation_ledgers/${targetDate}`;

    try {
        // プロキシ経由でCSRFトークンを取得
        const csrfResponse = await fetch(`${proxyBaseURL}${loginPath}`, {
            method: 'GET',
            credentials: 'include', // Cookieを含める
        });

        const csrfText = await csrfResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(csrfText, 'text/html');
        const csrfToken = doc.querySelector('input[name="authenticity_token"]').value;

        if (!csrfToken) {
            console.error('CSRFトークンを取得できませんでした');
            return;
        }

        console.log('取得したCSRFトークン:', csrfToken);

        // ログインリクエストデータ
        const loginData = new URLSearchParams({
            'authenticity_token': csrfToken,
            'user_session[login]': 'your-username', // ユーザー名
            'user_session[password]': 'your-password', // パスワード
            'user_session[remember_me]': '0', // ログイン状態を保持するか
        });

        // プロキシ経由でログインリクエストを送信
        const loginResponse = await fetch(`${proxyBaseURL}${sessionPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: loginData.toString(),
        });

        if (!loginResponse.ok) {
            console.error('ログイン失敗:', loginResponse.status);
            const errorText = await loginResponse.text();
            console.error('エラー内容:', errorText);
            return;
        }

        console.log('ログイン成功！');

        // プロキシ経由で保護されたページへアクセス
        const protectedResponse = await fetch(`${proxyBaseURL}${protectedPath}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!protectedResponse.ok) {
            console.error('保護されたページへのアクセスに失敗しました:', protectedResponse.status);
            return;
        }

        const protectedText = await protectedResponse.text();
        console.log('保護されたページのHTML:', protectedText);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
