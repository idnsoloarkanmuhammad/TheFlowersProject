# Audit antislop 002 — catatan implementasi (2026-11-24)

**Mode:** AFTER.  
**Dasar kerja:** `DESIGN-DIRECTION.md` dari pengguna dan Audit antislop 002 tanggal 24 November 2026.  
**Persetujuan:** temuan 25, 26, 27, 28, dan 31.  
**Tidak disetujui:** temuan 29 dan 30.

## Ringkasan keputusan

| Temuan | Status | Catatan |
|---:|---|---|
| 25 | **Selesai** | Arah desain resmi tersedia di root dan dirujuk oleh `CLAUDE.md`, README, serta komentar `apple.css`. |
| 26 | **Selesai untuk renderer registry `FlowerEngine`** | Kegagalan mount ditangani; pesan tampil; kontrol pada studi yang gagal dinonaktifkan. Fallback disediakan bila `IntersectionObserver` tidak tersedia. |
| 27 | **Selesai** | Semantik gambar dipindahkan ke canvas; pesan error berperan sebagai status terpisah. |
| 28 | **Ditunda karena batasan spacing** | Tidak diubah. Target 44 × 44 px yang terpisah untuk 15 tautan vertikal akan mengubah jarak visual rail. |
| 29 | **Tidak dikerjakan** | Tidak disetujui; tidak ada perubahan pada ekspresi/kaomoji audio. |
| 30 | **Tetap terbuka** | Source yang dilampirkan tidak memuat `wake()` dan masih menjadwalkan rAF sebelum guard paused/hidden/visibility. Tidak dilakukan implementasi ulang. |
| 31 | **Selesai** | README dilengkapi untuk pengguna dan pengembang berikutnya. |

## Baseline sebelum perubahan

Baseline source disalin sebelum pengeditan ke snapshot kerja terpisah. Pemeriksaan baseline mencatat:

- Seluruh file JavaScript lolos `node --check`.
- `styles.css`, `studies.css`, dan `apple.css` masing-masing memiliki 0 parse error.
- `index.html` memiliki 29 ID statis dan tidak ada ID duplikat.
- Hash awal untuk file yang relevan dicatat agar perubahan dapat dibandingkan:

| File | SHA-256 sebelum perubahan |
|---|---|
| `index.html` | `8e0a741cc185deb634dcf7476e2b972fab08609e505a9ed70f5f2eab3932ce0a` |
| `styles.css` | `193456e46931c5baed5f4b0008ba93689f7930ddb30977fba37affec0adf9c84` |
| `studies.css` | `14327cbba203f693ded4bde65a262b96a8d75300097d78034ea9ea128af88abf` |
| `apple.css` | `a949355a73237b5d63d4f38ab65294ea2ffedc850ca0a5c2e81e4ac44ba7533f` |
| `engine.js` | `80ed73d3c66ceed29c1f2ca9535dacf33c70d779b4be61bc502c9dcfd11bd9ec` |
| `studies.js` | `8e3461f006a4ea60e6c442d9417546eb9b16bff235f4a8d493f4dadd2d1683bd` |
| `cover.js` | `2ba69ad3cba7674db84009e996d323320038b788d8eeb2e88d44550293f9df4f` |
| `README.md` | `d138389f7a26ea068f020aaf248d42ba4bd41c1f08290a141e6771ce2b9af800` |
| `CLAUDE.md` | `0c396739cf61f68e1b8164543fcfa4d2e04910a17c3bfe28bdc58af5e0048d7b` |

A screenshot baseline tidak dapat diambil karena Chromium tidak dapat dijalankan secara andal pada lingkungan ini. Karena itu, baseline di sini adalah baseline source dan pemeriksaan statis, bukan bukti screenshot visual.

## Implementasi per temuan

### 25 — DESIGN-DIRECTION.md dan CLAUDE.md

