
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

interface FamilyState {
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, memberData: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
}

// Create a store with persistence
export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      members: [
        { id: '1', name: 'Grayson', role: 'Child', color: '#9b87f5' },
        { id: '2', name: 'Mom', role: 'Parent', color: '#D3E4FD' },
        { id: '3', name: 'Dad', role: 'Parent', color: '#FFDEE2' }
      ],
      addMember: (member) => set((state) => ({
        members: [...state.members, { ...member, id: Date.now().toString() }]
      })),
      updateMember: (id, memberData) => set((state) => ({
        members: state.members.map(member => 
          member.id === id ? { ...member, ...memberData } : member
        )
      })),
      deleteMember: (id) => set((state) => ({
        members: state.members.filter(member => member.id !== id)
      })),
    }),
    {
      name: 'family-storage',
    }
  )
);
