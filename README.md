# Student Management REST API

Aplikasi manajemen data siswa berbasis REST API untuk mengelola data siswa melalui dashboard web. Aplikasi ini dibuat menggunakan Node.js, Express.js, MySQL, HTML, CSS, dan JavaScript.

## Live Demo

Aplikasi dapat diakses melalui:

https://student-management-rest-api-production-f875.up.railway.app

## Fitur Aplikasi

- Menampilkan seluruh data siswa
- Menampilkan jumlah siswa
- Menambahkan data siswa
- Mengubah data siswa
- Menghapus data siswa
- Mengunggah foto siswa
- Validasi NIS agar tidak sama
- Pencarian berdasarkan nama atau NIS
- Filter berdasarkan kelas
- Pagination atau pembagian halaman
- Dark mode
- Tampilan responsif
- Status koneksi REST API
- Status koneksi database
- REST API CRUD
- Database MySQL online

## Teknologi yang Digunakan

### Backend

- Node.js
- Express.js
- MySQL2
- Multer
- CORS

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

### Tools dan Deployment

- Visual Studio Code
- Git
- GitHub
- Postman
- HeidiSQL
- Railway

## Tampilan Aplikasi

### Dashboard

![Dashboard](screenshots/Dashboard.png)

### Form Tambah Siswa

![Form Tambah Siswa](screenshots/Tambah-Siswa.png)

### Dark Mode

![Dark Mode](screenshots/dark-mode.png)

### Pencarian dan Filter

![Pencarian dan Filter](screenshots/pencarian.png)

## Struktur Folder

```text
student-management-rest-api/
├── config/
│   └── database.js
├── public/
│   ├── uploads/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── screenshots/
│   ├── Dashboard.png
│   ├── Tambah-Siswa.png
│   ├── dark-mode.png
│   ├── pencarian.png
│   ├── GetDataUser.png
│   ├── GetDataUserByID.png
│   ├── PostDataUser.png
│   ├── PutDataUser.png
│   └── DeleteDataUser.png
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Endpoint REST API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api` | Memeriksa status REST API |
| GET | `/api/siswa` | Mengambil seluruh data siswa |
| GET | `/api/siswa/:id` | Mengambil siswa berdasarkan ID |
| POST | `/api/siswa` | Menambahkan data siswa |
| PUT | `/api/siswa/:id` | Mengubah data siswa |
| DELETE | `/api/siswa/:id` | Menghapus data siswa |

## Struktur Data Siswa

| Field | Tipe Data | Keterangan |
|---|---|---|
| id | INT | ID siswa dan primary key |
| nis | VARCHAR | Nomor Induk Siswa |
| nama | VARCHAR | Nama lengkap siswa |
| kelas | VARCHAR | Kelas siswa |
| jurusan | VARCHAR | Jurusan siswa |
| alamat | TEXT | Alamat siswa |
| foto | VARCHAR | Nama file foto siswa |
| created_at | TIMESTAMP | Waktu data dibuat |

## Contoh Request Tambah Siswa

Endpoint:

```http
POST /api/siswa
```

Data dikirim menggunakan `form-data`:

```text
nis      : 24251059
nama     : Felicya Agatha
kelas    : XII RPL
jurusan  : Rekayasa Perangkat Lunak
alamat   : Parungpanjang
foto     : file gambar
```

## Pengujian API

Pengujian REST API dilakukan menggunakan Postman untuk memastikan semua endpoint dapat berjalan dengan baik.

### GET Seluruh Data Siswa

Endpoint ini digunakan untuk mengambil seluruh data siswa.

```http
GET /api/siswa
```

![GET Seluruh Data Siswa](screenshots/GetDataUser.png)

### GET Data Siswa Berdasarkan ID

Endpoint ini digunakan untuk mengambil satu data siswa berdasarkan ID.

```http
GET /api/siswa/:id
```

![GET Data Siswa Berdasarkan ID](screenshots/GetDataUserByID.png)

### POST Tambah Data Siswa

Endpoint ini digunakan untuk menambahkan data siswa baru.

```http
POST /api/siswa
```

![POST Tambah Data Siswa](screenshots/PostDataUser.png)

### PUT Ubah Data Siswa

Endpoint ini digunakan untuk mengubah data siswa berdasarkan ID.

```http
PUT /api/siswa/:id
```

![PUT Ubah Data Siswa](screenshots/PutDataUser.png)

### DELETE Data Siswa

Endpoint ini digunakan untuk menghapus data siswa berdasarkan ID.

```http
DELETE /api/siswa/:id
```

![DELETE Data Siswa](screenshots/DeleteDataUser.png)

## Contoh Respons API

Contoh respons ketika seluruh data siswa berhasil diambil:

```json
{
    "status": true,
    "message": "Data siswa berhasil diambil",
    "data": []
}
```

Contoh respons ketika data siswa berhasil ditambahkan:

```json
{
    "status": true,
    "message": "Data siswa berhasil ditambahkan",
    "data": {
        "id": 1,
        "nis": "24251059",
        "nama": "Felicya Agatha",
        "kelas": "XII RPL",
        "jurusan": "Rekayasa Perangkat Lunak",
        "alamat": "Parungpanjang"
    }
}
```

## Instalasi Project

Clone repository:

```bash
git clone https://github.com/FelicyaAgatha/student-management-rest-api.git
```

Masuk ke folder project:

```bash
cd student-management-rest-api
```

Instal seluruh dependency:

```bash
npm install
```

Jalankan server:

```bash
npm start
```

Server akan berjalan di:

```text
http://localhost:3000
```

## Konfigurasi Database

Aplikasi menggunakan environment variable berikut:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_sekolah
DB_PORT=3306
```

## Struktur Tabel MySQL

Jalankan query berikut untuk membuat tabel `siswa`:

```sql
CREATE TABLE siswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nis VARCHAR(30) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    jurusan VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    foto VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Cara Menggunakan Aplikasi

1. Pastikan Node.js dan MySQL telah terpasang.
2. Buat database dengan nama `db_sekolah`.
3. Buat tabel `siswa`.
4. Sesuaikan konfigurasi database.
5. Jalankan `npm install`.
6. Jalankan server menggunakan `npm start`.
7. Buka `http://localhost:3000`.
8. Gunakan dashboard untuk mengelola data siswa.

## Deployment

Aplikasi telah di-deploy menggunakan Railway dengan:

- Web service Node.js
- Database MySQL Railway
- Environment variables
- Domain publik Railway

## Repository

Repository project dapat diakses melalui:

https://github.com/FelicyaAgatha/student-management-rest-api

## Pembuat

**Felicya Agatha Susanto Lie**  
Kelas XII Rekayasa Perangkat Lunak  
SMK Bina Putra Mandiri