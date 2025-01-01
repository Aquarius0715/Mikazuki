(async () => {
    const baseURL = 'https://mikazuki.urkt.in';
    const loginPath = '/login';
    const sessionPath = '/user_session';

    try {
        // CSRFトークンを取得
        const csrfResponse = await fetch(`${baseURL}${loginPath}`, {
            method: 'GET',
            credentials: 'include', // セッション情報を含める
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Referer': `${baseURL}${loginPath}`,
                'Origin': baseURL,
            },
        });

        if (!csrfResponse.ok) {
            throw new Error(`CSRFトークン取得失敗: ${csrfResponse.status}`);
        }

        const csrfText = await csrfResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(csrfText, 'text/html');
        const csrfToken = doc.querySelector('input[name="authenticity_token"]').value;

        if (!csrfToken) {
            throw new Error('CSRFトークンを取得できませんでした');
        }

        console.log('取得したCSRFトークン:', csrfToken);

        // ログインリクエストデータ
        const loginData = new URLSearchParams({
            'authenticity_token': csrfToken,
            'user_session[login]': 'rezya-bu@mikazuki.co.jp',
            'user_session[password]': 'rezya7116',
            'user_session[remember_me]': '0',
        });

        console.log('送信データ:', loginData.toString());

        // ログインリクエストを送信
        const loginResponse = await fetch(`${baseURL}${sessionPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': `${baseURL}${loginPath}`,
                'Origin': baseURL,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            },
            credentials: 'include',
            body: loginData.toString(),
        });

        if (!loginResponse.ok) {
            const errorText = await loginResponse.text();
            console.error('レスポンスヘッダー:', Array.from(loginResponse.headers.entries()));
            throw new Error(`ログイン失敗: ${loginResponse.status} - ${errorText}`);
        }

        console.log('ログイン成功！');

    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