- Menyalin dokumen arahan yang diberikan pengguna ke root proyek sebagai `DESIGN-DIRECTION.md` tanpa mengubah isinya.
- Menambahkan guardrail proyek ke `CLAUDE.md`: `DESIGN-DIRECTION.md` adalah sumber kebenaran; `DESIGN.md` lama dinyatakan sebagai referensi instalasi Antislop yang legacy, bukan arah desain botani.
- Memperbarui komentar dokumentasi pada `apple.css` agar tidak lagi menyebut `DESIGN.md` lama sebagai arah desain resmi.
- Tidak mengubah deklarasi CSS untuk penyelarasan dokumentasi ini.

### 26 — graceful failure ketika mount gagal

- `FlowerEngine.mount()` sekarang menangani elemen canvas yang hilang, context 2D yang tidak tersedia/menimbulkan exception, kegagalan `def.build()`, dan exception saat render awal (`resize()`).
- Kegagalan dicatat di console dan ditampilkan sebagai pesan status pada halaman, bukan dibiarkan sebagai area gelap tanpa penjelasan.
- `studies.js` menonaktifkan tombol di dalam studi yang mount-nya gagal. Tombol untuk studi lain tidak terpengaruh.
- `FlowerEngine.start()` memiliki fallback pemeriksaan batas viewport saat `IntersectionObserver` tidak tersedia atau gagal dibuat. Fallback memperbarui visibilitas melalui event scroll/resize.
- Fungsi `frame()` dan lifecycle `requestAnimationFrame()` tidak diubah. Perubahan ini tidak dimaksudkan sebagai implementasi temuan 30.

### 27 — semantik dan accessibility pesan kegagalan

- Menghapus `role="img"` dari wrapper `.scene`.
- Memindahkan `role="img"` dan nama aksesibel ke elemen `<canvas>` pada tiga studi statis, cover, dan template studi dinamis.
- Pesan error tetap berada di `.scene`, tetapi kini menjadi sibling dari canvas image, bukan turunan dari landmark gambar.
- Pesan menggunakan `role="status"`, `aria-live="polite"`, dan `aria-atomic="true"`.

### 28 — target interaksi Study Rail (ditunda)

- CSS `studies.css` sengaja tidak diubah agar bentuk dan spacing visual rail tetap persis seperti baseline.
- Source saat ini menempatkan 15 tautan vertikal dalam target 22 × 15 px dengan gap 2 px (pitch 17 px).
- Target 44 × 44 px yang tidak saling tumpang tindih membutuhkan tinggi `15 × 44 + 14 × 2 = 688 px`, dengan pitch 46 px. Artinya jarak visual garis rail berubah dari 17 px menjadi 46 px.
- Karena batasan wajib melarang perubahan spacing, target yang lebih besar tidak dapat diterapkan secara jujur tanpa melanggar batasan tersebut. Temuan 28 ditunda sampai ada keputusan yang mengizinkan perubahan jarak visual rail atau pendekatan navigasi lain.

### 31 — README

- Menjelaskan cara menjalankan situs statis melalui local HTTP server.
- Menegaskan bahwa Python hanya contoh server pengembangan lokal, bukan bagian dari runtime aplikasi.
- Menjelaskan peran file, urutan script `defer`, hubungan `FlowerEngine` dengan modul bunga, batas Vanilla JavaScript, dan aturan yang harus dijaga.
- Menandai `DESIGN-DIRECTION.md` sebagai acuan desain resmi dan `DESIGN.md` lama sebagai referensi legacy.
- Mengingatkan bahwa status izin/lisensi aset `audio/avril-14th.mp3` belum dibuktikan oleh repository.

## Rekonsiliasi khusus temuan 30

Pemeriksaan source yang tersedia menunjukkan:

- Tidak ditemukan fungsi `wake()` pada `engine.js`, `bouquet.js`, `peony.js`, maupun `violet.js`.
- Di `engine.js`, `bouquet.js`, `peony.js`, dan `violet.js`, callback `frame()` masih menjadwalkan `requestAnimationFrame()` sebelum memeriksa kondisi paused, dokumen tersembunyi, atau visibilitas.
- Arsip proyek ini juga memuat `anti-slop/audit-002-2026-11-24.md` yang masih mencatat temuan 30 sebagai temuan terbuka. Arsip ini tidak memuat source atau catatan implementasi yang menunjukkan hasil baru “callback rAF saat paused = 0”.
- Tidak ada perubahan pada `bouquet.js`, `peony.js`, atau `violet.js`; isi fungsi `frame()` di keempat renderer tetap sama dengan baseline.

