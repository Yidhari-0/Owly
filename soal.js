/* =========================================================
   soal.js — DATA SOAL untuk halaman Bank Soal
   Gaya soal mengikuti pre-test TKA: ada stimulus (teks/tabel),
   lalu salah satu dari tiga jenis jawaban:

   type: 'pg'     -> pilihan ganda (satu jawaban).        answer: nomor pilihan (mulai 0)
   type: 'multi'  -> pilihan ganda kompleks (lebih dari   answer: daftar nomor, mis. [0, 2]
                     satu jawaban benar)
   type: 'table'  -> tabel pernyataan (Benar/Salah, dst.) cols: dua label kolom,
                                                          rows: [{ t: pernyataan, a: 0 atau 1 }]
                                                          a = nomor kolom yang benar

   Cara menambah soal: salin salah satu blok { ... }, ganti isinya,
   lalu tambahkan di dalam daftar SOAL. Teks boleh memakai HTML sederhana
   (<b>, <i>, <sup>, <table>).
   ========================================================= */

const TOPICS = {
  mtk: ['Bilangan', 'Aljabar', 'Geometri dan Pengukuran', 'Data dan Peluang'],
  ind: ['Pemahaman Tekstual (Literal)', 'Pemahaman Inferensial', 'Evaluasi dan Apresiasi Teks']
};

