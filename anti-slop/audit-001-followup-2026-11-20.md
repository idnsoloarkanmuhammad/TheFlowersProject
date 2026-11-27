# Tindak lanjut audit 001 (2026-11-20), kondisi akhir

Mode: AFTER. Semua 24 temuan sudah ditangani (1 sampai 19 disetujui lebih dulu; 20 sampai 24 ditambahkan atas permintaan "seluruh aturan antislop terpenuhi").
Keputusan pemilik: gaya Apple disengaja (override sadar), arah desain resmi = `DESIGN.md` (disalin ke root proyek) dan diprioritaskan, simbol wordmark 4 kelopak dipertahankan.

## Design Read dan dial

Galeri botani generatif berformat gulir panjang, dibaca sebagai situs editorial yang tenang (DESIGN.md) dengan warna dasar hitam dan font sistem bergaya Apple (pilihan pemilik).
Dial: ENERGY 1, RHYTHM 1 (seragam, disengaja: tiap studi satu templat agar terbaca seperti dokumen, sesuai DESIGN.md bagian 2.1), MOTION 2 (animasi bunga; berhenti sendiri saat reduced-motion).

## Penerapan DESIGN.md

DESIGN.md mendeskripsikan situs dokumentasi Antislop. Yang diterapkan adalah bahasa visualnya; bagian khusus dokumentasi (breadcrumb, tab kategori, langkah bernomor, permukaan perintah) tidak relevan untuk galeri ini dan tidak dibuat.

| Bagian DESIGN.md | Penerapan |
|---|---|
| 1 Arah visual, 5 Ritme | Konten lebih dulu, permukaan tenang, jarak rapat dalam grup dan lega antar grup, tanpa dekorasi yang tidak membantu orientasi |
| 3 Warna | Satu aksen UI (biru, hanya untuk aksi). Kata penekanan di judul netral. Warna bunga hanya di seni dan swatch palet. Tanpa halo, glow, atau gradien dekoratif |
| 4 Tipografi | Font sans sistem, judul maks. 48px (bukan hero), label berhuruf kalimat |
| 6 Bentuk | Radius kecil dan konsisten (tombol 10px, nav CTA 8px, kartu 14px); tanpa pil; tanpa bayangan tebal |
| 7 Komponen | Kartu indeks sama struktur dan padding; hover halus (garis tepi atau permukaan); aturan dan catatan riset berupa teks dengan garis tipis |
| 8 Interaksi | Hover: garis bawah atau cincin; fokus: outline biru 2px; transisi 0,15 detik; tanpa gerak dramatis |
| 9 Responsif | Tanpa overflow di 320/375/390px, target ketuk 44px, tanpa teks di bawah 11px |
| 10 Konsistensi | Satu bahasa bentuk dan jarak di cover, studi, indeks, dan colophon |
| 11 Hindari | Tanpa glassmorphism/blur, orb warna, bento acak, badge dan pil status (pil "live", edisi, catatan sudut dihapus), bayangan tebal |

Satu pengecualian yang disengaja: di mobile ada lapisan gelap berpinggiran lembut di belakang teks deskripsi, murni agar kontras 4,5:1 tercapai di atas animasi. Ini satu-satunya gradien.

## Status per nomor

1. R-02: em dash dihapus dari teks dan komentar.
2. R-25: teks deskripsi 14px lebih terang di atas lapisan gelap (mobile).
3. R-25: label kecil dibesarkan dan diberi kontras cukup; tidak ada teks di bawah 11px.
4. R-03: semua target ketuk minimal 44px di mobile.
5. R-03: tinggi bab = layar dikurangi bar nav; dock utuh setelah lompat anchor.
6. R-24: link yang bergantung pada JS disembunyikan sampai targetnya ada.
7. R-27: `<noscript>`, banner library gagal, pesan di scene bila canvas gagal.
8. R-32: urutan DOM dan Tab = urutan visual (nav, cover, indeks, studi).
9. R-39: satu `<main>`, satu `<h1>`, `<footer>` nyata berisi pintasan keyboard.
10. R-39: reduced-motion membuat bloom mulai selesai dan berhenti (5 engine).
11. R-39: hover tidak hanya berganti warna.
12. R-39: seni punya teks alternatif; label pause dan replay unik per bunga.
13. R-37, R-31: DESIGN.md di root, Design Read dan dial tertulis, alasan di komentar `apple.css`.
14. R-23: simbol 4 kelopak dipertahankan dan kini terlihat di merek nav (sebelumnya tersembunyi).
15. R-06: font sistem (Inter dibuang), label berhuruf kalimat.
16. R-10: nol elemen ber-blur.
17. R-14: kartu hanya untuk indeks (item sejajar); sisanya teks dengan garis tipis.
18. R-04, R-08: chevron palet dan panah dekoratif dihapus; ikon pause terisi; panah ↑ pada link kembali dipertahankan karena menunjukkan arah gulir.
19. R-01, R-29: satu aksen UI; tidak ada warna bunga di antarmuka.
20. R-30: override sadar milik pemilik; warna dasar dan font tetap bergaya Apple, sedangkan pil, blur, dan halo diubah mengikuti DESIGN.md yang diprioritaskan.
21. R-05: ritme seragam dideklarasikan sengaja (RHYTHM 1) dengan alasan tertulis.
22. R-15: tombol nav "Start" diganti "Lilies" (tujuan spesifik).
23. C-2, C-3: markup tersembunyi dihapus dari sumber (topbar, pil live, edisi, catatan sudut, footer halaman, scroll-cue, canvas ambient, vignette, grain).
24. C-4, C-5: status kini "Playing" atau "Paused" dan selalu akurat; pintasan keyboard tampil di footer; ukuran teks deskripsi mobile seragam 14px.

