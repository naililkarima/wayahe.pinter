let currentRole = '';
let books = JSON.parse(localStorage.getItem('books')) || [
    { title: 'Novel: Harry Potter', available: true, resi: null, tanggalPengembalian: null, kategori: 'Novel', namaPeminjam: null, absenPeminjam: null, kelasPeminjam: null },
    { title: 'Matematika Kelas X', available: true, resi: null, tanggalPengembalian: null, kategori: 'Pelajaran Kelas X', namaPeminjam: null, absenPeminjam: null, kelasPeminjam: null },
    { title: 'Fisika Kelas XI', available: true, resi: null, tanggalPengembalian: null, kategori: 'Pelajaran Kelas XI', namaPeminjam: null, absenPeminjam: null, kelasPeminjam: null },
    { title: 'Kimia Kelas XII', available: false, resi: 'RESI20231120-001', tanggalPengembalian: '2023-12-01', kategori: 'Pelajaran Kelas XII', namaPeminjam: 'Ahmad', absenPeminjam: '15', kelasPeminjam: 'XII IPA 1' },
];

let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [
    {
        title: 'Quiz Matematika Dasar',
        questions: [
            { question: 'Berapa 2 + 2?', options: ['3', '4', '5'], correct: 1 },
            { question: 'Apa akar kuadrat dari 9?', options: ['2', '3', '4'], correct: 1 }
        ]
    }
];

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'siswa' && password === '123654') {
        currentRole = 'siswa';
        document.getElementById('login').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadContent();
    } else if (username === 'guru' && password === 'abcefd') {
        currentRole = 'guru';
        document.getElementById('login').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadContent();
    } else if (username === 'penjaga perpus' && password === 'abc321') {
        currentRole = 'penjaga';
        document.getElementById('login').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadContent();
    } else {
        alert('Username atau password salah! Coba lagi.');
    }
}

function goHome() {
    currentRole = '';
    document.getElementById('content').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('content').innerHTML = '';
    document.getElementById('loginForm').reset();
}

document.getElementById('loginForm').addEventListener('submit', login);

function loadContent() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if(currentRole === 'siswa') {
        content.innerHTML = `
            <h2><i class="fas fa-search"></i> Dashboard Siswa</h2>
            <button class="logout-btn" onclick="goHome()">Logout</button>
            <h3>Filter Kategori Buku</h3>
            <select id="filterKategori" onchange="searchBook()">
                <option value="Semua">Semua Kategori</option>
                <option value="Novel">Novel</option>
                <option value="Pelajaran Kelas X">Pelajaran Kelas X</option>
                <option value="Pelajaran Kelas XI">Pelajaran Kelas XI</option>
                <option value="Pelajaran Kelas XII">Pelajaran Kelas XII</option>
            </select>
            <h3>Cari Buku</h3>
            <input type="text" id="searchBook" placeholder="Ketik judul buku" oninput="searchBook()" />
            <div id="bookResults"></div>
            <h3>Kerjakan Quiz</h3>
            <select id="quizSelect"></select>
            <button onclick="startQuiz()">Mulai Quiz</button>
            <div id="quizContainer"></div>`;
        loadQuizzesForStudent();
    }
    else if(currentRole === 'guru') {
        content.innerHTML = `
            <h2><i class="fas fa-edit"></i> Dashboard Guru</h2>
            <button class="logout-btn" onclick="goHome()">Logout</button>
            <h3>Buat Bank Soal</h3>
            <form id="quizForm">
                <input type="text" id="quizTitle" placeholder="Judul Quiz" required />
                <div id="questionsContainer"></div>
                <button type="button" onclick="addQuestion()">Tambah Soal</button>
                <button type="submit">Simpan Quiz</button>
            </form>`;
        document.getElementById('quizForm').addEventListener('submit', saveQuiz);
    }
    else if(currentRole === 'penjaga') {
        content.innerHTML = `
            <h2><i class="fas fa-cogs"></i> Dashboard Penjaga Perpustakaan</h2>
            <button class="logout-btn" onclick="goHome()">Logout</button>
            <h3>Tambah Buku Baru</h3>
            <form id="bookForm">
                <input type="text" id="bookTitle" placeholder="Judul Buku" required />
                <input type="text" id="bookResi" placeholder="Nomor Resi Buku" required />
                <select id="bookKategori" required>
                    <option value="">Pilih Kategori</option>
                    <option value="Novel">Novel</option>
                    <option value="Pelajaran Kelas X">Pelajaran Kelas X</option>
                    <option value="Pelajaran Kelas XI">Pelajaran Kelas XI</option>
                    <option value="Pelajaran Kelas XII">Pelajaran Kelas XII</option>
                </select>
                <button type="submit">Tambah Buku</button>
            </form>
            <h3>Daftar Buku</h3>
            <ul id="bookList"></ul>`;
        document.getElementById('bookForm').addEventListener('submit', addBook);
        displayBooks();
    }

    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
}

