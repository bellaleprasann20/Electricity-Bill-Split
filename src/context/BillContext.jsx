import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BillContext = createContext(null);

const DEFAULT_PEOPLE = [
  { id: 1, name: 'Rahul', days: 30, rooms: 1 },
  { id: 2, name: 'Priya', days: 30, rooms: 2 },
  { id: 3, name: 'Arjun', days: 25, rooms: 1 },
];

export const BillProvider = ({ children }) => {
  const [totalBill, setTotalBill] = useLocalStorage('ebs_bill', 1200);
  const [splitMode, setSplitMode] = useLocalStorage('ebs_mode', 'equal');
  const [people, setPeople] = useLocalStorage('ebs_people', DEFAULT_PEOPLE);
  const [activeTab, setActiveTab] = useLocalStorage('ebs_tab', 'split');

  const addPerson = () => {
    setPeople(prev => [...prev, {
      id: Date.now(),
      name: `Roommate ${prev.length + 1}`,
      days: 30,
      rooms: 1,
    }]);
  };

  const updatePerson = (id, field, value) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  return (
    <BillContext.Provider value={{
      totalBill, setTotalBill,
      splitMode, setSplitMode,
      people, addPerson, updatePerson, removePerson,
      activeTab, setActiveTab,
    }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => {
  const ctx = useContext(BillContext);
  if (!ctx) throw new Error('useBill must be used within BillProvider');
  return ctx;
};