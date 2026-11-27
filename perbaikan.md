# PERBAIKAN KONTROL AUDIO NAVBAR — THE FLOWER PROJECT

Dokumen ini adalah instruksi implementasi untuk memperbaiki fitur audio pada proyek **The Flower Project** berdasarkan paket `The_Flowers_Project_revised_v2.zip`. Baca seluruh instruksi sebelum mengubah kode.

## 1. Tujuan utama

Sempurnakan kontrol audio di ujung kanan navbar agar tampil dan berinteraksi **sedekat mungkin dengan kontrol audio Dverso Studio pada referensi yang diberikan**, termasuk animasi ketika pointer melakukan hover, pergantian visual antara status ENABLE AUDIO dan DISABLE AUDIO, serta kaomoji/ekspresi karakter.

Hasil akhirnya harus terasa sebagai bagian asli dari desain The Flower Project, bukan pemutar musik generik yang ditempelkan ke navbar.

**Prioritas tertinggi:** kesetiaan visual dan motion terhadap referensi Dverso, waveform vektor yang dibuat sendiri (bukan screenshot), perilaku audio yang benar, aksesibilitas, dan tidak merusak bagian website lain.

Referensi yang harus digunakan:
- Website referensi utama: https://dverso.io/ (diakses sebagai halaman Dverso Studio).
- Referensi visual status nonaktif: bentuk garis horizontal dan label `ENABLE AUDIO`; kaomoji referensi hanya ditampilkan ketika hover/focus-visible.
- Referensi visual status aktif: bentuk waveform dan label `DISABLE AUDIO`; waveform harus dianimasikan dengan SVG/CSS orisinal dan kaomoji hanya tampil ketika hover/focus-visible.
- Screenshot yang pernah diberikan hanya boleh menjadi referensi visual. Jangan memasang screenshot, frame screenshot, GIF, atau video screenshot sebagai aset animasi. Semua ikon dan waveform harus digambar sendiri menggunakan SVG/CSS.

## 2. Audit kondisi kode saat ini

Paket yang diperiksa memiliki struktur dan implementasi berikut:

- `index.html` sudah memuat tombol `#audio-toggle` di dalam `.gn-end`, setelah navigasi navbar.
- Tombol memakai SVG buatan sendiri dengan lingkaran abu-abu, garis horizontal untuk status nonaktif, dan waveform animatif untuk status aktif. Tidak ada titik hitam di ujung ikon.
- `audio.js` membuat satu objek `Audio`, mengatur volume ke `0.2`, menonaktifkan loop, serta menggunakan `pause()` untuk menghentikan musik tanpa mengatur ulang `currentTime`.
- `apple.css` sudah mengatur ukuran kontrol untuk navbar dan tampilan responsif.
- `audio.js` saat ini menetapkan `audio.src` ketika halaman diinisialisasi. Perbaiki agar sumber MP3 baru dipasang ketika pengunjung pertama kali menekan tombol.
- Hover saat ini hanya memberi underline pada teks. Ini **belum memenuhi** permintaan animasi hover seperti referensi.
- Selector `.audio-toggle { display: inline-flex; }` berpotensi membuat elemen dengan atribut `hidden` tetap tampil. Perbaiki secara eksplisit.

File utama yang boleh disentuh untuk pekerjaan ini:
- `index.html`
- `audio.js`
- `apple.css`

Jangan mengubah `styles.css`, file bunga, animasi bunga, studi, konten, maupun layout bagian lain kecuali benar-benar diperlukan untuk mencegah konflik langsung dengan kontrol audio. Jika perubahan tambahan memang tidak bisa dihindari, jelaskan alasan dan buktikan bahwa tidak ada regresi.

## 3. Spesifikasi visual — jangan melakukan redesign

Pertahankan identitas visual referensi:

