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
          {splitMode === 'days' && person.days < 30 && (
            <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '4px' }}>
              Away for {30 - person.days} days 👍
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;