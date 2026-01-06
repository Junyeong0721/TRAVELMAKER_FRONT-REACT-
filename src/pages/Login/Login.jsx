import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <div className="ticket-container">
        {/* 왼쪽: 티켓 정보 섹션 */}
        <div className="ticket-info">
          <div className="ticket-header">
            <h1 className="logo-text">TripMate</h1>
            <p className="logo-subtext">Travel Companion</p>
          </div>

          <div className="info-section">
            <div className="info-group">
              <label>FROM</label>
              <p className="info-value">어디서든</p>
            </div>
            
            <div className="divider-line">
              <span className="plane-symbol">✈︎</span>
            </div>

            <div className="info-group">
              <label>TO</label>
              <p className="info-value">나만의 여행</p>
            </div>
          </div>

          <div className="info-footer">
            <div className="footer-item">
              <label>TYPE</label>
              <p>MBTI 맞춤</p>
            </div>
            <div className="footer-item">
              <label>CLASS</label>
              <p>Premium</p>
            </div>
          </div>
          <p className="style-find-text">당신의 여행 스타일을 찾아보세요</p>
        </div>

        {/* 오른쪽: 로그인 폼 섹션 */}
        <div className="ticket-form">
          <h2 className="form-title">로그인</h2>
          
          <div className="input-group">
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <div className="password-wrapper">
              <input type="password" placeholder="••••••••" />
              <span className="eye-icon">👁</span>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> 로그인 유지
            </label>
            <a href="#find" className="find-link">비밀번호 찾기</a>
          </div>

          <button className="login-submit-btn">로그인</button>

          {/* 이 부분이 박스 내부 최하단에 고정됩니다 */}
          <div className="signup-prompt">
            <span>계정이 없으신가요?</span>
            <a href="#signup" className="signup-link">회원가입</a>
          </div>
          
          <div className="corner-tag"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;