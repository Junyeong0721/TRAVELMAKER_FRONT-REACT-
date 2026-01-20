import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosSetting';
// ★ FaEdit, FaTrash 아이콘 추가
import { FaUtensils, FaCoffee, FaLandmark, FaMapMarkerAlt, FaCalendarAlt, FaPlane, FaArrowLeft, FaChevronDown, FaChevronUp, FaEdit, FaTrash } from 'react-icons/fa';
import './MyPage.css';

// --- 여행 계획 카드 컴포넌트 ---
const TravelPlanCard = ({ plan, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // (기존 헬퍼 함수들 유지...)
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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const groupDetailsByDay = (details) => {
    return details.reduce((acc, item) => {
      const day = item.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});
  };

  const groupedDetails = groupDetailsByDay(plan.details);
  const dayKeys = Object.keys(groupedDetails).sort((a, b) => Number(a) - Number(b));

  return (
    <div className={`travel-plan-card ${isExpanded ? 'expanded' : ''}`}>
      {/* 카드 헤더 클릭 시 펼치기/접기 */}
      <div className="plan-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="plan-title-info">
          <h3><FaPlane style={{ marginRight: '8px', color: '#5D5FEF' }} /> {plan.title}</h3>
          <span className="plan-date">{formatDate(plan.createAt)}</span>
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="header-actions">
          {/* ★ 수정 버튼 */}
          <button 
            className="action-btn edit-btn" 
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 막기 (펼쳐짐 방지)
              onEdit(plan.planIdx);
            }}
            title="수정"
          >
            <FaEdit />
          </button>

          {/* ★ 삭제 버튼 */}
          <button 
            className="action-btn delete-btn" 
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 막기
              onDelete(plan.planIdx);
            }}
            title="삭제"
          >
            <FaTrash />
          </button>

          {/* 펼치기 화살표 */}
          <button className="expand-btn">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* 펼쳐졌을 때 내용 (기존 코드 유지) */}
      {isExpanded && (
        <div className="plan-details-area">
          <div className="daily-schedule-grid">
            {dayKeys.map((day) => (
              <div key={day} className="day-column">
                <div className="day-column-header">
                  <FaCalendarAlt className="day-icon" />
                  <h4>{day}일차</h4>
                </div>
                <div className="day-timeline">
                  {groupedDetails[day].map((item, idx) => {
                    const color = getCategoryColor(item.category);
                    return (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-marker" style={{ backgroundColor: color, borderColor: color }}>
                          <span className="category-icon" style={{ color: '#fff' }}>
                            {getCategoryIcon(item.category)}
                          </span>
                        </div>
                        <div className="timeline-content">
                          <div className="time-badge">{item.time.substring(0, 5)}</div>
                          <h4 className="place-title">{item.title}</h4>
                          {item.address && <p className="place-address">{item.address}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 메인 페이지 컴포넌트 ---
const MyTravelPage = () => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 데이터 불러오기
  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/plans/list/1"); // ★ userIdx
      if (res.data) setSavedPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ★ [기능] 삭제 핸들러
  const handleDelete = async (planIdx) => {
    if (!window.confirm("정말로 이 여행 계획을 삭제하시겠습니까?")) return;

    try {
      // API 호출 (주소 주의: /api/plans/123)
      await api.delete(`/plans/${planIdx}`);
      alert("삭제되었습니다.");
      
      // 목록 갱신 (다시 불러오거나, state에서 제거)
      setSavedPlans(prev => prev.filter(p => p.planIdx !== planIdx));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // ★ [기능] 수정 핸들러 (임시)
  const handleEdit = (planIdx) => {
    // 나중에 수정 페이지로 이동시키거나 모달을 띄우면 됩니다.
    const newTitle = prompt("변경할 여행 제목을 입력하세요:");
    if (newTitle) {
      // 제목 수정 API 호출 로직 추가 가능
      console.log(`계획 ${planIdx} 제목 변경: ${newTitle}`);
      // UI 업데이트 (임시)
      setSavedPlans(prev => prev.map(p => p.planIdx === planIdx ? {...p, title: newTitle} : p));
    }
  };

  return (
    <div className="mypage-wrapper">
      <header className="header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer', color:'#333'}}>
                <FaArrowLeft />
             </button>
             <h1 className="logo" style={{fontSize:'1.4rem', margin:0}}>나의 여행 기록</h1>
          </div>
        </div>
      </header>

      <main className="mypage-container" style={{ paddingTop: '30px' }}>
        {isLoading ? (
            <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>로딩 중...</p>
        ) : savedPlans.length === 0 ? (
            <div className="empty-message">
                <p>아직 저장된 여행 계획이 없습니다.</p>
                <button onClick={() => navigate('/ai')} className="load-btn" style={{marginTop:'15px'}}>
                    AI 추천 받으러 가기
                </button>
            </div>
        ) : (
            <div className="plan-cards-container">
                {savedPlans.map((plan) => (
                    <TravelPlanCard 
                      key={plan.planIdx} 
                      plan={plan} 
                      onDelete={handleDelete} // 함수 전달
                      onEdit={handleEdit}     // 함수 전달
                    />
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default MyTravelPage;