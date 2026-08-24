import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const newsArticles = [
    { id: 1, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { id: 2, title: 'SolarWinds fixed a critical RCE flaw in its...', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { id: 3, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { id: 4, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { id: 5, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    // { id: 6, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    // { id: 7, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    // { id: 8, title: 'Nation-State hackers exploit Libraesva Email...', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
];

export default function BlogsandNews() {
    const [activeTab, setActiveTab] = useState('blogs');
    const navigate = useNavigate();

    return (
        <div className="blogs-news-section">
            <h5 className="section-title">
                Blogs & News <i className="bi bi-question-circle"></i>
            </h5>
            <div className="news-sidebar">

                <div className="nav-tabs-container d-flex">
                    <button
                        className={`nav-tab-btn flex-fill ${activeTab === 'blogs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blogs')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11.2" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M0 3V0.6C0 0.422222 0.0555556 0.277778 0.166667 0.166667C0.277778 0.0555556 0.422222 0 0.6 0H2.6C2.77778 0 2.92222 0.0555556 3.03333 0.166667C3.14444 0.277778 3.2 0.422222 3.2 0.6V3C3.2 3.16667 3.14444 3.30833 3.03333 3.425C2.92222 3.54167 2.77778 3.6 2.6 3.6H0.6C0.422222 3.6 0.277778 3.54167 0.166667 3.425C0.0555556 3.30833 0 3.16667 0 3ZM4.6 3.6C4.43333 3.6 4.29167 3.54167 4.175 3.425C4.05833 3.30833 4 3.16667 4 3V0.6C4 0.422222 4.05833 0.277778 4.175 0.166667C4.29167 0.0555556 4.43333 0 4.6 0H6.6C6.77778 0 6.92222 0.0555556 7.03333 0.166667C7.14444 0.277778 7.2 0.422222 7.2 0.6V3C7.2 3.16667 7.14444 3.30833 7.03333 3.425C6.92222 3.54167 6.77778 3.6 6.6 3.6H4.6ZM8.6 3.6C8.42222 3.6 8.27778 3.54167 8.16667 3.425C8.05556 3.30833 8 3.16667 8 3V0.6C8 0.422222 8.05556 0.277778 8.16667 0.166667C8.27778 0.0555556 8.42222 0 8.6 0H10.6C10.7778 0 10.9222 0.0555556 11.0333 0.166667C11.1444 0.277778 11.2 0.422222 11.2 0.6V3C11.2 3.16667 11.1444 3.30833 11.0333 3.425C10.9222 3.54167 10.7778 3.6 10.6 3.6H8.6ZM2.6 8H0.6C0.422222 8 0.277778 7.94167 0.166667 7.825C0.0555556 7.70833 0 7.56667 0 7.4V5C0 4.82222 0.0555556 4.67778 0.166667 4.56667C0.277778 4.45556 0.422222 4.4 0.6 4.4H2.6C2.77778 4.4 2.92222 4.45556 3.03333 4.56667C3.14444 4.67778 3.2 4.82222 3.2 5V7.4C3.2 7.56667 3.14444 7.70833 3.03333 7.825C2.92222 7.94167 2.77778 8 2.6 8ZM4.6 8C4.43333 8 4.29167 7.94167 4.175 7.825C4.05833 7.70833 4 7.56667 4 7.4V5C4 4.82222 4.05833 4.67778 4.175 4.56667C4.29167 4.45556 4.43333 4.4 4.6 4.4H6.6C6.77778 4.4 6.92222 4.45556 7.03333 4.56667C7.14444 4.67778 7.2 4.82222 7.2 5V7.4C7.2 7.56667 7.14444 7.70833 7.03333 7.825C6.92222 7.94167 6.77778 8 6.6 8H4.6ZM8.6 8C8.42222 8 8.27778 7.94167 8.16667 7.825C8.05556 7.70833 8 7.56667 8 7.4V5C8 4.82222 8.05556 4.67778 8.16667 4.56667C8.27778 4.45556 8.42222 4.4 8.6 4.4H10.6C10.7778 4.4 10.9222 4.45556 11.0333 4.56667C11.1444 4.67778 11.2 4.82222 11.2 5V7.4C11.2 7.56667 11.1444 7.70833 11.0333 7.825C10.9222 7.94167 10.7778 8 10.6 8H8.6Z" fill="currentColor" />
                        </svg> Blogs
                    </button>
                    <button
                        className={`nav-tab-btn flex-fill ${activeTab === 'news' ? 'active' : ''}`}
                        onClick={() => setActiveTab('news')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11.2" height="11.2" viewBox="0 0 12 12" fill="none">
                            <path d="M0 0H4.8V4.8H0V0ZM6.4 0H11.2V4.8H6.4V0ZM0 6.4H4.8V11.2H0V6.4ZM8.2 6.4H9.4V8.2H11.2V9.4H9.4V11.2H8.2V9.4H6.4V8.2H8.2V6.4ZM7.6 1.2V3.6H10V1.2H7.6ZM1.2 1.2V3.6H3.6V1.2H1.2ZM1.2 7.6V10H3.6V7.6H1.2Z" fill="currentColor" />
                        </svg> News
                    </button>
                </div>

                <div className="news-list">
                    {newsArticles.map((article) => (
                        <a className="news-item" key={article.id} onClick={() => navigate('/blogs-and-news')} style={{ cursor: 'pointer' }}>
                            <img src={article.image} alt="News thumbnail" className="news-img" />
                            <div className="news-title">{article.title}</div>
                            <i className="bi bi-arrow-up-right arrow-icon"></i>
                        </a>
                    ))}
                </div>

            </div>
            <button className="see-all-btn" onClick={() => navigate('/blogs-and-news')}>
                See all news <i className="bi bi-arrow-right ms-1"></i>
            </button>
        </div>
    );
}
