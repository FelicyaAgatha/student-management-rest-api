const API_URL = '/api/siswa';

const studentForm = document.getElementById('studentForm');
const siswaId = document.getElementById('siswaId');

const inputNis = document.getElementById('nis');
const inputNama = document.getElementById('nama');
const inputKelas = document.getElementById('kelas');
const inputJurusan = document.getElementById('jurusan');
const inputAlamat = document.getElementById('alamat');
const inputFoto = document.getElementById('foto');
const fotoLama = document.getElementById('fotoLama');

const previewFoto = document.getElementById('previewFoto');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const btnHapusPilihanFoto = document.getElementById('btnHapusPilihanFoto');

const errorNis = document.getElementById('errorNis');
const errorNama = document.getElementById('errorNama');
const errorKelas = document.getElementById('errorKelas');
const errorJurusan = document.getElementById('errorJurusan');
const errorAlamat = document.getElementById('errorAlamat');
const errorFoto = document.getElementById('errorFoto');

const judulForm = document.getElementById('judulForm');
const btnSimpan = document.getElementById('btnSimpan');
const btnBatal = document.getElementById('btnBatal');
const btnRefresh = document.getElementById('btnRefresh');
const btnTambah = document.getElementById('btnTambah');
const btnTambahSidebar = document.getElementById('btnTambahSidebar');
const btnTutupModal = document.getElementById('btnTutupModal');
const btnDarkMode = document.getElementById('btnDarkMode');

const darkModeIcon = document.getElementById('darkModeIcon');
const darkModeText = document.getElementById('darkModeText');

const modalSiswa = document.getElementById('modalSiswa');
const modalOverlay = document.getElementById('modalOverlay');
const loadingOverlay = document.getElementById('loadingOverlay');

const tbodySiswa = document.getElementById('tbodySiswa');
const totalSiswa = document.getElementById('totalSiswa');
const jumlahData = document.getElementById('jumlahData');
const statusApi = document.getElementById('statusApi');
const statusDatabase = document.getElementById('statusDatabase');
const tempatPesan = document.getElementById('pesan');
const pesanModal = document.getElementById('pesanModal');

const inputPencarian = document.getElementById('inputPencarian');
const filterKelas = document.getElementById('filterKelas');
const jumlahPerHalaman = document.getElementById('jumlahPerHalaman');

const btnSebelumnya = document.getElementById('btnSebelumnya');
const btnBerikutnya = document.getElementById('btnBerikutnya');
const nomorHalaman = document.getElementById('nomorHalaman');
const paginationInfo = document.getElementById('paginationInfo');

let semuaSiswa = [];
let siswaTersaring = [];
let halamanAktif = 1;
let dataPerHalaman = 5;
let previewObjectUrl = null;

function escapeHtml(teks) {
    return String(teks ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function tampilkanPesan(message, jenis) {
    const namaClass =
        jenis === 'sukses'
            ? 'message-success'
            : 'message-error';

    tempatPesan.innerHTML = `
        <div class="${namaClass}">
            ${escapeHtml(message)}
        </div>
    `;

    setTimeout(function () {
        tempatPesan.innerHTML = '';
    }, 3500);
}

function tampilkanPesanModal(message) {
    pesanModal.innerHTML = `
        <div class="message-error">
            ${escapeHtml(message)}
        </div>
    `;
}

function hapusPesanModal() {
    pesanModal.innerHTML = '';
}

function tampilkanLoading() {
    loadingOverlay.classList.add('active');
}

function sembunyikanLoading() {
    loadingOverlay.classList.remove('active');
}

function aturStatus(terhubung) {
    if (terhubung) {
        statusApi.textContent = 'Terhubung';
        statusApi.className = 'status-text status-success';

        statusDatabase.textContent = 'Terhubung';
        statusDatabase.className = 'status-text status-success';
    } else {
        statusApi.textContent = 'Terputus';
        statusApi.className = 'status-text status-error';

        statusDatabase.textContent = 'Terputus';
        statusDatabase.className = 'status-text status-error';
    }
}

function tampilkanPreviewFoto(url) {
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
        previewObjectUrl = null;
    }

    if (url) {
        previewFoto.src = url;
        previewFoto.style.display = 'block';
        previewPlaceholder.style.display = 'none';
    } else {
        previewFoto.removeAttribute('src');
        previewFoto.style.display = 'none';
        previewPlaceholder.style.display = 'block';
    }
}

function tampilkanPreviewFile(file) {
    if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
    }

    previewObjectUrl = URL.createObjectURL(file);
    previewFoto.src = previewObjectUrl;
    previewFoto.style.display = 'block';
    previewPlaceholder.style.display = 'none';
}

