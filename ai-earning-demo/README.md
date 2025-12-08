# AI 讀法說 Demo (React + Vite)

靜態前端 Demo，展示「法說會列表 / 我關注的法說 / 法說會內頁」的基礎 UI 與互動。資料由本地 JSON 模擬，關注列表會寫入 `localStorage`。

## 安裝與啟動
1. 安裝套件
   ```bash
   npm install
   ```
2. 開發環境
   ```bash
   npm run dev
   ```
   Vite 會預設開啟瀏覽器並載入本地開發網址。
3. 建置與預覽
   ```bash
   npm run build
   npm run preview
   ```

## 功能介紹
- **法說會列表**：載入近三個月的法說會 Mock 資料，支援依個股名稱／代號搜尋，並可從卡片跳轉至內頁。
- **我關注的法說**：顯示使用者加入關注的法說會卡片，空列表時顯示插圖提示。
- **法說會內頁**：呈現法說會摘要、AI 分析與資料來源，並可加入／取消關注。
- **關注狀態**：利用 React Context + `useReducer` 管理，並同步儲存在瀏覽器 `localStorage`。

## 專案結構
- `src/mock/`：本地 Mock JSON 資料 (`earnings_calls.json`, `earnings_contents.json`).
- `src/context/`：Earnings 狀態管理（列表資料、關注狀態）。
- `src/components/`：共用 UI（分頁 Tab、搜尋框、卡片元件）。
- `src/pages/`：列表、收藏、內頁畫面。
- `src/layouts/HomeLayout.tsx`：頁面框架與 Tab Header。
- `src/utils/earnings.ts`：歸檔判斷工具函式。

## 樣式
- 已整合 Tailwind CSS，`tailwind.config.js` 已設定掃描 `index.html` 與 `src/**/*.{js,ts,jsx,tsx}`。
- `src/index.css` 匯入 `@tailwind base/components/utilities` 並設定全域字體、背景顏色與按鈕樣式。

## 路由
- `/` → 重新導向 `/list`
- `/list` → 法說會列表頁 (含搜尋、卡片 + 加入關注)
- `/follow` → 我關注的法說列表
- `/detail/:callId` → 法說會內頁，顯示摘要、AI 分析與資料來源

