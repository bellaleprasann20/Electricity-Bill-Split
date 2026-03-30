import { useBill } from './context/BillContext';
import Navbar from './components/Navbar';
import BillInput from './components/BillInput';
import RoommateList from './components/RoommateList';
import SummaryCards from './components/SummaryCards';
import ResultsPanel from './components/ResultsPanel';
import ApplianceTracker from './components/ApplianceTracker';
import './App.css';

const App = () => {
  const { activeTab } = useBill();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {activeTab === 'split' ? (
          <div className="split-layout">
            <div className="split-left">
              <BillInput />
              <RoommateList />
            </div>
            <div className="split-right">
              <SummaryCards />
              <ResultsPanel />
            </div>
          </div>
        ) : (
          <ApplianceTracker />
        )}
      </main>
    </div>
  );
};

export default App;