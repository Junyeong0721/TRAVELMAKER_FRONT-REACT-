import React, { useEffect, useState } from 'react';
import './MyPage.css';
import { useNavigate } from 'react-router-dom'; // ★ 페이지 이동 훅
import { getCookie } from '../../js/getToken';
import { MyInfo } from '../api/MyInfo/myinfoService';

const MyPage = () => {
  const [myInfo, setMyInfo] = useState([]);
  const navigate = useNavigate(); // 이동 함수 생성
  const nickname = getCookie('userNickName');
  const mbti = getCookie('userMbti');
  useEffect(() => {
    const token = getCookie('token');
    MyInfo(token)
      .then(res => {
        console.log(res);
        setMyInfo(res.data);
      }).catch(err => {
        console.log("error");
      });
    
  }, []);


  return (
    <div className="mypage-wrapper">

      {/* 메인 컨텐츠 영역 */}
      <main className="mypage-container">
        {/* 페이지 타이틀 */}
        <section className="page-title-area">
          <h2>마이 페이지</h2>
          <p>개인 정보와 여행 선호도를 관리하세요.</p>
        </section>

        {/* 메인 레이아웃 그리드 */}
        <div className="mypage-layout-grid">
          
          {/* 왼쪽 사이드바 */}
          <aside className="mypage-sidebar">
            <div className="profile-summary-card">
              <div className="avatar-section">
              </div>
              <h3>{nickname}</h3>
              <p className="user-email">{myInfo.email}</p>
              <div className="user-badges">
                <span className="badge-mbti">{mbti}</span>
              </div>
              <div className="user-stats-row">
                <div className="stat-box">
                  <span className="stat-val">{myInfo.postsCount}</span>
                  <span className="stat-label">나의 여행</span>
                </div>
              </div>
            </div>

            <nav className="sidebar-menu">
              <div className="menu-item active">👤 내 정보 관리</div>
              <div className="menu-item">🔖 저장된 여행지</div>
              <div className="menu-item">⚙️ AI 맞춤 설정</div>
              <div className="menu-item">🧠 MBTI 분석</div>
              <div className="menu-item">🔖 저장된 여행지</div>
              <div className="menu-item logout">📤 로그아웃</div>
            </nav>
          </aside>

          {/* 오른쪽 상세 설정 폼 */}
          <section className="settings-form-area">
            
            {/* ▼ [수정됨] 심플해진 여행 기록 카드 (바로가기 버튼만 있음) ▼ */}
            <div className="form-card travel-history-card">
              <div className="card-header-row" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <div className="title-with-icon">
                  <span className="title-icon">✈️</span>
                  <div>
                    <h4 style={{ margin: 0 }}>나의 여행 기록</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#888' }}>
                      저장된 AI 추천 여행 코스를 확인하고 관리하세요.
                    </p>
                  </div>
                </div>
                
                {/* 클릭 시 페이지 이동 */}
                <button 
                  onClick={() => navigate('/my-travels')} 
                  className="load-btn"
                >
                  전체 보기 ➔
                </button>
              </div>
            </div>
            {/* ▲ [끝] ▲ */}

            {/* 기본 프로필 카드 */}
            <div className="form-card basic-profile">
              <div className="card-title">
                <span className="title-icon">👤</span>
                <h4>기본 프로필</h4>
              </div>
              <div className="input-grid">
                <div className="input-field">
                  <label>닉네임</label>
                  <input type="text" defaultValue={nickname} />
                </div>
                <div className="input-field">
                  <label>이메일</label>
                  <input type="email" value={myInfo.email} readOnly className="readonly-input" />
                  <span className="helper-text">이메일 변경은 고객센터에 문의해주세요.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mypage-footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default MyPage;