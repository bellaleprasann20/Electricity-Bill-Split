import { useBill } from '../context/BillContext';
import { calcShares, calcAmounts } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const WhatsAppShare = () => {
  const { totalBill, people, splitMode } = useBill();
  const shares = calcShares(people, splitMode);
  const amounts = calcAmounts(totalBill, shares);

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const sendToAll = () => {
    const lines = people.map((p, i) => `  ${p.name} → ${formatCurrency(amounts[i])}`).join('\n');
    const message =
      `⚡ *Electricity Bill – ${month}*\n\n` +
      `${lines}\n\n` +
      `💰 *Total: ${formatCurrency(totalBill)}*\n` +
      `Please pay by the 5th 🙏`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendToPerson = (person, amount) => {
    const message =
      `Hey ${person.name}! 👋\n\n` +
      `⚡ Your share of the *${month} electricity bill* is *${formatCurrency(amount)}*\n\n` +
      `Please pay by the 5th 🙏\nThanks!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-card">
      <div className="whatsapp-header">
        <span className="whatsapp-icon">💬</span>
        <span className="whatsapp-title">Send Reminders</span>
      </div>

      <button className="whatsapp-btn-all" onClick={sendToAll}>
        <span>📢</span> Send to Group
        <span className="btn-sub">Sends full bill summary</span>
      </button>

      <div className="whatsapp-divider">or send individually</div>

      <div className="whatsapp-people">
        {people.map((person, i) => (
          <div key={person.id} className="whatsapp-person-row">
            <span className="whatsapp-person-name">{person.name}</span>
            <span className="whatsapp-person-amount">{formatCurrency(amounts[i])}</span>
            <button
              className="whatsapp-btn-person"
              onClick={() => sendToPerson(person, amounts[i])}
            >
              Send ↗
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsAppShare;