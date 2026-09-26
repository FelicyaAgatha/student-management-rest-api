const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

const folderUpload = path.join(
    __dirname,
    'public',
    'uploads'
);

if (!fs.existsSync(folderUpload)) {
    fs.mkdirSync(folderUpload, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, folderUpload);
    },

    filename: function (req, file, callback) {
        const ekstensi = path
            .extname(file.originalname)
            .toLowerCase();

        const namaFile =
            'siswa-' +
            Date.now() +
            '-' +
            Math.round(Math.random() * 1000000) +
            ekstensi;

        callback(null, namaFile);
    }
});

const fileFilter = function (req, file, callback) {
    const formatDiizinkan = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (formatDiizinkan.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new Error(
                'Foto harus berformat JPG, PNG, atau WEBP'
            ),
            false
        );
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

function hapusFileFoto(namaFile) {
    if (!namaFile) {
        return;
    }

    const lokasiFoto = path.join(
        folderUpload,
        path.basename(namaFile)
    );

    if (fs.existsSync(lokasiFoto)) {
        fs.unlinkSync(lokasiFoto);
    }
}

app.use(cors());
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

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

        const dataSiswa = rows.map(function (siswa) {
            return {
                ...siswa,
                foto_url: siswa.foto
                    ? `/uploads/${siswa.foto}`
                    : null
            };
        });

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil diambil',
            data: dataSiswa
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal diambil'
        });
    }
});

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

        const siswa = rows[0];

        siswa.foto_url = siswa.foto
            ? `/uploads/${siswa.foto}`
            : null;

        res.status(200).json({
            status: true,
            message: 'Data siswa berhasil ditemukan',
            data: siswa
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: 'Data siswa gagal diambil'
        });
    }
});

app.post(
    '/api/siswa',
    upload.single('foto'),
    async function (req, res) {
        const {
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        } = req.body;

        const foto = req.file
            ? req.file.filename
            : null;

        if (
            !nis ||
            !nama ||
            !kelas ||
            !jurusan ||
            !alamat
        ) {
            hapusFileFoto(foto);

            return res.status(400).json({
                status: false,
                message: 'Semua data wajib diisi'
            });
        }

        try {
            const sqlCek = `
                SELECT id
                FROM siswa
                WHERE nis = ?
            `;

            const [siswaSudahAda] = await database
                .promise()
                .query(sqlCek, [nis]);

            if (siswaSudahAda.length > 0) {
                hapusFileFoto(foto);

                return res.status(409).json({
                    status: false,
                    message: 'NIS sudah digunakan'
                });
            }

            const sql = `
                INSERT INTO siswa
                (
                    nis,
                    nama,
                    kelas,
                    jurusan,
                    alamat,
                    foto
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const [result] = await database
                .promise()
                .query(sql, [
                    nis,
                    nama,
                    kelas,
                    jurusan,
                    alamat,
                    foto
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
                    alamat: alamat,
                    foto: foto,
                    foto_url: foto
                        ? `/uploads/${foto}`
                        : null
                }
            });
        } catch (error) {
            hapusFileFoto(foto);
            console.error(error);

            res.status(500).json({
                status: false,
                message: 'Data siswa gagal ditambahkan'
            });
        }
    }
);

app.put(
    '/api/siswa/:id',
    upload.single('foto'),
    async function (req, res) {
        const id = req.params.id;

        const {
            nis,
            nama,
            kelas,
            jurusan,
            alamat
        } = req.body;

        const fotoBaru = req.file
            ? req.file.filename
            : null;

        if (
            !nis ||
            !nama ||
            !kelas ||
            !jurusan ||
            !alamat
        ) {
            hapusFileFoto(fotoBaru);

            return res.status(400).json({
                status: false,
                message: 'Semua data wajib diisi'
            });
        }

        try {
            const sqlCekId = `
                SELECT *
                FROM siswa
                WHERE id = ?
            `;

            const [siswa] = await database
                .promise()
                .query(sqlCekId, [id]);

            if (siswa.length === 0) {
                hapusFileFoto(fotoBaru);

                return res.status(404).json({
                    status: false,
                    message: 'Data siswa tidak ditemukan'
                });
            }

            const sqlCekNis = `
                SELECT id
                FROM siswa
                WHERE nis = ? AND id != ?
            `;

            const [nisSudahAda] = await database
                .promise()
                .query(sqlCekNis, [nis, id]);

            if (nisSudahAda.length > 0) {
                hapusFileFoto(fotoBaru);

                return res.status(409).json({
                    status: false,
                    message: 'NIS sudah digunakan siswa lain'
                });
            }

            const fotoLama = siswa[0].foto;

            const fotoUntukDatabase =
                fotoBaru || fotoLama || null;

            const sqlUpdate = `
                UPDATE siswa
                SET nis = ?,
                    nama = ?,
                    kelas = ?,
                    jurusan = ?,
                    alamat = ?,
                    foto = ?
                WHERE id = ?
            `;

            await database
                .promise()
                .query(sqlUpdate, [
                    nis,
                    nama,
                    kelas,
                    jurusan,
                    alamat,
                    fotoUntukDatabase,
                    id
                ]);

            if (
                fotoBaru &&
                fotoLama &&
                fotoBaru !== fotoLama
            ) {
                hapusFileFoto(fotoLama);
            }

            res.status(200).json({
                status: true,
                message: 'Data siswa berhasil diubah',
                data: {
                    id: Number(id),
                    nis: nis,
                    nama: nama,
                    kelas: kelas,
                    jurusan: jurusan,
                    alamat: alamat,
                    foto: fotoUntukDatabase,
                    foto_url: fotoUntukDatabase
                        ? `/uploads/${fotoUntukDatabase}`
                        : null
                }
            });
        } catch (error) {
            hapusFileFoto(fotoBaru);
            console.error(error);

            res.status(500).json({
                status: false,
                message: 'Data siswa gagal diubah'
            });
        }
    }
);

app.delete('/api/siswa/:id', async function (req, res) {
    const id = req.params.id;

    try {
        const sqlCek = `
            SELECT *
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

        const foto = rows[0].foto;

        const sqlHapus = `
            DELETE FROM siswa
            WHERE id = ?
        `;

        await database
            .promise()
            .query(sqlHapus, [id]);

        hapusFileFoto(foto);

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

app.use(function (error, req, res, next) {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: false,
                message: 'Ukuran foto maksimal 2 MB'
            });
        }

        return res.status(400).json({
            status: false,
            message: error.message
        });
    }

    if (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }

    next();
});

app.listen(PORT, function () {
    console.log(
        `Server berjalan di http://localhost:${PORT}`
    );
});