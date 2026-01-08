import React from 'react';
import './AiPage.css';

const AIRecommendation = () => {
  // 추천 여행지 데이터 예시
  const destinations = [
    { id: 1, title: '제주도 애월 해안산책로', match: 98, desc: '탁 트인 바다 전망과 함께 걷는 힐링 코스. ENFP의 감성을 자극하는...', tags: ['#오션뷰', '#포토존'], img: 'jeju.jpg' },
    { id: 2, title: '도쿄 시부야 스카이', match: 95, desc: '도시의 화려함을 한눈에 담을 수 있는 최고의 전망대. 활기찬 에너지를...', tags: ['#랜드마크', '#쇼핑'], img: 'tokyo.jpg' },
    { id: 3, title: '치앙마이 올드타운', match: 92, desc: '역사와 현대가 공존하는 태국의 보물 같은 도시. 여유로운 카페 탐방...', tags: ['#문화/역사', '#이국적'], img: 'chiangmai.jpg' },
    { id: 4, title: '이탈리아 토스카나', match: 89, desc: '푸른 구릉과 포도밭이 펼쳐지는 예술 같은 풍경. 와인 한 잔의 여유...', tags: ['#예술/감성', '#미식'], img: 'tuscany.jpg' },
  ];

  return (
    <div className="ai-rec-container">
      {/* 상단 네비게이션 */}
      <header className="nav-header">
        <div className="logo">TripMate <small>AI Travel</small></div>
        <nav>
          <span>홈</span>
          <span className="active">AI 추천</span>
          <span>여행지</span>
          <span>커뮤니티</span>
          <span>마이페이지</span>
        </nav>
        <div className="header-right">
          <span className="icon-dark">🌙</span>
          <div className="user-profile">
            <div className="avatar"></div>
            <span>김여행</span>
          </div>
        </div>
      </header>

      {/* 필터 설정 바 */}
      <div className="filter-bar">
        <div className="filter-info">
          <span className="icon-settings">⚙️</span>
          <div>
            <strong>맞춤 여행 설정</strong>
            <p>여행 성향과 현재 위치를 기반으로 추천합니다.</p>
          </div>
        </div>
        <div className="filter-dropdowns">
          <button className="dropdown">MBTI <span>ENFP</span></button>
          <button className="dropdown">지역 <span>서울 강남구</span></button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content">
        <div className="content-left">
          <h2 className="main-title">🤖 AI 여행 추천</h2>
          <p className="sub-title">나만의 맞춤형 여행지를 발견하고 일정을 만들어보세요.</p>
          
          <div className="section-header">
            <h3>✨ 오늘의 추천 여행지</h3>
            <div className="header-controls">
              <span>📊</span>
              <span>🔄</span>
            </div>
          </div>

          <div className="destination-grid">
            {destinations.map(dest => (
              <div key={dest.id} className="dest-card">
                <div className="card-image" style={{backgroundColor: '#e0e0e0'}}>
                  <span className="match-tag">👍 {dest.match}% 매칭</span>
                  <button className="add-btn">+</button>
                </div>
                <div className="card-body">
                  <h4>{dest.title}</h4>
                  <p>{dest.desc}</p>
                  <div className="tag-group">
                    {dest.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 일정 만들기 사이드바 */}
        <aside className="planner-sidebar">
          <div className="planner-header">
            <h3>📅 나의 일정 만들기</h3>
            <button className="reset-btn">전체 초기화</button>
          </div>
          <div className="drop-zone">
            <div className="empty-msg">
              <span>⠿</span>
              <p>왼쪽에서 추천 장소를<br/>이곳으로 드래그하세요.</p>
            </div>
            {/* 추가된 카드 예시 */}
            <div className="added-item">
              <div className="item-thumb"></div>
              <div className="item-info">
                <strong>치앙마이 올드타운</strong>
                <span>Day 1 • 14:00</span>
              </div>
            </div>
          </div>
          <div className="planner-summary">
            <div className="summary-row">
              <span>총 일정</span>
              <span>1일 4시간</span>
            </div>
            <div className="summary-row">
              <span>예상 비용</span>
              <strong>약 120,000원</strong>
            </div>
            <button className="save-schedule-btn">일정 저장하기 ➔</button>
          </div>
        </aside>
      </main>

      {/* 하단 검색 오버레이 */}
      <div className="search-overlay">
        <div className="search-box">
          <span className="pin-icon">📍</span>
          <input type="text" placeholder="어디로 여행을 떠나고 싶으신가요? (예: 파리, 런던)" />
          <button className="search-btn">검색 🔍</button>
        </div>
        <p className="search-helper">MBTI 분석 결과를 반영하여 검색합니다.</p>
      </div>
    </div>
  );
};

export default AIRecommendation;