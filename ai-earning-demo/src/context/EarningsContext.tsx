import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import earningsCallsData from '../mock/earnings_calls.json';
import earningsContentsData from '../mock/earnings_contents.json';

type EarningsCall = {
  id: number;
  stock_code: string;
  stock_name: string;
  call_date: string;
};

type EarningsContent = {
  id: number;
  call_id: number;
  summary_html: string;
  ai_insight_html: string;
  sources: string[];
};

type EarningsState = {
  earningsCalls: EarningsCall[];
  earningsContents: EarningsContent[];
  follows: number[];
};

type EarningsAction =
  | { type: 'ADD_FOLLOW'; payload: number }
  | { type: 'REMOVE_FOLLOW'; payload: number }
  | { type: 'HYDRATE_FOLLOWS'; payload: number[] };

type EarningsContextValue = EarningsState & {
  addFollow: (id: number) => void;
  removeFollow: (id: number) => void;
  isFollowed: (id: number) => boolean;
};

const LOCAL_STORAGE_KEY = 'follows';

const initialState: EarningsState = {
  earningsCalls: earningsCallsData,
  earningsContents: earningsContentsData,
  follows: [],
};

const EarningsContext = createContext<EarningsContextValue | undefined>(undefined);

function earningsReducer(state: EarningsState, action: EarningsAction): EarningsState {
  switch (action.type) {
    case 'HYDRATE_FOLLOWS': {
      return { ...state, follows: action.payload };
    }
    case 'ADD_FOLLOW': {
      if (state.follows.includes(action.payload)) return state;
      return { ...state, follows: [...state.follows, action.payload] };
    }
    case 'REMOVE_FOLLOW': {
      return { ...state, follows: state.follows.filter((id) => id !== action.payload) };
    }
    default:
      return state;
  }
}

export function EarningsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(earningsReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        dispatch({ type: 'HYDRATE_FOLLOWS', payload: parsed });
      } catch (error) {
        console.error('Failed to parse follows from storage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.follows));
  }, [state.follows]);

  const addFollow = useCallback((id: number) => dispatch({ type: 'ADD_FOLLOW', payload: id }), []);
  const removeFollow = useCallback((id: number) => dispatch({ type: 'REMOVE_FOLLOW', payload: id }), []);
  const isFollowed = useCallback((id: number) => state.follows.includes(id), [state.follows]);

  const value = useMemo(
    () => ({
      ...state,
      addFollow,
      removeFollow,
      isFollowed,
    }),
    [state, addFollow, removeFollow, isFollowed],
  );

  return <EarningsContext.Provider value={value}>{children}</EarningsContext.Provider>;
}

export function useEarnings() {
  const context = useContext(EarningsContext);
  if (!context) {
    throw new Error('useEarnings must be used within an EarningsProvider');
  }
  return context;
}

export type { EarningsCall, EarningsContent };
