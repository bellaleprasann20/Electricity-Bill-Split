import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBill } from '../context/BillContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BillHistory = () => {
  const { totalBill } = useBill();
  const [history, setHistory] = useLocalStorage('ebs_history', []);
  const [saved, setSaved] = useState(false);

  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const currentKey = `${currentMonth} ${currentYear}`;

  const saveThisMonth = () => {
    const exists = history.find(h => h.month === currentKey);
    if (exists) {
      setHistory(prev => prev.map(h =>
        h.month === currentKey ? { ...h, amount: totalBill } : h
      ));
    } else {
      setHistory(prev => [...prev.slice(-5), { month: currentKey, amount: totalBill }]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteMonth = (month) => {
    setHistory(prev => prev.filter(h => h.month !== month));
  };

  const maxAmount = Math.max(...history.map(h => h.amount), totalBill);
  const minAmount = Math.min(...history.map(h => h.amount));
  const avgAmount = history.length > 0
    ? history.reduce((s, h) => s + h.amount, 0) / history.length
    : 0;

  const spike = history.length >= 2
    ? ((history[history.length - 1]?.amount - history[history.length - 2]?.amount) /
       history[history.length - 2]?.amount * 100)
    : null;

  const chartData = [...history, { month: currentKey + ' (now)', amount: totalBill, current: true }];

  return (
    <div className="history-card">
      <div className="history-header">
        <span className="history-title">📈 Bill History</span>
        <button
          className={`save-month-btn ${saved ? 'saved' : ''}`}
          onClick={saveThisMonth}
        >
          {saved ? '✓ Saved!' : `+ Save ${currentMonth}`}
        </button>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          No history yet. Click "Save {currentMonth}" to start tracking!
        </div>
      ) : (
        <>
          {spike !== null && Math.abs(spike) > 10 && (
            <div className={`spike-alert ${spike > 0 ? 'spike-up' : 'spike-down'}`}>
              {spike > 0
                ? `🚨 Bill jumped ${spike.toFixed(0)}% vs last month!`
                : `✅ Bill dropped ${Math.abs(spike).toFixed(0)}% vs last month!`}
            </div>
          )}

          <div className="history-stats">
            <div className="h-stat">
              <div className="h-stat-val">₹{Math.round(maxAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Highest</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-val">₹{Math.round(minAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Lowest</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-val">₹{Math.round(avgAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Average</div>
            </div>
          </div>

          <div style={{ height: 180, marginBottom: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#555870', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#1a1d27',
                    border: '1px solid #2a2d3e',
                    borderRadius: 8,
                    color: '#f0f0f5',
                    fontSize: 13,
                  }}
                  formatter={(val) => [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Bill']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.current ? '#f0c040' : '#3b82f6'}
                      opacity={entry.current ? 1 : 0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="history-list">
            {[...history].reverse().map((h) => (
              <div key={h.month} className="history-row">
                <span className="history-month">{h.month}</span>
                <span className="history-amount">₹{Math.round(h.amount).toLocaleString('en-IN')}</span>
                <button className="remove-btn" onClick={() => deleteMonth(h.month)}>×</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BillHistory;