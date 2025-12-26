import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEarnings } from '../context/EarningsContext';
import { isArchived } from '../utils/earnings';

function EarningsDetail() {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const { earningsCalls, earningsContents, addFollow, removeFollow, isFollowed } = useEarnings();

  const call = useMemo(() => earningsCalls.find((c) => c.id === Number(callId)), [earningsCalls, callId]);
  const content = useMemo(
    () => earningsContents.find((c) => c.call_id === Number(callId)),
    [earningsContents, callId],
  );

  if (!call) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
        找不到這場法說會資訊
      </div>
    );
  }

  const followed = isFollowed(call.id);
  const archived = isArchived(call.call_date);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            {call.stock_name}
            <span className="text-base text-slate-500">({call.stock_code})</span>
            {archived && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Archived</span>
            )}
          </div>
          <div className="text-sm text-slate-600">法說會日期：{call.call_date}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            返回
          </button>
          <button
            onClick={() => (followed ? removeFollow(call.id) : addFollow(call.id))}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition ${
              followed
                ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {followed ? '取消關注' : '加入關注'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xl font-semibold text-slate-900">法說會摘要</div>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: content?.summary_html ?? '<p>暫無資料</p>' }} />
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xl font-semibold text-slate-900">AI 分析</div>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: content?.ai_insight_html ?? '<p>暫無資料</p>' }} />
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xl font-semibold text-slate-900">資料來源</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-indigo-700">
            {content?.sources.map((src) => (
              <li key={src}>
                <a href={src} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {src}
                </a>
              </li>
            )) || <li className="text-slate-500">暫無資料</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default EarningsDetail;
