import React, { useState } from 'react';
import './AiPage.css';
import api from '../api/axiosSetting'; // axios 설정 파일 경로 확인
import { FaUtensils, FaCoffee, FaLandmark, FaMapMarkerAlt, FaCalendarAlt, FaPlus } from 'react-icons/fa';

const AIPage = () => {
  const [isSettingsComplete, setIsSettingsComplete] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  // 모달 관련 상태
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  // 지역 데이터
  const locationData = {
    "강원도": ["강릉시", "속초시", "양양군"],
    "제주도": ["제주시", "서귀포시"],
    "부산광역시": ["해운대구", "광안리", "남포동"]
  };

  const [selectedCity, setSelectedCity] = useState("강원도");
  const [selectedDistrict, setSelectedDistrict] = useState("강릉시");

  const [myMbti, setMyMbti] = useState("ENFP");
  const [partnerMbti, setPartnerMbti] = useState("none");
  const [people, setPeople] = useState(1);
  
  // [수정] 여행 기간 초기값을 "1박 2일"로 설정
  const [duration, setDuration] = useState("1박 2일");
  const [dailyBudget, setDailyBudget] = useState("");

  const [aiRecommendedSets, setAiRecommendedSets] = useState([]);

  // Fallback 데이터
  const fallbackSets = [
    {
      id: 'set1',
      day: '1일차',
      memos: [
        { 
          id: 'm1', time: '10:00 AM', category: 'CAFE',
          title: '안목해변 카페거리', 
          desc: '바다 뷰 카페를 중심으로 가볍게 산책해요.',
          address: '강원 강릉시 창해로14번길 20-1',
          reason: 'ENFP의 감성을 자극하는 탁 트인 바다 뷰입니다.',
          tags: ['오션뷰', '커피', '산책']
        },
        { 
          id: 'm2', time: '12:30 PM', category: 'RESTAURANT',
          title: '강릉 중앙시장 먹거리', 
          desc: '시장 투어로 점심과 간식을 해결해요.',
          address: '강원 강릉시 금성로 21',
          reason: '활기찬 분위기에서 다양한 먹거리를 즐길 수 있어요.',
          tags: ['시장투어', '먹방', '활기찬']
        },
      ]
    }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'RESTAURANT': return <FaUtensils />;
      case 'CAFE': return <FaCoffee />;
      case 'SIGHTSEEING': return <FaLandmark />;
      default: return <FaMapMarkerAlt />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'RESTAURANT': return '#ff7e67';
      case 'CAFE': return '#b08d55';
      case 'SIGHTSEEING': return '#6c5ce7';
      default: return '#888';
    }
  };

  const openSaveModal = () => {
    const targetSets = aiRecommendedSets.length > 0 ? aiRecommendedSets : fallbackSets;
    if (!targetSets || targetSets.length === 0) {
      alert("저장할 AI 추천 일정이 없습니다.");
      return;
    }
    setSaveTitle(`${selectedCity} ${selectedDistrict} AI 여행`);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!saveTitle.trim()) {
        alert("제목을 입력해야 합니다.");
        return;
    }

    const targetSets = aiRecommendedSets.length > 0 ? aiRecommendedSets : fallbackSets;
    const details = [];
    
    targetSets.forEach((daySet, index) => {
      const currentDay = index + 1;
      daySet.memos.forEach((memo) => {
        details.push({
          day: currentDay,
          time: memo.time,
          title: memo.title,
          address: memo.address || "주소 정보 없음",
          category: memo.category || "ETC"
        });
      });
    });

    const payload = {
      userIdx: 1, 
      title: saveTitle,
      details: details
    };

    try {
      const res = await api.post("/plans/save", payload);
      if (res.status === 200) {
        alert(`✅ [${saveTitle}] 일정이 저장되었습니다!`);
        setIsSaveModalOpen(false); 
      }
    } catch (e) {
      console.error("저장 에러:", e);
      alert("일정 저장 중 오류가 발생했습니다.");
    }
  };

  const fetchAiPlan = async (extraMessage = "") => {
    setIsLoading(true);

    const budgetNumber = Number(String(dailyBudget ?? "").replace(/[^\d]/g, ""));
    const normalizedPartnerMbti = partnerMbti === "none" ? null : partnerMbti === "SAME" ? myMbti : partnerMbti;

    // [수정] 3가지 옵션에 맞춰 durationMap 조정
    const durationMap = {
      "1박 2일": "ONE_NIGHT_TWO_DAYS",
      "2박 3일": "TWO_NIGHTS_THREE_DAYS",
      "3박 4일": "THREE_NIGHTS_PLUS",
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
      const res = await api.post("/ai/plan", payload, { timeout: 90000 });

      if (res?.data?.sets && Array.isArray(res.data.sets)) {
        setAiRecommendedSets(res.data.sets);
      } else {
        setAiRecommendedSets(fallbackSets);
      }
    } catch (err) {
      console.error("AI 추천 실패:", err);
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

      <main className="ai-container wide-container" style={ isSettingsComplete ? { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '95%', maxWidth: '1600px', margin: '0 auto', paddingBottom: '120px' } : {} }>
        {!isSettingsComplete ? (
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
                    <option value="ISTJ">ISTJ - 청렴결백한 논리주의자</option>
                    <option value="ISFJ">ISFJ - 용감한 수호자</option>
                    <option value="INFJ">INFJ - 통찰력 있는 선지자</option>
                    <option value="INTJ">INTJ - 용의주도한 전략가</option>
                    <option value="ISTP">ISTP - 만능 재주꾼</option>
                    <option value="ISFP">ISFP - 호기심 많은 예술가</option>
                    <option value="INFP">INFP - 열정적인 중재자</option>
                    <option value="INTP">INTP - 논리적인 사색가</option>
                    <option value="ESTP">ESTP - 모험을 즐기는 사업가</option>
                    <option value="ESFP">ESFP - 자유로운 영혼의 연예인</option>
                    <option value="ENFP">ENFP - 재기발랄한 활동가</option>
                    <option value="ENTP">ENTP - 논쟁을 즐기는 변론가</option>
                    <option value="ESTJ">ESTJ - 엄격한 관리자</option>
                    <option value="ESFJ">ESFJ - 사교적인 외교관</option>
                    <option value="ENFJ">ENFJ - 정의로운 사회운동가</option>
                    <option value="ENTJ">ENTJ - 대담한 통솔자</option>
                  </select>
                </div>

                <div className="setting-card">
                  <label>👥 동행자 MBTI</label>
                  <select value={partnerMbti} onChange={(e) => setPartnerMbti(e.target.value)}>
                    <option value="none">없음 (혼자 여행)</option>
                    <option value="SAME">나와 같음</option>
                    <option value="ISTJ">ISTJ</option>
                    <option value="ISFJ">ISFJ</option>
                    <option value="INFJ">INFJ</option>
                    <option value="INTJ">INTJ</option>
                    <option value="ISTP">ISTP</option>
                    <option value="ISFP">ISFP</option>
                    <option value="INFP">INFP</option>
                    <option value="INTP">INTP</option>
                    <option value="ESTP">ESTP</option>
                    <option value="ESFP">ESFP</option>
                    <option value="ENFP">ENFP</option>
                    <option value="ENTP">ENTP</option>
                    <option value="ESTJ">ESTJ</option>
                    <option value="ESFJ">ESFJ</option>
                    <option value="ENFJ">ENFJ</option>
                    <option value="ENTJ">ENTJ</option>
                  </select>
                </div>

                <div className="setting-card">
                  <label>📍 여행 위치</label>
                  <select value={selectedCity} onChange={(e) => {
                      setSelectedCity(e.target.value);
                      if (locationData[e.target.value]) {
                        setSelectedDistrict(locationData[e.target.value][0]);
                      }
                    }}>
                    {Object.keys(locationData).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-card">
                  <label>📍 상세 지역</label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
                    {locationData[selectedCity] && locationData[selectedCity].map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div className="setting-card">
                  <label>👨‍👩‍👧‍👦 인원</label>
                  <input type="number" min="1" value={people} onChange={(e) => setPeople(Number(e.target.value))} />
                </div>

                {/* [수정] 여행 기간 옵션을 3개로 제한 */}
                <div className="setting-card">
                  <label>📅 여행 기간</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="1박 2일">1박 2일</option>
                    <option value="2박 3일">2박 3일</option>
                    <option value="3박 4일">3박 4일</option>
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
          <div className="chat-phase fade-in" style={{ width: '100%' }}>
            
            <div className="result-control-bar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <button 
                  className="reset-btn" 
                  onClick={onEditSettings}
                  style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight:'bold' }}
                >
                  ← 설정 다시하기
                </button>
                
                <button 
                  className="save-schedule-btn" 
                  style={{ background: '#5D5FEF', color:'white', padding: '10px 20px', borderRadius:'20px', border:'none', cursor:'pointer', fontWeight:'bold', boxShadow:'0 4px 10px rgba(93,95,239,0.3)' }} 
                  onClick={openSaveModal}
                >
                    AI 풀코스 저장하기 💾
                </button>
            </div>

            <div className="notepad-layout-expanded" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div className="recommendation-scroll-area" style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  width: '100%',
                  justifyContent: 'center', 
                  alignItems: 'flex-start' 
              }}>
                {(aiRecommendedSets.length ? aiRecommendedSets : fallbackSets).map((set, setIdx) => (
                  <div key={set.id} className="day-column" style={{ 
                      flex: 1, 
                      minWidth: '0', 
                      background: '#fff', 
                      padding: '25px', 
                      borderRadius: '20px', 
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                  }}>
                    <div className="day-column-header" style={{ marginBottom: '25px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                      <h4 style={{ fontSize: '1.3rem', margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCalendarAlt style={{color:'#5D5FEF'}}/> {setIdx + 1}일차
                      </h4>
                    </div>

                    <div className="day-timeline">
                      {set.memos.map((memo, mIdx) => {
                        const color = getCategoryColor(memo.category);
                        return (
                          <div
                            key={memo.id}
                            className="timeline-item"
                            style={{ display: 'flex', gap: '15px', marginBottom: '20px', position: 'relative' }}
                          >
                            {mIdx !== set.memos.length - 1 && (
                              <div style={{ position: 'absolute', left: '20px', top: '45px', bottom: '-25px', width: '2px', background: '#e0e0e0' }}></div>
                            )}

                            <div className="timeline-marker" style={{ 
                                width: '40px', height: '40px', borderRadius: '50%', 
                                backgroundColor: color, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                flexShrink: 0, zIndex: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                              <span className="category-icon" style={{ color: '#fff', fontSize: '1.2rem' }}>
                                {getCategoryIcon(memo.category)}
                              </span>
                            </div>
                            
                            <div className="timeline-content" style={{ flex: 1, background: '#f8f9fa', padding: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
                              <div className="time-badge" style={{ display:'inline-block', padding:'3px 8px', background:'#eee', borderRadius:'6px', fontSize: '0.8rem', color: '#555', marginBottom: '6px', fontWeight: 'bold' }}>
                                ⏰ {memo.time}
                              </div>
                              <h4 className="place-title" style={{ margin: '4px 0 6px 0', fontSize: '1.1rem', color: '#222' }}>{memo.title}</h4>
                              
                              {memo.address && (
                                <p className="place-address" style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 8px 0', display:'flex', alignItems:'center', gap:'4px' }}>
                                  <FaMapMarkerAlt size={12} color="#888"/> {memo.address}
                                </p>
                              )}
                              
                              <p className="place-desc" style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.5', margin: 0 }}>
                                {memo.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gemini-search-container" style={{ 
                position: 'fixed', 
                bottom: '40px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                width: '90%', 
                maxWidth: '1600px',
                zIndex: 100 
            }}>
               <div className="gemini-search-box" style={{ 
                   background: '#fff', 
                   padding: '12px 25px', 
                   borderRadius: '50px', 
                   boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '15px',
                   border: '1px solid #eee'
               }}>
                 <span className="sparkle-icon" style={{ fontSize: '1.5rem' }}>✨</span>
                 <input 
                   type="text" 
                   placeholder="AI에게 수정 요청하기 (예: 점심 메뉴를 파스타로 바꿔줘)" 
                   value={chatInput} 
                   onChange={e=>setChatInput(e.target.value)} 
                   onKeyDown={e=>{if(e.key==='Enter')onSendChat()}} 
                   disabled={isLoading}
                   style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1.1rem', background:'transparent' }}
                 />
                 <button className="send-btn" onClick={onSendChat} disabled={isLoading} style={{ background: '#5D5FEF', color: 'white', borderRadius: '50%', width: '45px', height: '45px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize:'1.2rem', transition:'transform 0.2s' }}>
                   ➤
                 </button>
               </div>
            </div>

            {isSaveModalOpen && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: '#fff', padding: '30px', borderRadius: '15px',
                  width: '400px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                  display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>여행 계획 저장하기</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>나만의 여행 계획 이름을 정해주세요.</p>
                  
                  <input 
                    type="text" 
                    value={saveTitle} 
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder="예: 강릉 힐링 여행"
                    style={{
                      padding: '12px', border: '1px solid #ddd', borderRadius: '8px',
                      fontSize: '1rem', outline: 'none'
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => setIsSaveModalOpen(false)}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                        backgroundColor: '#f0f0f0', cursor: 'pointer', fontWeight: 'bold', color: '#555'
                      }}
                    >
                      취소
                    </button>
                    <button 
                      onClick={handleConfirmSave}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                        backgroundColor: '#5D5FEF', cursor: 'pointer', fontWeight: 'bold', color: '#fff'
                      }}
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default AIPage;