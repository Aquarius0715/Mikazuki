(async () => {
    const baseURL = 'https://mikazuki.urkt.in'; // リモートサーバーのURL
    const loginPath = '/login';
    const sessionPath = '/user_session';
    const targetDate = new Date().toISOString().split('T')[0];
    const protectedPath = `/reservation_ledgers/${targetDate}`;

    try {
        // リモートサーバーからCSRFトークンを取得
        const csrfResponse = await fetch(`${baseURL}${loginPath}`, {
            method: 'GET',
            credentials: 'include', // クッキーを含める
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
            'user_session[login]': 'rezya-bu@mikazuki.co.jp', // ユーザー名を入力
            'user_session[password]': 'rezya7116', // パスワードを入力
            'user_session[remember_me]': '0', // ログイン状態を保持しない
        });

        // リモートサーバーにログインリクエストを送信
        const loginResponse = await fetch(`${baseURL}${sessionPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: loginData.toString(),
        });

        if (!loginResponse.ok) {
            const errorText = await loginResponse.text();
            throw new Error(`ログイン失敗: ${loginResponse.status} - ${errorText}`);
        }

        console.log('ログイン成功！');

        // 保護されたページにアクセス
        const protectedResponse = await fetch(`${baseURL}${protectedPath}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!protectedResponse.ok) {
            throw new Error(`保護されたページへのアクセスに失敗: ${protectedResponse.status}`);
        }

        const protectedText = await protectedResponse.text();
        console.log('保護されたページのHTML:', protectedText);
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