function bukaModal() {
    hapusPesanModal();

    modalSiswa.classList.add('active');
    document.body.classList.add('modal-open');

    setTimeout(function () {
        inputNis.focus();
    }, 200);
}

function tutupModal() {
    modalSiswa.classList.remove('active');
    document.body.classList.remove('modal-open');

    resetForm();
}

function resetForm() {
    studentForm.reset();

    siswaId.value = '';
    fotoLama.value = '';

    judulForm.textContent = 'Tambah Siswa';
    btnSimpan.textContent = 'Simpan Data';
    btnSimpan.disabled = false;

    tampilkanPreviewFoto(null);
    hapusSemuaError();
    hapusPesanModal();
}

function hapusSemuaError() {
    errorNis.textContent = '';
    errorNama.textContent = '';
    errorKelas.textContent = '';
    errorJurusan.textContent = '';
    errorAlamat.textContent = '';
    errorFoto.textContent = '';

    inputNis.classList.remove('input-invalid');
    inputNama.classList.remove('input-invalid');
    inputKelas.classList.remove('input-invalid');
    inputJurusan.classList.remove('input-invalid');
    inputAlamat.classList.remove('input-invalid');
    inputFoto.classList.remove('input-invalid');
}

function beriError(input, tempatError, message) {
    input.classList.add('input-invalid');
    tempatError.textContent = message;
}

function validasiForm(dataSiswa) {
    hapusSemuaError();

    let valid = true;

    if (dataSiswa.nis === '') {
        beriError(
            inputNis,
            errorNis,
            'NIS wajib diisi'
        );

        valid = false;
    } else if (dataSiswa.nis.length < 4) {
        beriError(
            inputNis,
            errorNis,
            'NIS minimal 4 karakter'
        );

        valid = false;
    }

    if (dataSiswa.nama === '') {
        beriError(
            inputNama,
            errorNama,
            'Nama wajib diisi'
        );

        valid = false;
    } else if (dataSiswa.nama.length < 3) {
        beriError(
            inputNama,
            errorNama,
            'Nama minimal 3 karakter'
        );

        valid = false;
    }

    if (dataSiswa.kelas === '') {
        beriError(
            inputKelas,
            errorKelas,
            'Kelas wajib diisi'
        );

        valid = false;
    }

    if (dataSiswa.jurusan === '') {
        beriError(
            inputJurusan,
            errorJurusan,
            'Jurusan wajib diisi'
        );

        valid = false;
    }

    if (dataSiswa.alamat === '') {
        beriError(
            inputAlamat,
            errorAlamat,
            'Alamat wajib diisi'
        );

        valid = false;
    } else if (dataSiswa.alamat.length < 3) {
        beriError(
            inputAlamat,
            errorAlamat,
            'Alamat minimal 3 karakter'
        );

        valid = false;
    }

    const fileFoto = inputFoto.files[0];

    if (fileFoto) {
        const formatDiizinkan = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!formatDiizinkan.includes(fileFoto.type)) {
            beriError(
                inputFoto,
                errorFoto,
                'Foto harus berformat JPG, PNG, atau WEBP'
            );

            valid = false;
        }

        if (fileFoto.size > 2 * 1024 * 1024) {
            beriError(
                inputFoto,
                errorFoto,
                'Ukuran foto maksimal 2 MB'
            );

            valid = false;
        }
    }

    return valid;
}

