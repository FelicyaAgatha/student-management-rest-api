const express = require('express');
const cors = require('cors');
const path = require('path');

const database = require('./config/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Membuka folder public
app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);

// Endpoint pengecekan server
app.get('/api', function (req, res) {
    res.status(200).json({
        status: true,
        message: 'REST API berhasil berjalan'
    });
});

// Menjalankan server
app.listen(PORT, function () {
    console.log(
        `Server berjalan di http://localhost:${PORT}`
    );
});