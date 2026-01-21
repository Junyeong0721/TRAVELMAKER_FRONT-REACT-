import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api/axiosSetting'; // ★ 경로 확인: src/pages/api/axiosSetting.js
import { FaArrowLeft, FaSave, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaUtensils, FaCoffee, FaLandmark } from 'react-icons/fa';
import './MyPage/MyPage.css'; 

const PlanEditPage = () => {
  const { planIdx } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 데이터 불러오기
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${planIdx}`);
        if (res.data) {
          setTitle(res.data.title);
          // 수정 시 리스트 관리를 위해 originalIndex 추가
          const detailsWithIdx = res.data.details.map((item, idx) => ({ 
            ...item, 
            originalIndex: idx 
          }));
          setDetails(detailsWithIdx);
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        alert("데이터를 불러오지 못했습니다. (백엔드 서버가 켜져있는지 확인해주세요)");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [planIdx]);

  // 2. 입력값 변경 핸들러
  const handleDetailChange = (originalIndex, field, value) => {
    const newDetails = [...details];
    const targetIdx = newDetails.findIndex(item => item.originalIndex === originalIndex);
    
    if(targetIdx !== -1) {
        newDetails[targetIdx][field] = value;
        setDetails(newDetails);
    }
  };

  // 3. 삭제 핸들러
  const handleDeleteDetail = (originalIndex) => {
    if(window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
        setDetails(prev => prev.filter(item => item.originalIndex !== originalIndex));
    }
  };

  // 4. 저장 핸들러
  const handleSave = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");

    // 서버로 보낼 때는 임시로 썼던 originalIndex를 지워줍니다.
    const cleanDetails = details.map(({ originalIndex, ...rest }) => rest);

    const payload = {
      planIdx: Number(planIdx),
      userIdx: 1, // ★ 실제 로그인된 유저 ID가 있다면 교체 필요
      title: title,
      details: cleanDetails
    };

    try {
      await api.put("/plans/update", payload);
      alert("수정 완료! 💾");
      navigate('/my-travels'); // 목록 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("저장 실패: 서버 로그를 확인해주세요.");
    }
  };

  // 아이콘 & 색상 헬퍼 함수
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
      default: return '#888'; // 기본 회색
    }
  };

  // 데이터 그룹화 (day 기준)
  const groupDetailsByDay = (list) => {
    return list.reduce((acc, item) => {
      const d = item.day || 1; 
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    }, {});
  };

  if (isLoading) return <div className="loading-msg">로딩 중...</div>;

  const groupedDetails = groupDetailsByDay(details);
  const dayKeys = Object.keys(groupedDetails).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="mypage-wrapper">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer'}}>
                <FaArrowLeft />
             </button>
             <h1 className="logo" style={{fontSize:'1.4rem', margin:0}}>여행 계획 수정</h1>
          </div>
          <button className="save-btn-header" onClick={handleSave}>
            <FaSave /> 저장 완료
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mypage-container" style={{paddingTop:'30px', paddingBottom:'50px'}}>
        
        {/* 여행 제목 수정 */}
        <div className="edit-title-box">
            <label>여행 제목</label>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="edit-main-title"
            />
        </div>

        {/* 가로 스크롤 영역 */}
        <div className="edit-scroll-container">
            {dayKeys.length === 0 ? (
                <div className="empty-msg">일정이 없습니다.</div>
            ) : (
                dayKeys.map(day => (
                    <div key={day} className="edit-day-column">
                        <div className="edit-day-header">
                            <h4><FaCalendarAlt style={{color:'#5D5FEF', marginRight:'6px'}}/> {day}일차</h4>
                        </div>

                        <div className="edit-day-timeline">
                            {groupedDetails[day].map((item) => {
                                const color = getCategoryColor(item.category);
                                return (
                                    <div key={item.originalIndex} className="timeline-card">
                                        {/* 왼쪽 마커 */}
                                        <div className="timeline-marker-area">
                                            <div className="marker-circle" style={{ borderColor: color, background: '#fff' }}>
                                                <span style={{ color: color, fontSize:'0.7rem' }}>
                                                    {getCategoryIcon(item.category)}
                                                </span>
                                            </div>
                                            <div className="marker-line"></div>
                                        </div>

                                        {/* 오른쪽 내용 (입력폼) */}
                                        <div className="timeline-card-content">
                                            <div className="card-top-row">
                                                {/* 시간 입력 */}
                                                <input 
                                                    type="text"
                                                    className="input-time"
                                                    value={item.time}
                                                    onChange={(e) => handleDetailChange(item.originalIndex, 'time', e.target.value)}
                                                    placeholder="00:00"
                                                />
                                                {/* 일차 이동 (숫자 바꾸면 옆 컬럼으로 감) */}
                                                <div className="day-mover">
                                                    <span className="small-label">Day</span>
                                                    <input 
                                                        type="number"
                                                        className="input-day-num"
                                                        value={item.day}
                                                        onChange={(e) => handleDetailChange(item.originalIndex, 'day', Number(e.target.value))}
                                                    />
                                                </div>
                                                {/* 삭제 버튼 */}
                                                <button 
                                                    className="btn-delete-mini"
                                                    onClick={() => handleDeleteDetail(item.originalIndex)}
                                                    title="일정 삭제"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            {/* 장소명 입력 (크게) */}
                                            <input 
                                                type="text"
                                                className="input-place-title"
                                                value={item.title}
                                                onChange={(e) => handleDetailChange(item.originalIndex, 'title', e.target.value)}
                                                placeholder="장소명 입력"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
};

export default PlanEditPage;