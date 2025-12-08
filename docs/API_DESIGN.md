# 「AI讀法說」API 端點設計

## 1. 總覽
- Base URL：`/v1`
- 認證：預留 JWT / OAuth；收藏類 API 需驗證使用者身份。
- Response 格式：`application/json`，統一 envelope：`{ "data": ..., "meta": { ... } }`
- 錯誤格式：`{ "error": { "code": "string", "message": "string" } }`

## 2. 資料模型
- **earnings_calls**：src_id, stock_code, stock_name, call_date, raw_html, created_at, is_archived
- **earnings_contents**：call_id, summary, analysis, sources[], vector_index_uri, version, generated_at
- **user_follow_earnings**：id, user_id, call_id, created_at

## 3. 端點列表
### 3.1 法說會列表
`GET /v1/earnings_calls`
- **Query**
  - `start` (date, optional)：起始日期，預設三個月前。
  - `end` (date, optional)：結束日期，預設今日。
  - `q` (string, optional)：股票代號或名稱的模糊搜尋。
  - `sort` (string, optional)：`call_date_desc`（預設）、`call_date_asc`。
  - `limit`/`offset`：分頁；預設 20 / 0。
- **Response**：
  ```json
  {
    "data": [
      {
        "call_id": 123,
        "stock_code": "2330",
        "stock_name": "台積電",
        "call_date": "2025-09-08",
        "is_archived": false
      }
    ],
    "meta": {"count": 20, "total": 200, "duration_ms": 120}
  }
  ```
- **事件**：`list_impression`，`search_used`，`scroll_depth`。

### 3.2 法說會內容內頁
`GET /v1/earnings_calls/{call_id}`
- **Response**：
  ```json
  {
    "data": {
      "call_id": 123,
      "stock_code": "2330",
      "stock_name": "台積電",
      "call_date": "2025-09-08",
      "summary": "200-300 字摘要",
      "analysis": "≤500 字分析",
      "sources": [
        {"type": "slides", "url": "https://..."},
        {"type": "news", "url": "https://..."}
      ],
      "version": 1,
      "generated_at": "2025-09-08T03:00:00+08:00",
      "is_archived": false,
      "is_followed": true
    }
  }
  ```
- **快取**：Redis 30 分鐘；熱門 call 熱層。
- **事件**：`detail_view`、`source_click`、`archived_view`。

### 3.3 收藏 / 取消收藏
`POST /v1/users/{uid}/follow_earnings`
- **Body**：`{ "call_id": number }`
- **Response**：`204 No Content`
- **事件**：`add_follow`

`DELETE /v1/users/{uid}/follow_earnings`
- **Body**：`{ "call_id": number }`
- **Response**：`204 No Content`
- **事件**：`remove_follow`

### 3.4 我關注的法說列表
`GET /v1/users/{uid}/follow_earnings`
- **Query**：`limit`/`offset`（預設 20 / 0），`months`（預設 6）
- **Response**：
  ```json
  {
    "data": [
      {
        "call_id": 123,
        "stock_code": "2330",
        "stock_name": "台積電",
        "call_date": "2025-09-08",
        "followed_at": "2025-09-10T02:00:00+08:00",
        "is_archived": false
      }
    ],
    "meta": {"total": 42}
  }
  ```
- **事件**：`follow_list_view`、`follow_card_click`、`unfollow_swipe`（若有手勢）。

### 3.5 排程與生成（後台/系統）
- **每日爬蟲**：02:00 UTC+8 以 Server-Side crawler 解析公開資訊觀測站 HTML，寫入 earnings_calls（僅保 90 天熱資料，舊資料搬冷層）。
- **內容生成**：首次點擊或偵測到新法說時，下載 Slides PDF＋新聞→建立向量索引→呼叫 LLM (GPT-4o) 生成摘要/分析→寫入 earnings_contents；生成後靜態化，版本升級時以 version 控制，失敗回傳 503 + "稍後再試"。

## 4. 安全性與權限
- 收藏相關 API 需登入；匿名僅可讀列表與內頁（不含 is_followed 標記）。
- Rate limit：依 IP/user 限制搜尋與收藏操作，避免濫用。

## 5. 監控與追蹤
- API latency、錯誤率、LLM 生成耗時與 token 使用量需進行監控。
- 追蹤事件：對應需求中的 list_impression、search_used、card_click、detail_view、add_follow、remove_follow 等。

