# LICENSE-DECISION.md

**Project:** The Flowers Project v4  
**Status:** Recommendation only; no license selected  
**Owner decision:** Considering open-source; specific license deferred  

## 1. Keputusan saat ini

Belum ada lisensi source code yang dipilih oleh pemilik. Jangan menyebut repository sebagai open-source dan jangan menambahkan file `LICENSE`, `COPYING`, atau `NOTICE` final sebelum pemilik menyetujui lisensi, identitas pemegang hak, dan cakupan berkas yang dilisensikan.

Dokumen ini bukan nasihat hukum. Ini ringkasan pilihan praktis untuk membantu keputusan pemilik.

## 2. Tiga kandidat yang relevan

| Lisensi | Model | Implikasi utama | Cocok bila pemilik mengutamakan |
|---|---|---|---|
| MIT | Permissive | Pengguna dapat menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, mensublisensikan, dan menjual salinan dengan mempertahankan pemberitahuan hak cipta dan izin. Tidak ada kewajiban umum untuk membuka perubahan turunan. | Adopsi luas dan persyaratan redistribusi yang sederhana. |
| Apache-2.0 | Permissive | Memberi grant hak cipta dan grant paten eksplisit dari kontributor, dengan persyaratan distribusi seperti menyertakan lisensi, menandai file yang dimodifikasi, mempertahankan notice, dan meneruskan atribusi NOTICE bila ada. | Model permissive, tetapi pemilik juga ingin kejelasan grant paten dan notice kontributor. |
| GPL-3.0 | Strong copyleft | Ketika covered work didistribusikan/diconvey, persyaratan GPL dan ketentuan source terkait berlaku pada distribusi tersebut. Turunan yang termasuk covered work harus tetap berada dalam model copyleft sesuai syarat GPL. | Mempertahankan kebebasan pengguna melalui kewajiban berbagi source pada distribusi turunan yang tercakup. |

Rujukan resmi:

- MIT dan daftar lisensi populer: <https://opensource.org/licenses>.
- Apache License 2.0: <https://opensource.org/license/apache-2.0>.
- GNU GPLv3: <https://www.gnu.org/licenses/gpl-3.0.en.html>.
- GNU GPLv3 quick guide: <https://www.gnu.org/licenses/quick-guide-gplv3.html>.
- OSI FAQ mengenai definisi open-source dan memilih lisensi: <https://opensource.org/faq>.

## 3. Trade-off

### MIT

Kelebihan:
- Ringkas dan mudah dipahami.
- Memudahkan penggunaan ulang di proyek pribadi maupun komersial.
- Cocok untuk proyek statis Vanilla JavaScript yang ingin digunakan ulang tanpa kewajiban copyleft.

Konsekuensi:
- Perubahan turunan tidak harus dibagikan sebagai source terbuka.
- Tetap perlu memastikan pemilik benar-benar memegang hak atas kode yang dilisensikan dan mempertahankan notice.

### Apache-2.0

Kelebihan:
- Tetap permissive.
- Memuat grant paten eksplisit dari kontributor.
- Menentukan cara mempertahankan copyright/patent/attribution notices dan NOTICE bila digunakan.

Konsekuensi:
- Lebih panjang dan memiliki kewajiban notice/modified-file yang lebih rinci dibanding MIT.
- Lebih banyak metadata lisensi yang perlu dijaga saat redistribusi.

### GPL-3.0

Kelebihan:
- Menjaga agar distribusi covered derivative work tetap memberi penerima hak dan akses source sesuai GPL.
- Tepat bila tujuan pemilik secara sadar adalah copyleft, bukan sekadar membagikan source.

Konsekuensi:
- Penerima yang mendistribusikan covered work harus mengikuti persyaratan GPL, termasuk source code yang sesuai.
- Dapat membatasi penggabungan atau penggunaan ulang dalam proyek yang tidak kompatibel.
- Cakupan apakah beberapa komponen merupakan satu covered work atau karya terpisah harus dianalisis dengan cermat.

## 4. Rekomendasi bersyarat

Untuk proyek website statis Vanilla JavaScript ini, **MIT layak menjadi kandidat pertama untuk dievaluasi** bila prioritas pemilik adalah reuse seluas mungkin dengan syarat yang relatif sederhana.

Apache-2.0 lebih cocok dievaluasi bila pemilik menginginkan model permissive sekaligus grant paten eksplisit dan ketentuan notice yang lebih formal.

