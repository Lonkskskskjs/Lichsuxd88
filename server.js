const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// API gốc
const SOURCE_API_URL = 'https://taixiumd5.system32-cloudfare-356783752985678522.monster/api/md5luckydice/GetSoiCau';

/**
 * Chuẩn hóa dữ liệu từ API gốc
 */
function formatResult(raw) {
    const d1 = raw.FirstDice ?? 0;
    const d2 = raw.SecondDice ?? 0;
    const d3 = raw.ThirdDice ?? 0;
    const tong = raw.DiceSum ?? (d1 + d2 + d3);

    // Quy ước: >=11 là Tài, <=10 là Xỉu
    const ketQua = tong >= 11 ? "Tài" : "Xỉu";

    return {
        Phien: raw.SessionId,
        Xuc_xac_1: d1,
        Xuc_xac_2: d2,
        Xuc_xac_3: d3,
        Tong: tong,
        Ket_qua: ketQua,
        id: "@akkskskbucumh"
    };
}

// Lấy phiên mới nhất
app.get('/api/lxk', async (req, res) => {
    try {
        const response = await axios.get(SOURCE_API_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 10000
        });

        const data = response.data;

        // API trả về mảng → phần tử đầu tiên là phiên mới nhất
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(500).json({
                error: "API gốc không trả về mảng hợp lệ"
            });
        }

        const latestRaw = data[0];
        const result = formatResult(latestRaw);

        res.json(result);

    } catch (err) {
        res.status(503).json({
            error: "Không thể lấy dữ liệu từ API gốc",
            details: err.message
        });
    }
});

// Trang chủ
app.get('/', (req, res) => {
    res.send('OK – Truy cập <b>/api/lxk</b> để lấy phiên mới nhất');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});

