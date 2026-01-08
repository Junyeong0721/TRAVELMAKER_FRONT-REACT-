import React from 'react';
import { register } from '../api/회원가입/registerService';
import './SignUp.css';

const Signup = () => {//회원가입로직

  function 회원가입유효성검사(id, email, pw) {

    // 1. 공백 검사 (trim()을 사용하여 띄어쓰기가 입력한 경우도 방지)
    if (!id.trim() || !email.trim() || !pw.trim()) {
      alert("모든 필드를 입력해주세요."); 
      return false;
    }

    // 2. 아이디 유효성 검사 (5~15자, 영문 소문자/숫자 조합)
    const idRegex = /^[a-z0-9]{5,15}$/;
    if (!idRegex.test(id)) {
      alert("아이디는 5~15자의 영문 소문자와 숫자만 가능합니다.");
      return false;
    }

    // 3. 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return false;
    }

    // 4. 비밀번호 복잡도 검사 (8자 이상, 영문/숫자/특수문자 모두 포함)
    // ^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]) -> 최소 하나씩 포함되어야 함
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!pwRegex.test(pw)) {
      alert("비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 각각 최소 하나 이상 포함해야 합니다.");
      return false;
    }

    return true;
  }
  const 회원가입 = (e) => {
  e.preventDefault(); // 폼 제출로 인한 페이지 새로고침 방지

  const id = document.getElementById("id"); // 아이디 추가
  const pw = document.getElementById("pw");
  const email = document.getElementById("email");
  const nickname = document.getElementById("nickname");

  const obj = {
    userId: id.value,
    userPw: pw.value,
    userEmail: email.value,
    userNickname: nickname.value
  };

  // 1. 유효성 검사 함수 호출
  if (회원가입유효성검사(id.value, email.value, pw.value)) {
    // 2. 검사 통과 시 실제 서버와 통신하는 로직 실행
    console.log("서버로 회원가입 데이터 전송 중...");
    // 예: axios.post('/api/signup', { id, email, pw })
      register(obj)
        .then(res => {
          if (res.status !== 200) {

          console.log('error');
          return;
          }
          alert("회원가입이 완료되었습니다.");
          // 3. 가입 완료 후 메인 페이지로 이동 등의 로직
        });
  } else {
    // 검사 실패 시 (내부에서 alert를 띄웠으므로) 아무것도 하지 않음
    return;
  }
};
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
            <input type="text" placeholder="사용하실 닉네임을 입력하세요" id="nickname"/>
          </div>

          <div className="input-group">
            <label>이메일</label>
            <input type="email" placeholder="example@tripmate.com" id="email"/>
          </div>

          <div className="input-group">
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" id="id"/>
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input type="password" placeholder="8자리 이상 입력하세요" id="pw"/>
          </div>

          <button className="signup-submit-btn" onClick={회원가입}>가입하기</button>

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