GPL-3.0 sebaiknya dipilih hanya bila pemilik memang menghendaki copyleft dan menerima konsekuensi distribusi source pada covered derivative work.

Ini bukan pemilihan lisensi oleh AI. Pemilik tetap harus memilih sendiri setelah mempertimbangkan cara proyek akan digunakan dan didistribusikan.

## 5. Cakupan komponen harus dipisahkan

Sebelum membuat lisensi final, buat inventaris dan identifikasi pemegang hak untuk setiap kelompok berikut:

1. **Kode proyek:** HTML, CSS, JavaScript, renderer, flower definitions, dan scheduler. Pastikan kontribusi pemilik/pihak lain sebelum melisensikannya.
2. **Dokumentasi:** README, DESIGN-DIRECTION, catatan pengembangan, dan materi tertulis. Tentukan apakah dokumentasi memakai lisensi yang sama atau lisensi terpisah.
3. **Artwork/hasil ASCII generatif:** jangan menganggap lisensi source otomatis menjawab seluruh status hak atas setiap hasil atau desain bunga. Catat apakah output berasal dari kode asli, kontribusi, atau materi pihak ketiga.
4. **Font dan dependency/aset lain:** inventaris semua aset eksternal, lisensi, versi, dan atribusi yang disyaratkan. Pemeriksaan source saat ini tidak menemukan permintaan font eksternal pada `@import` atau `url()` CSS, tetapi inventaris akhir tetap perlu dilakukan sebelum rilis.
5. **Audio `audio/avril-14th.mp3`:** komponen pihak ketiga yang terpisah dari lisensi kode. Jangan masukkan MP3 ke cakupan lisensi proyek atau paket source publik sebelum izin terpisah yang mencakup hosting/playback dan distribusi file dikonfirmasi.

Jangan menganggap satu lisensi proyek otomatis melisensikan semua aset pihak ketiga.

## 6. Status audio Bandcamp

Pemilik melaporkan membeli *Avril 14th* melalui Bandcamp dan menyimpan bukti pembelian secara pribadi. Bukti pembelian tidak perlu diunggah ke repository atau dimasukkan ke dokumen publik.

Bandcamp Terms of Use menjelaskan bahwa lisensi pengguna untuk konten pada layanan dibatasi ke penggunaan personal non-komersial dan penggunaan/distribusi lain memerlukan izin tertulis dari Bandcamp atau pemegang hak yang relevan. Bandcamp Help Center menyatakan pembelian musik tidak dengan sendirinya memberikan hak komersial atau broadcasting, dan menyarankan menghubungi kreator/publisher untuk usage agreement.

Sumber:
- Bandcamp Terms of Use, Content and License: <https://bandcamp.com/terms_of_use>.
- Bandcamp Help Center, “Can I use the music that I bought in my YouTube video/commercial/podcast?” (5 June 2026): <https://get.bandcamp.help/en/articles/15263299-can-i-use-the-music-that-i-bought-in-my-youtube-video-commercial-podcast>.

Status operasional: pembelian dilaporkan oleh pemilik; izin khusus untuk playback/hosting website dan distribusi MP3 di repository atau paket publik belum dibuktikan oleh dokumen izin tertulis yang tersedia. Cakupan hak dapat bergantung pada hak rekaman dan komposisi serta ketentuan penggunaan yang diberikan pemegang hak. Konfirmasikan secara tertulis dengan artist/label/publisher atau penasihat yang kompeten sebelum rilis publik.

Tidak ada perubahan audio pada Audit 007. Jangan menghapus file privat pemilik atau mengemas MP3 ke dalam rilis publik tanpa keputusan dan izin yang sesuai.

## 7. Keputusan yang diminta dari pemilik

Sebelum lisensi final dibuat, pemilik perlu menentukan:

- Tujuan utama: reuse luas dengan syarat sederhana (MIT), permissive dengan grant paten eksplisit (Apache-2.0), atau copyleft (GPL-3.0).
- Identitas pemegang hak yang akan dicantumkan.
- Tanggal/tahun copyright dan cakupan file yang dilisensikan.
- Apakah dokumentasi dan artwork memiliki lisensi terpisah.
- Aset pihak ketiga mana yang dikecualikan dari lisensi kode.
- Status final audio untuk distribusi publik.

**Tidak ada lisensi final yang dipilih atau diterbitkan dalam dokumen ini.**
