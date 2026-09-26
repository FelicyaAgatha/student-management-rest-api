const API_URL = '/api/siswa';

const studentForm = document.getElementById('studentForm');
const siswaId = document.getElementById('siswaId');

const inputNis = document.getElementById('nis');
const inputNama = document.getElementById('nama');
const inputKelas = document.getElementById('kelas');
const inputJurusan = document.getElementById('jurusan');
const inputAlamat = document.getElementById('alamat');

const judulForm = document.getElementById('judulForm');
const btnSimpan = document.getElementById('btnSimpan');
const btnBatal = document.getElementById('btnBatal');
const btnRefresh = document.getElementById('btnRefresh');
const btnTambah = document.getElementById('btnTambah');
const btnTambahSidebar = document.getElementById('btnTambahSidebar');
const btnTutupModal = document.getElementById('btnTutupModal');

const modalSiswa = document.getElementById('modalSiswa');
const modalOverlay = document.getElementById('modalOverlay');

const tbodySiswa = document.getElementById('tbodySiswa');
const totalSiswa = document.getElementById('totalSiswa');
const jumlahData = document.getElementById('jumlahData');
const statusApi = document.getElementById('statusApi');
const statusDatabase = document.getElementById('statusDatabase');
const tempatPesan = document.getElementById('pesan');

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
    }, 3000);
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

function bukaModal() {
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

    judulForm.textContent = 'Tambah Siswa';
    btnSimpan.textContent = 'Simpan Data';
    btnSimpan.disabled = false;
}

async function ambilDataSiswa() {
    tbodySiswa.innerHTML = `
        <tr>
            <td colspan="7" class="empty">
                Memuat data...
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
                hasil.message || 'Data siswa gagal diambil'
            );
        }

        const daftarSiswa = hasil.data || [];

        totalSiswa.textContent = daftarSiswa.length;
        jumlahData.textContent = `${daftarSiswa.length} data`;

        aturStatus(true);
        tampilkanTabel(daftarSiswa);
    } catch (error) {
        console.error(error);

        totalSiswa.textContent = '0';
        jumlahData.textContent = '0 data';

        aturStatus(false);

        tbodySiswa.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    Data gagal diambil. Pastikan Express dan MySQL berjalan.
                </td>
            </tr>
        `;
    } finally {
        btnRefresh.disabled = false;
        btnRefresh.textContent = '↻ Refresh';
    }
}

function tampilkanTabel(daftarSiswa) {
    tbodySiswa.innerHTML = '';

    if (daftarSiswa.length === 0) {
        tbodySiswa.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    Belum ada data siswa.
                </td>
            </tr>
        `;

        return;
    }

    daftarSiswa.forEach(function (siswa, index) {
        const baris = document.createElement('tr');

        baris.innerHTML = `
            <td>${index + 1}</td>

            <td>${escapeHtml(siswa.nis)}</td>

            <td>
                <span class="student-name">
                    ${escapeHtml(siswa.nama)}
                </span>
            </td>

            <td>${escapeHtml(siswa.kelas)}</td>

            <td>${escapeHtml(siswa.jurusan)}</td>

            <td>${escapeHtml(siswa.alamat)}</td>

            <td>
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
            </td>
        `;

        tbodySiswa.appendChild(baris);
    });
}

function validasiForm(dataSiswa) {
    if (
        !dataSiswa.nis ||
        !dataSiswa.nama ||
        !dataSiswa.kelas ||
        !dataSiswa.jurusan ||
        !dataSiswa.alamat
    ) {
        return 'Semua data wajib diisi';
    }

    return null;
}

studentForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const id = siswaId.value;

    const dataSiswa = {
        nis: inputNis.value.trim(),
        nama: inputNama.value.trim(),
        kelas: inputKelas.value.trim(),
        jurusan: inputJurusan.value.trim(),
        alamat: inputAlamat.value.trim()
    };

    const kesalahan = validasiForm(dataSiswa);

    if (kesalahan) {
        alert(kesalahan);
        return;
    }

    let url = API_URL;
    let method = 'POST';

    if (id !== '') {
        url = `${API_URL}/${id}`;
        method = 'PUT';
    }

    btnSimpan.disabled = true;

    btnSimpan.textContent =
        method === 'POST'
            ? 'Menyimpan...'
            : 'Mengubah...';

    try {
        const response = await fetch(url, {
            method: method,

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dataSiswa)
        });

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message || 'Data siswa gagal disimpan'
            );
        }

        tutupModal();
        tampilkanPesan(hasil.message, 'sukses');

        await ambilDataSiswa();
    } catch (error) {
        console.error(error);

        alert(error.message);

        btnSimpan.disabled = false;

        btnSimpan.textContent =
            id === ''
                ? 'Simpan Data'
                : 'Update Data';
    }
});

async function ambilSiswaBerdasarkanId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message || 'Data siswa tidak ditemukan'
            );
        }

        const siswa = hasil.data;

        siswaId.value = siswa.id;
        inputNis.value = siswa.nis;
        inputNama.value = siswa.nama;
        inputKelas.value = siswa.kelas;
        inputJurusan.value = siswa.jurusan;
        inputAlamat.value = siswa.alamat;

        judulForm.textContent = 'Edit Siswa';
        btnSimpan.textContent = 'Update Data';

        bukaModal();
    } catch (error) {
        console.error(error);
        tampilkanPesan(error.message, 'gagal');
    }
}

async function hapusSiswa(id, nama) {
    const yakin = confirm(
        `Apakah kamu yakin ingin menghapus siswa ${nama}?`
    );

    if (!yakin) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const hasil = await response.json();

        if (!response.ok) {
            throw new Error(
                hasil.message || 'Data siswa gagal dihapus'
            );
        }

        tampilkanPesan(hasil.message, 'sukses');
        await ambilDataSiswa();
    } catch (error) {
        console.error(error);
        tampilkanPesan(error.message, 'gagal');
    }
}

tbodySiswa.addEventListener('click', async function (event) {
    const tombolEdit = event.target.closest('.btn-edit');
    const tombolHapus = event.target.closest('.btn-hapus');

    if (tombolEdit) {
        const id = tombolEdit.dataset.id;
        await ambilSiswaBerdasarkanId(id);
    }

    if (tombolHapus) {
        const id = tombolHapus.dataset.id;
        const nama = tombolHapus.dataset.nama;

        await hapusSiswa(id, nama);
    }
});

btnTambah.addEventListener('click', function () {
    resetForm();
    bukaModal();
});

btnTambahSidebar.addEventListener('click', function () {
    resetForm();
    bukaModal();
});

btnTutupModal.addEventListener('click', function () {
    tutupModal();
});

btnBatal.addEventListener('click', function () {
    tutupModal();
});

modalOverlay.addEventListener('click', function () {
    tutupModal();
});

btnRefresh.addEventListener('click', function () {
    ambilDataSiswa();
});

document.addEventListener('keydown', function (event) {
    if (
        event.key === 'Escape' &&
        modalSiswa.classList.contains('active')
    ) {
        tutupModal();
    }
});

const semuaMenu = document.querySelectorAll('.nav-link');

semuaMenu.forEach(function (menu) {
    menu.addEventListener('click', function () {
        semuaMenu.forEach(function (item) {
            item.classList.remove('active');
        });

        menu.classList.add('active');
    });
});

ambilDataSiswa();