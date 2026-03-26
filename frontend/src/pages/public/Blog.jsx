import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User } from 'lucide-react';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await axios.get('/api/blog');
            setPosts(res.data);
        };
        fetchPosts();
    }, []);

    return (
        <div style={{padding: '4rem 5%', backgroundColor: '#f8fafc', minHeight: '100vh'}}>
            <div style={{textAlign: 'center', marginBottom: '4rem'}}>
                <h1 style={{color: 'var(--primary)', fontSize: '3rem', margin: '0 0 1rem 0'}}>Resources & Insights</h1>
                <p style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>Latest news, guides, and trends in global trade.</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
                {posts.map(post => (
                    <article key={post.id} style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden'}} className="animate-fade-in">
                        <div style={{padding: '2rem'}}>
                            <h2 style={{margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1.5rem', lineHeight: '1.4'}}>{post.title}</h2>
                            <div style={{display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Calendar size={14}/> {post.created_at.split(' ')[0]}</span>
                                <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><User size={14}/> Admin</span>
                            </div>
                            <p style={{color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: '1.5rem'}}>
                                {post.content}
                            </p>
                            
                            {post.additional_images && post.additional_images.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    {post.additional_images.map((url, idx) => {
                                        const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                                        return (
                                            <div key={idx} style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                {isVideo ? (
                                                    <video src={`/api${url}`} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <img src={`/api${url}`} alt="Resource Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
                
                {posts.length === 0 && (
                  <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)'}}>
                    <p>No articles published yet.</p>
                  </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
