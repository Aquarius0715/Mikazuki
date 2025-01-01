const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSヘッダーを追加するミドルウェア
app.use((req, res, next) => {
    const allowedOrigin = req.headers.origin || 'http://localhost:3000'; // 必要に応じてオリジンを設定
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin); // 特定のオリジンを許可
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // クッキーを許可
    next();
});

// プロキシエンドポイント
app.all('*', (req, res) => {
    const options = {
        hostname: 'mikazuki.urkt.in',
        path: req.path,
        method: req.method,
        headers: {
            ...req.headers,
            host: 'mikazuki.urkt.in',
        },
    };

    const proxy = https.request(options, (proxyRes) => {
        let body = '';

        proxyRes.on('data', (chunk) => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            res.set(proxyRes.headers);
            res.status(proxyRes.statusCode).send(body);
        });
    });

    proxy.on('error', (err) => {
        console.error('プロキシエラー:', err);
        res.status(500).send('プロキシサーバーエラー');
    });

    if (req.body) {
        proxy.write(JSON.stringify(req.body));
    }

    proxy.end();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`プロキシサーバーが起動しました: http://localhost:${PORT}`);
});
