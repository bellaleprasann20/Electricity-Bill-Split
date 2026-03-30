import { useBill } from '../context/BillContext';
import RoommateCard from './RoommateCard';

const RoommateList = () => {
  const { people, addPerson } = useBill();

  return (
    <div className="roommate-section">
      <div className="section-header">
        <h2 className="section-title">Roommates</h2>
        <button className="add-btn" onClick={addPerson}>+ Add roommate</button>
      </div>
      <div className="roommate-grid">
        {people.map((person, index) => (
          <RoommateCard key={person.id} person={person} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RoommateList;