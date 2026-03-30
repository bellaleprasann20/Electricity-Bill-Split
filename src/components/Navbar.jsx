import { useBill } from '../context/BillContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { activeTab, setActiveTab } = useBill();

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
      </div>
    </nav>
  );
};

export default Navbar;