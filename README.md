## how to run

Jalankan perintah berikut di root project:

```bash
npm install
npx playwright install
```

`npm install` memasang dependency (`@playwright/test`, `@types/node`), sedangkan `npx playwright install` mengunduh browser yang dibutuhkan Playwright.

## Struktur Project

```
Tech-test/
├── playwright.config.ts              # Konfigurasi Playwright
├── package.json                      # Dependency & metadata project
├── .gitignore                        # File/folder yang tidak di-commit
├── README.md                         # Panduan menjalankan test
└── ui-automation-tech-test/
    ├── data/
    │   └── testData.ts               # Data user, produk, dan customer
    ├── pages/                        # Page Object Model (POM)
    │   ├── BasePage.ts               # Helper dasar (URL & title)
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   ├── CheckoutInformationPage.ts
    │   ├── CheckoutOverviewPage.ts
    │   └── CheckoutCompletePage.ts
    ├── tests/
    │   ├── login.spec.ts             # Skenario login
    │   └── checkout.spec.ts          # Skenario E2E checkout
    └── example.spec.ts               # Contoh test bawaan Playwright
```

## Skenario Test

| File | Skenario |
| --- | --- |
| `tests/login.spec.ts` | **Positive:** login berhasil dengan kredensial valid |
| | **Negative:** password salah, username tidak dikenal, user locked out, username kosong, password kosong, keduanya kosong, password beda huruf besar/kecil, username/password dengan spasi di awal & akhir, username/password berisi spasi saja |
| | **Boundary:** kredensial 1 karakter, username 255 karakter, password 255 karakter, username & password 1000 karakter, karakter spesial/SQL injection |
| `tests/checkout.spec.ts` | E2E checkout: login → tambah **Sauce Labs Onesie** ke cart → buka cart → checkout → isi data customer → finish → verifikasi pesanan selesai |

Test ditulis dengan **Page Object Model (POM)**: locator dan aksi halaman berada di folder `pages/`, sedangkan file `*.spec.ts` hanya berisi alur skenario dan assertion. Data test dipusatkan di `data/testData.ts`.

## Perintah yang Tersedia

Semua perintah dijalankan dari root project.

| Perintah | Kegunaan |
| --- | --- |
| `npx playwright test` | Menjalankan seluruh end-to-end test. |
| `npx playwright test --ui` | Membuka mode UI interaktif (watch mode). |
| `npx playwright test --project=chromium` | Menjalankan test hanya di Desktop Chrome. |
| `npx playwright test example` | Menjalankan test pada file tertentu (contoh: `example`). |
| `npx playwright test --debug` | Menjalankan test dalam mode debug (Playwright Inspector). |
| `npx playwright codegen` | Membuat test secara otomatis dengan Codegen. |

### Rekomendasi awal

Untuk memulai, jalankan:

```bash
npx playwright test
```

Lalu periksa file berikut:

- `./ui-automation-tech-test/tests/login.spec.ts` — skenario login
- `./ui-automation-tech-test/tests/checkout.spec.ts` — skenario E2E checkout
- `./ui-automation-tech-test/pages/` — Page Object Model
- `./playwright.config.ts` — konfigurasi Playwright Test

Dokumentasi lengkap: <https://playwright.dev/docs/intro>

## Menjalankan Test

### Semua browser (default)

```bash
npx playwright test
```

Secara default test dijalankan di dua browser project yang dikonfigurasi: **chromium** dan **Google Chrome**.

### Browser tertentu

```bash
npx playwright test --project=chromium
npx playwright test --project="Google Chrome"
```

### File atau test tertentu

```bash
# Berdasarkan nama file
npx playwright test login
npx playwright test checkout

# Berdasarkan judul test
npx playwright test -g "completes checkout"
npx playwright test -g "logs in successfully"

# Hanya menjalankan test yang gagal pada run sebelumnya
npx playwright test --last-failed

# Melihat daftar test tanpa menjalankannya
npx playwright test --list
```

### Mode interaktif & debug

```bash
# UI mode — cocok untuk eksplorasi dan menjalankan ulang test
npx playwright test --ui

# Debug mode — berhenti di setiap langkah dengan Playwright Inspector
npx playwright test --debug

# Debug satu file tertentu
npx playwright test example --debug
```

