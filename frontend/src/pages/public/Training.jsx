import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, DollarSign } from 'lucide-react';

const Training = () => {
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    const fetchTrainings = async () => {
      const res = await axios.get('/api/training');
      setTrainings(res.data.filter(t => t.is_active));
    };
    fetchTrainings();
  }, []);

  return (
    <div style={{padding: '4rem 5%', backgroundColor: '#f8fafc', minHeight: '100vh'}}>
      <div style={{textAlign: 'center', marginBottom: '4rem'}}>
        <h1 style={{color: 'var(--primary)', fontSize: '3rem', margin: '0 0 1rem 0'}}>Export Training Programs</h1>
        <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto'}}>
          Learn from industry experts. Our programs are designed to take you from a beginner to a successful global exporter.
        </p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto'}}>
        {trainings.map(t => (
          <div key={t.id} style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column'}} className="animate-slide-up">
             <div style={{backgroundColor: 'var(--primary)', color: 'white', padding: '2rem'}}>
                <h2 style={{margin: '0 0 0.5rem 0', fontSize: '2rem'}}>{t.title}</h2>
                <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '50px'}}><Clock size={16}/> {t.duration}</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--secondary)', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 'bold'}}><DollarSign size={16}/> {t.fees}</span>
                </div>
             </div>
             <div style={{padding: '2rem'}}>
                <p style={{fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '2rem'}}>{t.description}</p>
                
                {t.modules && (
                  <div>
                    <h4 style={{color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                      <BookOpen size={18}/> Course Modules
                    </h4>
                    <ul style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0}}>
                      {t.modules.split(',').map((mod, idx) => (
                        <li key={idx} style={{backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                          <span style={{color: 'var(--secondary)', fontWeight: 'bold'}}>✓</span> {mod.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Training;