async function ambilDataSiswa() {
    tbodySiswa.innerHTML = `
        <tr>
            <td colspan="8" class="empty">
                <div class="table-loading">
                    <div class="spinner-small"></div>
                    <span>Memuat data...</span>
                </div>
            </td>
        </tr>
    `;

    btnRefresh.disabled = true;
    btnRefresh.textContent = 'Memuat...';

    try {
        const response = await fetch(API_URL);
        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message ||
                'Data siswa gagal diambil'
            );
        }

        semuaSiswa = hasil.data || [];

        totalSiswa.textContent = semuaSiswa.length;

        aturStatus(true);
        isiPilihanKelas();
        terapkanFilter();
    } catch (error) {
        console.error(error);

        semuaSiswa = [];
        siswaTersaring = [];

        totalSiswa.textContent = '0';
        jumlahData.textContent = '0 data';

        aturStatus(false);

        tbodySiswa.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Data gagal diambil. Pastikan Express dan MySQL berjalan.
                </td>
            </tr>
        `;

        tampilkanPagination();
    } finally {
        btnRefresh.disabled = false;
        btnRefresh.textContent = '↻ Refresh';
    }
}

function isiPilihanKelas() {
    const kelasSebelumnya = filterKelas.value;

    const daftarKelas = [
        ...new Set(
            semuaSiswa
                .map(function (siswa) {
                    return siswa.kelas;
                })
                .filter(function (kelas) {
                    return kelas;
                })
        )
    ].sort();

    filterKelas.innerHTML = `
        <option value="">Semua kelas</option>
    `;

    daftarKelas.forEach(function (kelas) {
        const option = document.createElement('option');

        option.value = kelas;
        option.textContent = kelas;

        filterKelas.appendChild(option);
    });

    if (daftarKelas.includes(kelasSebelumnya)) {
        filterKelas.value = kelasSebelumnya;
    }
}

function terapkanFilter() {
    const kataKunci = inputPencarian
        .value
        .trim()
        .toLowerCase();

    const kelasDipilih = filterKelas.value;

    siswaTersaring = semuaSiswa.filter(function (siswa) {
        const nama = String(
            siswa.nama ?? ''
        ).toLowerCase();

        const nis = String(
            siswa.nis ?? ''
        ).toLowerCase();

        const kelas = String(
            siswa.kelas ?? ''
        );

        const cocokPencarian =
            nama.includes(kataKunci) ||
            nis.includes(kataKunci);

        const cocokKelas =
            kelasDipilih === '' ||
            kelas === kelasDipilih;

        return cocokPencarian && cocokKelas;
    });

    jumlahData.textContent =
        `${siswaTersaring.length} data`;

    const totalHalaman = Math.max(
        1,
        Math.ceil(
            siswaTersaring.length /
            dataPerHalaman
        )
    );

    if (halamanAktif > totalHalaman) {
        halamanAktif = totalHalaman;
    }

    tampilkanTabel();
    tampilkanPagination();
}

function tampilkanTabel() {
    tbodySiswa.innerHTML = '';

    if (siswaTersaring.length === 0) {
        tbodySiswa.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Data siswa tidak ditemukan.
                </td>
            </tr>
        `;

        return;
    }

    const indeksAwal =
        (halamanAktif - 1) * dataPerHalaman;

    const indeksAkhir =
        indeksAwal + dataPerHalaman;

    const dataHalaman = siswaTersaring.slice(
        indeksAwal,
        indeksAkhir
    );

    dataHalaman.forEach(function (siswa, index) {
        const nomor = indeksAwal + index + 1;
        const baris = document.createElement('tr');

        const hurufAwal = String(
            siswa.nama || 'S'
        )
            .charAt(0)
            .toUpperCase();

        const tampilanFoto = siswa.foto_url
            ? `
                <img
                    src="${escapeHtml(siswa.foto_url)}"
                    alt="Foto siswa"
                    class="student-photo"
                >
            `
            : `
                <div class="student-photo-placeholder">
                    ${escapeHtml(hurufAwal)}
                </div>
            `;

        baris.innerHTML = `
            <td>${nomor}</td>

            <td>
                ${tampilanFoto}
            </td>

            <td>
                <span class="nis-badge">
                    ${escapeHtml(siswa.nis)}
                </span>
            </td>

            <td>
                <span class="student-name">
                    ${escapeHtml(siswa.nama)}
                </span>
            </td>

            <td>${escapeHtml(siswa.kelas)}</td>
            <td>${escapeHtml(siswa.jurusan)}</td>
            <td>${escapeHtml(siswa.alamat)}</td>

            <td>
                <div class="action-buttons">
                    <button
                        type="button"
                        class="btn-edit"
                        data-id="${siswa.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn-hapus"
                        data-id="${siswa.id}"
                        data-nama="${escapeHtml(siswa.nama)}"
                    >
                        Hapus
                    </button>
                </div>
            </td>
        `;

        tbodySiswa.appendChild(baris);
    });
}

function tampilkanPagination() {
    const totalData = siswaTersaring.length;

    const totalHalaman = Math.max(
        1,
        Math.ceil(totalData / dataPerHalaman)
    );

    const indeksAwal =
        totalData === 0
            ? 0
            : (
                (halamanAktif - 1) *
                dataPerHalaman
            ) + 1;

    const indeksAkhir = Math.min(
        halamanAktif * dataPerHalaman,
        totalData
    );

    paginationInfo.textContent =
        totalData === 0
            ? 'Menampilkan 0 data'
            : `Menampilkan ${indeksAwal}-${indeksAkhir} dari ${totalData} data`;

    btnSebelumnya.disabled =
        halamanAktif <= 1 ||
        totalData === 0;

    btnBerikutnya.disabled =
        halamanAktif >= totalHalaman ||
        totalData === 0;

    nomorHalaman.innerHTML = '';

    if (totalData === 0) {
        return;
    }

    for (
        let nomor = 1;
        nomor <= totalHalaman;
        nomor++
    ) {
        const tombolNomor =
            document.createElement('button');

        tombolNomor.type = 'button';
        tombolNomor.textContent = nomor;
        tombolNomor.className = 'page-number';

        if (nomor === halamanAktif) {
            tombolNomor.classList.add('active');
        }

        tombolNomor.addEventListener(
            'click',
            function () {
                halamanAktif = nomor;

                tampilkanTabel();
                tampilkanPagination();

                document
                    .getElementById('dataSiswa')
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            }
        );

        nomorHalaman.appendChild(tombolNomor);
    }
}