## Melihat Hasil Test (Report)

Reporter yang digunakan adalah **HTML reporter** (lihat `reporter: 'html'` pada `playwright.config.ts`). Setelah test selesai, buka report dengan:

```bash
npx playwright show-report
```

Report akan tersedia di folder `playwright-report/`. Hasil run mentah (termasuk trace, screenshot, dan video) disimpan di `test-results/`.

### Capture otomatis saat test gagal

Konfigurasi di `playwright.config.ts` sudah mengaktifkan artifact berikut ketika test gagal:

| Opsi | Nilai | Keterangan |
| --- | --- | --- |
| `screenshot` | `only-on-failure` | Screenshot diambil otomatis saat test gagal. |
| `video` | `retain-on-failure` | Video direkam selama test, tetapi hanya disimpan jika test gagal (video test yang lolos dihapus). |
| `trace` | `on-first-retry` | Trace direkam saat test di-retry (di CI, retry otomatis 2x). |

Artifact tersebut otomatis terlampir di HTML report. Untuk melihatnya:

```bash
npx playwright show-report
```

Kemudian buka test yang gagal — screenshot dan video bisa dilihat langsung dari report. File mentahnya juga ada di folder `test-results/<nama-test>/`.

Untuk membuka trace secara detail (langkah per langkah, DOM snapshot, network):

```bash
npx playwright show-trace test-results/<nama-test>/trace.zip
```

> **Catatan:** `video: 'retain-on-failure'` merekam video untuk **semua** test lalu menghapusnya jika test lolos. Ini memakan waktu dan disk lebih banyak. Jika ingin lebih ringan, ganti menjadi `video: 'on-first-retry'` agar video hanya direkam saat retry (butuh `retries` aktif).

## Codegen — Membuat Test Otomatis

```bash
npx playwright codegen
```

Codegen membuka browser dan merekam interaksi kamu menjadi kode test Playwright. Untuk langsung membuka URL tertentu:

```bash
npx playwright codegen https://contoh-website.com
```

## Konfigurasi

Konfigurasi utama ada di `playwright.config.ts`:

- **`testDir`** — `./ui-automation-tech-test`, lokasi semua file test.
- **`fullyParallel`** — `true`, test dijalankan paralel.
- **`reporter`** — `html`.
- **`baseURL`** — `https://www.saucedemo.com`.
- **`testIdAttribute`** — `data-test`, mengikuti atribut yang dipakai Sauce Demo.
- **`screenshot`** — `only-on-failure`, screenshot disimpan saat test gagal.
- **`video`** — `retain-on-failure`, video disimpan hanya saat test gagal.
- **`trace`** — `on-first-retry`, trace direkam saat test gagal dan di-retry.
- **`projects`** — chromium dan Google Chrome.

Opsi lain seperti `webServer` dan mobile viewport masih dikomentari dan bisa diaktifkan sesuai kebutuhan.

## Menulis Test Baru

Test mengikuti pola **Page Object Model**:

1. Buat page object di `ui-automation-tech-test/pages/` jika ada halaman baru. Simpan locator dan aksi halaman di class tersebut, misalnya `LoginPage.ts`.
2. Buat file test di `ui-automation-tech-test/tests/` dengan akhiran `.spec.ts`, misalnya `login.spec.ts`.
3. Import page object dan data test, lalu tulis alur skenario di file spec.

Contoh:

```ts
import { test } from '@playwright/test';
import { USERS } from '../data/testData';
import { LoginPage } from '../pages/LoginPage';

test('login berhasil', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const inventoryPage = await loginPage.login(USERS.standard.username, USERS.standard.password);
  await inventoryPage.expectLoaded();
});
```

Dengan pola ini, perubahan locator cukup dilakukan di satu tempat (page object) tanpa mengubah banyak file test.

## Catatan

- Jalankan perintah dari **root project** agar `playwright.config.ts` terbaca.
- Jika browser belum terpasang atau muncul error terkait browser, jalankan `npx playwright install`.
- Folder `node_modules/`, `test-results/`, `playwright-report/`, `blob-report/`, dan cache Playwright sudah diabaikan oleh Git melalui `.gitignore`.
- Untuk melihat semua opsi CLI: `npx playwright test --help`.
