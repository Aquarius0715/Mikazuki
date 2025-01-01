const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORSヘッダーを追加するミドルウェア
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 必要に応じて特定のオリジンに制限
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
