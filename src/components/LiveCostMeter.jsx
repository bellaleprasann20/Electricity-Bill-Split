import { useState, useEffect } from 'react';
import { useBill } from '../context/BillContext';
import { calcMonthlyKwh, calcRatePerUnit } from '../utils/calculations';

const LiveCostMeter = () => {
  const { appliances, totalBill, totalUnits } = useBill();
  const [tick, setTick] = useState(0);

  const rate = calcRatePerUnit(totalBill, totalUnits);
  const totalKwh = appliances.reduce((s, a) => s + calcMonthlyKwh(a.watts, a.hours), 0);

  // cost per second = monthly cost / 30 days / 24 hrs / 3600 secs
  const costPerSecond = (totalKwh * rate) / 30 / 24 / 3600;
  const costPerHour = costPerSecond * 3600;
  const costPerDay = costPerSecond * 86400;

  // get seconds elapsed today since midnight
  const getSecondsToday = () => {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  };

  const [secondsToday, setSecondsToday] = useState(getSecondsToday());

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsToday(getSecondsToday());
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayCost = costPerSecond * secondsToday;

  return (
    <div className="live-meter-card">
      <div className="live-meter-header">
        <span className="live-dot" />
        <span className="live-label">Live Cost Meter</span>
      </div>

      <div className="live-main">
        <span className="live-currency">₹</span>
        <span className="live-amount">{todayCost.toFixed(4)}</span>
      </div>
      <div className="live-sub">spent today so far</div>

      <div className="live-stats-row">
        <div className="live-stat">
          <div className="live-stat-val">₹{costPerHour.toFixed(2)}</div>
          <div className="live-stat-label">per hour</div>
        </div>
        <div className="live-stat-divider" />
        <div className="live-stat">
          <div className="live-stat-val">₹{costPerDay.toFixed(2)}</div>
          <div className="live-stat-label">per day</div>
        </div>
        <div className="live-stat-divider" />
        <div className="live-stat">
          <div className="live-stat-val">₹{(costPerDay * 30).toFixed(0)}</div>
          <div className="live-stat-label">per month</div>
        </div>
      </div>
    </div>
  );
};

export default LiveCostMeter;