const SOAL = [

  /* ================= MATEMATIKA · Bab 1: Bilangan ================= */
  {
    id: 'MTK-001', subject: 'mtk', bab: 'Bilangan', title: 'Operasi bilangan berpangkat',
    level: 'Sedang', type: 'pg', stimulus: '',
    question: 'Hasil dari (5<sup>4</sup> × 5<sup>−2</sup>) ÷ 5<sup>3</sup> adalah …',
    options: ['5<sup>−9</sup>', '5<sup>−1</sup>', '5', '5<sup>9</sup>'],
    answer: 1,
    explain: 'Pada perkalian, pangkat dijumlahkan: 5<sup>4</sup> × 5<sup>−2</sup> = 5<sup>2</sup>. Pada pembagian, pangkat dikurangkan: 5<sup>2</sup> ÷ 5<sup>3</sup> = 5<sup>2−3</sup> = 5<sup>−1</sup>.'
  },
  {
    id: 'MTK-002', subject: 'mtk', bab: 'Bilangan', title: 'Bilangan rasional dan irasional',
    level: 'Dasar', type: 'multi', stimulus: '',
    question: 'Manakah yang merupakan bilangan irasional?',
    options: ['√16', '√20', 'π', '22/7'],
    answer: [1, 2],
    explain: '√16 = 4 dan 22/7 adalah pecahan, jadi keduanya rasional. √20 tidak dapat dinyatakan sebagai pecahan, begitu juga π, sehingga keduanya irasional.'
  },
  {
    id: 'MTK-003', subject: 'mtk', bab: 'Bilangan', title: 'Perbandingan dalam resep kue',
    level: 'Sedang', type: 'table',
    stimulus: '<p>Resep kue untuk <b>10 potong</b> memerlukan 250 gram tepung, 100 gram gula, dan 2 butir telur.</p>',
    question: 'Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    cols: ['Benar', 'Salah'],
    rows: [
      { t: 'Perbandingan banyak tepung dan gula adalah 5 : 2.', a: 0 },
      { t: 'Untuk membuat 20 potong kue diperlukan 4 butir telur.', a: 0 },
      { t: 'Untuk membuat 15 potong kue diperlukan 300 gram tepung.', a: 1 }
    ],
    explain: '250 : 100 disederhanakan menjadi 5 : 2 (benar). 20 potong = 2 kali resep, sehingga telur 2 × 2 = 4 butir (benar). 15 potong = 1,5 kali resep, sehingga tepung 1,5 × 250 = 375 gram, bukan 300 gram (salah).'
  },

  /* ================= MATEMATIKA · Bab 2: Aljabar ================= */
  {
    id: 'MTK-004', subject: 'mtk', bab: 'Aljabar', title: 'Sistem persamaan linear dua variabel',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Dina membeli 2 pensil dan 3 buku seharga Rp19.000. Rani membeli 1 pensil dan 2 buku seharga Rp11.000. Harga pensil dan buku pada kedua pembelian sama.</p>',
    question: 'Harga satu buku adalah …',
    options: ['Rp2.000', 'Rp3.000', 'Rp4.000', 'Rp5.000'],
    answer: 1,
    explain: 'Misalkan pensil = p dan buku = b. Diperoleh 2p + 3b = 19.000 dan p + 2b = 11.000. Kalikan persamaan kedua dengan 2: 2p + 4b = 22.000. Kurangkan dengan persamaan pertama: b = 3.000. Jadi harga satu buku Rp3.000 (harga pensil Rp5.000).'
  },
  {
    id: 'MTK-005', subject: 'mtk', bab: 'Aljabar', title: 'Relasi dan fungsi',
    level: 'Dasar', type: 'table',
    stimulus: '<p>Diketahui himpunan A = {1, 2, 3} dan B = {a, b, c, d}.</p>',
    question: 'Tentukan apakah relasi dari A ke B berikut merupakan fungsi atau bukan fungsi!',
    cols: ['Fungsi', 'Bukan fungsi'],
    rows: [
      { t: 'R₁ = {(1, a), (2, b), (3, b)}', a: 0 },
      { t: 'R₂ = {(1, a), (1, b), (2, c), (3, d)}', a: 1 },
      { t: 'R₃ = {(1, c), (2, d)}', a: 1 }
    ],
    explain: 'Relasi disebut fungsi jika setiap anggota A memiliki tepat satu pasangan di B. R₁ adalah fungsi (anggota B boleh dipakai lebih dari sekali). R₂ bukan fungsi karena 1 berpasangan dengan a dan b. R₃ bukan fungsi karena 3 tidak punya pasangan.'
  },
  {
    id: 'MTK-006', subject: 'mtk', bab: 'Aljabar', title: 'Barisan aritmetika pada susunan kursi',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Sebuah gedung pertunjukan menata kursi dalam beberapa baris. Baris pertama berisi 12 kursi, baris kedua 15 kursi, baris ketiga 18 kursi, dan seterusnya bertambah dengan selisih yang sama.</p>',
    question: 'Banyak kursi pada baris ke-10 adalah …',
    options: ['36', '39', '42', '255'],
    answer: 1,
    explain: 'Ini barisan aritmetika dengan suku pertama a = 12 dan beda b = 3. U₁₀ = a + 9b = 12 + 27 = 39.'
  },
  {
    id: 'MTK-007', subject: 'mtk', bab: 'Aljabar', title: 'Deret aritmetika',
    level: 'Menantang', type: 'multi',
    stimulus: '<p>Sebuah gedung pertunjukan menata kursi dalam beberapa baris. Baris pertama berisi 12 kursi, baris kedua 15 kursi, baris ketiga 18 kursi, dan seterusnya bertambah dengan selisih yang sama.</p>',
    question: 'Pernyataan yang benar tentang susunan kursi tersebut adalah …',
    options: [
      'Baris ke-5 berisi 24 kursi.',
      'Baris ke-10 berisi 40 kursi.',
      'Jumlah kursi pada 10 baris pertama adalah 255.',
      'Selisih banyak kursi antarbaris yang berurutan selalu sama.'
    ],
    answer: [0, 2, 3],
    explain: 'U₅ = 12 + 4 × 3 = 24 (benar). U₁₀ = 39, bukan 40 (salah). S₁₀ = 10/2 × (12 + 39) = 5 × 51 = 255 (benar). Selisih tiap baris selalu 3 (benar).'
  },

  /* ================= MATEMATIKA · Bab 3: Geometri dan Pengukuran ================= */
  {
    id: 'MTK-008', subject: 'mtk', bab: 'Geometri dan Pengukuran', title: 'Sudut berpelurus',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Titik Q terletak pada garis lurus AB. Dari titik Q ditarik sinar QP sehingga terbentuk ∠AQP = (3x + 6)° dan ∠PQB = (2x + 24)°.</p>',
    question: 'Besar ∠PQB adalah … °',
    options: ['30', '84', '90', '96'],
    answer: 1,
    explain: 'Dua sudut yang berpelurus berjumlah 180°. (3x + 6) + (2x + 24) = 180, sehingga 5x + 30 = 180 dan x = 30. Maka ∠PQB = 2(30) + 24 = 84°.'
  },
  {
    id: 'MTK-009', subject: 'mtk', bab: 'Geometri dan Pengukuran', title: 'Teorema Pythagoras pada tangga',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Sebuah tangga bambu sepanjang 5 meter disandarkan pada dinding tegak. Ujung bawah tangga berjarak 3 meter dari dinding.</p>',
    question: 'Tinggi ujung atas tangga dari tanah adalah … meter',
    options: ['2', '4', '5', '8'],
    answer: 1,
    explain: 'Tangga, dinding, dan tanah membentuk segitiga siku-siku dengan sisi miring 5 m. Tinggi = √(5² − 3²) = √(25 − 9) = √16 = 4 meter.'
  },
  {
    id: 'MTK-010', subject: 'mtk', bab: 'Geometri dan Pengukuran', title: 'Luas juring lingkaran',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Sebuah taman berbentuk lingkaran dengan jari-jari 14 meter. Sebagian taman berbentuk juring dengan sudut pusat 90° akan ditanami bunga.</p>',
    question: 'Luas bagian yang ditanami bunga adalah … m² (π = 22/7)',
    options: ['77', '154', '308', '616'],
    answer: 1,
    explain: 'Luas lingkaran = π r² = 22/7 × 14 × 14 = 616 m². Luas juring = 90/360 × 616 = 1/4 × 616 = 154 m².'
  },
  {
    id: 'MTK-011', subject: 'mtk', bab: 'Geometri dan Pengukuran', title: 'Dua persegi panjang sebangun',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Dua persegi panjang sebangun. Persegi panjang besar berukuran 24 cm × 16 cm, sedangkan lebar persegi panjang kecil adalah 6 cm.</p>',
    question: 'Keliling persegi panjang kecil adalah … cm',
    options: ['15', '30', '36', '80'],
    answer: 1,
    explain: 'Perbandingan panjang : lebar = 24 : 16 = 3 : 2. Jika lebar persegi panjang kecil 6 cm, maka panjangnya 9 cm. Keliling = 2 × (9 + 6) = 30 cm.'
  },

  /* ================= MATEMATIKA · Bab 4: Data dan Peluang ================= */
  {
    id: 'MTK-012', subject: 'mtk', bab: 'Data dan Peluang', title: 'Peluang tanpa pengembalian',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Sebuah kantong berisi 5 kelereng merah, 3 kelereng biru, dan 2 kelereng hijau. Doni mengambil satu kelereng secara acak dan hasilnya merah. Kelereng itu tidak dikembalikan.</p>',
    question: 'Kemudian Ayu mengambil satu kelereng. Peluang Ayu mendapat kelereng biru adalah …',
    options: ['3/10', '1/3', '3/8', '1/2'],
    answer: 1,
    explain: 'Setelah satu kelereng merah diambil, tersisa 9 kelereng dan 3 di antaranya biru. Peluang = 3/9 = 1/3.'
  },
  {
    id: 'MTK-013', subject: 'mtk', bab: 'Data dan Peluang', title: 'Mean, median, dan modus',
    level: 'Sedang', type: 'table',
    stimulus: '<p>Nilai ulangan 10 siswa: 6, 7, 7, 8, 8, 8, 9, 9, 10, 10.</p>',
    question: 'Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    cols: ['Benar', 'Salah'],
    rows: [
      { t: 'Rata-rata nilai tersebut adalah 8,2.', a: 0 },
      { t: 'Modus data tersebut adalah 10.', a: 1 },
      { t: 'Median data tersebut adalah 8.', a: 0 }
    ],
    explain: 'Jumlah nilai = 82, sehingga rata-rata = 82 ÷ 10 = 8,2 (benar). Nilai yang paling sering muncul adalah 8 (tiga kali), jadi modus = 8, bukan 10 (salah). Data sudah terurut; nilai ke-5 dan ke-6 sama-sama 8, sehingga median = 8 (benar).'
  },

  /* ================= BAHASA INDONESIA · Bab 1: Pemahaman Tekstual (Literal) ================= */
  {
    id: 'IND-001', subject: 'ind', bab: 'Pemahaman Tekstual (Literal)', title: 'Membaca data pada teks dan tabel',
    level: 'Sedang', type: 'multi',
    stimulus: '<p><b>Kebiasaan Membaca Siswa SMP Kota Cerdas</b></p><p>Sebuah survei dilakukan pada 200 siswa kelas IX untuk mengetahui lama mereka membaca buku di luar jam pelajaran setiap hari.</p><table><tr><th>Lama membaca per hari</th><th>Jumlah siswa</th></tr><tr><td>30 menit atau lebih</td><td>90</td></tr><tr><td>10–30 menit</td><td>70</td></tr><tr><td>Kurang dari 10 menit</td><td>40</td></tr></table>',
    question: 'Pernyataan yang sesuai dengan data tersebut adalah …',
    options: [
      'Siswa yang membaca kurang dari 10 menit per hari adalah kelompok paling sedikit.',
      'Lebih dari separuh siswa membaca 30 menit atau lebih setiap hari.',
      'Sebanyak 70 siswa membaca selama 10–30 menit setiap hari.',
      'Survei dilakukan pada 200 siswa kelas IX.'
    ],
    answer: [0, 2, 3],
    explain: '90 dari 200 siswa berarti 45%, jadi bukan lebih dari separuh (pernyataan kedua salah). Tiga pernyataan lainnya sesuai dengan teks dan tabel.'
  },
  {
    id: 'IND-002', subject: 'ind', bab: 'Pemahaman Tekstual (Literal)', title: 'Makna kata dalam konteks',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Meskipun sering kalah di babak awal, Rani tetap <b>gigih</b> berlatih bulu tangkis setiap sore hingga akhirnya menjuarai turnamen antarsekolah.</p>',
    question: 'Makna kata <i>gigih</i> pada kalimat tersebut adalah …',
    options: ['mudah menyerah', 'tekun dan pantang menyerah', 'suka berlatih sendirian', 'cepat puas dengan hasil'],
    answer: 1,
    explain: 'Dari konteks kalimat, Rani terus berlatih meskipun sering kalah. Hal itu menunjukkan sikap tekun dan pantang menyerah.'
  },
  {
    id: 'IND-003', subject: 'ind', bab: 'Pemahaman Tekstual (Literal)', title: 'Menemukan informasi tersurat',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Perpustakaan keliling <b>Pustaka Jaya</b> melayani warga Desa Sukamaju setiap Selasa dan Kamis pukul 08.00–11.00 di lapangan desa. Peminjam wajib membawa kartu anggota. Buku dapat dipinjam paling lama dua pekan.</p>',
    question: 'Informasi yang <b>tidak</b> terdapat dalam teks adalah …',
    options: ['hari layanan', 'tempat layanan', 'jumlah koleksi buku', 'lama peminjaman'],
    answer: 2,
    explain: 'Hari layanan (Selasa dan Kamis), tempat layanan (lapangan desa), dan lama peminjaman (dua pekan) disebutkan dalam teks. Jumlah koleksi buku tidak disebutkan.'
  },

  /* ================= BAHASA INDONESIA · Bab 2: Pemahaman Inferensial ================= */
  {
    id: 'IND-004', subject: 'ind', bab: 'Pemahaman Inferensial', title: 'Ide pokok paragraf',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Tidur yang cukup sangat penting bagi pelajar. Saat tidur, otak merapikan informasi yang dipelajari sepanjang hari. Pelajar yang kurang tidur cenderung sulit berkonsentrasi dan mudah lupa. Karena itu, tidur 8–10 jam setiap malam sebaiknya menjadi kebiasaan.</p>',
    question: 'Ide pokok paragraf tersebut adalah …',
    options: [
      'Otak merapikan informasi saat tidur.',
      'Tidur yang cukup sangat penting bagi pelajar.',
      'Pelajar yang kurang tidur sulit berkonsentrasi.',
      'Pelajar sebaiknya tidur 8–10 jam setiap malam.'
    ],
    answer: 1,
    explain: 'Ide pokok terdapat pada kalimat utama, yaitu kalimat pertama paragraf. Kalimat-kalimat lain berfungsi sebagai penjelas dan pendukung.'
  },
  {
    id: 'IND-005', subject: 'ind', bab: 'Pemahaman Inferensial', title: 'Hubungan sebab-akibat',
    level: 'Sedang', type: 'multi',
    stimulus: '<p>Hujan deras mengguyur kota sejak pagi. Saluran air tersumbat sampah sehingga air meluap ke jalan. Akibatnya, banyak kendaraan mogok dan sejumlah siswa terlambat tiba di sekolah.</p>',
    question: 'Akibat dari tersumbatnya saluran air oleh sampah adalah …',
    options: [
      'Air meluap ke jalan.',
      'Banyak kendaraan mogok.',
      'Hujan deras turun sejak pagi.',
      'Sejumlah siswa terlambat tiba di sekolah.'
    ],
    answer: [0, 1, 3],
    explain: 'Hujan deras adalah kejadian awal, bukan akibat. Tersumbatnya saluran membuat air meluap, lalu berakibat kendaraan mogok dan siswa terlambat.'
  },
  {
    id: 'IND-006', subject: 'ind', bab: 'Pemahaman Inferensial', title: 'Menyimpulkan isi teks',
    level: 'Sedang', type: 'pg',
    stimulus: '<p>Setiap hari Sungai Asri dipenuhi sampah plastik. Ikan-ikan mati karena menelan plastik dan air sungai berbau busuk. Warga yang memakai air sungai untuk mencuci mengeluh gatal-gatal. Padahal, kegiatan bersih sungai baru dilakukan setahun sekali.</p>',
    question: 'Simpulan yang paling tepat dari teks tersebut adalah …',
    options: [
      'Warga sebaiknya pindah dari sekitar Sungai Asri.',
      'Sampah plastik merusak lingkungan dan merugikan warga, sehingga pembersihan perlu dilakukan lebih rutin.',
      'Ikan di Sungai Asri mati hanya karena air berbau busuk.',
      'Kegiatan bersih sungai tidak ada gunanya.'
    ],
    answer: 1,
    explain: 'Teks menunjukkan dampak sampah plastik pada ikan, air, dan kesehatan warga, serta pembersihan yang jarang dilakukan. Simpulan yang mencakup semuanya adalah pilihan kedua.'
  },
  {
    id: 'IND-007', subject: 'ind', bab: 'Pemahaman Inferensial', title: 'Kesesuaian pernyataan dengan teks',
    level: 'Dasar', type: 'table',
    stimulus: '<p>Pisang mengandung kalium yang membantu kerja otot dan karbohidrat sebagai sumber tenaga. Buah ini mudah ditemukan sepanjang tahun. Namun, orang yang memiliki masalah ginjal perlu membatasi konsumsinya.</p>',
    question: 'Tentukan pernyataan yang sesuai dan tidak sesuai berdasarkan teks!',
    cols: ['Sesuai', 'Tidak sesuai'],
    rows: [
      { t: 'Pisang dapat menjadi sumber tenaga.', a: 0 },
      { t: 'Pisang hanya berbuah pada musim tertentu.', a: 1 },
      { t: 'Semua orang boleh mengonsumsi pisang tanpa batas.', a: 1 }
    ],
    explain: 'Karbohidrat pada pisang menjadi sumber tenaga (sesuai). Teks menyebut buah ini mudah ditemukan sepanjang tahun (tidak sesuai). Orang dengan masalah ginjal perlu membatasi konsumsi, jadi tidak semua orang bebas tanpa batas (tidak sesuai).'
  },

  /* ================= BAHASA INDONESIA · Bab 3: Evaluasi dan Apresiasi Teks ================= */
  {
    id: 'IND-008', subject: 'ind', bab: 'Evaluasi dan Apresiasi Teks', title: 'Menilai argumen dan bukti',
    level: 'Sedang', type: 'table',
    stimulus: '<p><b>Opini:</b> Siswa sebaiknya tidak membawa ponsel ke sekolah.</p><p><b>Alasan 1:</b> Ponsel dapat mengganggu konsentrasi saat pelajaran. Survei di sebuah SMP menunjukkan 60% siswa membuka media sosial pada jam belajar.</p><p><b>Alasan 2:</b> Semua siswa pasti menyalahgunakan ponselnya.</p>',
    question: 'Tentukan Benar atau Salah untuk setiap pernyataan berikut!',
    cols: ['Benar', 'Salah'],
    rows: [
      { t: 'Alasan 1 didukung bukti berupa hasil survei.', a: 0 },
      { t: 'Alasan 2 lemah karena menggeneralisasi semua siswa tanpa bukti.', a: 0 },
      { t: 'Survei tersebut membuktikan bahwa seluruh siswa menyalahgunakan ponsel.', a: 1 }
    ],
    explain: 'Alasan 1 memiliki bukti survei (benar). Alasan 2 memakai kata "semua" dan "pasti" tanpa bukti sehingga lemah (benar). Survei hanya menunjukkan 60% siswa membuka media sosial, bukan seluruh siswa (salah).'
  },
  {
    id: 'IND-009', subject: 'ind', bab: 'Evaluasi dan Apresiasi Teks', title: 'Citraan dalam puisi',
    level: 'Sedang', type: 'pg',
    stimulus: '<p><i>Senja menjatuhkan jingga di pundak sawah,<br>angin mengetuk jendela rumah yang sepi.</i></p>',
    question: 'Citraan yang paling dominan pada puisi tersebut adalah …',
    options: ['penglihatan (visual)', 'pendengaran (auditif)', 'penciuman (olfaktori)', 'pengecapan (gustatori)'],
    answer: 0,
    explain: 'Frasa "jingga di pundak sawah" menghadirkan warna dan pemandangan yang dapat dilihat, sehingga citraan yang paling dominan adalah citraan penglihatan.'
  },
  {
    id: 'IND-010', subject: 'ind', bab: 'Evaluasi dan Apresiasi Teks', title: 'Ragam sastra dan nonsastra',
    level: 'Dasar', type: 'pg', stimulus: '',
    question: 'Kutipan berikut yang termasuk ragam <b>sastra</b> adalah …',
    options: [
      '“Pemerintah kota menambah 20 bus sekolah mulai bulan depan.”',
      '“Lampu minyak itu bergetar, seperti hati Ibu yang menunggu kabar dari seberang lautan.”',
      '“Diskon 50% untuk semua buku tulis hanya sampai Jumat!”',
      '“Pengumuman: rapat orang tua siswa dilaksanakan pukul 09.00.”'
    ],
    answer: 1,
    explain: 'Teks sastra memakai bahasa yang imajinatif dan figuratif, seperti perbandingan lampu yang bergetar dengan hati Ibu. Pilihan lain bersifat informatif atau persuasif (nonsastra).'
  },
  {
    id: 'IND-011', subject: 'ind', bab: 'Evaluasi dan Apresiasi Teks', title: 'Pesan penulis dalam cerita',
    level: 'Dasar', type: 'pg',
    stimulus: '<p>Dina menemukan sebuah dompet berisi uang di bangku taman. Uang itu cukup untuk membeli sepatu baru yang sudah lama ia inginkan. Namun, Dina memilih menyerahkannya kepada petugas taman. Tak lama kemudian, pemiliknya, seorang nenek, datang dan memeluk Dina sambil menangis haru.</p>',
    question: 'Pesan yang ingin disampaikan penulis adalah …',
    options: [
      'Rezeki harus dicari dengan bekerja keras.',
      'Kejujuran lebih berharga daripada keinginan pribadi.',
      'Sepatu baru lebih penting daripada dompet.',
      'Taman adalah tempat yang berbahaya.'
    ],
    answer: 1,
    explain: 'Dina tetap menyerahkan dompet meski uangnya bisa dipakai untuk keinginannya. Sikap itu menyampaikan pesan tentang pentingnya kejujuran.'
  },
  {
    id: 'IND-012', subject: 'ind', bab: 'Evaluasi dan Apresiasi Teks', title: 'Mengkritik teks opini',
    level: 'Menantang', type: 'multi',
    stimulus: '<p>Kantin sekolah harus menjual makanan sehat. Banyak siswa yang mengeluh. Pokoknya kantin harus berubah sekarang juga.</p>',
    question: 'Kelemahan teks opini tersebut adalah …',
    options: [
      'Tidak ada data atau bukti yang mendukung pendapat.',
      'Alasan tidak dijelaskan secara rinci ("banyak siswa mengeluh" tanpa penjelasan).',
      'Kalimat-kalimatnya terlalu panjang dan berbelit.',
      'Menggunakan kata tidak baku "pokoknya" pada teks opini.'
    ],
    answer: [0, 1, 3],
    explain: 'Teks tidak menyertakan data, alasannya tidak dirinci, dan memakai kata tidak baku "pokoknya". Kalimat-kalimatnya justru pendek, jadi pilihan ketiga bukan kelemahan.'
  }
];

window.SOAL = SOAL;
window.TOPICS = TOPICS;
