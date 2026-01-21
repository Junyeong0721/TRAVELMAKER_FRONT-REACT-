import React from 'react';
import './MyPage.css';
import { useNavigate } from 'react-router-dom'; // ★ 페이지 이동 훅

const MyPage = () => {
  const navigate = useNavigate(); // 이동 함수 생성

  return (
    <div className="mypage-wrapper">
      {/* 상단 헤더 */}
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">TripMate <span>Travel Companion</span></h1>
          <nav className="header-nav">
            <span>홈</span>
            <span>기능</span>
            <span>여행지</span>
            <span>커뮤니티</span>
            <span>도움말</span>
          </nav>
          <div className="header-right">
            <div className="user-profile-circle"></div>
            <span className="user-name">김여행</span>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="mypage-container">
        {/* 페이지 타이틀 */}
        <section className="page-title-area">
          <h2>마이 페이지</h2>
          <p>개인 정보와 여행 선호도를 관리하세요.</p>
        </section>

        {/* 메인 레이아웃 그리드 */}
        <div className="mypage-layout-grid">
          
          {/* 왼쪽 사이드바 */}
          <aside className="mypage-sidebar">
            <div className="profile-summary-card">
              <div className="avatar-section">
                <div className="avatar-circle"></div>
                <button className="avatar-edit-btn">✏️</button>
              </div>
              <h3>김여행</h3>
              <p className="user-email">traveler@tripmate.com</p>
              <div className="user-badges">
                <span className="badge-premium">PREMIUM</span>
                <span className="badge-mbti">ENFP</span>
              </div>
              <div className="user-stats-row">
                <div className="stat-box">
                  <span className="stat-val">12</span>
                  <span className="stat-label">나의 여행</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val">5</span>
                  <span className="stat-label">리뷰</span>
                </div>
              </div>
            </div>

            <nav className="sidebar-menu">
              <div className="menu-item">👤 내 정보 관리</div>
              <div className="menu-item active">🔖 저장된 여행지</div>
              <div className="menu-item">⚙️ AI 맞춤 설정</div>
              <div className="menu-item logout">📤 로그아웃</div>
            </nav>
          </aside>

          {/* 오른쪽 상세 설정 폼 */}
          <section className="settings-form-area">
            
            {/* ▼ [수정됨] 심플해진 여행 기록 카드 (바로가기 버튼만 있음) ▼ */}
            <div className="form-card travel-history-card">
              <div className="card-header-row" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <div className="title-with-icon">
                  <span className="title-icon">✈️</span>
                  <div>
                    <h4 style={{ margin: 0 }}>나의 여행 기록</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#888' }}>
                      저장된 AI 추천 여행 코스를 확인하고 관리하세요.
                    </p>
                  </div>
                </div>
                
                {/* 클릭 시 페이지 이동 */}
                <button 
                  onClick={() => navigate('/my-travels')} 
                  className="load-btn"
                >
                  전체 보기 ➔
                </button>
              </div>
            </div>
            {/* ▲ [끝] ▲ */}

            {/* 기본 프로필 카드 */}
            <div className="form-card basic-profile">
              <div className="card-title">
                <span className="title-icon">👤</span>
                <h4>기본 프로필</h4>
              </div>
              <div className="input-grid">
                <div className="input-field">
                  <label>닉네임</label>
                  <input type="text" defaultValue="김여행" />
                </div>
                <div className="input-field">
                  <label>이메일</label>
                  <input type="email" value="traveler@tripmate.com" readOnly className="readonly-input" />
                  <span className="helper-text">이메일 변경은 고객센터에 문의해주세요.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mypage-footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default MyPage;