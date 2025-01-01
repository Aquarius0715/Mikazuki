const express = require('express');
const https = require('https');
const http = require('http');

const app = express();

// プロキシ用にリクエストボディのパースを有効化
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// プロキシサーバーのエンドポイント
app.all('*', (req, res) => {
    const targetHost = 'mikazuki.urkt.in'; // 対象のサーバー
    const options = {
        hostname: targetHost,
        path: req.path,
        method: req.method,
        headers: {
            ...req.headers,
            host: targetHost, // Hostヘッダーを上書き
        },
    };

    // 対象サーバーへのリクエストをプロキシ
    const proxy = https.request(options, (proxyRes) => {
        let body = '';

        proxyRes.on('data', (chunk) => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            // プロキシレスポンスをクライアントに送信
            res.set(proxyRes.headers);
            res.status(proxyRes.statusCode).send(body);
        });
    });

    // プロキシリクエストのエラー処理
    proxy.on('error', (err) => {
        console.error('プロキシエラー:', err);
        res.status(500).send('プロキシサーバーエラー');
    });

    // リクエストボディが存在する場合、それを送信
    if (req.body) {
        proxy.write(JSON.stringify(req.body));
    }

    proxy.end();
});

// プロキシサーバーの起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`プロキシサーバーが起動しました: http://localhost:${PORT}`);
});
