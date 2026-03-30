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
          <button
            className="remove-btn"
            onClick={() => removePerson(person.id)}
            aria-label="Remove roommate"
          >
            ×
          </button>
        )}
      </div>

      <div className="roommate-fields">
        <div className="field-group">
          <label className="field-label">Days stayed</label>
          <input
            type="number"
            className="field-input"
            value={person.days}
            min="1"
            max="31"
            onChange={e => updatePerson(person.id, 'days', parseInt(e.target.value) || 1)}
          />
        </div>

        <div className={`field-group ${splitMode !== 'units' ? 'dimmed' : ''}`}>
          <label className="field-label">Units used (kWh)</label>
          <input
            type="number"
            className="field-input"
            value={person.units}
            min="0"
            disabled={splitMode !== 'units'}
            onChange={e => updatePerson(person.id, 'units', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;