import { useBill } from '../context/BillContext';

const Navbar = () => {
  const { activeTab, setActiveTab } = useBill();

  const tabs = [
    { id: 'split',   label: '⚡ Electricity' },
    { id: 'water',   label: '💧 Water' },
    { id: 'wifi',    label: '📶 WiFi' },
    { id: 'history', label: '📈 History' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="bolt">⚡</span>
        <span className="brand-text">BillSplit</span>
      </div>
      <div className="tab-group">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;