import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './HeaderLayout.css'; // 레이아웃 전용 CSS 임포트

const Layout = () => {
  return (
    <div className="app-wrapper">
      {/* 공통 헤더 */}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo-link">
            <h1 className="logo">TripMate <span>Travel Companion</span></h1>
          </Link>
          <nav className="header-nav">
            <Link to="/">홈</Link>
            <span>기능</span>
            <span>여행지</span>
             <Link to="/CommunityPage">커뮤니티</Link>
            <span>도움말</span>
          </nav>
          <div className="header-right">
            <div className="user-profile-circle"></div>
            <span className="user-name">김여행</span>
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