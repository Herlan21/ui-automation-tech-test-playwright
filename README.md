## how to run

Jalankan perintah berikut di root project:

```bash
npm install
npx playwright install
```

`npm install` memasang dependency (`@playwright/test`, `@types/node`), sedangkan `npx playwright install` mengunduh browser yang dibutuhkan (Chromium, Firefox, WebKit).

## Struktur Project

```
Tech-test/
├── playwright.config.ts          # Konfigurasi Playwright
├── package.json                  # Dependency & metadata project
├── .gitignore                    # File/folder yang tidak di-commit
└── ui-automation-tech-test/
    └── example.spec.ts           # Contoh end-to-end test
```

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

- `./ui-automation-tech-test/example.spec.ts` — contoh end-to-end test
- `./playwright.config.ts` — konfigurasi Playwright Test

Dokumentasi lengkap: <https://playwright.dev/docs/intro>

## Menjalankan Test

### Semua browser (default)

```bash
npx playwright test
```

Secara default test dijalankan di tiga browser project yang dikonfigurasi: **chromium**, **firefox**, dan **webkit**.

### Browser tertentu

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### File atau test tertentu

```bash
# Berdasarkan nama file
npx playwright test example

# Berdasarkan judul test
npx playwright test -g "has title"

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

Report akan tersedia di folder `playwright-report/`. Hasil run mentah (termasuk trace) disimpan di `test-results/`.

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
- **`retries` / `workers`** — hanya aktif di CI (2 retry, 1 worker).
- **`reporter`** — `html`.
- **`trace`** — `on-first-retry`, trace direkam saat test gagal dan di-retry.
- **`projects`** — chromium, firefox, webkit.

Opsi lain seperti `baseURL`, `webServer`, dan mobile viewport masih dikomentari dan bisa diaktifkan sesuai kebutuhan.

## Menulis Test Baru

1. Buat file baru di `ui-automation-tech-test/` dengan akhiran `.spec.ts`, misalnya `login.spec.ts`.
2. Import `test` dan `expect` dari `@playwright/test`.
3. Tulis test menggunakan API Playwright.

Contoh:

```ts
import { test, expect } from '@playwright/test';

test('halaman utama dapat dibuka', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

## Catatan

- Jalankan perintah dari **root project** agar `playwright.config.ts` terbaca.
- Jika browser belum terpasang atau muncul error terkait browser, jalankan `npx playwright install`.
- Folder `node_modules/`, `test-results/`, `playwright-report/`, `blob-report/`, dan cache Playwright sudah diabaikan oleh Git melalui `.gitignore`.
- Untuk melihat semua opsi CLI: `npx playwright test --help`.
