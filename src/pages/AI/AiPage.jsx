import React, { useState } from 'react';
import './AiPage.css';
import api from '../api/axiosSetting'; // axios 설정 파일 경로 확인

const AIPage = () => {
  const [isSettingsComplete, setIsSettingsComplete] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [initialMessage, setInitialMessage] = useState("");
  const [mySchedule, setMySchedule] = useState([]);

  // 지역 데이터
  const locationData = {
    "강원도": ["강릉시"]
  };

  const [selectedCity, setSelectedCity] = useState("강원도");
  const [selectedDistrict, setSelectedDistrict] = useState("강릉시");

  const [myMbti, setMyMbti] = useState("ENFP");
  const [partnerMbti, setPartnerMbti] = useState("none");
  const [people, setPeople] = useState(1);
  const [duration, setDuration] = useState("당일치기");
  const [dailyBudget, setDailyBudget] = useState("");

  const [aiRecommendedSets, setAiRecommendedSets] = useState([]);

  // Fallback 데이터
  const fallbackSets = [
    {
      id: 'set1',
      day: '1일차: 감성 카페 투어 (예시)',
      memos: [
        { 
          id: 'm1', time: '10:00 AM', category: 'CAFE',
          title: '📍 안목해변 카페거리', 
          desc: '바다 뷰 카페를 중심으로 가볍게 산책해요.',
          address: '강원 강릉시 창해로14번길 20-1',
          reason: 'ENFP의 감성을 자극하는 탁 트인 바다 뷰입니다.',
          tags: ['오션뷰', '커피', '산책']
        },
        { 
          id: 'm2', time: '12:30 PM', category: 'RESTAURANT',
          title: '🍴 강릉 중앙시장 먹거리', 
          desc: '시장 투어로 점심과 간식을 해결해요.',
          address: '강원 강릉시 금성로 21',
          reason: '활기찬 분위기에서 다양한 먹거리를 즐길 수 있어요.',
          tags: ['시장투어', '먹방', '활기찬']
        },
      ]
    },
    {
      id: 'set2',
      day: '2일차: 바다/산책 힐링 (예시)',
      memos: [
        { 
          id: 'm3', time: '09:30 AM', category: 'SIGHTSEEING',
          title: '🌊 경포호 산책', 
          desc: '호수 주변을 천천히 걸으며 힐링해요.',
          address: '강원 강릉시 경포로 365',
          reason: '복잡한 생각을 정리하기 좋은 평화로운 곳입니다.',
          tags: ['힐링', '자전거', '호수']
        },
      ]
    }
  ];

  // 카테고리 스타일 헬퍼
  const getCategoryInfo = (category) => {
    switch (category) {
      case 'RESTAURANT': return { label: '🍚 식당', color: '#ff7e67', bg: '#fff0ec' };
      case 'CAFE': return { label: '☕ 카페', color: '#b08d55', bg: '#f7f3eb' };
      case 'SIGHTSEEING': return { label: '🎡 관광', color: '#6c5ce7', bg: '#f0f0ff' };
      default: return { label: '📍 장소', color: '#888', bg: '#f5f5f5' };
    }
  };

  // --- 핸들러 ---
  const handleImportItem = (item) => {
    // 중복 체크
    if (!mySchedule.find(m => m.id === item.id)) {
      setMySchedule([...mySchedule, item]);
    }
  };

  const handleImportSet = (memos) => {
    const newItems = memos.filter(memo => !mySchedule.find(m => m.id === memo.id));
    setMySchedule([...mySchedule, ...newItems]);
  };

  const onDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const onDragOver = (e) => { e.preventDefault(); };

  const onDrop = (e) => {
    e.preventDefault();
    const itemData = JSON.parse(e.dataTransfer.getData("item"));
    handleImportItem(itemData);
  };

  // ---------------------------------------------------------
  // [기능 1] AI 전체 일정 저장 (왼쪽 리스트 전체)
  // ---------------------------------------------------------
  const handleSaveAllAI = async () => {
    // 사용할 데이터 결정 (API 결과가 없으면 Fallback 데이터 사용)
    const targetSets = aiRecommendedSets.length > 0 ? aiRecommendedSets : fallbackSets;

    if (!targetSets || targetSets.length === 0) {
      alert("저장할 AI 추천 일정이 없습니다.");
      return;
    }

    if (!window.confirm("AI가 추천한 모든 일정을 DB에 저장하시겠습니까?")) return;

    // 데이터 가공 (Flatten)
    const details = [];
    targetSets.forEach((daySet, index) => {
      const currentDay = index + 1; // 1일차, 2일차...
      
      daySet.memos.forEach((memo) => {
        details.push({
          day: currentDay,
          time: memo.time,
          title: memo.title,    // 장소명
          address: memo.address || "주소 정보 없음", // 주소 null 방지
          category: memo.category || "ETC"
        });
      });
    });

    const payload = {
      userIdx: 1, // ★ 실제 로그인한 유저 ID로 변경 필요
      title: `${selectedCity} ${selectedDistrict} AI 풀코스 여행`,
      details: details
    };

    try {
      const res = await api.post("/plans/save", payload);
      if (res.status === 200) {
        alert("✅ AI 전체 일정이 저장되었습니다!");
      }
    } catch (e) {
      console.error("저장 에러:", e);
      alert("일정 저장 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------------------
  // [기능 2] 나만의 일정 저장 (오른쪽 리스트)
  // ---------------------------------------------------------
  const handleSaveMyPlan = async () => {
    if (mySchedule.length === 0) {
      alert("저장할 일정이 없습니다. 일정을 오른쪽으로 옮겨주세요!");
      return;
    }

    if (!window.confirm("내가 선택한 일정을 저장하시겠습니까?")) return;

    // 오른쪽 리스트는 '몇 일차' 정보가 섞여있거나 없을 수 있음.
    // 여기서는 단순히 순서대로 저장하거나, 원본 데이터의 날짜를 추정해야 함.
    // 일단 모두 '1일차' 또는 '선택한 일정'으로 저장한다고 가정.
    const details = mySchedule.map((item) => ({
      day: 1, // 사용자가 드래그한건 일단 1일차로 퉁치거나, 별도 날짜 선택 로직 필요
      time: item.time,
      title: item.title,
      address: item.address || "주소 정보 없음",
      category: item.category || "ETC"
    }));

    const payload = {
      userIdx: 1, // ★ 실제 로그인한 유저 ID로 변경 필요
      title: "내가 직접 만든 강릉 여행",
      details: details
    };

    try {
      const res = await api.post("/plans/save", payload);
      if (res.status === 200) {
        alert("✅ 나만의 일정이 저장되었습니다!");
      }
    } catch (e) {
      console.error("저장 에러:", e);
      alert("일정 저장 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------------------
  // AI 추천 요청
  // ---------------------------------------------------------
  const fetchAiPlan = async (extraMessage = "") => {
    setIsLoading(true);

    const budgetNumber = Number(String(dailyBudget ?? "").replace(/[^\d]/g, ""));
    const normalizedPartnerMbti = partnerMbti === "none" ? null : partnerMbti === "SAME" ? myMbti : partnerMbti;

    const durationMap = {
      "당일치기": "DAY_TRIP",
      "1박 2일": "ONE_NIGHT_TWO_DAYS",
      "2박 3일": "TWO_NIGHTS_THREE_DAYS",
      "3박 4일 이상": "THREE_NIGHTS_PLUS",
    };

    const payload = {
      city: selectedCity,
      district: selectedDistrict,
      myMbti,
      partnerMbti: normalizedPartnerMbti,
      people: Number(people),
      duration: durationMap[duration] ?? duration,
      dailyBudget: Number.isNaN(budgetNumber) ? 0 : budgetNumber,
      message: extraMessage ? extraMessage : initialMessage, 
    };

    try {
      // 타임아웃 넉넉하게 설정
      const res = await api.post("/ai/plan", payload, { timeout: 90000 });

      if (res?.data?.sets && Array.isArray(res.data.sets)) {
        setAiRecommendedSets(res.data.sets);
      } else {
        setAiRecommendedSets(fallbackSets);
      }
    } catch (err) {
      console.error("AI 추천 실패:", err);
      // 실패 시 fallback 데이터 보여줌 (테스트용)
      setAiRecommendedSets(fallbackSets);
    } finally {
      setIsLoading(false);
    }
  };

  const onCompleteSettings = async () => {
    if (!myMbti) return;
    await fetchAiPlan(""); 
    setIsSettingsComplete(true);
  };

  const onEditSettings = () => {
    setIsSettingsComplete(false);
    setChatInput("");
    setMySchedule([]);
  };

  const onSendChat = async () => {
    if (!chatInput.trim()) return;
    await fetchAiPlan(chatInput.trim());
    setChatInput("");
  };

  return (
    <div className="ai-page-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner">🤖</div>
          <p>AI가 엑셀 데이터를 분석해서<br/>완벽한 코스를 짜고 있어요...</p>
        </div>
      )}

      <header className="header">
        <div className="header-inner">
          <h1 className="logo">TripMate <small>AI Travel</small></h1>
          <nav className="header-nav">
            <span>홈</span>
            <span className="active">AI 추천</span>
            <span>여행지</span>
            <span>커뮤니티</span>
            <span>마이페이지</span>
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
          // --- [설정 화면] ---
          <div className="setup-phase fade-in">
            <section className="intro-section">
              <div className="title-box">
                <span className="icon-robot">🤖</span>
                <h2>AI 맞춤 여행 설계</h2>
                <p>당신의 취향과 실제 강릉 맛집 데이터를 기반으로 계획을 제안합니다.</p>
              </div>
            </section>

            <section className="settings-section">
              <div className="settings-grid">
                <div className="setting-card">
                  <label>🧬 나의 MBTI</label>
                  <select value={myMbti} onChange={(e) => setMyMbti(e.target.value)}>
                    <option value="ENFP">ENFP - 재기발랄한 활동가</option>
                    <option value="INTJ">INTJ - 용의주도한 전략가</option>
                    <option value="ISTJ">ISTJ - 청렴결백한 논리주의자</option>
                    <option value="INFP">INFP - 열정적인 중재자</option>
                    <option value="ENTP">ENTP - 논쟁을 즐기는 변론가</option>
                    {/* 필요 시 더 추가 */}
                  </select>
                </div>

                <div className="setting-card">
                  <label>👥 동행자 MBTI</label>
                  <select value={partnerMbti} onChange={(e) => setPartnerMbti(e.target.value)}>
                    <option value="none">없음 (혼자 여행)</option>
                    <option value="SAME">나와 같음</option>
                    <option value="ENFP">ENFP</option>
                    <option value="INTJ">INTJ</option>
                    <option value="ISTJ">ISTJ</option>
                    <option value="INFP">INFP</option>
                    <option value="ENTP">ENTP</option>
                  </select>
                </div>

                <div className="setting-card">
                  <label>📍 여행 위치</label>
                  <select value={selectedCity} onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedDistrict(locationData[e.target.value][0]);
                    }}>
                    {Object.keys(locationData).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-card">
                  <label>📍 상세 지역</label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                    {locationData[selectedCity].map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-card">
                  <label>👨‍👩‍👧‍👦 인원</label>
                  <input type="number" min="1" value={people} onChange={(e) => setPeople(Number(e.target.value))} />
                </div>

                <div className="setting-card">
                  <label>📅 여행 기간</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="당일치기">당일치기</option>
                    <option value="1박 2일">1박 2일</option>
                    <option value="2박 3일">2박 3일</option>
                    <option value="3박 4일 이상">3박 4일 이상</option>
                  </select>
                </div>

                <div className="setting-card full-width">
                  <label>💰 1일 예상 경비 (1인 기준)</label>
                  <input type="text" placeholder="예: 10만원" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value)} />
                </div>

                <div className="setting-card full-width">
                  <label className="sparkle-text">✨ 특별히 원하는 점이 있나요?</label>
                  <div className="initial-message-box">
                    <input 
                      type="text" 
                      placeholder="예: 해산물은 못 먹어요, 사람이 적은 조용한 곳 위주로 추천해줘" 
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button className="complete-btn" onClick={onCompleteSettings} disabled={isLoading}>
                {isLoading ? "생성 중..." : "여행 설정 완료 및 추천받기 ✨"}
              </button>
            </section>
          </div>
        ) : (
          // --- [채팅 및 결과 화면] ---
          <div className="chat-phase fade-in">
            <div className="notepad-layout-expanded">
              {/* 왼쪽: AI 추천 리스트 */}
              <div className="recommendation-scroll-area">
                {(aiRecommendedSets.length ? aiRecommendedSets : fallbackSets).map((set) => (
                  <section key={set.id} className="ai-memo-area compact">
                    <div className="notepad-header">
                      <span className="ai-status">✨ {set.day}</span>
                      <button className="import-all-btn" onClick={() => handleImportSet(set.memos)}>
                        전체 가져오기
                      </button>
                    </div>

                    <div className="notepad-content">
                      {set.memos.map(memo => {
                        const catInfo = getCategoryInfo(memo.category);
                        return (
                          <div
                            key={memo.id}
                            className="memo-item draggable"
                            draggable
                            onDragStart={(e) => onDragStart(e, memo)}
                          >
                            <div className="memo-pin">📌</div>
                            <div className="memo-body">
                              <div className="memo-meta-row">
                                <span className="memo-time">{memo.time}</span>
                                <span className="category-badge" style={{
                                    backgroundColor: catInfo.bg,
                                    color: catInfo.color,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    marginLeft: '8px',
                                    border: `1px solid ${catInfo.color}40`
                                }}>
                                  {catInfo.label}
                                </span>
                              </div>
                              
                              <h4 className="memo-title">{memo.title}</h4>
                              {memo.address && <p className="memo-address">📍 {memo.address}</p>}
                              
                              <p className="memo-desc">{memo.desc}</p>
                              
                              {memo.tags && memo.tags.length > 0 && (
                                <div className="memo-tags">
                                  {memo.tags.map((tag, i) => (
                                    <span key={i} className="tag">#{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button className="memo-add-btn" onClick={() => handleImportItem(memo)}>
                              가져오기
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* 오른쪽: 나의 여행 계획장 */}
              <aside className="my-planner-area" onDragOver={onDragOver} onDrop={onDrop}>
                <div className="notepad-header planner-header">
                  <h4>📝 나의 여행 계획장</h4>
                  <button className="reset-btn" onClick={onEditSettings}>설정 수정</button>
                </div>

                <div className="notepad-content planner-drop-zone">
                  {mySchedule.length === 0 ? (
                    <div className="empty-planner-msg">
                      <p>원하는 일정을 이쪽으로 가져와서<br />나만의 여행을 완성하세요.</p>
                      <small>(드래그하거나 '가져오기' 버튼 클릭)</small>
                    </div>
                  ) : (
                    mySchedule.map((item, idx) => {
                       const catInfo = getCategoryInfo(item.category);
                       return (
                        <div key={`${item.id}-${idx}`} className="memo-item planner-item">
                          <div className="memo-body">
                            <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px'}}>
                              <span className="memo-time">{item.time}</span>
                               <span style={{ fontSize:'0.7rem', color: catInfo.color }}>
                                 {catInfo.label}
                               </span>
                            </div>
                            <h4 className="memo-title">{item.title}</h4>
                            <p className="memo-desc" style={{fontSize:'0.8rem', color:'#888'}}>
                              {item.desc ? item.desc.substring(0, 30) + '...' : ''}
                            </p>
                          </div>
                          <button className="remove-btn" onClick={() => setMySchedule(mySchedule.filter((_, i) => i !== idx))}>
                            ✕
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* 하단 저장 버튼 영역 */}
                <div className="planner-footer-btns" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button 
                    className="save-schedule-btn" 
                    onClick={handleSaveMyPlan}
                    style={{ background: '#1d1d1f' }}
                  >
                    나만의 일정 저장하기 ➔
                  </button>

                  <button 
                    className="save-schedule-btn" 
                    onClick={handleSaveAllAI}
                    style={{ background: '#5D5FEF' }} // AI 전용 색상
                  >
                    AI 풀코스 전체 저장하기 🤖
                  </button>
                </div>
              </aside>
            </div>

            {/* 채팅창 */}
            <div className="gemini-search-container">
              <div className="gemini-search-box">
                <span className="sparkle-icon">✨</span>
                <input
                  type="text"
                  placeholder="예: 저녁은 좀 더 조용한 곳으로 바꿔줘"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSendChat(); }}
                  disabled={isLoading}
                />
                <button className="send-btn" onClick={onSendChat} disabled={isLoading}>
                  {isLoading ? "..." : "➤"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIPage;