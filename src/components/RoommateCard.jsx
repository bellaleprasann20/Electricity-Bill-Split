import { useBill } from '../context/BillContext';
import { getPersonColor } from '../utils/colors';
import { getInitials } from '../utils/formatters';

const RoommateCard = ({ person, index }) => {
  const { updatePerson, removePerson, splitMode, people } = useBill();
  const color = getPersonColor(index);

  return (
    <div className="roommate-card" style={{ borderLeftColor: color.dot }}>
      <div className="roommate-header">
        <div className="avatar" style={{ background: color.bg, color: color.text }}>
          {getInitials(person.name)}
        </div>
        <input
          type="text"
          className="name-input"
          value={person.name}
          onChange={e => updatePerson(person.id, 'name', e.target.value)}
          placeholder="Name"
        />
        {people.length > 1 && (
          <button className="remove-btn" onClick={() => removePerson(person.id)}>×</button>
        )}
      </div>

      <div className="roommate-fields">
        <div className={`field-group ${splitMode !== 'days' ? 'dimmed' : ''}`}>
          <label className="field-label">📅 Days stayed</label>
          <input
            type="number"
            className="field-input"
            value={person.days}
            min="1"
            max="31"
            disabled={splitMode !== 'days'}
            onChange={e => updatePerson(person.id, 'days', parseInt(e.target.value) || 1)}
          />
        </div>

        <div className={`field-group ${splitMode !== 'rooms' ? 'dimmed' : ''}`}>
          <label className="field-label">🚪 Room size</label>
          <select
            className="field-input"
            value={person.rooms}
            disabled={splitMode !== 'rooms'}
            onChange={e => updatePerson(person.id, 'rooms', parseInt(e.target.value))}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 10px',
              fontSize: '14px',
              width: '100%',
              cursor: splitMode !== 'rooms' ? 'not-allowed' : 'pointer',
              opacity: splitMode !== 'rooms' ? 0.4 : 1,
            }}
          >
            <option value={1}>Small (1x)</option>
            <option value={2}>Medium (2x)</option>
            <option value={3}>Large (3x)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;