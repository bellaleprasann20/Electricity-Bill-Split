import { useBill } from '../context/BillContext';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const { activeTab, setActiveTab } = useBill();
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: 'split', label: '⚡ Electricity' },
    { id: 'water', label: '💧 Water' },
    { id: 'wifi', label: '📶 WiFi' },
    { id: 'appliances', label: '🏠 Appliances' },
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

      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
        <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  );
};

export default Navbar;