function searchBook() {
    const query = document.getElementById('searchBook').value.toLowerCase();
    const kategori = document.getElementById('filterKategori').value;
    const results = books.filter(b =>
        (kategori === 'Semua' || b.kategori === kategori) &&
        b.title.toLowerCase().includes(query)
    );
    const resultsDiv = document.getElementById('bookResults');
    if(results.length) {
        resultsDiv.innerHTML = results.map(book => `
            <li>
                <strong>${book.title}</strong> (${book.kategori}) -
                Status: ${book.available ? '<span style="color:green">Tersedia</span>' : '<span style="color:red">Dipinjam</span>'}
            </li>`).join('');
    } else {
        resultsDiv.innerHTML = '<p>Tidak ada buku ditemukan.</p>';
    }
}

window.selectedOptions = {};

function loadQuizzesForStudent() {
    const select = document.getElementById('quizSelect');
    select.innerHTML = '<option>Pilih Quiz</option>' + quizzes.map((quiz, index) => `<option value="${index}">${quiz.title}</option>`).join('');
}

function startQuiz() {
    const index = document.getElementById('quizSelect').value;
    if (index === 'Pilih Quiz') return alert('Pilih quiz dulu!');
    const quiz = quizzes[index];
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    window.selectedOptions = {};
    quiz.questions.forEach((q, i) => {
        container.innerHTML += `
        <div class="question">
            <p><strong>${q.question}</strong></p>
            <div class="options" id="options-q${i}">
                ${q.options.map((opt, j) => `<div class="option" onclick="selectOption(${i},${j})">${opt}</div>`).join('')}
            </div>
        </div>`;
    });
    container.innerHTML += `<button onclick="submitQuiz(${index})">Submit</button>`;
}

function selectOption(soalIndex, optionIndex) {
    window.selectedOptions[soalIndex] = optionIndex;
    const optionsDiv = document.querySelector(`#options-q${soalIndex}`);
    optionsDiv.querySelectorAll('.option').forEach(optDiv => {
        optDiv.style.background = '';
        optDiv.style.color = '#253858';
        optDiv.style.fontWeight = '600';
    });
    const opsiTerpilih = optionsDiv.children[optionIndex];
    if (opsiTerpilih) {
        opsiTerpilih.style.background = '#f8b500';
        opsiTerpilih.style.color = 'white';
        opsiTerpilih.style.fontWeight = '700';
    }
}

function submitQuiz(index) {
    const quiz = quizzes[index];
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
        if (window.selectedOptions[i] !== undefined && window.selectedOptions[i] === quiz.questions[i].correct)
            score++;
    }
    document.getElementById('quizContainer').innerHTML += `<div class="quiz-result">Nilai Anda: ${score}/${quiz.questions.length}</div>`;
}

