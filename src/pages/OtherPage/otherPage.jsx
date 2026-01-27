import React, { useState } from 'react';
import './OtherPage.css';

const OtherPage = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const otherPosts = [
    { id: 1, title: '이번 오사카 여행에서 만난 최고의 라멘집', date: '2023.10.15', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80' },
    { id: 2, title: '제주도 푸른 밤, 파도 소리와 함께한 티타임', date: '2023.09.28', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80' },
    { id: 3, title: '마레 지구에서 찾은 낭만적인 브런치', date: '2023.09.10', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80' },
    { id: 4, title: '교토의 고즈넉한 골목 산책', date: '2023.08.22', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80' },
  ];

  return (
    <div className="other-page-wrapper">
      <div className="other-page-container">
        {/* 상단 프로필 영역 */}
        <section className="profile-header">
          <div className="profile-main-info">
            {/* 프로필 이미지 영역 삭제됨 */}
            
            <div className="profile-details">
              <div className="name-row">
                <h2 className="user-id">jimin_travels</h2>
                {/* 더 작아진 버튼 */}
                <button className="follow-btn">팔로우</button>
              </div>
              <div className="stats-row">
                <span><strong>45</strong> 게시물</span>
                <span><strong>890</strong> 팔로워</span>
                <span><strong>342</strong> 팔로우</span>
              </div>
              <div className="mbti-info">
                <span className="mbti-label">ENFP</span>
              </div>
            </div>
          </div>
        </section>

        {/* 탭 메뉴 (이하 동일) */}
        <nav className="profile-tabs">
          <div className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            📋 게시물
          </div>
          
        </nav>

        {/* 게시물 그리드 (이하 동일) */}
        <main className="posts-grid">
          {otherPosts.map(post => (
            <article key={post.id} className="post-item-card">
              <div className="post-thumb-box">
                <img src={post.img} alt={post.title} />
              </div>
              <div className="post-text-content">
                <h3 className="post-item-title">{post.title}</h3>
                <span className="post-item-date">{post.date}</span>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
};

export default OtherPage;