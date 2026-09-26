const mysql = require('mysql2');

const database = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_sekolah',
    port: process.env.DB_PORT || 3306
});

database.connect(function (error) {
    if (error) {
        console.error(
            'Database gagal terhubung:',
            error.message
        );

        return;
    }

    console.log('Database berhasil terhubung');
});

module.exports = database;