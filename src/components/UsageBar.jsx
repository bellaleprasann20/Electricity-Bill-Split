import { calcMonthlyKwh } from '../utils/calculations';
import { formatUnits, formatCurrency } from '../utils/formatters';
import { APPLIANCE_COLORS } from '../utils/colors';

const UsageBar = ({ appliances, ratePerUnit }) => {
  const withKwh = appliances.map((a, i) => ({
    ...a,
    kwh: calcMonthlyKwh(a.watts, a.hours),
    color: APPLIANCE_COLORS[i % APPLIANCE_COLORS.length],
  }));

  const totalKwh = withKwh.reduce((s, a) => s + a.kwh, 0);
  const sorted = [...withKwh].sort((a, b) => b.kwh - a.kwh);

  return (
    <div className="usage-bar-section">
      <div className="stacked-bar">
        {withKwh.map(a => (
          <div
            key={a.id}
            className="stacked-segment"
            style={{
              width: totalKwh > 0 ? `${(a.kwh / totalKwh) * 100}%` : '0%',
              background: a.color,
            }}
            title={`${a.name}: ${a.kwh.toFixed(1)} kWh`}
          />
        ))}
      </div>

      <div className="usage-legend">
        {sorted.map(a => (
          <div key={a.id} className="legend-row">
            <div className="legend-left">
              <div className="legend-dot" style={{ background: a.color }} />
              <span className="legend-name">{a.name}</span>
            </div>
            <div className="legend-right">
              <span className="legend-kwh">{formatUnits(a.kwh)}</span>
              <span className="legend-cost">{formatCurrency(a.kwh * ratePerUnit)}</span>
              <div className="legend-bar-wrap">
                <div
                  className="legend-bar"
                  style={{
                    width: totalKwh > 0 ? `${(a.kwh / totalKwh) * 100}%` : '0%',
                    background: a.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageBar;