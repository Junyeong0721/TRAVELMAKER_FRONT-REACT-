import React from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCookie } from '../../js/getToken.js';


const Main = () => {
  const navigate = useNavigate();
  
  // 3. 로그인 상태와 유저 정보를 담을 state 추가
  const [nickname, setNickname] = useState(null);

  // 4. 페이지 로드 시 쿠키 확인
  useEffect(() => {
    const userNick = getCookie('userNickName');
    if (userNick) {
      setNickname(userNick);
    }
  }, []);

  // 5. 로그아웃 함수 (쿠키 삭제)
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "userMbti=; path=/; max-age=0";
    document.cookie = "userNickName=; path=/; max-age=0";
    document.cookie = "userTitle=; path=/; max-age=0";
    setNickname(null); // 상태 초기화
    alert("로그아웃 되었습니다.");
  };

  return (
    <div className="main-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">TripMate <span className="logo-sub">Travel Companion</span></div>
  
        <div className="nav-actions">
          {/* 6. 조건부 렌더링 적용 */}
          {nickname ? (
            <div className="login-user-info">
              <span className="user-nickname"><strong>{nickname}</strong>님</span>
              <button className="logout-btn" onClick={handleLogout} style={{marginLeft: '10px'}}>로그아웃</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate('/login')}>로그인</button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>당신이 꿈꾸는 여행을<br />TripMate와 함께</h1>
          <p>세상의 아름다운 곳을 쉽고 편하게 계획하세요.<br />개인 맞춤형 일정부터 현지 정보까지, 모든 것을 한 곳에서.</p>
          <div className="hero-btns">
            <button className="btn-primary">무료 시작하기</button>
            {/* 빈 버튼 스타일 변경을 위해 클래스 유지 */}
            <button className="btn-secondary">데모 영상</button> 
          </div>
        </div>
        <div className="hero-image-card">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="Hero" />
          <div className="card-overlay">
            <p>'꿈을 현실로'</p>
            <button className="card-start-btn" onClick={e=>{navigate('/Aipage')}}>시작하기</button>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="filter-bar">
        <button className="filter-item active"> 모두 보기</button>
        <button className="filter-item"> AI</button>
        <button className="filter-item"> 프레젠테이션</button>
        <button className="filter-item"> SNS</button>
        <button className="filter-item"> 동영상</button>
      </div>

      {/* Feature Cards Section (컬러 카드 유지) */}
      <section className="feature-grid">
        <div className="feature-card plan-card">
          <span className="icon">📅</span>
          <h3>일정 계획</h3>
          <h2>여행 일정을 쉽고 빠르게 계획하세요</h2>
          <p>AI 기반 추천으로 맞춤형 여행 일정을 자동으로 생성합니다.</p>
          <button className="more-btn" onClick={e=>{navigate('/Aipage')}}>더 알아보기</button>
          <div className="card-shapes">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>
        </div>
        <div className="feature-card community-card">
          <span className="icon">👥</span>
          <h3>커뮤니티</h3>
          <h2>여행 친구와 요즘 가장 핫한 여행지를 공유하세요</h2>
          <p>실시간 정보와 여행 팁을 공유하고 소통할 수 있습니다.</p>
          <button className="more-btn" onClick={e=>{navigate('/CommunityPage')}}>더 알아보기</button>
          <div className="card-shapes">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations">
        <div className="section-header">
          <h2>인기 여행지를 둘러보세요</h2>
          <p>전 세계 여행자들이 가장 사랑하는 여행지</p>
        </div>
        <div className="destination-grid">
          <DestinationCard 
            img="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80"
            rating="4.9"
            location="발리, 인도네시아"
            desc="열대 천국의 완벽한 휴양지"
            reviews="2,453 리뷰"
          />
          <DestinationCard 
            img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80"
            rating="4.8"
            location="뉴욕, 미국"
            desc="잠들지 않는 도시의 활기"
            reviews="3,892 리뷰"
          />
          <DestinationCard 
            img="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80"
            rating="4.95"
            location="스위스 알프스"
            desc="장엄한 산과 자연의 경이로움"
            reviews="1,876 리뷰"
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <div className="cta-box">
          <h2>지금 바로 여행 계획을 시작하세요</h2>
          <p>TripMate와 함께라면 완벽한 여행이 당신을 기다립니다</p>
          <div className="cta-btns">
            <button className="btn-primary-blue"onClick={e=>{navigate('/Login')}}>무료로 시작하기</button>
            <button className="btn-outline">데모 보기</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Destination Card Component
const DestinationCard = ({ img, rating, location, desc, reviews }) => (
  <div className="dest-card">
    <div className="dest-img-wrapper">
      <img src={img} alt={location} />
      <span className="rating-tag">⭐ {rating}</span>
    </div>
    <div className="dest-info">
      <p className="location-text">📍 {location}</p>
      <h4 className="desc-text">{desc}</h4>
      <div className="dest-footer">
        <span className="reviews">{reviews}</span>
        <span className="view-more">자세히 보기 →</span>
      </div>
    </div>
  </div>
);

export default Main;