const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_sekolah'
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