import { Link } from 'react-router-dom';
import { EarningsCall } from '../context/EarningsContext';

type CardProps = {
  call: EarningsCall;
  linkTo: string;
  archived?: boolean;
  followed: boolean;
  onToggleFollow: () => void;
};

function Card({ call, linkTo, archived = false, followed, onToggleFollow }: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
      <Link to={linkTo} className="flex flex-col gap-1">
        <div className="text-sm text-slate-500">{call.call_date}</div>
        <div className="text-lg font-semibold text-slate-900">{call.stock_name}</div>
        <div className="text-sm text-slate-600">{call.stock_code}</div>
        {archived && (
          <span className="mt-1 inline-flex w-fit rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            Archived
          </span>
        )}
      </Link>
      <button
        onClick={onToggleFollow}
        className={`ml-4 rounded-full px-3 py-1 text-sm font-medium border transition ${
          followed
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
        }`}
      >
        {followed ? '取消關注' : '加入關注'}
      </button>
    </div>
  );
}

export default Card;
