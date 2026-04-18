import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBill } from '../context/BillContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BILL_TYPES = [
  { id: 'electricity', label: '⚡ Electricity', color: '#f0c040', storageKey: 'ebs_history',   emoji: '⚡' },
  { id: 'water',       label: '💧 Water',       color: '#3b82f6', storageKey: 'water_history', emoji: '💧' },
  { id: 'wifi',        label: '📶 WiFi',        color: '#a855f7', storageKey: 'wifi_history',  emoji: '📶' },
];

const getLast5Months = () => {
  const result = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`);
  }
  return result;
};

const BillSection = ({ billType, currentBill }) => {
  const [history, setHistory] = useLocalStorage(billType.storageKey, []);
  const [saved, setSaved] = useState(false);

  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const currentKey = `${currentMonth} ${currentYear}`;
  const last5Months = getLast5Months();

  const saveThisMonth = () => {
    const exists = history.find(h => h.month === currentKey);
    if (exists) {
      setHistory(prev => prev.map(h =>
        h.month === currentKey ? { ...h, amount: currentBill } : h
      ));
    } else {
      setHistory(prev => {
        const filtered = prev.filter(h => h.month !== currentKey);
        return [...filtered, { month: currentKey, amount: currentBill }].slice(-5);
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteMonth = (month) => {
    setHistory(prev => prev.filter(h => h.month !== month));
  };

  const chartData = last5Months.map(month => {
    const entry = history.find(h => h.month === month);
    const isCurrent = month === currentKey;
    return {
      month: month.split(' ')[0],
      fullMonth: month,
      amount: isCurrent ? currentBill : (entry?.amount || 0),
      isCurrent,
      isEmpty: !isCurrent && !entry,
    };
  });

  const savedAmounts = history.map(h => h.amount);
  const allAmounts = [...savedAmounts, currentBill].filter(Boolean);
  const maxAmount = allAmounts.length > 0 ? Math.max(...allAmounts) : 0;
  const minAmount = allAmounts.length > 0 ? Math.min(...allAmounts) : 0;
  const avgAmount = allAmounts.length > 0
    ? allAmounts.reduce((s, a) => s + a, 0) / allAmounts.length
    : 0;

  const spike = history.length >= 2
    ? ((history[history.length - 1]?.amount - history[history.length - 2]?.amount) /
       (history[history.length - 2]?.amount || 1) * 100)
    : null;

  return (
    <div className="bill-section-card" style={{ borderTopColor: billType.color }}>

      <div className="bill-section-header">
        <div className="bill-section-title-row">
          <span className="bill-section-icon">{billType.emoji}</span>
          <span className="bill-section-title">{billType.label} History</span>
        </div>
        <button
          className={`save-month-btn ${saved ? 'saved' : ''}`}
          onClick={saveThisMonth}
        >
          {saved ? '✓ Saved!' : `+ Save ${currentMonth}`}
        </button>
      </div>

      <div className="history-current-bill" style={{ borderLeftColor: billType.color }}>
        <span className="history-current-label">{currentMonth} {currentYear} (current)</span>
        <span className="history-current-amount" style={{ color: billType.color }}>
          ₹{Math.round(currentBill).toLocaleString('en-IN')}
        </span>
      </div>

      {spike !== null && Math.abs(spike) > 10 && (
        <div className={`spike-alert ${spike > 0 ? 'spike-up' : 'spike-down'}`}>
          {spike > 0
            ? `🚨 Bill jumped ${spike.toFixed(0)}% vs last month!`
            : `✅ Bill dropped ${Math.abs(spike).toFixed(0)}% vs last month!`}
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

      <div style={{ height: 180, marginBottom: '0.75rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={36}>
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: '#1a1d27',
                border: `1px solid ${billType.color}44`,
                borderRadius: 8,
                color: '#f0f0f5',
                fontSize: 13,
              }}
              formatter={(val, name, props) => {
                if (props.payload.isEmpty) return ['No data saved yet', ''];
                return [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Bill'];
              }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isEmpty ? '#2a2d3e' : entry.isCurrent ? billType.color : billType.color + 'aa'}
                  opacity={entry.isEmpty ? 0.5 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="history-legend" style={{ marginBottom: '1rem' }}>
        <span className="legend-dot-item">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: billType.color, display: 'inline-block' }} />
          Current month
        </span>
        <span className="legend-dot-item">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: billType.color + 'aa', display: 'inline-block' }} />
          Past months
        </span>
        <span className="legend-dot-item">
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2a2d3e', display: 'inline-block' }} />
          No data
        </span>
      </div>

      <div className="history-list">
        {last5Months.map((month) => {
          const entry = history.find(h => h.month === month);
          const isCurrent = month === currentKey;
          const amount = isCurrent ? currentBill : entry?.amount;
          const diff = amount && avgAmount ? amount - avgAmount : null;
          const isHigh = diff > 0;

          return (
            <div
              key={month}
              className={`history-row ${isCurrent ? 'history-row-current' : ''}`}
              style={isCurrent ? { borderLeftColor: billType.color, borderLeftWidth: '3px', borderLeftStyle: 'solid' } : {}}
            >
              <span className="history-month">
                {month}
                {isCurrent && (
                  <span className="current-badge" style={{ background: billType.color + '22', color: billType.color }}>
                    current
                  </span>
                )}
              </span>

              {amount ? (
                <>
                  {diff !== null && (
                    <span className="history-diff" style={{ color: isHigh ? '#f43f5e' : '#22c55e' }}>
                      {isHigh ? '▲' : '▼'} ₹{Math.abs(diff).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                  <span className="history-amount" style={{ color: billType.color }}>
                    ₹{Math.round(amount).toLocaleString('en-IN')}
                  </span>
                  {!isCurrent
                    ? <button className="remove-btn" onClick={() => deleteMonth(month)}>×</button>
                    : <span style={{ width: '24px' }} />
                  }
                </>
              ) : (
                <span className="history-no-data">— not saved yet</span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

const BillHistory = () => {
  const { totalBill } = useBill();
  const [waterBill] = useLocalStorage('water_bill', 300);
  const [wifiBill] = useLocalStorage('wifi_bill', 599);

  const currentBillMap = {
    electricity: totalBill,
    water: waterBill,
    wifi: wifiBill,
  };

  return (
    <div className="history-page">
      <div className="history-page-header">
        <h2 className="history-page-title">📈 Bill History</h2>
        <p className="history-page-sub">
          Last 5 months tracked for each bill. Click "+ Save" on any section to record this month's bill.
        </p>
      </div>
      <div className="history-sections">
        {BILL_TYPES.map(bt => (
          <BillSection
            key={bt.id}
            billType={bt}
            currentBill={currentBillMap[bt.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default BillHistory;