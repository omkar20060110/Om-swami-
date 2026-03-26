import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, Shield, Globe2 } from 'lucide-react';

const About = () => {
  const [aboutText, setAboutText] = useState('');
  const [aboutMedia, setAboutMedia] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get('/api/content');
        setAboutText(res.data.about_us_text?.content || 'We are a leading export network connecting quality goods with global buyers.');
        
        const media = [];
        for (let i = 1; i <= 5; i++) {
          if (res.data[`about_media_${i}`]?.content) {
             media.push(res.data[`about_media_${i}`].content);
          }
        }
        setAboutMedia(media);
      } catch (err) {
        console.error("Failed to fetch about content", err);
      }
    };
    fetchContent();
  }, []);

  const renderMedia = (url) => {
    const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
    if (isVideo) {
      return <video src={`/api${url}`} autoPlay loop muted playsInline style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'}} />;
    }
    return <img src={`/api${url}`} alt="About Us" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'}} />;
  };

  return (
    <div style={{backgroundColor: '#fff', minHeight: '100vh'}} className="animate-fade-in">
        {/* About Hero */}
        <section style={{backgroundColor: 'var(--primary)', color: 'white', padding: '6rem 5%', textAlign: 'center'}}>
            <h1 style={{fontSize: '3.5rem', marginBottom: '1rem'}}>About Us</h1>
            <p style={{fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto'}}>
                Your trusted gateway to international trade excellence and premium product sourcing.
            </p>
        </section>

        {/* Story Section */}
        <section style={{padding: '6rem 5%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap'}}>
            <div style={{flex: '1', minWidth: '300px'}}>
                <h2 style={{color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1.5rem'}}>Our Story</h2>
                <div style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', whiteSpace: 'pre-wrap'}}>
                    {aboutText}
                </div>
            </div>
            <div style={{flex: '1', minWidth: '300px'}}>
                {aboutMedia.length > 0 ? (
                    renderMedia(aboutMedia[0])
                ) : (
                    <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2670&auto=format&fit=crop" alt="Global Trade" style={{width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)'}} />
                )}
            </div>
        </section>

        {/* Extra Media Gallery */}
        {aboutMedia.length > 1 && (
            <section style={{padding: '0 5% 6rem', maxWidth: '1200px', margin: '0 auto'}}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {aboutMedia.slice(1).map((url, idx) => (
                        <div key={idx} style={{ aspectRatio: '1', width: '100%' }}>
                            {renderMedia(url)}
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Values */}
        <section style={{backgroundColor: '#f8fafc', padding: '6rem 5%'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h2 style={{textAlign: 'center', color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '4rem'}}>Our Core Values</h2>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem'}}>
                    <div style={{backgroundColor: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center'}}>
                        <div style={{width: '64px', height: '64px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                            <Shield size={32} />
                        </div>
                        <h3 style={{color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1rem'}}>Integrity & Quality</h3>
                        <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>We never compromise on the quality of our goods. Every product is strictly verified before export.</p>
                    </div>

                    <div style={{backgroundColor: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center'}}>
                        <div style={{width: '64px', height: '64px', backgroundColor: '#fef3c7', color: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                            <Globe2 size={32} />
                        </div>
                        <h3 style={{color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1rem'}}>Global Reach</h3>
                        <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>Bridging boundaries and expanding market access for manufacturers to over 50+ countries.</p>
                    </div>

                    <div style={{backgroundColor: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center'}}>
                        <div style={{width: '64px', height: '64px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
                            <Target size={32} />
                        </div>
                        <h3 style={{color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1rem'}}>Client Success</h3>
                        <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>Our strategic partnerships and logistics network are fully centered on making our clients successful.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};

export default About;