## Bukti pengukuran (Chromium headless)

- Kontras teks di atas animasi, kasus terburuk (p95): mobile 375px 48 pengukuran semua lolos (terendah 6,69:1); desktop 1280px 60 pengukuran semua lolos (terendah 5,43:1).
- Mobile 320/375/390px: tanpa overflow, 0 target di bawah 44px, 0 teks di bawah 11px, dock utuh.
- Reduced-motion: 0 piksel berubah (sebelumnya 94.015); gerak normal tetap berjalan.
- 15 bab: pause, palet, replay berfungsi; Space dan P berfungsi; fokus terlihat; tidak ada error konsol.
- Tanpa JS, engine diblokir, canvas gagal: pesan tampil dan tidak ada link mati.
- 1 `<main>`, 1 `<h1>`, 16 dari 16 scene punya teks alternatif, 15 dari 15 label unik, 0 elemen ber-blur, 0 em dash di DOM.

## Yang tersisa dan tidak diukur

- Data yang kini tidak dipakai: field `note` dan `ambient` di `flowers/*.js` dan `cover.js`, serta selector CSS lama untuk elemen yang sudah dihapus di `styles.css` dan `studies.css`. Tidak berdampak pada tampilan; bisa dibersihkan kemudian.
- Lighthouse dan Core Web Vitals tidak diukur. Pengujian memakai emulasi mobile di Chromium headless, bukan perangkat fisik.
- Proses: perubahan awal di `engine.js` dikerjakan dengan skrip penggantian string; semua sisanya lewat suntingan langsung pada sumber. Cara pertama tidak sesuai aturan R-33 dan tidak diulang.

## Tambahan: kontrol audio navbar (tambahan_1.md)

Berkas: `audio.js` (baru), `audio/avril-14th.mp3` (baru), markup di `index.html`, gaya bagian 9 di `apple.css`.
- Bentuk mengikuti dua referensi Dverso Studio: lingkaran abu-abu `#63615C` (Ø64 pada skala referensi), titik hitam Ø~20 di tepi kanan, garis putih (nonaktif) atau gelombang putih dua puncak (aktif), teks monospace 11px (skala 0,36). Teks `ENABLE AUDIO ヾ(´◯`)ﾉ♪♪♪` dan `DISABLE AUDIO (ง'̀-'́)ง` disalin dari referensi.
- Satu elemen audio bersama; tanpa autoplay, tanpa penyimpanan preferensi, tanpa loop, tanpa slider; volume awal 0,20; file tidak diunduh sebelum diminta (`preload="none"`).
- Status visual mengikuti kejadian audio nyata (`playing`, `pause`, `ended`, `error`), bukan klik.
- Diuji: tanpa autoplay dan tanpa permintaan mp3 sebelum klik; 1 instance audio; pause menyimpan posisi dan enable lanjut dari posisi itu; file gagal tidak menjebak status aktif; tanpa JS tombol tersembunyi; Enter dan Space berfungsi dan Space tidak memicu animasi bunga; tanpa overflow di 320/375/390 px dan tidak bertumpuk dengan tautan; area ketuk 44px.
- Penyesuaian yang perlu diketahui: tautan navbar dibungkus `div.gn-end` bersama kontrol (urutan tidak berubah); di layar 640px ke bawah hanya lingkaran yang terlihat (teks tetap menjadi nama aksesibel); di layar 360px ke bawah simbol kelopak di merek disembunyikan agar semua muat.
- Catatan visual: titik hitam referensi berada di atas latar krem, sedangkan navbar proyek hitam, sehingga separuh titik yang di luar lingkaran tidak terlihat.
- Lisensi: rekaman dan komposisi "Avril 14th" perlu izin atau lisensi sebelum situs dipublikasikan.
