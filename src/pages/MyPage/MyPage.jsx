import React from 'react';
import './MyPage.css';

const MyPage = () => {
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
          
          {/* 왼쪽 사이드바 (프로필 및 메뉴) */}
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
              <div className="menu-item active">👤 내 정보 관리</div>
              <div className="menu-item">👥 친구 목록</div>
              <div className="menu-item">⚙️ AI 맞춤 설정</div>
              <div className="menu-item">🧠 MBTI 분석</div>
              <div className="menu-item">🔖 저장된 여행지</div>
              <div className="menu-item logout">📤 로그아웃</div>
            </nav>
          </aside>

          {/* 오른쪽 상세 설정 폼 */}
          <section className="settings-form-area">
            
            {/* 기본 프로필 카드 (연노랑 배경) */}
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
              <div className="input-field full-width">
                <label>한줄 소개</label>
                <textarea defaultValue="세상의 모든 바다를 보고 싶은 여행자입니다."></textarea>
              </div>
            </div>

            {/* AI 맞춤 설정 카드 */}
            <div className="form-card ai-mbti-settings">
              <div className="card-title">
                <span className="title-icon sparkle">✨</span>
                <h4>AI 맞춤 설정 & MBTI</h4>
              </div>
              
              <div className="mbti-selection-box">
                <label>나의 MBTI</label>
                <div className="mbti-row">
                  <div className="mbti-display">ENFP - 재기발랄한 활동가</div>
                  <button className="mbti-retry-btn">MBTI 다시 검사하기</button>
                </div>
                <p className="description-text">MBTI 정보를 업데이트하면 여행지 추천 알고리즘이 즉시 반영됩니다.</p>
              </div>

              <div className="travel-style-box">
                <label>선호하는 여행 스타일</label>
                <div className="style-tags">
                  <span className="style-tag active">🏖️ 휴양지</span>
                  <span className="style-tag active">🍴 맛집 탐방</span>
                  <span className="style-tag">🏃 액티비티</span>
                  <span className="style-tag">🏛️ 문화 유적</span>
                  <span className="style-tag">🛌 호캉스</span>
                </div>
              </div>

              <div className="toggle-options">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <strong>AI 일정 자동 생성</strong>
                    <p>검색 기록을 기반으로 맞춤형 일정을 제안받습니다.</p>
                  </div>
                  <div className="toggle-switch active"></div>
                </div>
                <div className="toggle-row">
                  <div className="toggle-info">
                    <strong>마케팅 알림 수신</strong>
                    <p>특가 항공권 및 프로모션 정보를 받습니다.</p>
                  </div>
                  <div className="toggle-switch"></div>
                </div>
              </div>
            </div>

            {/* 하단 동작 버튼 */}
            <div className="form-action-btns">
              <button className="btn-cancel">취소</button>
              <button className="btn-save">변경사항 저장</button>
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