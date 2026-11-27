# DESIGN-DIRECTION.md
# The Flowers Project — Design Direction

**Dokumen arah desain dan batasan implementasi untuk v4**  
**Status:** Panduan pengembangan, bukan instruksi untuk melakukan redesign  
**Prinsip utama:** *Preserve the character. Improve the craft.*

---

## 1. Tujuan dokumen

Dokumen ini menetapkan arah pengembangan visual, interaksi, dan pengalaman pengguna The Flowers Project berdasarkan tiga referensi:

1. [Immersive Garden](https://immersive-g.com/) — interaksi yang terasa hidup dan dibuat khusus untuk konteksnya.
2. [C82 — Lilies & Roses of P.J. Redouté](https://www.c82.net/redoute/) — presentasi botani yang editorial, teliti, dan membiarkan karya menjadi pusat perhatian.
3. [Silk](https://weavesilk.com/) — generative art yang memberi pengguna ruang bereksperimen melalui kontrol yang sedikit dan mudah dipahami.

Ketiganya **bukan template visual** dan tidak boleh digabungkan secara mentah. Fungsinya adalah menjadi sumber prinsip desain yang diterjemahkan ke karakter, sistem, dan kode yang sudah dimiliki The Flowers Project.

Dokumen ini tidak mengusulkan penggantian identitas, struktur halaman, palet, tipografi, atau renderer yang sudah ada hanya demi mengikuti tren desain.

## 2. Identitas yang harus dipertahankan

The Flowers Project adalah pengalaman seni botani digital yang menggabungkan:

- Bunga sebagai subjek utama.
- ASCII art sebagai medium visual yang khas.
- Generative animation sebagai bagian dari karya, bukan ornamen antarmuka.
- Eksplorasi beberapa jenis bunga dengan karakter visual masing-masing.
- Presentasi editorial yang tenang dan tidak berlebihan.

**Keunikan proyek ini bukan efek 3D, gradient, atau banyaknya animasi.** Keunikannya adalah bagaimana bentuk bunga diterjemahkan menjadi karakter, warna, gerak, dan pengalaman interaktif di browser.

Setiap pengembangan harus memperkuat identitas tersebut. Bila sebuah fitur membuat website terlihat lebih ramai tetapi tidak membuat karya bunganya lebih bermakna, fitur itu tidak perlu ditambahkan.

### Hierarki prioritas

1. Karya bunga dan rendering ASCII.
2. Keterbacaan serta ruang untuk mengamati karya.
3. Navigasi dan kontrol yang diperlukan untuk menjelajah.
4. Informasi botani dan konteks editorial.
5. Dekorasi tambahan — hanya jika memiliki fungsi yang jelas.

## 3. Tiga referensi dan cara menerapkannya

### 3.1 Immersive Garden — interaksi yang memiliki alasan

**Referensi:** https://immersive-g.com/

Immersive Garden memperlihatkan bagaimana pengalaman digital dapat terasa khas melalui art direction, gerak, dan interaksi yang dirancang sesuai konsep. Situs studionya menggunakan pendekatan pengalaman yang imersif; contoh karya dan studi kasusnya juga memperlihatkan bahwa interaksi dapat menjadi bagian dari cara menyampaikan cerita.

**Prinsip yang diambil:**

- Interaksi harus memiliki hubungan dengan subjek, bukan sekadar efek hover.
- Gerakan harus terasa disengaja, responsif, dan punya awal serta akhir yang masuk akal.
- Satu interaksi yang kuat lebih baik daripada banyak efek kecil yang saling berebut perhatian.
- Pengalaman harus tetap dapat dipahami tanpa pengguna harus menebak-nebak cara kerjanya.

**Penerapan pada The Flowers Project:**

- Gerak bunga dapat merespons interaksi secara halus jika respons tersebut memperkaya pengalaman mengamati bunga.
- Transisi antarbagian harus menjaga orientasi pengguna dan tidak menghalangi konten.
- Efek pointer, bila memang sudah menjadi bagian dari desain, harus tetap ringan dan tidak menggantikan pointer standar tanpa alasan kuat.
- Gerak dekoratif tidak boleh mengalahkan detail ASCII atau membuat teks sulit dibaca.

**Jangan ditiru secara literal:** jangan menambahkan relief 3D, efek cursor yang kompleks, atau transisi sinematik hanya karena terlihat mengesankan di situs referensi. Teknik tersebut bukan identitas The Flowers Project.

### 3.2 C82 — Lilies & Roses — karya menjadi pusat perhatian

**Referensi:** https://www.c82.net/redoute/  
**Catatan proses desain:** https://c82.net/blog/making-of-lilies-and-roses-of-pj-redoute

Edisi digital C82 menampilkan koleksi ilustrasi botani Pierre-Joseph Redouté yang dipulihkan, disertai nama dan deskripsi bunga. Proyek tersebut menyediakan tampilan berlatar terang dan gelap serta menempatkan ilustrasi sebagai fokus utama. Dalam catatan pembuatannya, Nicholas Rougeux menjelaskan prinsip desain yang berangkat dari gagasan *grand elegance*: memberi ruang agar karya berbicara dan tidak mengalahkannya dengan antarmuka.

**Prinsip yang diambil:**

- Karya harus mendapat ruang visual yang cukup.
- Informasi pendamping harus ringkas, akurat, dan tersusun.
- Nama ilmiah, nama umum, dan deskripsi memiliki hierarki yang jelas.
- Tata letak katalog harus membantu penemuan, bukan mengubah halaman menjadi dashboard.
- Detail kecil dan kualitas penyajian lebih penting daripada banyak ornamen.

**Penerapan pada The Flowers Project:**

- Pertahankan bunga sebagai fokus pada halaman cover dan halaman studi.
- Berikan ruang yang cukup antara karya, judul, deskripsi, dan navigasi.
- Informasi botani dapat ditambahkan secara bertahap dan hanya jika sumbernya dapat diverifikasi.
- Jika katalog berkembang, gunakan struktur indeks yang jelas dan konsisten, bukan kumpulan kartu dekoratif yang seragam.
- Pertimbangkan latar terang atau gelap berdasarkan keterbacaan karya yang sedang ditampilkan; jangan mengubah tema global tanpa pengujian.

**Jangan ditiru secara literal:** jangan mengubah ASCII art menjadi galeri ilustrasi klasik, menyalin komposisi halaman C82, atau mengambil gambar dan asetnya tanpa memeriksa lisensi.

### 3.3 Silk — sedikit kontrol, ruang untuk bereksperimen

**Referensi:** https://weavesilk.com/

Silk adalah pengalaman generative art yang memungkinkan pengguna menggambar dengan gerakan pointer. Kontrolnya relatif sedikit, seperti pencampuran warna, simetri, spiral, undo, dan memulai ulang karya.

**Prinsip yang diambil:**

- Interaksi langsung dapat menjadi inti pengalaman, bukan tambahan.
- Kontrol sebaiknya sedikit, jelas, dan mudah dibatalkan.
- Sistem generatif harus memberi hasil yang menarik tanpa memaksa pengguna mempelajari banyak pengaturan.
- Eksperimen pengguna harus terasa responsif dan memberi umpan balik yang jelas.

**Penerapan pada The Flowers Project:**

- Kontrol animasi, palet, atau variasi visual harus tetap sederhana.
- Jika kelak dibuat mode eksperimen, mulai dari satu atau dua parameter yang benar-benar bermakna.
- Sediakan reset atau cara kembali ke keadaan awal jika pengguna dapat mengubah komposisi.
- Jangan menjadikan semua parameter renderer sebagai kontrol publik. Sebagian besar kompleksitas sebaiknya tetap berada di balik sistem.

**Jangan ditiru secara literal:** jangan mengubah proyek menjadi aplikasi menggambar bebas atau menambahkan panel pengaturan besar yang menggeser fokus dari koleksi bunga.

---

## 4. Aturan anti-AI-slop — batasan yang tidak boleh dilanggar

Bagian ini adalah kontrak desain untuk setiap perubahan berikutnya. Tujuannya bukan mengejar gaya minimalis generik, melainkan menjaga keputusan visual tetap spesifik terhadap proyek.

### 4.1 Jangan melakukan redesign tanpa kebutuhan nyata

- Jangan mengganti layout utama hanya agar terlihat lebih modern.
- Jangan mengganti tipografi yang sudah dipilih tanpa alasan keterbacaan atau konsistensi yang dapat dibuktikan.
- Jangan mengganti palet warna proyek dengan palet tren.
- Jangan menambahkan section, badge, card, panel, atau label hanya untuk membuat halaman terlihat lebih penuh.
- Jangan membuat semua halaman memiliki komposisi yang sama apabila karakter kontennya berbeda.

### 4.2 Hindari pola visual generik

Jangan menambahkan pola berikut sebagai jalan pintas desain:

- Gradient ungu-biru atau gradient neon yang tidak berasal dari identitas bunga.
- Glassmorphism, blur panel, glow, dan shadow berlapis tanpa fungsi.
- Blob, orb, mesh gradient, atau bentuk abstrak dekoratif yang tidak terkait dengan bunga.
- Kartu berulang dengan radius besar untuk setiap informasi.
- Tombol pill untuk seluruh kontrol tanpa mempertimbangkan bentuk dan konteks.
- Heading raksasa, huruf kapital berlebihan, dan teks kecil bergaya terminal hanya untuk memberi kesan futuristik.
- Ikon dekoratif, emoji, label status, atau microcopy yang tidak menambah informasi.
- Efek parallax, cursor follower, scroll animation, dan reveal animation yang terus-menerus hanya demi terlihat interaktif.

Daftar ini bukan larangan mutlak terhadap setiap teknik. Sebuah teknik hanya boleh digunakan jika ada alasan spesifik, proporsional, dan konsisten dengan sistem visual yang sudah ada.

### 4.3 Jangan menambahkan dekorasi untuk menutupi masalah

Jika halaman terasa kosong, jangan langsung menambahkan gradient, ornament, atau animasi. Periksa dahulu:

1. Apakah komposisi karya sudah tepat?
2. Apakah ukuran dan posisi bunga sudah sesuai?
3. Apakah hierarki judul dan deskripsi jelas?
4. Apakah jarak antar-elemen perlu diperbaiki?
5. Apakah ada informasi yang memang dibutuhkan pengguna?

Ruang kosong yang disengaja bukan kekurangan desain.

### 4.4 Hindari copywriting generik

Gunakan bahasa yang konkret dan informatif. Hindari slogan yang terdengar seperti promosi produk AI, misalnya klaim berlebihan tentang pengalaman "revolusioner", "immersive next-generation", atau "magical digital universe".

Jangan menambahkan kalimat pemasaran di setiap bagian. Biarkan nama bunga, karya visual, dan informasi yang relevan menjelaskan pengalaman.

### 4.5 Jangan meniru referensi secara langsung

Ambil prinsip, bukan aset atau identitas:

- Immersive Garden: interaksi yang punya alasan.
- C82: presentasi karya yang teliti dan editorial.
- Silk: kontrol sederhana untuk eksplorasi generatif.

Jangan menyalin layout, ilustrasi, animasi, teks, kode, atau aset milik pihak lain. Buat implementasi yang berangkat dari sistem ASCII dan renderer The Flowers Project sendiri.

---

## 5. Arah visual

### 5.1 Komposisi

- Bunga adalah titik fokus utama.
- Jaga ruang kosong di sekeliling karya agar karakter ASCII dapat diamati.
- Jangan memaksa semua halaman memakai grid kartu.
- Gunakan alignment, lebar konten, dan jarak yang konsisten.
- Hindari menempatkan terlalu banyak informasi di area hero.
- Pada halaman studi, komposisi dapat menyesuaikan karakter setiap bunga selama hierarki navigasi dan informasi tetap konsisten.

### 5.2 Warna

- Pertahankan palet dasar yang saat ini digunakan oleh v4.
- Warna aksen boleh berasal dari karakter bunga yang sedang ditampilkan.
- Warna bunga harus membantu identifikasi dan suasana karya, bukan menjadi dekorasi acak pada seluruh UI.
- Pastikan teks, kontrol, dan indikator tetap terbaca pada latar yang dipilih.
- Jangan memperkenalkan warna aksen baru sebelum memeriksa palet yang sudah ada di CSS dan modul bunga.

Tidak ada kewajiban untuk menjadikan seluruh situs gelap atau terang. Pilihan tema harus mengikuti implementasi v4 saat ini dan diuji terhadap hasil rendering bunga.

### 5.3 Tipografi

- Pertahankan font yang sudah dipilih di v4.
- Jangan menambahkan font hanya karena sedang populer di website portfolio atau generative-art.
- Gunakan hirarki yang konsisten untuk judul, nama ilmiah, deskripsi, metadata, dan kontrol.
- Jaga teks pendamping tetap nyaman dibaca; jangan terlalu kecil demi estetika.
- Karakter ASCII adalah bagian dari karya visual, bukan alasan untuk membuat seluruh UI menggunakan font monospace.

### 5.4 Bentuk komponen

- Kontrol harus tampak seperti kontrol dan mudah dikenali.
- Bentuk border, radius, dan shadow mengikuti komponen yang sudah ada.
- Gunakan pemisah dan garis hanya ketika membantu struktur.
- Hindari membungkus setiap kelompok konten dalam card.
- Jangan menambahkan ikon apabila label teks sudah cukup jelas.

---

## 6. Arah gerak dan interaksi

### 6.1 Gerak harus berasal dari karakter bunga

Animasi utama sebaiknya terasa berkaitan dengan bentuk organik: pertumbuhan, pembukaan kelopak, perubahan posisi, atau detail gerak yang memang menjadi bagian dari ilustrasi.

Jangan menggunakan animasi generik yang sama untuk semua elemen. Tiap bunga boleh memiliki karakter gerak sendiri.

### 6.2 Gerak UI harus lebih tenang daripada karya

- Transisi UI tidak boleh bersaing dengan animasi bunga.
- Hover cukup memberi respons yang jelas dan singkat.
- Hindari animasi yang memantul berlebihan.
- Jangan memicu gerakan besar hanya ketika pointer melewati area yang tidak relevan.
- Jangan membuat seluruh halaman bergerak ketika pengguna sedang membaca informasi.

### 6.3 Kontrol harus jelas

Untuk setiap kontrol, pengguna harus dapat memahami:

- Apa yang akan berubah.
- Apakah perubahan berlangsung langsung atau setelah tindakan.
- Bagaimana menghentikan atau membatalkannya.
- Bagaimana mengembalikan keadaan awal jika fitur tersebut mengubah komposisi.

Jangan menyembunyikan fungsi penting hanya di balik gesture yang tidak terlihat.

### 6.4 Audio tidak boleh mengganggu

- Tidak ada autoplay.
- Audio hanya dimulai setelah tindakan pengguna.
- Pertahankan kontrol pause/resume dan volume yang sudah ada.
- Jangan memutar audio sebagai syarat untuk menikmati animasi.
- Jika aset musik diganti atau ditambah, periksa lisensi dan hak penggunaannya sebelum publikasi.

### 6.5 Aksesibilitas gerak

- Hormati `prefers-reduced-motion`.
- Berikan alternatif untuk interaksi yang bergantung pada pointer.
- Pastikan kontrol dapat digunakan dengan keyboard.
- Pastikan status pause, mute, dan perubahan kontrol dapat diketahui oleh teknologi bantu.
- Jangan menggunakan kedipan cepat atau kontras gerak yang berlebihan.

---

## 7. Pemetaan ke struktur proyek v4

Struktur saat ini harus diperlakukan sebagai fondasi. Jangan memindahkan file atau mengganti arsitektur secara massal hanya untuk membuat struktur folder terlihat lebih modern.

| File / kelompok | Peran yang dipertahankan | Arah pengembangan |
|---|---|---|
| `index.html` | Entry point dan struktur halaman | Pertahankan markup semantik dan struktur yang sudah bekerja. Ubah hanya bagian yang diperlukan untuk konten, aksesibilitas, atau interaksi baru. |
| `styles.css` | Gaya utama situs | Jadikan sumber utama untuk memahami sistem visual sebelum menambah aturan baru. Hindari duplikasi selector dan override berlapis. |
| `apple.css` | Stylesheet pendamping yang sudah ada di v4 | Periksa relasi impor dan pemakaiannya sebelum mengubah atau menggabungkannya. Jangan menghapus berdasarkan nama file saja. |
| `studies.css` | Gaya untuk area botanical studies | Jaga agar halaman studi tetap satu keluarga dengan situs utama tanpa memaksakan semua komponen menjadi identik. |
| `engine.js` | Mesin rendering bersama berbasis registry | Prioritaskan efisiensi lifecycle, pengelolaan frame, visibilitas, dan konsistensi API. Pertahankan hasil visual bunga. |
| `flowers/*.js` | Definisi dan perilaku bunga yang digunakan sistem registry | Perlakukan setiap bunga sebagai modul mandiri. Perubahan satu bunga tidak boleh merusak bunga lain. |
| `cover.js` | Modul bunga/visual untuk area cover | Pertahankan komposisi awal yang menjadi identitas halaman. Optimalkan tanpa mengganti karakter artwork. |
| `bouquet.js` | Renderer khusus lily | Jangan dipaksa bermigrasi sebelum perilakunya dipahami dan hasil render dapat dibandingkan. |
| `peony.js` | Renderer khusus peony | Pertahankan karakter gerak dan hasil visualnya selama proses audit atau optimasi. |
| `violet.js` | Renderer khusus violet | Pertahankan karakter visualnya; hindari perubahan algoritma tanpa baseline pembanding. |
| `studies.js` | Pengelolaan area studi, navigasi, dan konten bunga | Kembangkan indeks dan informasi bunga secara bertahap, dengan struktur data yang konsisten. |
| `site.js` | Penghubung kontrol antarmuka dan sistem situs | Jaga pemisahan antara perilaku antarmuka dan algoritma gambar. |
| `audio.js` | Pengelolaan audio dan kontrolnya | Pertahankan prinsip no-autoplay, kontrol eksplisit, dan aksesibilitas. |
| `audio/` | Aset audio | Pastikan ukuran, format, atribusi, dan lisensi sebelum distribusi. |
| `anti-slop/` | Catatan audit kualitas UI | Lanjutkan pola audit dengan temuan, bukti, perubahan, dan hasil verifikasi. |
| `.claude/skills/antislop/` | Panduan workflow AI Slop yang digunakan proyek | Jadikan aturan anti-slop dalam dokumen ini sebagai konteks tambahan; jangan menganggap skill dapat menggantikan review manusia. |
| `perbaikan.md` | Catatan spesifikasi/perbaikan yang sudah ada | Perbarui atau arsipkan setelah perubahan terkait selesai dan diverifikasi. |
| `README.md` | Dokumentasi penggunaan dan pengembangan | Lengkapi agar pengembang memahami cara menjalankan situs, struktur modul, dan batasan proyek. |

**Catatan:** sebelum mengubah stylesheet atau modul, periksa kembali hubungan import, urutan pemuatan script, dan dependensinya di `index.html`. Nama file saja tidak cukup untuk menyimpulkan bahwa suatu file aman digabungkan atau dihapus.

### 7.1 Batas arsitektur

- Tetap gunakan Vanilla JavaScript selama kebutuhan proyek masih dapat dipenuhi dengan arsitektur yang ada.
- Jangan memigrasikan proyek ke React, Next.js, atau framework lain hanya karena dianggap lebih modern.
- Jangan menulis ulang seluruh renderer untuk mendapatkan abstraksi yang lebih bersih.
- Jangan menggabungkan renderer khusus dengan `engine.js` sebelum kesetaraan hasil visual dan perilakunya dibuktikan.
- Pertahankan modul bunga sebagai unit yang mudah diuji.
- Pisahkan perubahan visual dari perubahan performa agar penyebab regresi mudah ditemukan.

---

## 8. Arah pengembangan fitur

Fitur baru bukan kewajiban. Tambahkan hanya ketika ada kebutuhan pengguna yang jelas dan implementasinya tidak mengorbankan identitas utama.

### Prioritas A — kualitas fondasi

1. Audit baseline visual dan perilaku seluruh halaman.
2. Pastikan loop animasi berhenti atau ditangguhkan saat tidak dibutuhkan.
3. Pastikan renderer tetap stabil ketika tab tidak terlihat dan ketika pengguna berpindah halaman.
4. Periksa responsivitas, keyboard navigation, reduced motion, dan kontras.
5. Rapikan dokumentasi struktur, lisensi, dan cara menjalankan proyek.

### Prioritas B — eksplorasi bunga

1. Indeks bunga yang mudah dipahami.
2. Pencarian berdasarkan nama.
3. Kategori yang sesuai dengan data botani yang tersedia.
4. Detail bunga yang berisi nama umum, nama ilmiah, dan deskripsi dari sumber tepercaya.
5. Navigasi antarstudi yang konsisten.

Fitur favorit atau penyimpanan lokal dapat dipertimbangkan setelah kebutuhan dan perilakunya didefinisikan. Jangan menambah database hanya untuk fitur yang masih dapat dikelola secara statis.

### Prioritas C — eksperimen generatif

1. Eksperimen palet warna yang tetap menggunakan karakter visual bunga.
2. Variasi animasi yang dapat dipahami dan mudah di-reset.
3. Interaksi pointer atau keyboard yang memperkaya karya.
4. Mode eksperimen terpisah dari halaman utama agar tidak mengganggu pengalaman melihat koleksi.

Fitur pada Prioritas C tidak boleh mendahului stabilitas fondasi.

---

## 9. Protokol perubahan agar desain tidak menyimpang

Setiap perubahan UI atau interaksi harus mengikuti alur berikut.

### Sebelum mengubah

- Ambil screenshot baseline desktop dan mobile.
- Identifikasi file dan selector yang benar-benar terkait.
- Jelaskan masalah yang hendak diselesaikan.
- Tentukan bagian yang tidak boleh berubah.
- Periksa apakah perubahan dapat dilakukan dengan modifikasi kecil.

### Saat mengubah

- Kerjakan satu area atau satu perilaku dalam satu waktu.
- Gunakan kembali token, komponen, dan pola yang sudah ada.
- Hindari menambahkan dependency tanpa alasan teknis.
- Jangan mengganti artwork atau algoritma bunga sebagai efek samping perubahan layout.
- Jangan menghapus kode yang belum dipahami.

### Setelah mengubah

- Bandingkan screenshot sebelum dan sesudah.
- Periksa desktop, tablet, dan mobile.
- Uji keyboard dan reduced motion.
- Pastikan audio tetap mengikuti aturan interaksi pengguna.
- Periksa console dan network untuk error.
- Jalankan pengujian pada bunga yang terdampak dan setidaknya satu bunga lain untuk mendeteksi regresi.
- Catat perubahan, alasan, dan hasil verifikasi di dokumentasi audit.

### Pertanyaan wajib sebelum menerima desain baru

1. Apakah perubahan ini memperkuat identitas botanical ASCII?
2. Apakah perubahan menyelesaikan kebutuhan yang nyata?
3. Apakah karya bunga tetap menjadi fokus?
4. Apakah tampilannya masih terasa seperti The Flowers Project v4?
5. Apakah hasilnya lebih jelas tanpa menjadi lebih ramai?
6. Apakah perubahan dapat dibuktikan bekerja di desktop dan mobile?

Jika jawaban untuk pertanyaan 1 atau 2 adalah "tidak", jangan lanjutkan perubahan tersebut.

---

## 10. Definition of done

Sebuah perubahan dianggap selesai jika:

- Identitas visual v4 tetap dikenali.
- Tidak ada dekorasi generik yang ditambahkan tanpa fungsi.
- Konten dan karya bunga tetap menjadi fokus.
- Interaksi jelas, dapat dikendalikan, dan tidak mengganggu.
- Keyboard, reduced motion, serta ukuran layar yang relevan telah diperiksa.
- Performa tidak mengalami regresi yang tidak dapat diterima.
- Tidak ada error baru pada console.
- Perubahan tidak merusak modul bunga lain.
- Dokumentasi diperbarui jika struktur atau perilaku berubah.

**Ukuran keberhasilan bukan jumlah fitur, animasi, atau kompleksitas teknologi. Ukurannya adalah apakah pengalaman mengamati dan menjelajahi karya bunga menjadi lebih baik tanpa kehilangan karakter yang sudah dibangun.**

---

## 11. Referensi

1. **Immersive Garden** — https://immersive-g.com/  
   Referensi untuk art direction, interaksi yang kontekstual, dan pengalaman digital yang dibuat khusus.

2. **C82 — Lilies & Roses of P.J. Redouté** — https://www.c82.net/redoute/  
   Referensi untuk presentasi koleksi botani, penataan ilustrasi, dan hierarki informasi.

3. **Making of Lilies & Roses of P.J. Redouté** — https://c82.net/blog/making-of-lilies-and-roses-of-pj-redoute  
   Catatan proses desain dari pembuatnya, termasuk prinsip membiarkan karya menjadi fokus.

4. **Silk — Interactive Generative Art** — https://weavesilk.com/  
   Referensi untuk generative interaction dan kontrol yang sederhana.

### Prinsip penutup

> Improve the experience, not the noise.  
> Preserve the flower, preserve the character.

Dokumen ini harus dibaca sebagai pagar arah desain. Ia memberi ruang untuk bereksperimen, tetapi mencegah eksperimen tersebut menghapus identitas The Flowers Project.
