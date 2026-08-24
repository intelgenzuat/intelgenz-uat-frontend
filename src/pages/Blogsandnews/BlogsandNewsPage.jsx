import React from 'react';
import '../../assets/styles/Blogsandnews/BlogsandnewsPage.scss';
import image1 from '../../assets/images/image1.png';
import imag2 from '../../assets/images/imag2.png';
import maskGroup from '../../assets/images/Mask group.png';
import maskGroup1 from '../../assets/images/Mask group (1).png';

export default function BlogsandNewsPage() {
    return (
        <div className="blogs-news-page container">
            <header className="blogs-news-header">
                <h1 className="blogs-news-title">
                    Top 10 Malware Attacks That Shook the<br />Cybersecurity World
                </h1>
                <div className="blogs-news-meta">
                    <span><i className="bi bi-calendar3"></i> Aug 30, 2026</span>
                    <span><i className="bi bi-clock"></i> Time 2 minutes</span>
                </div>
            </header>

            <div className="blogs-news-toolbar">
                <div className="blogs-news-badges">
                    <span className="badge-pill"><i>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                        </svg>
                    </i> Malware Attacks</span>
                    <span className="badge-pill"><i><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                    </svg>
                    </i> Banking</span>
                    <span className="badge-pill"><i><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                    </svg>
                    </i> Banking</span>
                    <span className="badge-pill"><i><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                    </svg>
                    </i> Banking</span>
                    <span className="badge-pill"><i><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                    </svg>
                    </i> Banking</span>
                    <span className="badge-pill"><i><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.26667 12.5333C6.11022 12.5333 5.95894 12.5032 5.81283 12.443C5.66672 12.3827 5.53339 12.2957 5.41283 12.182L0.351333 7.1205C0.237667 6.99994 0.150667 6.86661 0.0903333 6.7205C0.0301111 6.57439 0 6.42311 0 6.26667C0 6.11022 0.0301111 5.95722 0.0903333 5.80767C0.150667 5.65811 0.237667 5.5265 0.351333 5.41283L5.41283 0.351334C5.53339 0.230778 5.66672 0.142111 5.81283 0.0853333C5.95894 0.0284444 6.11022 0 6.26667 0C6.42311 0 6.57611 0.0284444 6.72567 0.0853333C6.87522 0.142111 7.00683 0.230778 7.1205 0.351334L12.182 5.41283C12.3026 5.5265 12.3912 5.65811 12.448 5.80767C12.5049 5.95722 12.5333 6.11022 12.5333 6.26667C12.5333 6.42311 12.5049 6.57439 12.448 6.7205C12.3912 6.86661 12.3026 6.99994 12.182 7.1205L7.1205 12.182C7.00683 12.2957 6.87522 12.3827 6.72567 12.443C6.57611 12.5032 6.42311 12.5333 6.26667 12.5333ZM6.41417 11.4692L11.4692 6.41417C11.5034 6.37994 11.5205 6.33078 11.5205 6.26667C11.5205 6.20256 11.5034 6.15339 11.4692 6.11917L6.41417 1.06417C6.37994 1.02994 6.33078 1.01283 6.26667 1.01283C6.20256 1.01283 6.15339 1.02994 6.11917 1.06417L1.06417 6.11917C1.02994 6.15339 1.01283 6.20256 1.01283 6.26667C1.01283 6.33078 1.02994 6.37994 1.06417 6.41417L6.11917 11.4692C6.15339 11.5034 6.20256 11.5205 6.26667 11.5205C6.33078 11.5205 6.37994 11.5034 6.41417 11.4692ZM5.76667 6.991H6.76667V3.2475H5.76667V6.991ZM6.26667 8.73467C6.41711 8.73467 6.54445 8.6825 6.64867 8.57817C6.753 8.47394 6.80517 8.34661 6.80517 8.19617C6.80517 8.04572 6.753 7.91839 6.64867 7.81417C6.54445 7.70983 6.41711 7.65767 6.26667 7.65767C6.11622 7.65767 5.98889 7.70983 5.88467 7.81417C5.78033 7.91839 5.72817 8.04572 5.72817 8.19617C5.72817 8.34661 5.78033 8.47394 5.88467 8.57817C5.98889 8.6825 6.11622 8.73467 6.26667 8.73467Z" fill="#E08A00" />
                    </svg>
                    </i> Banking</span>
                </div>
                <div className="blogs-news-search">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="main-article">
                        <img
                            src={image1}
                            alt="Spyware Security Warning"
                            className="main-article-img"
                        />
                        <h2 className="main-article-title">
                            The Evolution of Malware: From Simple Viruses to Advanced Persistent Threats
                        </h2>
                        <p className="article-text">
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                        </p>

                        <div className="article-actions">
                            <button className="read-more-btn">
                                Read more <i className="bi bi-chevron-right"></i>
                            </button>
                            <div className="social-icons">
                                <i className="bi bi-youtube"></i>
                                <i className="bi bi-instagram"></i>
                                <i className="bi bi-twitter-x"></i>
                                <i className="bi bi-facebook"></i>
                            </div>
                        </div>
                    </div>

                    <div className="secondary-article">
                        <img
                            src={imag2}
                            alt="Malware code"
                            className="secondary-article-img"
                        />
                        <div className="secondary-article-content">
                            <h3 className="sec-title">
                                The Evolution of Malware: From Simple Viruses to Advanced Persistent Threats
                            </h3>
                            <p className="article-text">
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature.
                            </p>
                        </div>
                    </div>

                    <div className="article-footer">
                        <span>Latin words, consectetur, from a Lorem</span>
                        <div className="social-icons">
                            <i className="bi bi-youtube"></i>
                            <i className="bi bi-instagram"></i>
                            <i className="bi bi-twitter-x"></i>
                            <i className="bi bi-facebook"></i>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="related-news-section">
                        <h4 className="related-news-title">Related News</h4>

                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <div className="related-news-item" key={item}>
                                <img src={index % 2 === 0 ? maskGroup : maskGroup1} alt="News thumbnail" className="related-news-img" />
                                <div>
                                    <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.2rem', color: '#222' }}>When Email Security Becomes</div>
                                    <div className="related-news-text">Advanced nation-state threat actors are targeting Libraesva Email Security systems to bypass protections, gain unauthorized access, and launch sophisticated cyberattacks.</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <img src={maskGroup} alt="Promo Banner" className="img-fluid w-100" />
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-8">
                    <p className="article-text" style={{ textAlign: 'justify' }}>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words,
                        consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections
                        1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                        The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet...", comes from a line in section 1.10.32. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                        Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
                        and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet...", comes from a line in section 1.10.32.
                        Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
                        and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet...", comes from a line in section 1.10.32.
                    </p>
                </div>
                <div className="col-lg-4">
                    <div className="mb-4">
                        <img src={maskGroup1} alt="Promo Banner" className="img-fluid w-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}