import { useMemo, useState } from 'react';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import { useEarnings } from '../context/EarningsContext';
import { isArchived } from '../utils/earnings';

function EarningsList() {
  const { earningsCalls, addFollow, removeFollow, isFollowed } = useEarnings();
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    return earningsCalls
      .filter((call) =>
        lower
          ? call.stock_code.toLowerCase().includes(lower) || call.stock_name.toLowerCase().includes(lower)
          : true,
      )
      .sort((a, b) => (a.call_date < b.call_date ? 1 : -1));
  }, [earningsCalls, keyword]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((call) => {
      const list = map.get(call.call_date) ?? [];
      list.push(call);
      map.set(call.call_date, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-4">
      <SearchBar value={keyword} onChange={setKeyword} />
      {grouped.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          目前沒有符合搜尋的法說會資料
        </div>
      )}
      <div className="space-y-3">
        {grouped.map(([date, calls]) => (
          <section key={date} className="space-y-2">
            <div className="text-sm font-semibold text-slate-500">{date}</div>
            <div className="space-y-2">
              {calls.map((call) => (
                <Card
                  key={call.id}
                  call={call}
                  linkTo={`/detail/${call.id}`}
                  archived={isArchived(call.call_date)}
                  followed={isFollowed(call.id)}
                  onToggleFollow={() =>
                    isFollowed(call.id) ? removeFollow(call.id) : addFollow(call.id)
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default EarningsList;
