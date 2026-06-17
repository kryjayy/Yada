import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>Hello {user?.name}</h1>
      <p style={styles.date}>
        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <div style={styles.card}>
        <p style={styles.cardTitle}>How are you feeling right now?</p>
        <button style={styles.button} onClick={() => navigate('/checkin')}>
          Begin check-in
        </button>
      </div>

       <div style={styles.crisis} onClick={() => navigate('/crisis')}>
        <p style={styles.cardTitle}>Not okay right now? Tap here — I'm here with you</p>
      </div>

    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FDF8F4',
    padding: 24,
    minHeight: '100vh',
  },
  heading: {
    color: '#2C2C2A',
    fontSize: 24,
    margin: '0 0 4px',
  },
  date: {
    color: '#854F0B',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 20px',
  },
  card: {
    backgroundColor: '#EEEDFE',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    color: '#26215C',
    fontSize: 14,
    fontWeight: 600,
    margin: '0 0 12px',
  },
  button: {
    width: '100%',
    backgroundColor: '#534AB7',
    color: '#EEEDFE',
    border: 'none',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  crisis: {
    backgroundColor: '#FAECE7',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    cursor: 'pointer',
  },
}