Maka temuan 30 **tidak boleh ditandai sudah ditangani berdasarkan arsip yang tersedia**. Temuan ini tetap terbuka sampai source hasil perubahan yang dimaksud dapat diperiksa dan diuji. Tidak ada implementasi ulang yang dilakukan.

## Verifikasi setelah perubahan

| Pemeriksaan | Hasil |
|---|---|
| Unit harness Node VM: `build()` melempar exception | **PASS** — mount mengembalikan `null` dan menampilkan status polite. |
| Unit harness Node VM: elemen canvas tidak ditemukan | **PASS** — pesan status ditambahkan ke section. |
| Unit harness Node VM: context 2D tidak tersedia atau `getContext()` melempar exception | **PASS** — mount gagal secara terkendali. |
| Unit harness Node VM: `IntersectionObserver` tidak tersedia | **PASS** — fallback viewport memasang listener scroll/resize dan memperbarui visibilitas. |
| Unit harness Node VM: constructor `IntersectionObserver` gagal | **PASS** — setup gagal dialihkan ke fallback viewport. |
| Unit harness Node VM: `observe()` melempar exception | **PASS** — observer yang gagal dilepas dan fallback viewport tetap dipasang. |
| Unit harness Node VM: fungsi `draw()` melempar exception pada render awal | **PASS** — mount gagal terkendali dan mengirim status. |
| Unit harness Node VM: mount gagal pada `studies.js` | **PASS** — tombol studi yang terdampak dinonaktifkan. |
| `node --check` seluruh JavaScript proyek | **PASS**. |
| Parsing tiga stylesheet dengan `tinycss2` | **PASS** — 0 parse error pada setiap stylesheet. |
| Pemeriksaan HTML statis | **PASS** — 29 ID unik; tiga canvas statis memiliki nama aksesibel; wrapper scene tidak lagi memakai `role="img"`. |
| Template `cover.js` dan `studies.js` | **PASS** — semantik gambar dipasang pada canvas, bukan wrapper scene. |
| `git diff --check` | **PASS**. |
| Uji browser Chromium headless | **TIDAK SELESAI** — proses timeout (exit 124) setelah 15 detik, tidak menghasilkan DOM. Log menunjukkan kegagalan komunikasi DBus/zygote pada lingkungan eksekusi. |

**Batas klaim:** belum ada verifikasi tampilan visual, ukuran hit area aktual di browser, keyboard interaction end-to-end, screen reader aktual, mobile/tablet, atau console runtime di browser. Tidak ada klaim bahwa pengujian tersebut lulus.

## File yang diubah

1. `DESIGN-DIRECTION.md` — dokumen arah desain resmi ditambahkan.
2. `CLAUDE.md` — instruksi sumber kebenaran dan guardrail proyek.
3. `apple.css` — komentar dokumentasi arah desain diperbarui; deklarasi gaya tidak diubah.
4. `engine.js` — graceful failure, status error, dan fallback IntersectionObserver.
5. `studies.js` — semantik canvas pada template; tombol studi dinonaktifkan ketika mount gagal.
6. `index.html` — semantik aksesibel dipindahkan ke canvas tiga studi statis.
7. `cover.js` — semantik aksesibel canvas pada cover dinamis.
8. `README.md` — dokumentasi penggunaan, struktur, dan batas proyek.
9. `anti-slop/audit-002-implementation-2026-11-24.md` — catatan implementasi dan verifikasi ini.

Tidak ada file artwork, palet, renderer khusus bunga, algoritma gambar, audio, `studies.css`, maupun `requestAnimationFrame` pada temuan 30 yang diubah.