- Lingkaran utama berwarna `#63615C`.
- Garis dan waveform berwarna putih.
- Jangan menambahkan titik hitam di ujung lingkaran atau waveform. Bentuk hitam yang tampak pada screenshot sebelumnya adalah cursor yang tidak sengaja ikut tertangkap, bukan bagian desain.
- Latar kontrol tetap transparan agar menyatu dengan navbar.
- Tipografi menggunakan monospace seperti referensi. Pertahankan ukuran, ketebalan, jarak huruf, jarak antara ikon dan teks, serta proporsi keseluruhan.
- Gunakan skala navbar yang sudah diterapkan (sekitar `0.36×` dari referensi) hanya sebagai penyesuaian ukuran. Jaga rasio antara lingkaran, waveform, dan tulisan.
- Jangan menambahkan glow, gradien, shadow, panel, border dekoratif, progress bar, slider volume, ikon speaker, atau ornamen lain.
- Jangan mengganti SVG dengan gambar raster. Bentuk harus tetap tajam pada berbagai resolusi.

### 3.1. Dua tampilan status yang wajib akurat

**Audio nonaktif / paused:**
- Garis putih horizontal di dalam lingkaran.
- Label `ENABLE AUDIO`.
- Kaomoji status nonaktif `ヾ(´◯`)ﾉ♪♪♪` hanya ditampilkan ketika tombol di-hover (atau mendapat `:focus-visible` sebagai padanan aksesibel), dan tersembunyi pada kondisi normal.

**Audio aktif / sedang diputar:**
- Garis horizontal berubah menjadi waveform putih animatif yang dibuat sendiri dengan SVG/CSS. Gerakan waveform aktif hanya berjalan ketika audio benar-benar sedang diputar.
- Label `DISABLE AUDIO`.
- Kaomoji status aktif hanya ditampilkan ketika tombol di-hover (atau mendapat `:focus-visible` sebagai padanan aksesibel), dan tersembunyi pada kondisi normal. Simpan sebagai teks Unicode; jangan menggantinya dengan emoji.

Teks ekspresi merupakan bagian penting dari desain. Simpan sebagai teks asli/Unicode di DOM atau string JavaScript, bukan sebagai gambar. Periksa hasil render di browser karena beberapa karakter kombinasi Unicode dapat terlihat berbeda antar-font. Sesuaikan fallback font monospace tanpa mengubah karakter aslinya.

### 3.2. Tidak ada titik hitam di ujung ikon

Jangan menggambar atau menganimasikan titik hitam di sisi lingkaran maupun ujung waveform. Titik hitam pada screenshot lama merupakan cursor yang tidak sengaja ikut tertangkap dan bukan bagian kontrol audio.

## 4. Animasi hover — bagian yang wajib dikerjakan

Hover tidak boleh hanya menghasilkan underline. Buat micro-interaction yang nyata dan halus, dengan meniru perilaku kontrol Dverso pada browser.

Sebelum implementasi, periksa kontrol referensi secara langsung pada website Dverso melalui browser: amati kondisi awal, pointer masuk (hover-in), pointer keluar (hover-out), serta perubahan setelah diklik. Gunakan gerakan dan timing yang terlihat pada referensi sebagai acuan. Screenshot menjadi acuan visual jika perilaku live tidak dapat diperiksa.

Implementasikan detail berikut:

1. **Saat pointer masuk:** ikon, garis/waveform, label, dan kaomoji menjalankan animasi hover yang terkoordinasi. Kaomoji harus tersembunyi sepenuhnya pada kondisi normal; saat hover tampilkan kaomoji status dan satu kaomoji tambahan yang berbeda. Gerakannya ringan, presisi, dan singkat.
2. **Animasi ikon:** garis horizontal dan waveform harus berpindah dengan transisi halus. Waveform aktif wajib berupa animasi vektor SVG/CSS orisinal yang dibuat di proyek, misalnya bar gelombang dengan amplitudo yang bergerak. Jangan memakai screenshot sebagai frame animasi, GIF screenshot, atau video screenshot.
3. **Animasi tulisan:** `ENABLE AUDIO` / `DISABLE AUDIO` tetap terlihat sesuai status sebenarnya. Kaomoji status dan kaomoji tambahan hanya muncul saat hover/focus-visible dengan reveal halus (opacity, translate kecil, atau stagger singkat); keduanya tersembunyi saat normal.
4. **Saat pointer keluar:** animasi kembali dengan halus ke tampilan normal sesuai status audio sebenarnya.
5. **Saat diklik:** perubahan status audio menjalankan transisi visual yang sama-sama halus. Label, kaomoji, dan bentuk garis/waveform harus berubah sinkron dengan status audio yang benar.
6. **Hover tidak boleh memutar atau menjeda musik.** Hover hanya interaksi visual. Musik hanya berubah ketika tombol benar-benar diklik atau diaktifkan dengan keyboard/touch.
7. **Jangan menampilkan status palsu:** selama hover, jangan mengubah label menjadi status yang tidak sesuai dengan audio aktual. Saat audio nonaktif, status dasarnya tetap `ENABLE AUDIO`; saat audio sedang diputar, status dasarnya tetap `DISABLE AUDIO`. Animasi hover boleh memberi penekanan/reveal pada aksi yang tersedia, tetapi tidak boleh membuat pengguna mengira musik sudah berubah status.
8. **Keyboard:** ketika tombol mendapat `:focus-visible`, tampilkan micro-interaction yang setara atau versi aksesibel dari hover. Jangan mensyaratkan pointer/mouse agar animasi atau kontrol bisa digunakan.
9. **Touch:** jangan mengandalkan hover untuk fungsi utama. Tap harus tetap langsung mengaktifkan atau menonaktifkan audio.

Gunakan durasi singkat dan easing yang halus. Hindari bounce besar, elastic berlebihan, overshoot, atau animasi dekoratif yang tidak ada pada referensi. Hapus underline hover yang sekarang jika animasi baru sudah menggantikannya.

### 4.1. Reduced motion

Hormati `prefers-reduced-motion: reduce`. Pada preferensi ini, hilangkan gerakan perpindahan, stagger, dan morph yang tidak perlu; gunakan pergantian visual instan atau crossfade sangat singkat. Fungsi tombol dan pergantian status audio harus tetap berjalan penuh.

## 5. Perilaku audio

File musik yang digunakan tetap file proyek yang tersedia: `audio/avril-14th.mp3`. Jangan mengganti, mengubah, atau menduplikasi file tersebut.

Persyaratan wajib:

- **Tidak ada autoplay.** Musik tidak boleh mulai hanya karena halaman dibuka, halaman di-refresh, atau pointer diarahkan ke tombol.
- **Jangan meminta/memuat MP3 sebelum interaksi pertama.** Buat satu objek `Audio` saat inisialisasi, atur `preload = 'none'`, tetapi jangan memasang `src` sampai klik pertama pada `ENABLE AUDIO`.
- Saat klik pertama terjadi, pasang sumber audio dan panggil `play()` sebagai respons langsung terhadap interaksi tersebut agar sesuai dengan kebijakan autoplay browser.
- Setelah sumber dipasang, gunakan objek audio yang sama selama halaman hidup. Jangan membuat objek audio baru setiap kali tombol diklik.
- Volume awal tetap `0.20` (20%). Jangan menaikkan volume otomatis.
- `loop` harus `false`. Musik tidak boleh mengulang otomatis setelah selesai.
- Klik `DISABLE AUDIO` harus menjalankan `pause()`, bukan mengatur `currentTime = 0`.
- Klik `ENABLE AUDIO` setelah pause harus melanjutkan dari posisi terakhir, bukan memulai dari awal.
- Jika musik selesai secara normal, kontrol kembali ke status `ENABLE AUDIO`.
- Jika `play()` ditolak browser atau file gagal dimuat, kontrol harus tetap/berubah ke status nonaktif. Jangan menampilkan status aktif ketika audio tidak benar-benar diputar.
- Perubahan label dan visual harus mengikuti event audio yang nyata (`playing`, `pause`, `ended`, `error`) atau state yang telah diverifikasi, bukan sekadar asumsi bahwa klik berhasil.
- Pastikan event listener tidak terpasang berulang kali.

Contoh alur yang diharapkan:

1. Pengunjung membuka website → tidak ada musik yang diputar dan MP3 belum diminta.
2. Pengunjung hover → animasi visual berjalan, tetapi musik tetap diam.
3. Pengunjung menekan `ENABLE AUDIO` → MP3 dimuat, musik mulai diputar, lalu kontrol berubah ke tampilan `DISABLE AUDIO` setelah pemutaran benar-benar dimulai.
4. Pengunjung menekan `DISABLE AUDIO` → musik pause dan posisi playback dipertahankan.
5. Pengunjung menekan `ENABLE AUDIO` lagi → musik lanjut dari posisi pause sebelumnya.
6. Musik mencapai akhir → musik berhenti, tidak mengulang, dan kontrol kembali ke status `ENABLE AUDIO`.

## 6. Struktur, aksesibilitas, dan fallback

- Pertahankan elemen `<button type="button">` yang sudah ada. Jangan menggantinya dengan `<div>` atau elemen non-interaktif.
- Pertahankan `aria-label` yang dinamis: `Enable audio` saat nonaktif dan `Disable audio` saat aktif.
- Sinkronkan `aria-pressed` dengan status aktual jika atribut ini digunakan.
- Kaomoji dan hiasan waveform/garis harus disembunyikan dari pembaca layar (`aria-hidden="true"`) agar tidak mengganggu label kontrol. Kaomoji hanya bersifat visual saat hover/focus-visible.
- Enter dan Space harus mengaktifkan tombol secara native. Jangan membuat handler keyboard yang menyebabkan aksi ganda.
- Pastikan tombol memiliki tampilan `:focus-visible` yang jelas dan tidak merusak desain.
- Jika JavaScript belum berjalan, tombol jangan tampil sebagai kontrol mati. Tambahkan aturan CSS eksplisit seperti `.audio-toggle[hidden] { display: none !important; }` agar deklarasi `display: inline-flex` tidak mengalahkan atribut `hidden`.
- Tampilkan tombol hanya setelah inisialisasi JavaScript dan event listener selesai dipasang.
- Bila pemuatan atau playback gagal, jangan merusak layout navbar. Pertahankan status nonaktif dan sediakan pesan error aksesibel bila diperlukan, tanpa menambah ornamen visual baru.

## 7. Navbar dan responsivitas

- Kontrol tetap berada di sisi paling kanan navbar, setelah semua navigasi yang sudah ada.
- Beri jarak yang cukup dari tautan navigasi. Jangan mengubah urutan tautan yang sudah ada.
- Jangan menggeser logo, CTA, atau elemen navbar lain secara tidak perlu.
- Pada layar desktop, tampilkan ikon, label, dan kaomoji seperti referensi.
- Pada layar kecil, jika teks perlu disembunyikan demi mencegah overflow, nama aksesibel harus tetap tersedia untuk screen reader. Jangan menghilangkan fungsi atau kaomoji dari status yang dibaca aksesibilitas.
- Pertahankan target sentuh minimal 44 × 44px.
- Uji lebar viewport 320px, 360px, 375px, 390px, 640px, dan desktop. Tidak boleh ada horizontal overflow, teks bertabrakan, atau kontrol keluar dari navbar.
- Jangan menyembunyikan elemen merek/nav lain kecuali aturan responsif yang sudah ada memang membutuhkannya. Jangan membuat perubahan responsif baru yang mengubah komposisi website di luar kebutuhan kontrol audio.

## 8. Batasan perubahan — wajib dipatuhi

- Jangan merombak desain The Flower Project.
- Jangan mengubah palet warna, tipografi global, ukuran navbar, urutan navigasi, logo, konten, layout halaman, animasi bunga, atau interaksi bunga.
- Jangan melakukan refactor besar pada proyek.
- Jangan menambahkan framework, library, package, atau dependency baru untuk fitur ini.
- Jangan menambahkan control volume, seek bar, playlist, judul lagu, durasi, atau komponen pemutar musik tambahan.
- Jangan menggunakan emoji standar sebagai pengganti kaomoji karakter pada referensi.
- Jangan mengubah musik menjadi autoplay.
- Jangan menghapus atau menulis ulang kode yang tidak terkait.
- Jangan mengklaim pengujian telah dilakukan bila belum benar-benar dijalankan.

Perubahan ideal dibatasi pada `audio.js`, bagian kontrol audio di `index.html`, dan CSS audio di `apple.css`.

## 9. Checklist pengujian sebelum dinyatakan selesai

### Fungsi audio

- [ ] Saat halaman dibuka, musik tidak autoplay.
- [ ] Sebelum klik pertama, file MP3 tidak diminta oleh browser.
- [ ] Klik pertama pada `ENABLE AUDIO` memulai musik.
- [ ] Saat musik berjalan, label dan tampilan berubah menjadi `DISABLE AUDIO`.
- [ ] Klik `DISABLE AUDIO` menjeda musik tanpa mengatur ulang posisi.
- [ ] Klik `ENABLE AUDIO` melanjutkan musik dari posisi terakhir.
- [ ] Musik tidak mengulang otomatis setelah selesai.
- [ ] Kegagalan `play()` atau pemuatan file tidak membuat UI mengaku sedang memutar musik.
- [ ] Hanya ada satu objek audio.
- [ ] Volume awal benar-benar `0.20`.

### Hover dan visual

- [ ] Hover-in memunculkan animasi ikon, label, dan kaomoji; bukan sekadar underline.
- [ ] Hover-out mengembalikan tampilan dengan transisi yang rapi.
- [ ] Transisi status setelah klik terlihat sinkron antara garis/waveform, label, dan ekspresi karakter.
- [ ] Hover tidak mengubah status audio.
- [ ] Bentuk lingkaran, garis/waveform orisinal, warna, tipografi, proporsi, dan kaomoji sesuai arahan visual. Tidak ada titik hitam atau screenshot yang dipakai sebagai aset animasi.
- [ ] Tidak ada titik hitam di ujung ikon; cursor screenshot tidak direproduksi sebagai bagian desain.
- [ ] Tidak ada glow, gradient, shadow, panel, atau ornamen tambahan.
- [ ] Reduced motion dihormati.

### Aksesibilitas dan responsivitas

- [ ] Tombol tidak terlihat ketika JavaScript tidak aktif/gagal menginisialisasi.
- [ ] Enter dan Space dapat mengaktifkan tombol tanpa aksi ganda.
- [ ] Focus-visible terlihat jelas.
- [ ] Label aksesibel sesuai status audio.
- [ ] Target sentuh minimal 44 × 44px.
- [ ] Tidak ada overflow pada viewport 320px, 360px, 375px, 390px, dan 640px.
- [ ] Layout navbar desktop dan mobile tidak rusak.

### Regresi website

- [ ] Semua bagian, tautan, fitur, dan animasi bunga yang sudah ada tetap berfungsi.
- [ ] Tidak ada error JavaScript baru di console.
- [ ] Tidak ada 404 untuk file audio atau aset lain.
- [ ] Tidak ada perubahan visual yang tidak terkait dengan kontrol audio.

Lakukan pengujian di Chromium. Jika tersedia, uji juga Firefox dan Safari/WebKit, terutama perilaku playback setelah klik pertama dan layout mobile. Bedakan dengan jelas antara pengujian otomatis/emulasi dan pengujian pada perangkat fisik.

## 10. Hasil akhir yang harus diserahkan

Setelah selesai, serahkan:

1. ZIP proyek lengkap yang sudah diperbaiki.
2. `perbaikan.md` tetap disertakan di root proyek sebagai catatan instruksi.
3. Daftar file yang benar-benar diubah.
4. Ringkasan singkat perubahan hover/motion dan perilaku audio.
5. Hasil checklist pengujian, termasuk browser dan viewport yang benar-benar diuji.
6. Daftar keterbatasan atau pengujian yang belum bisa dilakukan. Jangan menyatakan semuanya lolos bila ada bagian yang belum diuji.

Untuk ZIP distribusi, jangan sertakan folder metadata `.git` atau cache yang tidak diperlukan. Jangan menghapus repository `.git` dari workspace pengembangan pengguna; cukup keluarkan dari paket ZIP distribusi.

---

**Definisi selesai:** kontrol audio berada di ujung kanan navbar; garis horizontal dan waveform SVG/CSS buatan sendiri berganti sesuai status playback; tidak ada titik hitam/cursor di ujung ikon dan tidak ada screenshot yang dipakai sebagai aset animasi; kaomoji status serta kaomoji tambahan hanya muncul saat hover/focus-visible; audio hanya berjalan setelah interaksi eksplisit; pause/resume mempertahankan posisi; dan bagian website lain tetap sama seperti sebelum perbaikan.
