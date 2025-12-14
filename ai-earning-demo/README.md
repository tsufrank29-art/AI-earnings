# AI 讀法說 Demo（靜態版）

此資料夾提供可直接部署到 GitHub Pages 的前端靜態頁面，無需安裝或建置流程。

## 使用方式
1. 直接開啟 `index.html`（雙擊或以本機伺服器例如 `python -m http.server` 開啟）。
2. 搜尋近三個月法說會（代號/名稱），點擊卡片進入內頁。
3. 在內頁或列表使用「加入關注 / 取消關注」，收藏狀態儲存在瀏覽器 `localStorage`。
4. 「我關注的法說」標籤僅顯示已收藏項目；若無資料會顯示空態提示。

## 檔案結構
- `index.html`：主頁與介面排版，載入 Tailwind CDN。
- `styles.css`：客製樣式（與 Tailwind 共用）。
- `script.js`：資料載入、搜尋、收藏、內頁切換等互動邏輯。
- `data/earnings_calls.json`：近三個月法說會清單（示意）。
- `data/earnings_contents.json`：各法說會的摘要、AI 分析與資料來源（示意）。

## 部署到 GitHub Pages
1. 將 `ai-earning-demo` 資料夾推送到你要公開的分支（通常為 `main` 或 `gh-pages`）。
2. 在 GitHub Repo 設定中啟用 Pages，來源指向該分支根目錄。
3. 頁面會直接以 `index.html` 為入口，不需額外打包。
