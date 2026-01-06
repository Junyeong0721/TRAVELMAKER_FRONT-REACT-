import React from 'react';
import './SignUp.css';

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="ticket-container">
        {/* 왼쪽: 티켓 정보 섹션 (로그인과 동일하게 유지) */}
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

        {/* 오른쪽: 회원가입 폼 섹션 */}
        <div className="ticket-form">
          <h2 className="form-title">회원가입</h2>
          
          <div className="input-group">
            <label>닉네임</label>
            <input type="text" placeholder="사용하실 닉네임을 입력하세요" />
          </div>

          <div className="input-group">
            <label>이메일</label>
            <input type="email" placeholder="example@tripmate.com" />
          </div>

          <div className="input-group">
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input type="password" placeholder="8자리 이상 입력하세요" />
          </div>

          <button className="signup-submit-btn">가입하기</button>

          {/* 로그인으로 돌아가기 문구 */}
          <div className="login-prompt">
            <span>이미 계정이 있으신가요?</span>
            <a href="/login" className="login-link">로그인</a>
          </div>
          
          <div className="corner-tag"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;