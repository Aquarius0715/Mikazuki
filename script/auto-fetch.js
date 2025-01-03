import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

(async () => {
    const baseURL = 'https://mikazuki.urkt.in';
    const loginPath = '/login';
    const sessionPath = '/user_session';
    const protectedPath = '/reservation_ledgers/2025-01-03'; // 保護されたページのパス（例）

    try {
        // 1. ログインページにアクセスしてCSRFトークンを取得
        const csrfResponse = await fetch(`${baseURL}${loginPath}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            },
        });

        if (!csrfResponse.ok) {
            throw new Error(`CSRFトークン取得失敗: ${csrfResponse.status}`);
        }

        const csrfText = await csrfResponse.text();
        const dom = new JSDOM(csrfText);
        const csrfToken = dom.window.document.querySelector('meta[name="csrf-token"]').content;

        if (!csrfToken) {
            throw new Error('CSRFトークンを取得できませんでした');
        }

        console.log('取得したCSRFトークン:', csrfToken);

        // 2. ログインリクエストデータを作成
        const loginData = new URLSearchParams({
            'authenticity_token': csrfToken,
            'user_session[login]': 'rezya-bu@mikazuki.co.jp', // ログインID
            'user_session[password]': 'rezya7116', // パスワード
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
            body: loginData.toString(),
        });

        if (loginResponse.status !== 302) {
            const errorText = await loginResponse.text();
            throw new Error(`ログイン失敗: ${loginResponse.status} - ${errorText}`);
        }

        console.log('ログイン成功！');

        // 4. 保護されたページにアクセス
        const cookies = loginResponse.headers.get('set-cookie');
        const protectedResponse = await fetch(`${baseURL}${protectedPath}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Referer': `${baseURL}/login`,
                'Cookie': cookies,
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
