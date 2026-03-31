import { useBill } from '../context/BillContext';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const { activeTab, setActiveTab } = useBill();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="bolt">⚡</span>
        <span className="brand-text">BillSplit</span>
      </div>

      <div className="tab-group">
        <button
          className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`}
          onClick={() => setActiveTab('split')}
        >
          Split Bill
        </button>
        <button
          className={`tab-btn ${activeTab === 'appliances' ? 'active' : ''}`}
          onClick={() => setActiveTab('appliances')}
        >
          Appliances
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📈 History
        </button>
      </div>

      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
        <span className="theme-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>
    </nav>
  );
};

export default Navbar;