inputFoto.addEventListener('change', function () {
    hapusSemuaError();

    const fileFoto = inputFoto.files[0];

    if (!fileFoto) {
        tampilkanPreviewFoto(
            fotoLama.value || null
        );

        return;
    }

    const formatDiizinkan = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (!formatDiizinkan.includes(fileFoto.type)) {
        beriError(
            inputFoto,
            errorFoto,
            'Foto harus berformat JPG, PNG, atau WEBP'
        );

        inputFoto.value = '';

        tampilkanPreviewFoto(
            fotoLama.value || null
        );

        return;
    }

    if (fileFoto.size > 2 * 1024 * 1024) {
        beriError(
            inputFoto,
            errorFoto,
            'Ukuran foto maksimal 2 MB'
        );

        inputFoto.value = '';

        tampilkanPreviewFoto(
            fotoLama.value || null
        );

        return;
    }

    tampilkanPreviewFile(fileFoto);
});

btnHapusPilihanFoto.addEventListener(
    'click',
    function () {
        inputFoto.value = '';
        errorFoto.textContent = '';

        inputFoto.classList.remove(
            'input-invalid'
        );

        tampilkanPreviewFoto(
            fotoLama.value || null
        );
    }
);

studentForm.addEventListener(
    'submit',
    async function (event) {
        event.preventDefault();

        const id = siswaId.value;

        const dataSiswa = {
            nis: inputNis.value.trim(),
            nama: inputNama.value.trim(),
            kelas: inputKelas.value.trim(),
            jurusan: inputJurusan.value.trim(),
            alamat: inputAlamat.value.trim()
        };

        if (!validasiForm(dataSiswa)) {
            tampilkanPesanModal(
                'Periksa kembali data yang kamu masukkan'
            );

            return;
        }

        let url = API_URL;
        let method = 'POST';

        if (id !== '') {
            url = `${API_URL}/${id}`;
            method = 'PUT';
        }

        const formData = new FormData();

        formData.append('nis', dataSiswa.nis);
        formData.append('nama', dataSiswa.nama);
        formData.append('kelas', dataSiswa.kelas);
        formData.append('jurusan', dataSiswa.jurusan);
        formData.append('alamat', dataSiswa.alamat);

        if (inputFoto.files[0]) {
            formData.append(
                'foto',
                inputFoto.files[0]
            );
        }

        btnSimpan.disabled = true;

        btnSimpan.textContent =
            method === 'POST'
                ? 'Menyimpan...'
                : 'Mengubah...';

        tampilkanLoading();

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const hasil = await response.json();

            if (!response.ok) {
                throw new Error(
                    hasil.message ||
                    'Data siswa gagal disimpan'
                );
            }

            tutupModal();

            tampilkanPesan(
                hasil.message,
                'sukses'
            );

            await ambilDataSiswa();
        } catch (error) {
            console.error(error);

            tampilkanPesanModal(error.message);

            btnSimpan.disabled = false;

            btnSimpan.textContent =
                id === ''
                    ? 'Simpan Data'
                    : 'Update Data';
        } finally {
            sembunyikanLoading();
        }
    }
);

async function ambilSiswaBerdasarkanId(id) {
    tampilkanLoading();

    try {
        const response = await fetch(
            `${API_URL}/${id}`
        );

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message ||
                'Data siswa tidak ditemukan'
            );
        }

        const siswa = hasil.data;

        resetForm();

        siswaId.value = siswa.id;
        inputNis.value = siswa.nis;
        inputNama.value = siswa.nama;
        inputKelas.value = siswa.kelas;
        inputJurusan.value = siswa.jurusan;
        inputAlamat.value = siswa.alamat;

        fotoLama.value = siswa.foto_url || '';

        tampilkanPreviewFoto(
            siswa.foto_url || null
        );

        judulForm.textContent = 'Edit Siswa';
        btnSimpan.textContent = 'Update Data';

        bukaModal();
    } catch (error) {
        console.error(error);

        tampilkanPesan(
            error.message,
            'gagal'
        );
    } finally {
        sembunyikanLoading();
    }
}

