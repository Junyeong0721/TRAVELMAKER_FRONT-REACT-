import React, { useState } from 'react';
import './AIPage.css';

const AIPage = () => {
  // 설정 완료 여부 상태
  const [isSettingsComplete, setIsSettingsComplete] = useState(false);
  const [chatInput, setChatInput] = useState("");

  // 1단계 프리뷰 데이터
  const previewDestinations = [
    { id: 1, title: '제주도 애월 해안산책로', match: 98, tags: ['#오션뷰', '#자연'], img: 'jeju.jpg' },
    { id: 2, title: '도쿄 시부야 스카이', match: 95, tags: ['#도시야경', '#랜드마크'], img: 'tokyo.jpg' },
    { id: 3, title: '치앙마이 올드타운', match: 92, tags: ['#문화유산', '#카페'], img: 'chiangmai.jpg' },
  ];

  // 2단계 메모장 데이터
  const aiMemos = [
    { id: 'm1', time: '10:00 AM', title: '📍 애월 카페거리 산책', desc: '바다 전망이 보이는 카페에서 여유로운 오전 시간을 보냅니다.' },
    { id: 'm2', time: '12:30 PM', title: '🍴 현지 맛집: 해물 라면', desc: '신선한 해산물이 가득한 제주식 라면으로 점심 식사를 합니다.' },
    { id: 'm3', time: '03:00 PM', title: '📸 한담 해안산책로 코스', desc: '에메랄드빛 바다를 배경으로 인생샷을 남길 수 있는 산책로입니다.' },
  ];

  return (
    <div className="ai-page-wrapper">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">TripMate <small>AI Travel</small></h1>
          <nav className="header-nav">
            <span>홈</span><span className="active">AI 추천</span><span>여행지</span><span>커뮤니티</span><span>마이페이지</span>
          </nav>
          <div className="header-right">
            <span>🌙</span>
            <div className="profile-circle"></div>
            <span className="user-name">김여행</span>
          </div>
        </div>
      </header>

      <main className="ai-container">
        {!isSettingsComplete ? (
          /* ---------------- [1단계: 이전의 좋았던 설정 전 디자인] ---------------- */
          <div className="setup-phase fade-in">
            <section className="intro-section">
              <div className="title-box">
                <span className="icon-robot">🤖</span>
                <h2>AI 맞춤 여행 설계</h2>
                <p>당신의 취향을 분석하여 완벽한 여행 계획을 제안합니다.</p>
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-grid">
                <div className="setting-card">
                  <label>🧬 나의 MBTI</label>
                  <select defaultValue="ENFP">
                    <option value="ENFP">ENFP - 재기발랄한 활동가</option>
                    <option value="INTJ">INTJ - 용의주도한 전략가</option>
                  </select>
                </div>
                <div className="setting-card">
                  <label>📍 여행 위치</label>
                  <input type="text" placeholder="어디로 가시나요?" />
                </div>
                <div className="setting-card">
                  <label>👥 동행 인원</label>
                  <input type="number" placeholder="명" min="1" />
                </div>
                <div className="setting-card">
                  <label>📅 여행 기간</label>
                  <select>
                    <option>당일치기</option>
                    <option>1박 2일</option>
                    <option>2박 3일</option>
                    <option>3박 4일 이상</option>
                  </select>
                </div>
                <div className="setting-card full-width">
                  <label>💰 예상 경비</label>
                  <input type="text" placeholder="예: 50만원" />
                </div>
              </div>
              <button className="complete-btn" onClick={() => setIsSettingsComplete(true)}>
                여행 설정 완료 및 추천받기 ✨
              </button>
            </section>

            <section className="preview-section">
              <h3>✨ 오늘의 추천 여행지</h3>
              <div className="dest-grid-preview">
                {previewDestinations.map(dest => (
                  <div key={dest.id} className="preview-card">
                    <div className="preview-img-box">
                      <span className="match-tag">{dest.match}% 매칭</span>
                    </div>
                    <div className="preview-info">
                      <h4>{dest.title}</h4>
                      <div className="tag-group">
                        {dest.tags.map(tag => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* ---------------- [2단계: 메모장 + 제미나이 검색바 디자인 (유지)] ---------------- */
          <div className="chat-phase fade-in">
            <div className="notepad-layout">
              {/* 왼쪽: AI 추천 메모장 */}
              <section className="ai-memo-area">
                <div className="notepad-header">
                  <span className="ai-status">✨ AI가 작성한 추천 일정</span>
                </div>
                <div className="notepad-content">
                  {aiMemos.map(memo => (
                    <div key={memo.id} className="memo-item">
                      <div className="memo-pin">📌</div>
                      <div className="memo-body">
                        <span className="memo-time">{memo.time}</span>
                        <h4 className="memo-title">{memo.title}</h4>
                        <p className="memo-desc">{memo.desc}</p>
                      </div>
                      <button className="memo-add-btn">가져오기</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 오른쪽: 나의 일정 계획장 (더 크게) */}
              <aside className="my-planner-area">
                <div className="notepad-header planner-header">
                  <h4>📝 나의 여행 계획장</h4>
                  <button className="reset-btn" onClick={() => setIsSettingsComplete(false)}>설정 수정</button>
                </div>
                <div className="notepad-content planner-drop-zone">
                  <div className="empty-planner-msg">
                    <p>원하는 일정을 이쪽으로 가져와서<br/>나만의 여행을 완성하세요.</p>
                  </div>
                </div>
                <div className="planner-footer-btns">
                  <button className="save-schedule-btn">일정 저장하기 ➔</button>
                </div>
              </aside>
            </div>

            {/* 하단 제미나이 스타일 검색바 */}
            <div className="gemini-search-container">
              <div className="gemini-search-box">
                <span className="sparkle-icon">✨</span>
                <input 
                  type="text" 
                  placeholder="추가하고 싶은 장소나 수정하고 싶은 내용을 입력하세요..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button className="send-btn">➤</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIPage;