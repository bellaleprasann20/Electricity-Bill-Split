import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BillContext = createContext(null);

const DEFAULT_PEOPLE = [
  { id: 1, name: 'Rahul', days: 30, units: 60 },
  { id: 2, name: 'Priya', days: 30, units: 80 },
  { id: 3, name: 'Arjun', days: 25, units: 40 },
];

const DEFAULT_APPLIANCES = [
  { id: 1, name: 'AC (1.5 ton)', watts: 1500, hours: 6 },
  { id: 2, name: 'Refrigerator', watts: 150, hours: 24 },
  { id: 3, name: 'Washing Machine', watts: 500, hours: 1 },
  { id: 4, name: 'LED Lights (5x)', watts: 50, hours: 8 },
  { id: 5, name: 'Television', watts: 120, hours: 4 },
];

export const BillProvider = ({ children }) => {
  const [totalBill, setTotalBill] = useLocalStorage('ebs_bill', 1200);
  const [totalUnits, setTotalUnits] = useLocalStorage('ebs_units', 180);
  const [splitMode, setSplitMode] = useLocalStorage('ebs_mode', 'equal');
  const [people, setPeople] = useLocalStorage('ebs_people', DEFAULT_PEOPLE);
  const [appliances, setAppliances] = useLocalStorage('ebs_appliances', DEFAULT_APPLIANCES);
  const [activeTab, setActiveTab] = useLocalStorage('ebs_tab', 'split');

  const addPerson = () => {
    const newId = Date.now();
    setPeople(prev => [...prev, { id: newId, name: `Roommate ${prev.length + 1}`, days: 30, units: 0 }]);
  };

  const updatePerson = (id, field, value) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePerson = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const addAppliance = () => {
    const newId = Date.now();
    setAppliances(prev => [...prev, { id: newId, name: 'New Appliance', watts: 100, hours: 2 }]);
  };

  const updateAppliance = (id, field, value) => {
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAppliance = (id) => {
    setAppliances(prev => prev.filter(a => a.id !== id));
  };

  return (
    <BillContext.Provider value={{
      totalBill, setTotalBill,
      totalUnits, setTotalUnits,
      splitMode, setSplitMode,
      people, addPerson, updatePerson, removePerson,
      appliances, addAppliance, updateAppliance, removeAppliance,
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