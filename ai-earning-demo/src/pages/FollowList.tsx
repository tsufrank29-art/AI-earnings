import Card from '../components/Card';
import { useEarnings } from '../context/EarningsContext';
import { isArchived } from '../utils/earnings';

function FollowList() {
  const { earningsCalls, follows, addFollow, removeFollow, isFollowed } = useEarnings();

  const followedCalls = earningsCalls
    .filter((call) => follows.includes(call.id))
    .sort((a, b) => (a.call_date < b.call_date ? 1 : -1));

  if (followedCalls.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-12 w-12 text-slate-300"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 5c-2.761 0-5 2.239-5 5 0 3.75 4.5 7 5 7s5-3.25 5-7c0-2.761-2.239-5-5-5Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
          />
        </svg>
        <div className="text-sm">目前沒有關注項目，去列表看看吧！</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {followedCalls.map((call) => (
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
  );
}

export default FollowList;
