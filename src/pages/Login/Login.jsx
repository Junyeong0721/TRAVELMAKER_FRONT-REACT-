import {login} from '../api/login/loginService';
import {boardList} from '../api/게시판테스트/boardService';
import './Login.css';

const Login = () => { 

  function 로그인() {
    const id = document.getElementById("id");
    const pw = document.getElementById("pw");

    const obj = {
      userId: id.value,
      userPw: pw.value
    }
    login(obj) // req, res
      .then(res => {
        console.log(res);

        if (res.status !== 200) {

          console.log('error');
          return;
        }
        const restoken = res.data.data;

        if (restoken === null){
          alert("아이디와 패스워드를 확인해주세요!");
          return;
        }
        console.log('토큰 발급 : ' + restoken);
        document.cookie = "token=" + restoken + "; path=/; max-age=86400";
        document.cookie = "userId=" + id.value + "; path=/; max-age=86400";
      })
  }
  function getCookie(name) {//테스트용
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return value ? value.split('=')[1] : null;


  }
  function 쿠키확인() {//테스트용
    const token = getCookie('token');
    console.log('토큰확인 : ' + token);

  }
  function api호출() {//테스트용
      const token = getCookie('token');
      const userId = getCookie('userId');

      boardList()
        .then(res => {
          console.log(res);
        }).catch(err => {
          console.log("error");
        });
    }

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
            <input type="text" placeholder="아이디를 입력하세요" id = "id"/>
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <div className="password-wrapper">
              <input type="password" placeholder="••••••••" id = "pw"/>
              <span className="eye-icon">👁</span>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> 로그인 유지
            </label>
            <a href="#find" className="find-link">비밀번호 찾기</a>
          </div>

          <button className="login-submit-btn" onClick={로그인}>로그인</button>
          <button className="testbutton" onClick={쿠키확인}>쿠키확인</button>
          <button className="apitestbutton" onClick={api호출}>API호출</button>
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