function addQuestion() {
    const container = document.getElementById('questionsContainer');
    const questionIndex = container.children.length;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
    <h4>Soal ${questionIndex + 1}</h4>
    <input type="text" placeholder="Pertanyaan" required />
    <div class="options">
        <input type="text" placeholder="Opsi 1" required />
        <input type="text" placeholder="Opsi 2" required />
        <input type="text" placeholder="Opsi 3 (opsional)" />
        <input type="text" placeholder="Opsi 4 (opsional)" />
    </div>
    <select required>
        <option value="">Pilih Jawaban Benar</option>
        <option value="0">Opsi 1</option>
        <option value="1">Opsi 2</option>
        <option value="2">Opsi 3</option>
        <option value="3">Opsi 4</option>
    </select>
    <button type="button" onclick="removeQuestion(this)">Hapus Soal Ini</button>
    `;
    container.appendChild(questionDiv);
}

function removeQuestion(button) {
    button.parentElement.remove();
}

function saveQuiz(e) {
    e.preventDefault();
    const title = document.getElementById('quizTitle').value.trim();
    const questions = [];
    const questionDivs = document.querySelectorAll('.question');

    for (let div of questionDivs) {
        const question = div.querySelector('input[placeholder="Pertanyaan"]').value.trim();
        const options = Array.from(div.querySelectorAll('.options input')).map(i => i.value.trim()).filter(o => o !== '');
        const correct = parseInt(div.querySelector('select').value);

        if (!question || options.length < 2 || isNaN(correct) || correct >= options.length) {
            alert('Soal tidak lengkap! Pastikan pertanyaan, minimal 2 opsi, dan jawaban benar sesuai opsi.');
            return;
        }
        questions.push({ question, options, correct });
    }

    if (!title) {
        alert('Judul quiz tidak boleh kosong!');
        return;
    }
    if (questions.length === 0) {
        alert('Tambahkan setidaknya satu soal!');
        return;
    }

    quizzes.push({ title, questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    alert('Quiz disimpan!');
    document.getElementById('quizForm').reset();
    document.getElementById('questionsContainer').innerHTML = '';
}

function addBook(e) {
    e.preventDefault();
    const title = document.getElementById('bookTitle').value.trim();
    const resi = document.getElementById('bookResi').value.trim();
    const kategori = document.getElementById('bookKategori').value;
    if (!title) {
        alert('Judul buku tidak boleh kosong!');
        return;
    }
    if (!resi) {
        alert('Nomor Resi buku harus diisi!');
        return;
    }
    if (kategori === '') {
        alert('Pilih kategori buku terlebih dahulu!');
        return;
    }
    if (books.some(b => b.resi === resi)) {
        alert('Nomor Resi sudah dipakai, gunakan nomor lain!');
        return;
    }
    books.push({ title, available: true, resi: resi, tanggalPengembalian: null, kategori, namaPeminjam: null, absenPeminjam: null, kelasPeminjam: null });
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    document.getElementById('bookForm').reset();
}

function displayBooks() {
    const list = document.getElementById('bookList');
    if (books.length === 0) {
        list.innerHTML = '<p>Belum ada buku tersedia.</p>';
        return;
    }
    list.innerHTML = books.map((book, idx) => `
        <li>
            <strong>${book.title}</strong> (${book.kategori}) - 
            ${book.available
            ? `<span style="color:green">Tersedia</span>`
            : `<span style="color:red">Dipinjam</span><br>
               <small>Nomor Resi: <em>${book.resi}</em></small><br>
               <small>Tanggal Pengembalian: <em>${book.tanggalPengembalian || '-'}</em></small><br>
               <small>Peminjam: <em>${book.namaPeminjam || '-'} (Absen: ${book.absenPeminjam || '-'}, Kelas: ${book.kelasPeminjam || '-'})</em></small>`
            }
            <br/>
            ${book.available
            ? `<button onclick="pinjamBuku(${idx})" style="background:#28a745;color:#fff;">Pinjam Buku</button>`
            : `<button onclick="kembalikanBuku(${idx})" style="background:#ffc107;">Kembalikan Buku</button>`
            }
            <button onclick="deleteBook(${idx})" style="background:#dc3545;margin-left:10px;color:#fff;">Hapus</button>
        </li>
    `).join('');
}

function pinjamBuku(index) {
    const buku = books[index];
    const nama = prompt('Masukkan nama peminjam:');
    const absen = prompt('Masukkan absen peminjam:');
    const kelas = prompt('Masukkan kelas peminjam:');
    const tanggalKembali = prompt('Masukkan tanggal pengembalian (YYYY-MM-DD):');

    if (!nama || !absen || !kelas || !tanggalKembali) {
        alert('Semua data peminjam dan tanggal pengembalian wajib diisi!');
        return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalKembali)) {
        alert('Format tanggal tidak valid, contoh: 2023-12-31');
        return;
    }

    buku.available = false;
    buku.tanggalPengembalian = tanggalKembali;
    buku.namaPeminjam = nama;
    buku.absenPeminjam = absen;
    buku.kelasPeminjam = kelas;
    localStorage.setItem('books', JSON.stringify(books));
    alert(`Buku "${buku.title}" berhasil dipinjam.\nNomor Resi: ${buku.resi}\nTanggal Pengembalian: ${buku.tanggalPengembalian}\nPeminjam: ${buku.namaPeminjam} (Absen: ${buku.absenPeminjam}, Kelas: ${buku.kelasPeminjam})`);
    displayBooks();
}

function kembalikanBuku(index) {
    if (!confirm('Apakah buku sudah dikembalikan?')) return;
    const buku = books[index];
    buku.available = true;
    buku.tanggalPengembalian = null;
    buku.namaPeminjam = null;
    buku.absenPeminjam = null;
    buku.kelasPeminjam = null;
    localStorage.setItem('books', JSON.stringify(books));
    alert(`Buku "${buku.title}" sudah dikembalikan dan tersedia.`);
    displayBooks();
}

function deleteBook(index) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
}
