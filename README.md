# Student Management REST API

Aplikasi manajemen data siswa berbasis REST API yang dibuat menggunakan Express.js, MySQL, HTML, CSS, dan JavaScript.

Aplikasi ini menyediakan fitur CRUD untuk menampilkan, menambahkan, mengubah, dan menghapus data siswa.

## Fitur

- Menampilkan seluruh data siswa
- Menampilkan siswa berdasarkan ID
- Menambahkan data siswa
- Mengubah data siswa
- Menghapus data siswa
- Validasi semua input
- Validasi NIS agar tidak duplikat
- Tampilan loading ketika mengambil data
- Pesan berhasil dan gagal
- Konfirmasi sebelum menghapus data
- Dashboard responsif
- Form tambah dan edit menggunakan modal
- Integrasi frontend menggunakan Fetch API

## Teknologi yang Digunakan

- Node.js
- Express.js
- MySQL
- MySQL2
- HTML
- CSS
- JavaScript
- Fetch API
- Postman
- Git dan GitHub

## Struktur Folder

```text
student-management-rest-api/
├── config/
│   └── database.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js