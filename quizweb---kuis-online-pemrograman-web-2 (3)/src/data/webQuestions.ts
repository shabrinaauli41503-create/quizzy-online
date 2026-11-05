import { QuizQuestion } from '../types/quiz';

export const INITIAL_WEB_QUESTIONS: QuizQuestion[] = [
  {
    id: 'web-01',
    question: 'Tag semantik HTML5 manakah yang paling tepat digunakan untuk membungkus konten utama sebuah halaman web (bukan sidebar atau header)?',
    options: ['<div>', '<main>', '<section>', '<article>'],
    correctAnswer: 1,
    explanation: '<main> merepresentasikan konten inti atau unik dari dokumen HTML yang tidak berulang di halaman lain seperti header, nav, atau footer.',
    category: 'HTML & CSS Modern',
    difficulty: 'Mudah'
  },
  {
    id: 'web-02',
    question: 'Pada CSS Flexbox, properti apa yang digunakan untuk mengatur perataan elemen anak secara horizontal sepanjang sumbu utama (main axis)?',
    options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
    correctAnswer: 1,
    explanation: 'justify-content mengatur alignment elemen sepanjang sumbu utama (secara default horizontal jika flex-direction adalah row).',
    category: 'HTML & CSS Modern',
    difficulty: 'Mudah'
  },
  {
    id: 'web-03',
    question: 'Apa perbedaan utama antara variabel yang dideklarasikan dengan "let" dan "var" di JavaScript modern (ES6)?',
    codeSnippet: `function test() {
  if (true) {
    var x = 10;
    let y = 20;
  }
  console.log(x); // 10
  console.log(y); // ReferenceError
}`,
    options: [
      'let bersifat block-scoped, sedangkan var bersifat function-scoped',
      'let tidak bisa diubah nilainya, sedangkan var bisa',
      'var hanya untuk angka, let untuk string',
      'Tidak ada perbedaan, let hanyalah alias dari var'
    ],
    correctAnswer: 0,
    explanation: 'let memiliki cakupan blok (block scope di dalam tanda kurung kurawal {}), sedangkan var terikat pada fungsi terluar (function scope).',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-04',
    question: 'Metode DOM API manakah yang paling fleksibel dan modern untuk memilih elemen pertama yang cocok dengan CSS selector tertentu?',
    options: ['document.getElementById()', 'document.querySelector()', 'document.getElementsByClassName()', 'document.findElement()'],
    correctAnswer: 1,
    explanation: 'document.querySelector() menerima CSS selector apa pun (.class, #id, div > p, dll.) dan mengembalikan elemen pertama yang cocok.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-05',
    question: 'Dalam komunikasi HTTP RESTful API, method HTTP manakah yang bersifat "Idempotent" dan digunakan untuk memperbarui seluruh representasi data?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    correctAnswer: 1,
    explanation: 'PUT bersifat idempotent, artinya mengeksekusi request yang sama berkali-kali akan menghasilkan state akhir resource yang sama di server.',
    category: 'Async & REST API',
    difficulty: 'Sedang'
  },
  {
    id: 'web-06',
    question: 'Apa status code HTTP standar yang dikembalikan server ketika user belum melakukan autentikasi (belum login / tidak ada token)?',
    options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
    correctAnswer: 1,
    explanation: '401 Unauthorized mengindikasikan bahwa request memerlukan kredensial otentikasi pengguna.',
    category: 'Web Security & HTTP',
    difficulty: 'Mudah'
  },
  {
    id: 'web-07',
    question: 'Perbedaan utama antara "localStorage" dan "sessionStorage" pada browser Web Storage API adalah:',
    options: [
      'localStorage hanya bisa menyimpan 10 byte data',
      'Data di sessionStorage otomatis terhapus saat tab atau jendela browser ditutup, sedangkan localStorage bertahan permanen',
      'localStorage hanya berjalan di server Node.js',
      'sessionStorage mengenkripsi data secara otomatis, localStorage tidak'
    ],
    correctAnswer: 1,
    explanation: 'sessionStorage memiliki masa hidup selama sesi tab browser aktif, sedangkan localStorage tersimpan hingga dihapus manual/oleh kode.',
    category: 'Database & Web Storage',
    difficulty: 'Mudah'
  },
  {
    id: 'web-08',
    question: 'Metode JavaScript apa yang digunakan untuk mengubah objek JavaScript menjadi format teks string JSON?',
    codeSnippet: `const mhs = { nama: "Budi", nim: "12345" };
const jsonString = JSON.???(mhs);`,
    options: ['JSON.parse()', 'JSON.stringify()', 'JSON.encode()', 'JSON.serialize()'],
    correctAnswer: 1,
    explanation: 'JSON.stringify() mengonversi objek/array JavaScript menjadi string format JSON.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-09',
    question: 'Dalam React, hook manakah yang digunakan untuk mengelola state internal pada functional component?',
    codeSnippet: `const [count, setCount] = ???(0);`,
    options: ['useEffect', 'useState', 'useRef', 'useContext'],
    correctAnswer: 1,
    explanation: 'useState adalah hook dasar React untuk membuat variabel state reaktif dan fungsi updater-nya.',
    category: 'React & Frontend',
    difficulty: 'Mudah'
  },
  {
    id: 'web-10',
    question: 'Pada React hook useEffect, apa akibatnya jika kita memberikan dependency array kosong "[]" sebagai argumen kedua?',
    codeSnippet: `useEffect(() => {
  fetchData();
}, []);`,
    options: [
      'Efek akan berjalan terus menerus setiap kali ada re-render (infinite loop)',
      'Efek hanya akan dieksekusi tepat satu kali setelah komponen pertama kali di-mount',
      'Efek tidak akan pernah dieksekusi sama sekali',
      'Aplikasi akan melempar error compile-time'
    ],
    correctAnswer: 1,
    explanation: 'Dependency array kosong [] memberitahu React bahwa efek tidak bergantung pada props/state apa pun, sehingga hanya berjalan sekali saat mount (mirip componentDidMount).',
    category: 'React & Frontend',
    difficulty: 'Sedang'
  },
  {
    id: 'web-11',
    question: 'Dalam framework Express.js (Node.js), fungsi apa yang bertindak sebagai jembatan untuk memproses request sebelum sampai ke handler route akhir?',
    codeSnippet: `app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  next();
});`,
    options: ['Controller', 'Middleware', 'Model', 'Router View'],
    correctAnswer: 1,
    explanation: 'Middleware adalah fungsi yang memiliki akses ke objek req, res, dan fungsi next() dalam siklus request-response Express.',
    category: 'Node.js & Express',
    difficulty: 'Sedang'
  },
  {
    id: 'web-12',
    question: 'Bagaimana cara membaca parameter ID dari URL dinamis pada Express.js?',
    codeSnippet: `app.get('/api/mahasiswa/:id', (req, res) => {
  const mhsId = req.???;
});`,
    options: ['req.body.id', 'req.params.id', 'req.query.id', 'req.headers.id'],
    correctAnswer: 1,
    explanation: 'Parameter rute dinamis (seperti :id) diekstraksi ke dalam objek req.params.',
    category: 'Node.js & Express',
    difficulty: 'Mudah'
  },
  {
    id: 'web-13',
    question: 'Mekanisme keamanan browser apa yang membatasi suatu domain memuat resource dari domain origin yang berbeda tanpa izin header yang sesuai?',
    options: ['CORS (Cross-Origin Resource Sharing)', 'CSRF', 'SQL Injection', 'DNS Spoofing'],
    correctAnswer: 0,
    explanation: 'CORS adalah mekanisme keamanan berbasis header HTTP yang memberi tahu browser apakah web origin diizinkan mengakses resource dari server lain.',
    category: 'Web Security & HTTP',
    difficulty: 'Sedang'
  },
  {
    id: 'web-14',
    question: 'Jenis serangan web di mana penyerang menyisipkan skrip JavaScript berbahaya ke dalam input pengguna yang kemudian dieksekusi di browser korban disebut:',
    options: ['SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Denial of Service (DoS)', 'Brute Force'],
    correctAnswer: 1,
    explanation: 'XSS (Cross-Site Scripting) terjadi ketika aplikasi memasukkan data yang tidak dipercaya ke dalam halaman web tanpa validasi atau escaping.',
    category: 'Web Security & HTTP',
    difficulty: 'Sedang'
  },
  {
    id: 'web-15',
    question: 'Struktur token JWT (JSON Web Token) terdiri dari 3 bagian yang dipisahkan oleh tanda titik (.), yaitu:',
    options: [
      'Header, Payload, Signature',
      'User, Password, Hash',
      'Origin, Method, Body',
      'Public Key, Private Key, Secret'
    ],
    correctAnswer: 0,
    explanation: 'JWT terdiri dari Header (algoritma & token type), Payload (claims data pengguna), dan Signature (verifikasi integritas).',
    category: 'Web Security & HTTP',
    difficulty: 'Sedang'
  },
  {
    id: 'web-16',
    question: 'Keyword manakah dalam JavaScript ES2017 yang digunakan untuk menunggu selesainya sebuah Promise di dalam fungsi async?',
    codeSnippet: `async function getMahasiswa() {
  const response = ??? fetch('/api/data');
  const data = ??? response.json();
  return data;
}`,
    options: ['wait', 'await', 'defer', 'then'],
    correctAnswer: 1,
    explanation: 'await menghentikan sementara eksekusi async function hingga Promise resolved atau rejected.',
    category: 'Async & REST API',
    difficulty: 'Mudah'
  },
  {
    id: 'web-17',
    question: 'Perintah CSS Grid manakah yang digunakan untuk membuat layout 3 kolom dengan lebar yang fleksibel dan seimbang secara proporsional?',
    options: [
      'grid-template-columns: 1fr 1fr 1fr;',
      'grid-columns: 33% 33% 33%;',
      'display: flex-grid(3);',
      'column-count: 3;'
    ],
    correctAnswer: 0,
    explanation: 'Unit 1fr (fractional unit) membagi ruang grid yang tersedia secara proporsional. repeat(3, 1fr) atau 1fr 1fr 1fr membuat 3 kolom sama lebar.',
    category: 'HTML & CSS Modern',
    difficulty: 'Mudah'
  },
  {
    id: 'web-18',
    question: 'Bagaimana cara menambahkan class "active" ke sebuah elemen HTML menggunakan JavaScript modern (ClassList API)?',
    options: [
      'element.className += "active"',
      'element.classList.add("active")',
      'element.setAttribute("class", "active")',
      'element.addClass("active")'
    ],
    correctAnswer: 1,
    explanation: 'element.classList.add() adalah metode modern, bersih, dan aman tanpa merusak class yang sudah ada sebelumnya.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-19',
    question: 'Apa fungsi dari operator spread (...) pada objek di JavaScript?',
    codeSnippet: `const user = { name: 'Aulia', role: 'Mahasiswa' };
const updated = { ...user, semester: 6 };`,
    options: [
      'Menghapus properti dari objek',
      'Menduplikasi dan menyalin seluruh properti dari objek lama ke objek baru secara immutable',
      'Mengubah objek menjadi string JSON',
      'Mengenkripsi isi properti objek'
    ],
    correctAnswer: 1,
    explanation: 'Spread operator (...) mengekstrak enumerable properties dari objek ke target objek baru secara shallow copy.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Sedang'
  },
  {
    id: 'web-20',
    question: 'Dalam arsitektur web modern, apa perbedaan mendasar antara SPA (Single Page Application) dan MPA (Multi Page Application)?',
    options: [
      'SPA tidak memerlukan server web sama sekali',
      'SPA hanya memuat satu file HTML di awal dan merender halaman secara dinamis lewat JavaScript di sisi client tanpa reload penuh',
      'MPA tidak bisa terhubung ke database relasional',
      'SPA hanya bisa diakses menggunakan koneksi WiFi'
    ],
    correctAnswer: 1,
    explanation: 'SPA seperti aplikasi React/Vue hanya meminta data JSON dari backend dan merender ulang tampilan tanpa me-reload seluruh halaman browser.',
    category: 'React & Frontend',
    difficulty: 'Sedang'
  },
  {
    id: 'web-21',
    question: 'Header HTTP manakah yang WAJIB disertakan oleh client saat mengirimkan payload data berformat JSON via method POST?',
    codeSnippet: `fetch('/api/simpan', {
  method: 'POST',
  headers: {
    '???': 'application/json'
  },
  body: JSON.stringify(data)
});`,
    options: ['Accept-Charset', 'Content-Type', 'User-Agent', 'Authorization'],
    correctAnswer: 1,
    explanation: 'Content-Type: application/json memberitahu server backend jenis MIME dari request body yang dikirimkan.',
    category: 'Async & REST API',
    difficulty: 'Mudah'
  },
  {
    id: 'web-22',
    question: 'Protokol apa yang digunakan untuk komunikasi dua arah (full-duplex) secara real-time dan berlatensi rendah antara browser dan server?',
    options: ['HTTP/1.1', 'WebSocket (ws://)', 'FTP', 'SMTP'],
    correctAnswer: 1,
    explanation: 'WebSocket memungkinkan koneksi persistent real-time dua arah tanpa overhead polling HTTP berulang kali.',
    category: 'Async & REST API',
    difficulty: 'Sedang'
  },
  {
    id: 'web-23',
    question: 'Apa fungsi dari atribut rel="noopener noreferrer" saat membuat link ke website eksternal dengan target="_blank"?',
    options: [
      'Mempercepat kecepatan download file',
      'Mencegah eksploitasi keamanan reverse tabnabbing (window.opener) dan menjaga privasi referrer',
      'Mengubah warna tautan menjadi biru',
      'Membuka link di aplikasi desktop terpisah'
    ],
    correctAnswer: 1,
    explanation: 'rel="noopener noreferrer" mencegah tab baru mengakses objek window.opener halaman asal, melindungi dari phising tabnabbing.',
    category: 'Web Security & HTTP',
    difficulty: 'Sulit'
  },
  {
    id: 'web-24',
    question: 'Dalam Express.js, middleware bawaan apa yang harus dipasang agar aplikasi dapat mem-parsing request body berformat JSON?',
    options: ['app.use(express.static())', 'app.use(express.json())', 'app.use(express.url())', 'app.use(express.body())'],
    correctAnswer: 1,
    explanation: 'express.json() adalah built-in middleware di Express 4.16+ untuk mengurai incoming request dengan JSON payloads.',
    category: 'Node.js & Express',
    difficulty: 'Mudah'
  },
  {
    id: 'web-25',
    question: 'Perintah SQL manakah yang digunakan untuk menggabungkan baris dari dua tabel yang berbeda berdasarkan kolom relasi yang sama?',
    options: ['SELECT * FROM a MERGE b', 'SELECT * FROM a INNER JOIN b ON a.id = b.a_id', 'UNION ALL', 'INSERT INTO JOIN'],
    correctAnswer: 1,
    explanation: 'INNER JOIN menghubungkan dua tabel berdasarkan kecocokan nilai kolom kunci (foreign key/primary key).',
    category: 'Database & Web Storage',
    difficulty: 'Sedang'
  },
  {
    id: 'web-26',
    question: 'Konsep "Virtual DOM" pada React bertujuan untuk:',
    options: [
      'Menyimpan seluruh database pengguna di memori browser',
      'Membandingkan perubahan state (diffing) di memori dan meminimalisir manipulasi lambat pada Real DOM browser',
      'Menggantikan peran server backend Node.js',
      'Menghilangkan kebutuhan akan sintaks CSS'
    ],
    correctAnswer: 1,
    explanation: 'Virtual DOM adalah representasi ringan UI di memori. React merekonsiliasi perubahan dan hanya meng-update bagian DOM asli yang benar-benar berubah.',
    category: 'React & Frontend',
    difficulty: 'Sedang'
  },
  {
    id: 'web-27',
    question: 'Apa fungsi dari atribut "SameSite=Strict" atau "SameSite=Lax" pada Cookie HTTP?',
    options: [
      'Mengizinkan cookie dibaca oleh skrip JavaScript via document.cookie',
      'Melindungi aplikasi dari serangan CSRF (Cross-Site Request Forgery) dengan membatasi pengiriman cookie pada cross-site requests',
      'Mengompres ukuran cookie agar lebih cepat terkirim',
      'Mengubah masa berlaku cookie menjadi 1 tahun'
    ],
    correctAnswer: 1,
    explanation: 'Atribut SameSite mencegah browser melampirkan cookie saat request berasal dari situs web pihak ketiga, menangkis serangan CSRF.',
    category: 'Web Security & HTTP',
    difficulty: 'Sulit'
  },
  {
    id: 'web-28',
    question: 'Dalam JavaScript Event Loop, manakah yang memiliki prioritas eksekusi lebih tinggi di Microtask Queue dibandingkan Task Queue biasa (macrotask)?',
    options: ['setTimeout()', 'Promise .then() / await', 'setInterval()', 'DOM click event callback'],
    correctAnswer: 1,
    explanation: 'Callback Promise (.then, .catch, async/await) masuk ke Microtask Queue yang dieksekusi tuntas sebelum macrotask berikutnya diproses.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Sulit'
  },
  {
    id: 'web-29',
    question: 'Bagaimana cara mencegah reload halaman otomatis saat event submit pada form HTML terjadi di JavaScript?',
    codeSnippet: `form.addEventListener('submit', (event) => {
  event.???();
  // Kirim data via AJAX/Fetch
});`,
    options: ['event.stopPropagation()', 'event.preventDefault()', 'event.stop()', 'event.cancel()'],
    correctAnswer: 1,
    explanation: 'event.preventDefault() membatalkan perilaku default browser (seperti form submit yang me-refresh halaman).',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-30',
    question: 'Dalam arsitektur basis data MongoDB (NoSQL), padanan istilah dari "Tabel" dan "Baris (Row)" pada database relasional berturut-turut adalah:',
    options: [
      'Collection dan Document',
      'Field dan Record',
      'Database dan Table',
      'Schema dan Column'
    ],
    correctAnswer: 0,
    explanation: 'Di MongoDB, data disimpan dalam Collection (setara Tabel) yang berisi Document berformat BSON/JSON (setara Row/Baris).',
    category: 'Database & Web Storage',
    difficulty: 'Sedang'
  },
  {
    id: 'web-31',
    question: 'Apa keuntungan utama menggunakan framework utilitas CSS seperti Tailwind CSS dibandingkan menulis CSS murni konvensional?',
    options: [
      'Tailwind menghapus kebutuhan server backend',
      'Pengembang dapat menata antarmuka langsung di dalam markup tanpa berpindah-pindah file CSS dan tanpa konflik nama class global',
      'Tailwind otomatis mengubah kode menjadi aplikasi Android',
      'Ukuran file HTML selalu menjadi nol kilobyte'
    ],
    correctAnswer: 1,
    explanation: 'Tailwind menggunakan utility classes terkomposisi yang mempercepat pengembangan UI tanpa menciptakan file CSS stylesheet raksasa.',
    category: 'HTML & CSS Modern',
    difficulty: 'Mudah'
  },
  {
    id: 'web-32',
    question: 'Fitur ES6 manakah yang digunakan untuk mengekstrak nilai properti dari objek secara ringkas ke dalam variabel?',
    codeSnippet: `const mhs = { nama: 'Shabrina', ipk: 3.9 };
const { nama, ipk } = mhs;`,
    options: ['Object Injection', 'Destructuring Assignment', 'Template Literal', 'Optional Chaining'],
    correctAnswer: 1,
    explanation: 'Destructuring assignment memungkinkan pembongkaran nilai dari array atau properti dari objek ke dalam variabel yang berbeda.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Sedang'
  },
  {
    id: 'web-33',
    question: 'Apa fungsi flag "HttpOnly" pada Cookie yang dikirimkan oleh server backend?',
    options: [
      'Membuat cookie hanya bisa dikirimkan lewat protokol HTTP tanpa enkripsi',
      'Mencegah skrip JavaScript client-side (document.cookie) membaca nilai cookie, melindungi token dari pencurian akibat XSS',
      'Membuat cookie hanya berlaku selama 24 jam',
      'Menghapus cookie secara otomatis jika user offline'
    ],
    correctAnswer: 1,
    explanation: 'HttpOnly cookie tidak dapat diakses oleh API JavaScript browser, menjadikannya standar aman penyimpanan refresh token/session ID.',
    category: 'Web Security & HTTP',
    difficulty: 'Sedang'
  },
  {
    id: 'web-34',
    question: 'Metode array JavaScript manakah yang mengembalikan array baru yang berisi elemen-elemen hasil transformasi setiap elemen array awal?',
    codeSnippet: `const angka = [1, 2, 3];
const kuadrat = angka.???(x => x * x); // [1, 4, 9]`,
    options: ['forEach()', 'map()', 'filter()', 'reduce()'],
    correctAnswer: 1,
    explanation: 'Array.prototype.map() memetakan setiap elemen dan mengembalikan array baru dengan panjang yang sama.',
    category: 'JavaScript ES6+ & DOM',
    difficulty: 'Mudah'
  },
  {
    id: 'web-35',
    question: 'Apa fungsi dari file .env dalam pengembangan aplikasi web modern?',
    options: [
      'Menyimpan file gambar dan aset publik',
      'Menyimpan variabel konfigurasi lingkungan dan kredensial rahasia (seperti API Key, Database URL) di luar kode sumber git',
      'Membuat tampilan website menjadi responsive di layar mobile',
      'Menghubungkan domain ke server cloud'
    ],
    correctAnswer: 1,
    explanation: 'File .env memisahkan konfigurasi environment (development, staging, production) dan menjaga rahasia tidak ter-commit ke public repository.',
    category: 'Node.js & Express',
    difficulty: 'Mudah'
  }
];
