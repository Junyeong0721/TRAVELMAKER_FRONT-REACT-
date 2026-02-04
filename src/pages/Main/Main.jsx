import React from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCookie } from '../../js/getToken.js';
import { getTop3Posts } from '../api/top3/getTop3Posts.js';


const Main = () => {
  
  const navigate = useNavigate();
  
  // 3. 로그인 상태와 유저 정보를 담을 state 추가
  const [nickname, setNickname] = useState(null);
  const [topPosts, setTopPosts] = useState([]);

  // 4. 페이지 로드 시 쿠키 확인
  useEffect(() => {
    getTop3Posts()
      .then(res => {
        if (res.status === 200) {
          setTopPosts(res.data);
        }
      })
      .catch(err => console.error(err)); 


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
        <div className="logo">TripMaker <span className="logo-sub">Travel Companion</span></div>
  
        <div className="nav-actions">
          {/* 6. 조건부 렌더링 적용 */}
          {nickname ? (
            <div className="login-user-info">
              <span className="user-nickname" onClick={() => navigate('/mypage')}><strong>{nickname}</strong>님</span>
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
          <h1>당신이 꿈꾸는 여행을<br />TripMaker와 함께</h1>
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
        <div className="destination-grid">
          {topPosts.map((post) => (
            <div 
              key={post.idx} 
              onClick={() => navigate(`/DetailPage/${post.idx}`)} // ✅ 클릭 시 이동
              style={{ cursor: 'pointer' }} // 클릭 가능하다는 표시
            >
              <DestinationCard 
                img={post.thumbnail}
                rating={`❤️ ${post.likeCount}`}
                location={post.title}
                desc={`👁️ ${post.viewCount} 💬 ${post.commentCount}`}
                reviews="상세보기"
              />
            </div>
          ))}
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