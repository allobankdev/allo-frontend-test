import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Rocket, Status } from '../types/rocket';
import { fetchRockets } from '../services/api';

interface RocketState {
  rockets: Rocket[];
  status: Status;
  error: string | null;
  searchQuery: string;
}

type RocketAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Rocket[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_ROCKET'; payload: Rocket }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: RocketState = {
  rockets: [],
  status: 'IDLE',
  error: null,
  searchQuery: '',
};

function rocketReducer(state: RocketState, action: RocketAction): RocketState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'LOADING', error: null };
    case 'FETCH_SUCCESS': {
      const localRockets = state.rockets.filter((r) => r.isLocal);
      return {
        ...state,
        status: 'SUCCESS',
        error: null,
        rockets: [...localRockets, ...action.payload],
      };
    }
    case 'FETCH_ERROR':
      return { ...state, status: 'ERROR', error: action.payload };
    case 'ADD_ROCKET':
      return {
        ...state,
        rockets: [action.payload, ...state.rockets],
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

interface RocketContextValue {
  state: RocketState;
  loadRockets: () => Promise<void>;
  addRocket: (newRocketData: Omit<Rocket, 'id' | 'isLocal'>) => void;
  setSearchQuery: (query: string) => void;
  getRocketById: (id: string | number) => Rocket | undefined;
}

const RocketContext = createContext<RocketContextValue | undefined>(undefined);

export const RocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rocketReducer, initialState);

  const loadRockets = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetchRockets();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve launcher data';
      dispatch({ type: 'FETCH_ERROR', payload: msg });
    }
  };

  const addRocket = (newRocketData: Omit<Rocket, 'id' | 'isLocal'>) => {
    const newRocket: Rocket = {
      ...newRocketData,
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isLocal: true,
    };
    dispatch({ type: 'ADD_ROCKET', payload: newRocket });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const getRocketById = (id: string | number): Rocket | undefined => {
    return state.rockets.find((r) => String(r.id) === String(id));
  };

  return (
    <RocketContext.Provider
      value={{
        state,
        loadRockets,
        addRocket,
        setSearchQuery,
        getRocketById,
      }}
    >
      {children}
    </RocketContext.Provider>
  );
};

export function useRocket(): RocketContextValue {
  const context = useContext(RocketContext);
  if (!context) {
    throw new Error('useRocket must be used within RocketProvider');
  }
  return context;
}
