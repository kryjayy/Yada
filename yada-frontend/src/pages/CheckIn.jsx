import { useState } from 'react';
import { checkInAPI, journalAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CheckIn() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ sleep: '', mind: '', settled: '' });
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [checkInId, setCheckInId] = useState(null);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  // When a pill is selected, save the answer and auto advance
  const selectSleep = (value) => {
    setAnswers({ ...answers, sleep: value });
    setStep(2);
  };

  const selectSettled = (value) => {
    setAnswers({ ...answers, settled: value });
    submitAnswers({ ...answers, settled: value });
  };

  const submitAnswers = async (finalAnswers) => {
    setLoading(true);
    setStep(4);
    try {
      const res = await checkInAPI.submit({
        answersJson: JSON.stringify(finalAnswers),
        moodLabel: finalAnswers.settled,
      });
      setReflection(res.data.reflection);
      setCheckInId(res.data.checkInId);
    } catch (e) {
      setReflection('Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveJournal = async () => {
    setLoading(true);
    try {
      await journalAPI.create({ content: journalEntry, linkedCheckinId: checkInId });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Step 1 — Sleep */}
      {step === 1 && (
        <div style={styles.card}>
          <p style={styles.question}>How did you sleep last night?</p>
          <div style={styles.pillRow}>
            <button className="pill" style={styles.pill} onClick={() => selectSleep('Really Well')}>Really well</button>
            <button className="pill" style={styles.pill} onClick={() => selectSleep('Okay')}>Okay</button>
            <button className="pill" style={styles.pill} onClick={() => selectSleep('Not Great')}>Not great</button>
            <button className="pill" style={styles.pill} onClick={() => selectSleep('Barely At All')}>Barely at all</button>
          </div>
        </div>
      )}

      {/* Step 2 — Mind */}
      {step === 2 && (
        <div style={styles.card}>
          <p style={styles.question}>What's on your mind right now? Talk to me :)</p>
          <textarea
            style={styles.input}
            value={answers.mind}
            onChange={(e) => setAnswers({ ...answers, mind: e.target.value })}
            placeholder="Take your time..."
            rows={4}
          />
          <button style={styles.cta} onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {/* Step 3 — Calm */}
      {step === 3 && (
        <div style={styles.card}>
          <p style={styles.question}>How calm do you feel inside right now?</p>
          <div style={styles.pillRow}>
            <button className="pill" style={styles.pill} onClick={() => selectSettled('Pretty Calm')}>Pretty calm</button>
            <button className="pill" style={styles.pill} onClick={() => selectSettled('A Little Restless')}>A little restless</button>
            <button className="pill" style={styles.pill} onClick={() => selectSettled('Quite Anxious')}>Quite anxious</button>
            <button className="pill" style={styles.pill} onClick={() => selectSettled('All Over The Place')}>All over the place</button>
          </div>
        </div>
      )}

      {/* Step 4 — Reflection */}
      {step === 4 && (
        <div>
          <div style={styles.reflectionCard}>
            <p style={styles.reflectionLabel}>Here is your reflection</p>
            {loading
              ? <p style={styles.reflectionText}>Getting your reflection...</p>
              : <p style={styles.reflectionText}>{reflection}</p>
            }
          </div>
          {!loading && (
            <>
              {saved ? (
                <>
                  <p style={{ fontSize: 14, color: '#534AB7', textAlign: 'center', marginTop: 12 }}>Saved to your journal!</p>
                  <button style={styles.ghost} onClick={() => navigate('/')}>Go home</button>
                </>
              ) : (
                <>
                  <textarea
                    style={{ ...styles.input, marginTop: 12 }}
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Write what's on your heart..."
                    rows={4}
                  />
                  <button style={styles.cta} onClick={saveJournal}>Save to journal</button>
                  <button style={styles.ghost} onClick={() => navigate('/')}>Go home</button>
                </>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FDF8F4',
    minHeight: '100vh',
    padding: 24,
    maxWidth: 380,
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#EEEDFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: 600,
    color: '#26215C',
    margin: '0 0 14px',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    border: '0.5px solid #534AB7',
    borderRadius: 20,
    padding: '8px 14px',
    fontSize: 12,
    color: '#534AB7',
    background: '#FDF8F4',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    background: '#FDF8F4',
    border: '0.5px solid #E0D8D0',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 13,
    color: '#2C2C2A',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'none',
  },
  reflectionCard: {
    backgroundColor: '#EEEDFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#854F0B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 10px',
  },
  reflectionText: {
    fontSize: 14,
    color: '#26215C',
    lineHeight: 1.7,
    margin: 0,
  },
  cta: {
    width: '100%',
    backgroundColor: '#534AB7',
    color: '#EEEDFE',
    border: 'none',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  ghost: {
    width: '100%',
    backgroundColor: 'transparent',
    color: '#888780',
    border: 'none',
    padding: 12,
    fontSize: 13,
    cursor: 'pointer',
    marginTop: 4,
  },
}
