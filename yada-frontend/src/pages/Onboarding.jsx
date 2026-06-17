import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const steps = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    faithBackground: '',
    notificationTime: '08:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => setStep((s) => s + 1);

  const handleFaith = (value) => {
    setForm((f) => ({ ...f, faithBackground: value }));
  };

  const handleNotification = (value) => {
    setForm((f) => ({ ...f, notificationTime: value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register(form);
      login(res.data.token, { name: form.name, email: form.email, faithBackground: form.faithBackground });
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const faithOptions = [
    { label: "I believe, but it's complicated", value: 'deep' },
    { label: "I'm curious, open to exploring", value: 'middle' },
    { label: 'I grew up with it but drifted', value: 'middle' },
    { label: "I'm not sure what I believe", value: 'surface' },
  ];

  const notificationOptions = [
    { label: 'Morning · 8am', value: '08:00' },
    { label: 'Midday · 12pm', value: '12:00' },
    { label: 'Evening · 8pm', value: '20:00' },
    { label: "Don't remind me", value: 'none' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.phone}>

        {/* Dots */}
        <div style={styles.dots}>
          {steps.map((s) => (
            <div key={s.id} style={{ ...styles.dot, ...(step === s.id ? styles.dotActive : {}) }} />
          ))}
        </div>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div style={styles.centered}>
            <p style={styles.yadaTitle}>Yada.</p>
            <p style={styles.yadaSub}>To know. To be known.</p>
            <div style={styles.bubble}>
              <p style={styles.bubbleText}>Hey. I'm glad you're here. This is a space just for you — no pressure, no performance. Just you and your heart.</p>
            </div>
            <button style={styles.cta} onClick={handleNext}>Get started</button>
          </div>
        )}

        {/* Step 2 — Name */}
        {step === 2 && (
          <div style={styles.step}>
            <div style={styles.header}>
              <p style={styles.label}>Let's start here</p>
              <p style={styles.heading}>What do people call you?</p>
            </div>
            <div style={styles.body}>
              <div style={styles.bubble}>
                <p style={styles.bubbleText}>Not your username. Just what the people who know you well actually call you.</p>
              </div>
              <input
                style={styles.input}
                placeholder="Your name..."
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <button style={styles.cta} onClick={handleNext} disabled={!form.name}>
                That's me
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Faith */}
        {step === 3 && (
          <div style={styles.step}>
            <div style={styles.header}>
              <p style={styles.label}>Just so I know</p>
              <p style={styles.heading}>Where are you with faith right now?</p>
            </div>
            <div style={styles.body}>
              <div style={styles.bubble}>
                <p style={styles.bubbleText}>There's no right answer. This just helps me meet you where you are.</p>
              </div>
              <div style={styles.pillRow}>
                {faithOptions.map((o) => (
                  <button
                    key={o.label}
                    style={{ ...styles.pill, ...(form.faithBackground === o.value && o.label === faithOptions.find(f => f.value === form.faithBackground)?.label ? styles.pillActive : {}) }}
                    onClick={() => handleFaith(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <button style={styles.cta} onClick={handleNext} disabled={!form.faithBackground}>
                This is where I am
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Account */}
        {step === 4 && (
          <div style={styles.step}>
            <div style={styles.header}>
              <p style={styles.label}>Keep your journey safe</p>
              <p style={styles.heading}>Create your account</p>
            </div>
            <div style={styles.body}>
              <div style={styles.bubble}>
                <p style={styles.bubbleText}>Your entries are private. Nobody sees them but you.</p>
              </div>
              <input
                style={styles.input}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <input
                style={{ ...styles.input, marginTop: 10 }}
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              {error && <p style={styles.error}>{error}</p>}
              <button style={styles.cta} onClick={handleNext} disabled={!form.email || !form.password}>
                Secure my journal
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Notification */}
        {step === 5 && (
          <div style={styles.step}>
            <div style={styles.header}>
              <p style={styles.label}>One last thing</p>
              <p style={styles.heading}>When do you want me to check in?</p>
            </div>
            <div style={styles.body}>
              <div style={styles.bubble}>
                <p style={styles.bubbleText}>I'll send you a gentle nudge. Nothing urgent — just a reminder that this space is here for you.</p>
              </div>
              <div style={styles.pillRow}>
                {notificationOptions.map((o) => (
                  <button
                    key={o.value}
                    style={{ ...styles.pill, ...(form.notificationTime === o.value ? styles.pillActive : {}) }}
                    onClick={() => handleNotification(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {error && <p style={styles.error}>{error}</p>}
<button style={styles.cta} onClick={handleRegister} disabled={loading}>
  {loading ? "Setting up your space..." : "I'm ready"}
</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#F5EDE3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phone: {
    width: '100%',
    maxWidth: 380,
    background: '#FDF8F4',
    borderRadius: 32,
    minHeight: '80vh',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    background: '#E0D8D0',
  },
  dotActive: {
    width: 18,
    background: '#534AB7',
  },
  centered: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yadaTitle: {
    fontSize: 48,
    fontWeight: 600,
    color: '#534AB7',
    margin: '0 0 8px',
  },
  yadaSub: {
    fontSize: 16,
    color: '#888780',
    fontStyle: 'italic',
    margin: '0 0 32px',
  },
  step: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#F5EDE3',
    margin: '-24px -24px 0',
    padding: '24px 24px 20px',
    borderRadius: '32px 32px 0 0',
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#854F0B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 6px',
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: '#2C2C2A',
    margin: 0,
  },
  body: {
    flex: 1,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  bubble: {
    background: '#EEEDFE',
    borderRadius: '16px 16px 16px 4px',
    padding: '12px 14px',
    marginBottom: 16,
  },
  bubbleText: {
    fontSize: 13,
    color: '#26215C',
    margin: 0,
    lineHeight: 1.6,
  },
  input: {
    background: '#FDF8F4',
    border: '0.5px solid #E0D8D0',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 13,
    color: '#2C2C2A',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    border: '0.5px solid #E0D8D0',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 12,
    color: '#888780',
    background: '#FDF8F4',
    cursor: 'pointer',
  },
  pillActive: {
    background: '#EEEDFE',
    borderColor: '#534AB7',
    color: '#3C3489',
    fontWeight: 600,
  },
  cta: {
    width: '100%',
    background: '#534AB7',
    color: '#EEEDFE',
    border: 'none',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 'auto',
  },
  error: {
    color: '#A32D2D',
    fontSize: 12,
    margin: '8px 0',
  },
};