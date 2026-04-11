import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBill } from '../context/BillContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BILL_TYPES = [
  { id: 'electricity', label: '⚡ Electricity', color: '#f0c040', storageKey: 'ebs_history' },
  { id: 'water',       label: '💧 Water',       color: '#3b82f6', storageKey: 'water_history' },
  { id: 'wifi',        label: '📶 WiFi',        color: '#a855f7', storageKey: 'wifi_history' },
];

const HistoryTab = ({ billType, currentBill }) => {
  const [history, setHistory] = useLocalStorage(billType.storageKey, []);
  const [saved, setSaved] = useState(false);

  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const currentKey = `${currentMonth} ${currentYear}`;

  const saveThisMonth = () => {
    const exists = history.find(h => h.month === currentKey);
    if (exists) {
      setHistory(prev => prev.map(h =>
        h.month === currentKey ? { ...h, amount: currentBill } : h
      ));
    } else {
      setHistory(prev => [...prev.slice(-5), { month: currentKey, amount: currentBill }]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteMonth = (month) => {
    setHistory(prev => prev.filter(h => h.month !== month));
  };

  const allAmounts = history.map(h => h.amount);
  const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : 0;
  const minAmount = allAmounts.length > 0 ? Math.min(...allAmounts) : 0;
  const avgAmount = allAmounts.length > 0
    ? allAmounts.reduce((s, a) => s + a, 0) / allAmounts.length
    : 0;

  const spike = history.length >= 2
    ? ((history[history.length - 1]?.amount - history[history.length - 2]?.amount) /
       (history[history.length - 2]?.amount || 1) * 100)
    : null;

  const chartData = [
    ...history,
    { month: `${currentMonth} (now)`, amount: currentBill, current: true },
  ];

  const isLight = document.body.classList.contains('light');
  const tooltipBg = isLight ? '#ffffff' : '#1a1d27';
  const tooltipBorder = isLight ? '#dde0e8' : '#2a2d3e';
  const tooltipColor = isLight ? '#0f1117' : '#f0f0f5';

  return (
    <div>
      <div className="history-current-bill">
        <span className="history-current-label">
          Current bill ({currentMonth} {currentYear})
        </span>
        <span className="history-current-amount" style={{ color: billType.color }}>
          ₹{Math.round(currentBill).toLocaleString('en-IN')}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          className={`save-month-btn ${saved ? 'saved' : ''}`}
          onClick={saveThisMonth}
        >
          {saved ? '✓ Saved!' : `+ Save ${currentMonth}`}
        </button>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
          No history yet. Click <strong>"+ Save {currentMonth}"</strong> to start tracking!
        </div>
      ) : (
        <>
          {spike !== null && Math.abs(spike) > 10 && (
            <div className={`spike-alert ${spike > 0 ? 'spike-up' : 'spike-down'}`}>
              {spike > 0
                ? `🚨 Bill jumped ${spike.toFixed(0)}% compared to last month!`
                : `✅ Bill dropped ${Math.abs(spike).toFixed(0)}% compared to last month!`}
            </div>
          )}

          <div className="history-stats">
            <div className="h-stat">
              <div className="h-stat-val" style={{ color: billType.color }}>₹{Math.round(maxAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Highest</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-val" style={{ color: billType.color }}>₹{Math.round(minAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Lowest</div>
            </div>
            <div className="h-stat">
              <div className="h-stat-val" style={{ color: billType.color }}>₹{Math.round(avgAmount).toLocaleString('en-IN')}</div>
              <div className="h-stat-label">Average</div>
            </div>
          </div>

          <div style={{ height: 200, marginBottom: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: 8,
                    color: tooltipColor,
                    fontSize: 13,
                  }}
                  formatter={(val) => [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Bill']}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.current ? billType.color : '#475569'}
                      opacity={entry.current ? 1 : 0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="history-legend">
            <span className="legend-dot-item">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#475569', display: 'inline-block' }} />
              Past months
            </span>
            <span className="legend-dot-item">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: billType.color, display: 'inline-block' }} />
              Current month
            </span>
          </div>

          <div className="history-list">
            {[...history].reverse().map((h) => {
              const diff = h.amount - avgAmount;
              const isHigh = diff > 0;
              return (
                <div key={h.month} className="history-row">
                  <span className="history-month">{h.month}</span>
                  <span className="history-diff" style={{ color: isHigh ? '#f43f5e' : '#22c55e' }}>
                    {isHigh ? '▲' : '▼'} ₹{Math.abs(diff).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="history-amount" style={{ color: billType.color }}>
                    ₹{Math.round(h.amount).toLocaleString('en-IN')}
                  </span>
                  <button className="remove-btn" onClick={() => deleteMonth(h.month)}>×</button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const BillHistory = () => {
  const { totalBill } = useBill();
  const [activeType, setActiveType] = useState('electricity');
  const [waterBill] = useLocalStorage('water_bill', 300);
  const [wifiBill] = useLocalStorage('wifi_bill', 599);

  const currentBillMap = {
    electricity: totalBill,
    water: waterBill,
    wifi: wifiBill,
  };

  const activeBillType = BILL_TYPES.find(b => b.id === activeType);

  return (
    <div className="history-card">
      <div className="history-header">
        <span className="history-title">📈 Bill History</span>
      </div>

      <div className="history-type-tabs">
        {BILL_TYPES.map(bt => (
          <button
            key={bt.id}
            className={`history-type-btn ${activeType === bt.id ? 'active' : ''}`}
            style={activeType === bt.id
              ? { borderColor: bt.color, color: bt.color, background: bt.color + '18' }
              : {}}
            onClick={() => setActiveType(bt.id)}
          >
            {bt.label}
          </button>
        ))}
      </div>

      <HistoryTab
        billType={activeBillType}
        currentBill={currentBillMap[activeType]}
      />
    </div>
  );
};

export default BillHistory;