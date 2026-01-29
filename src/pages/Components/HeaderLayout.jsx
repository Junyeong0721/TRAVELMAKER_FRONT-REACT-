import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './HeaderLayout.css'; // 레이아웃 전용 CSS 임포트
import { getCookie } from '../../js/getToken';
import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "userMbti=; path=/; max-age=0";
    document.cookie = "userNickName=; path=/; max-age=0";
    document.cookie = "userTitle=; path=/; max-age=0";
    setNickname(null); // 상태 초기화
    alert("로그아웃 되었습니다.");
    window.location.reload();
  };
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  useEffect(() => {
    const token = getCookie('token');
    const userNick = getCookie('userNickName');

    if (token) {
      setIsLoggedIn(true);
      setNickname(decodeURIComponent(userNick || ''));
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div className="app-wrapper">
      {/* 공통 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo-link">
            <h1 className="logo">TripMaker <span>Travel Companion</span></h1>
          </Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
             <Link to="/CommunityPage">커뮤니티</Link>
          </nav>
          <div className="header-right">
            {isLoggedIn ? (
              // 1. 로그인 상태일 때: 프로필과 닉네임 표시
              <>
                <span className="user-name" style={{ cursor: 'pointer' }} onClick={() => navigate('/mypage')}>{nickname}님</span>
                <button onClick={() => {handleLogout()}}>로그아웃</button>
              </>
            ) : (
              // 2. 로그아웃 상태일 때: 로그인 버튼 표시
              <button className="login-btn" onClick={() => navigate('/login')}>
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 페이지별 컨텐츠가 표시되는 영역 */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;