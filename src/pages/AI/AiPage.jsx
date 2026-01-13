import React, { useState } from 'react';
import './AIPage.css';

const AIPage = () => {
  const [isSettingsComplete, setIsSettingsComplete] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  // 나의 일정 계획장에 담긴 아이템들을 관리하는 상태
  const [mySchedule, setMySchedule] = useState([]);

  const locationData = {
    "강원도": ["강릉시"]
  };

  const [selectedCity, setSelectedCity] = useState("강원도");
  const [selectedDistrict, setSelectedDistrict] = useState("강릉시");

  const previewDestinations = [
    { id: 1, title: '제주도 애월 해안산책로', match: 98, tags: ['#오션뷰', '#자연'], img: 'jeju.jpg' },
    { id: 2, title: '도쿄 시부야 스카이', match: 95, tags: ['#도시야경', '#랜드마크'], img: 'tokyo.jpg' },
    { id: 3, title: '치앙마이 올드타운', match: 92, tags: ['#문화유산', '#카페'], img: 'chiangmai.jpg' },
  ];

  // 3개의 추천 일정 세트 데이터
  const aiRecommendedSets = [
    {
      id: 'set1',
      day: '1일차: 감성 카페 투어',
      memos: [
        { id: 'm1', time: '10:00 AM', title: '📍 애월 카페거리 산책', desc: '바다 전망이 보이는 카페에서 여유로운 오전 시간을 보냅니다.' },
        { id: 'm2', time: '12:30 PM', title: '🍴 현지 맛집: 해물 라면', desc: '신선한 해산물이 가득한 제주식 라면으로 점심 식사를 합니다.' },
        { id: 'm3', time: '03:00 PM', title: '📸 한담 해안산책로 코스', desc: '에메랄드빛 바다를 배경으로 인생샷을 남길 수 있는 산책로입니다.' },
      ]
    },
    {
      id: 'set2',
      day: '2일차: 자연 속 힐링',
      memos: [
        { id: 'm4', time: '10:00 AM', title: '🌲 사려니숲길', desc: '울창한 삼나무 숲길을 걸으며 피톤치드를 만끽합니다.' },
        { id: 'm5', time: '01:00 PM', title: '🍱 로컬 도시락 피크닉', desc: '숲 근처 정자에서 즐기는 소박한 로컬 도시락 시간.' },
      ]
    },
    {
      id: 'set3',
      day: '3일차: 액티비티 데이',
      memos: [
        { id: 'm6', time: '11:00 AM', title: '🏄‍♂️ 서핑 원데이 클래스', desc: '제주 바다에서 즐기는 시원한 서핑 체험입니다.' },
        { id: 'm7', time: '04:00 PM', title: '🛀 오션뷰 스파', desc: '지친 몸을 달래주는 바다 전망의 스파 타임.' },
      ]
    }
  ];

  // --- 핸들러 함수들 ---

  // 개별 아이템 가져오기
  const handleImportItem = (item) => {
    if (!mySchedule.find(m => m.id === item.id)) {
      setMySchedule([...mySchedule, item]);
    }
  };

  // 세트 전체 가져오기
  const handleImportSet = (memos) => {
    const newItems = memos.filter(memo => !mySchedule.find(m => m.id === memo.id));
    setMySchedule([...mySchedule, ...newItems]);
  };

  // 드래그 시작 시 호출
  const onDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  // 드롭 타겟 위에 있을 때 (필수)
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // 드롭했을 때 호출
  const onDrop = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData("item"));
    handleImportItem(itemData);
  };

  return (
    <div className="ai-page-wrapper">
      {/* 헤더 부분 생략 (동일) */}
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

      <main className="ai-container wide-container">
        {!isSettingsComplete ? (
          /* 1단계 설정 디자인 생략 (동일하게 유지) */
          <div className="setup-phase fade-in">
             <section className="intro-section">
               <div className="title-box">
                 <span className="icon-robot">🤖</span>
                 <h2>AI 맞춤 여행 설계</h2>
                 <p>당신의 취향과 동행자를 분석하여 완벽한 여행 계획을 제안합니다.</p>
               </div>
             </section>
             <section className="settings-section">
               <div className="settings-grid">
                 <div className="setting-card">
                   <label>🧬 나의 MBTI</label>
                   <select defaultValue="ENFP">
                     <option value="ENFP">ENFP - 재기발랄한 활동가</option>
                     <option value="INTJ">INTJ - 용의주도한 전략가</option>
                     <option value="ISTJ">ISTJ - 청렴결백한 논리주의자</option>
                   </select>
                 </div>
                 <div className="setting-card">
                   <label>👥 동행자 MBTI</label>
                   <select defaultValue="none">
                     <option value="none">없음 (혼자 여행)</option>
                     <option value="ENFP">ENFP</option>
                     <option value="INTJ">INTJ</option>
                     <option value="SAME">나와 같음</option>
                   </select>
                 </div>
                 <div className="setting-card">
                   <label>📍 여행 위치 (도/시)</label>
                   <select 
                     value={selectedCity} 
                     onChange={(e) => {
                       setSelectedCity(e.target.value);
                       setSelectedDistrict(locationData[e.target.value][0]);
                     }}
                   >
                     {Object.keys(locationData).map(city => (
                       <option key={city} value={city}>{city}</option>
                     ))}
                   </select>
                 </div>
                 <div className="setting-card">
                   <label>📍 상세 지역</label>
                   <select 
                     value={selectedDistrict} 
                     onChange={(e) => setSelectedDistrict(e.target.value)}
                   >
                     {locationData[selectedCity].map(dist => (
                       <option key={dist} value={dist}>{dist}</option>
                     ))}
                   </select>
                 </div>
                 <div className="setting-card">
                   <label>👨‍👩‍👧‍👦 인원</label>
                   <input type="number" placeholder="명" min="1" defaultValue="1" />
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
                   <label>💰 1일 예상 경비 (1인 기준)</label>
                   <input type="text" placeholder="예: 10만원" />
                 </div>
               </div>
               <button className="complete-btn" onClick={() => setIsSettingsComplete(true)}>
                 여행 설정 완료 및 추천받기 ✨
               </button>
             </section>
           </div>
        ) : (
          <div className="chat-phase fade-in">
            <div className="notepad-layout-expanded">
              {/* 왼쪽: 3개의 AI 추천 메모장 세트 */}
              <div className="recommendation-scroll-area">
                {aiRecommendedSets.map((set) => (
                  <section key={set.id} className="ai-memo-area compact">
                    <div className="notepad-header">
                      <span className="ai-status">✨ {set.day}</span>
                      <button className="import-all-btn" onClick={() => handleImportSet(set.memos)}>전체 가져오기</button>
                    </div>
                    <div className="notepad-content">
                      {set.memos.map(memo => (
                        <div 
                          key={memo.id} 
                          className="memo-item draggable"
                          draggable
                          onDragStart={(e) => onDragStart(e, memo)}
                        >
                          <div className="memo-pin">📌</div>
                          <div className="memo-body">
                            <span className="memo-time">{memo.time}</span>
                            <h4 className="memo-title">{memo.title}</h4>
                            <p className="memo-desc">{memo.desc}</p>
                          </div>
                          <button className="memo-add-btn" onClick={() => handleImportItem(memo)}>가져오기</button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* 오른쪽: 나의 일정 계획장 */}
              <aside 
                className="my-planner-area"
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                <div className="notepad-header planner-header">
                  <h4>📝 나의 여행 계획장</h4>
                  <button className="reset-btn" onClick={() => setIsSettingsComplete(false)}>설정 수정</button>
                </div>
                <div className="notepad-content planner-drop-zone">
                  {mySchedule.length === 0 ? (
                    <div className="empty-planner-msg">
                      <p>원하는 일정을 이쪽으로 가져와서<br/>나만의 여행을 완성하세요.</p>
                      <small>(드래그하거나 '가져오기' 버튼 클릭)</small>
                    </div>
                  ) : (
                    mySchedule.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="memo-item planner-item">
                        <div className="memo-body">
                          <span className="memo-time">{item.time}</span>
                          <h4 className="memo-title">{item.title}</h4>
                        </div>
                        <button 
                          className="remove-btn" 
                          onClick={() => setMySchedule(mySchedule.filter((_, i) => i !== idx))}
                        >✕</button>
                      </div>
                    ))
                  )}
                </div>
                <div className="planner-footer-btns">
                  <button className="save-schedule-btn">일정 저장하기 ➔</button>
                </div>
              </aside>
            </div>

            {/* 하단 제미나이 스타일 검색바 (동일) */}
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