import React from 'react';
import { register } from '../api/회원가입/registerService';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const navigate = useNavigate();

  // 1. 유효성 검사 로직 (pwConfirm 파라미터 추가)
  function 회원가입유효성검사(id, email, pw, pwConfirm) {
    if (!id.trim() || !email.trim() || !pw.trim() || !pwConfirm.trim()) {
      alert("모든 필드를 입력해주세요.");
      return false;
    }

    const idRegex = /^[a-z0-9]{5,15}$/;
    if (!idRegex.test(id)) {
      alert("아이디는 5~15자의 영문 소문자와 숫자만 가능합니다.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return false;
    }

    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!pwRegex.test(pw)) {
      alert("비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 각각 최소 하나 이상 포함해야 합니다.");
      return false;
    }

    // 2. 비밀번호 일치 검사 추가
    if (pw !== pwConfirm) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return false;
    }

    return true;
  }

  const 회원가입 = (e) => {
    e.preventDefault();

    const id = document.getElementById("id");
    const pw = document.getElementById("pw");
    const pwConfirm = document.getElementById("pwConfirm"); // 추가
    const email = document.getElementById("email");
    const nickname = document.getElementById("nickname");
    const mbti = document.getElementById("mbti");

    const obj = {
      userId: id.value,
      userPw: pw.value,
      userEmail: email.value,
      userNickname: nickname.value,
      mbti: mbti.value
    };

    // 유효성 검사 호출 시 pwConfirm.value 추가 전달
    if (회원가입유효성검사(id.value, email.value, pw.value, pwConfirm.value)) {
      console.log("서버로 회원가입 데이터 전송 중...");
      register(obj)
        .then(res => {
          if (res.status !== 200) {
            console.log('error');
            return;
          }
          alert("회원가입이 완료되었습니다.");
          setTimeout(() => {
            navigate('/login'); // 1초 뒤에 /login 경로로 이동
          }, 1000);
        });
    }
  };
  const mbtiList = [
    "ISTJ", "ISFJ", "INFJ", "INTJ",
    "ISTP", "ISFP", "INFP", "INTP",
    "ESTP", "ESFP", "ENFP", "ENTP",
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"
  ];

  return (
    <div className="signup-page">
      <div className="ticket-container">
        {/* 왼쪽 섹션 동일 */}
        <div className="ticket-info">
          <div className="ticket-header">
            <h1 className="logo-text">TripMate</h1>
            <p className="logo-subtext">Travel Companion</p>
          </div>
          <div className="info-section">
            <div className="info-group"><label>FROM</label><p className="info-value">어디서든</p></div>
            <div className="divider-line"><span className="plane-symbol">✈︎</span></div>
            <div className="info-group"><label>TO</label><p className="info-value">나만의 여행</p></div>
          </div>
          <div className="info-footer">
            <div className="footer-item"><label>TYPE</label><p>MBTI 맞춤</p></div>
            <div className="footer-item"><label>CLASS</label><p>Premium</p></div>
          </div>
          <p className="style-find-text">당신의 여행 스타일을 찾아보세요</p>
        </div>

        {/* 오른쪽 섹션: 비밀번호 확인 필드 추가 */}
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

          {/* 3. 비밀번호 확인 입력창 추가 */}
          <div className="input-group">
            <label>비밀번호 확인</label>
            <input type="password" placeholder="비밀번호를 다시 입력하세요" id="pwConfirm"/>
          </div>

          <div className="input-group">
            <label>MBTI</label>
            {/* MBTI 입력창을 콤보박스(select)로 변경 */}
            <select id="mbti" defaultValue="">
              <option value="" disabled>MBTI를 선택하세요</option>
              {mbtiList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button className="signup-submit-btn" onClick={회원가입}>가입하기</button>

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