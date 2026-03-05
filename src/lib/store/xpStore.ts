import { create } from 'zustand';

interface XPState {
    totalXP: number;
    completedChallenges: Set<string>;
    addXP: (amount: number) => void;
    completeChallenge: (id: string) => void;
}

export const useXPStore = create<XPState>((set) => ({
    totalXP: 0,
    completedChallenges: new Set(),
    addXP: (amount) => set((s) => ({ totalXP: s.totalXP + amount })),
    completeChallenge: (id) =>
        set((s) => ({ completedChallenges: new Set([...s.completedChallenges, id]) })),
}));
