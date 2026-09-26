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


app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);


app.get('/api', function (req, res) {
    res.status(200).json({
        status: true,
        message: 'REST API berhasil berjalan'
    });
});

// GET - Mengambil seluruh data siswa
app.get('/api/siswa', async function (req, res) {
    try {
        const sql = `
            SELECT *
            FROM siswa
            ORDER BY id ASC
        `;

        const [rows] = await database
            .promise()
            .query(sql);

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil diambil',
            data: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal diambil'
        });
    }
});

// GET - Mengambil satu siswa berdasarkan ID
app.get('/api/siswa/:id', async function (req, res) {
    const id = req.params.id;

    try {
        const sql = `
            SELECT *
            FROM siswa
            WHERE id = ?
        `;

        const [rows] = await database
            .promise()
            .query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil ditemukan',
            data: rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal diambil'
        });
    }
}); 

// POST - Menambahkan data siswa
app.post('/api/siswa', async function (req, res) {
    const {
        nis,
        nama,
        kelas,
        jurusan,
        alamat
    } = req.body;

    // Validasi input
    if (
        !nis ||
        !nama ||
        !kelas ||
        !jurusan ||
        !alamat
    ) {
        return res.status(400).json({
            status: false,
            message: 'Semua data wajib diisi'
        });
    }

    try {
        // Memeriksa apakah NIS sudah digunakan
        const sqlCek = `
            SELECT id
            FROM siswa
            WHERE nis = ?
        `;

        const [siswaSudahAda] = await database
            .promise()
            .query(sqlCek, [nis]);

        if (siswaSudahAda.length > 0) {
            return res.status(409).json({
                status: false,
                message: 'NIS sudah digunakan'
            });
        }

        // Menambahkan siswa
        const sql = `
            INSERT INTO siswa
            (nis, nama, kelas, jurusan, alamat)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await database
            .promise()
            .query(sql, [
                nis,
                nama,
                kelas,
                jurusan,
                alamat
            ]);

        res.status(201).json({
            status: true,
            message: 'Data siswa berhasil ditambahkan',
            data: {
                id: result.insertId,
                nis: nis,
                nama: nama,
                kelas: kelas,
                jurusan: jurusan,
                alamat: alamat
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal ditambahkan'
        });
    }
});

// ========================================
// PUT - MENGUBAH DATA SISWA
// ========================================

app.put('/api/siswa/:id', async function (req, res) {
    const id = req.params.id;
    const { nis, nama, kelas, jurusan, alamat } = req.body;

    // Validasi input
    if (!nis || !nama || !kelas || !jurusan || !alamat) {
        return res.status(400).json({
            status: false,
            message: 'Semua data wajib diisi'
        });
    }

    try {
        // Memeriksa apakah ID siswa tersedia
        const sqlCekId = `
            SELECT id
            FROM siswa
            WHERE id = ?
        `;

        const [siswa] = await database
            .promise()
            .query(sqlCekId, [id]);

        if (siswa.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        // Memeriksa agar NIS tidak sama dengan siswa lain
        const sqlCekNis = `
            SELECT id
            FROM siswa
            WHERE nis = ? AND id != ?
        `;

        const [nisSudahAda] = await database
            .promise()
            .query(sqlCekNis, [nis, id]);

        if (nisSudahAda.length > 0) {
            return res.status(409).json({
                status: false,
                message: 'NIS sudah digunakan siswa lain'
            });
        }

        // Mengubah data siswa
        const sqlUpdate = `
            UPDATE siswa
            SET nis = ?,
                nama = ?,
                kelas = ?,
                jurusan = ?,
                alamat = ?
            WHERE id = ?
        `;

        await database.promise().query(sqlUpdate, [
            nis,
            nama,
            kelas,
            jurusan,
            alamat,
            id
        ]);

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil diubah',
            data: {
                id: Number(id),
                nis,
                nama,
                kelas,
                jurusan,
                alamat
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal diubah'
        });
    }
});

// ========================================
// DELETE - MENGHAPUS DATA SISWA
// ========================================

app.delete('/api/siswa/:id', async function (req, res) {
    const id = req.params.id;

    try {
        // Cek apakah siswa tersedia
        const sqlCek = `
            SELECT id
            FROM siswa
            WHERE id = ?
        `;

        const [rows] = await database
            .promise()
            .query(sqlCek, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data siswa tidak ditemukan'
            });
        }

        // Hapus siswa
        const sqlHapus = `
            DELETE FROM siswa
            WHERE id = ?
        `;

        await database
            .promise()
            .query(sqlHapus, [id]);

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil dihapus'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal dihapus'
        });
    }
});

app.listen(PORT, function () {
    console.log(
        `Server berjalan di http://localhost:${PORT}`
    );
});