async function hapusSiswa(id, nama) {
    const yakin = confirm(
        `Apakah kamu yakin ingin menghapus siswa ${nama}?`
    );

    if (!yakin) {
        return;
    }

    tampilkanLoading();

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: 'DELETE'
            }
        );

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message ||
                'Data siswa gagal dihapus'
            );
        }

        tampilkanPesan(
            hasil.message,
            'sukses'
        );

        await ambilDataSiswa();
    } catch (error) {
        console.error(error);

        tampilkanPesan(
            error.message,
            'gagal'
        );
    } finally {
        sembunyikanLoading();
    }
}

tbodySiswa.addEventListener(
    'click',
    async function (event) {
        const tombolEdit =
            event.target.closest('.btn-edit');

        const tombolHapus =
            event.target.closest('.btn-hapus');

        if (tombolEdit) {
            await ambilSiswaBerdasarkanId(
                tombolEdit.dataset.id
            );
        }

        if (tombolHapus) {
            await hapusSiswa(
                tombolHapus.dataset.id,
                tombolHapus.dataset.nama
            );
        }
    }
);

inputPencarian.addEventListener(
    'input',
    function () {
        halamanAktif = 1;
        terapkanFilter();
    }
);

filterKelas.addEventListener(
    'change',
    function () {
        halamanAktif = 1;
        terapkanFilter();
    }
);

jumlahPerHalaman.addEventListener(
    'change',
    function () {
        dataPerHalaman = Number(
            jumlahPerHalaman.value
        );

        halamanAktif = 1;

        tampilkanTabel();
        tampilkanPagination();
    }
);

btnSebelumnya.addEventListener(
    'click',
    function () {
        if (halamanAktif > 1) {
            halamanAktif--;

            tampilkanTabel();
            tampilkanPagination();
        }
    }
);

btnBerikutnya.addEventListener(
    'click',
    function () {
        const totalHalaman = Math.ceil(
            siswaTersaring.length /
            dataPerHalaman
        );

        if (halamanAktif < totalHalaman) {
            halamanAktif++;

            tampilkanTabel();
            tampilkanPagination();
        }
    }
);

btnTambah.addEventListener(
    'click',
    function () {
        resetForm();
        bukaModal();
    }
);

btnTambahSidebar.addEventListener(
    'click',
    function () {
        resetForm();
        bukaModal();
    }
);

btnTutupModal.addEventListener(
    'click',
    function () {
        tutupModal();
    }
);

btnBatal.addEventListener(
    'click',
    function () {
        tutupModal();
    }
);

modalOverlay.addEventListener(
    'click',
    function () {
        tutupModal();
    }
);

btnRefresh.addEventListener(
    'click',
    async function () {
        halamanAktif = 1;

        await ambilDataSiswa();

        tampilkanPesan(
            'Data berhasil diperbarui',
            'sukses'
        );
    }
);

function aktifkanDarkMode() {
    document.body.classList.add('dark-mode');

    darkModeIcon.textContent = '☀';
    darkModeText.textContent = 'Light Mode';

    localStorage.setItem(
        'studentTheme',
        'dark'
    );
}

function nonaktifkanDarkMode() {
    document.body.classList.remove('dark-mode');

    darkModeIcon.textContent = '☾';
    darkModeText.textContent = 'Dark Mode';

    localStorage.setItem(
        'studentTheme',
        'light'
    );
}

btnDarkMode.addEventListener(
    'click',
    function () {
        const sedangDarkMode =
            document.body.classList.contains(
                'dark-mode'
            );

        if (sedangDarkMode) {
            nonaktifkanDarkMode();
        } else {
            aktifkanDarkMode();
        }
    }
);

document.addEventListener(
    'keydown',
    function (event) {
        if (
            event.key === 'Escape' &&
            modalSiswa.classList.contains('active')
        ) {
            tutupModal();
        }
    }
);

const semuaMenu =
    document.querySelectorAll('.nav-link');

semuaMenu.forEach(function (menu) {
    menu.addEventListener(
        'click',
        function () {
            semuaMenu.forEach(
                function (item) {
                    item.classList.remove(
                        'active'
                    );
                }
            );

            menu.classList.add('active');
        }
    );
});

const temaTersimpan =
    localStorage.getItem('studentTheme');

if (temaTersimpan === 'dark') {
    aktifkanDarkMode();
}

ambilDataSiswa();