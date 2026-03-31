import { useBill } from './context/BillContext';
import Navbar from './components/Navbar';
import BillInput from './components/BillInput';
import RoommateList from './components/RoommateList';
import SummaryCards from './components/SummaryCards';
import ResultsPanel from './components/ResultsPanel';
import ApplianceTracker from './components/ApplianceTracker';
import LiveCostMeter from './components/LiveCostMeter';
import WhatsAppShare from './components/WhatsAppShare';
import BudgetAlert from './components/BudgetAlert';
import BillHistory from './components/BillHistory';
import './App.css';

const App = () => {
  const { activeTab } = useBill();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {activeTab === 'split' && (
          <div className="split-layout">
            <div className="split-left">
              <BillInput />
              <BudgetAlert />
              <RoommateList />
            </div>
            <div className="split-right">
              <LiveCostMeter />
              <SummaryCards />
              <ResultsPanel />
              <WhatsAppShare />
            </div>
          </div>
        )}
        {activeTab === 'appliances' && <ApplianceTracker />}
        {activeTab === 'history' && <BillHistory />}
      </main>
    </div>
  );
};

export default App;