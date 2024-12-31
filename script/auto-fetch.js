(async () => {
    // ログインページのURLとCSRFトークン取得
    const loginURL = 'https://mikazuki.urkt.in/login';
    const sessionURL = 'https://mikazuki.urkt.in/user_session';

    try {
        // CSRFトークンを取得
        const csrfResponse = await fetch(loginURL, {
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
            'user_session[login]': 'rezya-bu@mikazuki.co.jp', // ユーザー名
            'user_session[password]': 'rezya7116', // パスワード
            'user_session[remember_me]': '0', // ログイン状態を保持するか
        });

        // ログインリクエスト
        const loginResponse = await fetch(sessionURL, {
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

        // 保護されたページへアクセス
        const targetDate = new Date().toISOString().split('T')[0];
        const protectedURL = `https://mikazuki.urkt.in/reservation_ledgers/${targetDate}`;
        console.log(protectedURL)
        const protectedResponse = await fetch(protectedURL, {
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
