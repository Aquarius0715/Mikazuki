(async () => {
    const baseURL = 'https://mikazuki.urkt.in';
    const loginPath = '/login';
    const sessionPath = '/user_session';
    const targetPath = '/reservation_ledgers/2025-01-01'; // 必要に応じて変更

    try {
        // 1. ログインページにアクセスしてCSRFトークンを取得
        const csrfResponse = await fetch(`${baseURL}${loginPath}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Referer': `${baseURL}${loginPath}`,
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

        // 2. ログインリクエストデータを作成
        const loginData = new URLSearchParams({
            'authenticity_token': csrfToken,
            'user_session[login]': 'rezya-bu@mikazuki.co.jp',
            'user_session[password]': 'rezya7116',
            'user_session[remember_me]': '0',
        });

        // 3. ログインリクエストを送信
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

        if (loginResponse.status !== 302) {
            const errorText = await loginResponse.text();
            throw new Error(`ログイン失敗: ${loginResponse.status} - ${errorText}`);
        }

        console.log('ログイン成功！');

        // 4. リダイレクト後のセッションを使用して保護されたページにアクセス
        const protectedResponse = await fetch(`${baseURL}${targetPath}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Referer': `${baseURL}/login`,
            },
        });

        if (!protectedResponse.ok) {
            throw new Error(`保護されたページへのアクセスに失敗: ${protectedResponse.status}`);
        }

        const text = await protectedResponse.text();
        console.log('保護されたページのHTML:', text);

    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
