import React from 'react';
import './FriendPage.css';

const FriendPage = () => {
  const friends = [
    { id: 1, name: '박지민', mbti: 'ENTP', info: '최근 여행: 제주도 서귀포', status: 'online' },
    { id: 2, name: '이서준', mbti: 'ISTJ', info: '3시간 전 접속', status: 'offline' },
    { id: 3, name: '김민지', mbti: 'ENFP', info: '✈️ 여행 계획 중: 오사카', status: 'online' },
    { id: 4, name: '최현우', mbti: 'INTP', info: '📷 최근 사진 업로드: 강릉', status: 'offline' },
    { id: 5, name: '정소연', mbti: 'ISFP', info: '📍 현재 여행중: 부산', status: 'online' },
  ];

  return (
    <div className="friend-page-wrapper">
     
      

      {/* 메인 컨텐츠 */}
      <main className="friend-container">
        <div className="friend-header-row">
          <div className="title-area">
            <h2>친구 목록</h2>
            <p>함께 여행할 친구들을 관리하고 소통하세요.</p>
          </div>
          <div className="action-area">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="친구 검색..." />
            </div>
            <button className="add-friend-btn">+ 친구 추가</button>
          </div>
        </div>

        <div className="friend-layout-grid">
          {/* 왼쪽 사이드바 */}
          <aside className="friend-sidebar">
            <div className="user-mini-profile">
              <div className="mini-avatar"></div>
              <div className="mini-info">
                <strong>김여행</strong>
                <span>ENFP • 12개의 여행</span>
              </div>
            </div>

            <nav className="sidebar-menu">
              <div className="menu-item">👤 내 정보 관리</div>
              <div className="menu-item active">👥 친구 목록</div>
              <div className="menu-item">⚙️ AI 맞춤 설정</div>
              <div className="menu-item">🧠 MBTI 분석</div>
              <div className="menu-item">🔖 저장된 여행지</div>
            </nav>

            <div className="invite-banner">
              <div className="banner-content">
                <h4>친구 초대하기</h4>
                <p>친구를 초대하고 함께 여행 계획을 세워보세요!</p>
                <button className="copy-link-btn">초대 링크 복사</button>
              </div>
              <div className="banner-icon">📢</div>
            </div>
          </aside>

          {/* 오른쪽 친구 리스트 */}
          <section className="friend-list-area">
            <div className="filter-tabs">
              <button className="tab active">팔로잉</button>
              <button className="tab">팔로워</button>
            </div>

            <div className="friend-list-card">
              {friends.map(friend => (
                <div key={friend.id} className="friend-item">
                  <div className="friend-avatar-wrapper">
                    <div className="friend-avatar"></div>
                    <span className={`status-dot ${friend.status}`}></span>
                  </div>
                  <div className="friend-details">
                    <div className="name-row">
                      <span className="friend-name">{friend.name}</span>
                      <span className={`mbti-tag ${friend.mbti.toLowerCase()}`}>{friend.mbti}</span>
                    </div>
                    <p className="friend-info-text">{friend.info}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="load-more-btn">더보기</button>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span><span>개인정보처리방침</span><span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default FriendPage;