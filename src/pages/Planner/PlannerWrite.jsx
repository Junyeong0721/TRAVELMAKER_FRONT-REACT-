import React from 'react';
import './PlannerWrite.css';

const PlannerWrite = () => {
  // 노트 줄 개수 (페이지 높이에 맞춰 조절 가능)
  const lineCount = 20;

  return (
    <div className="planner-write-container">
      {/* 상단 버튼 바 */}
      <div className="planner-top-bar">
        <h2>플래너 짜기</h2>
        <div className="btn-group">
          <button className="btn-draft">임시 저장</button>
          <button className="btn-complete">작성 완료</button>
        </div>
      </div>

      <div className="planner-main-layout">
        {/* 왼쪽: 입력 영역 */}
        <section className="planner-input-area">
          <div className="title-input-box">
            <label>TITLE</label>
            <input type="text" placeholder="제목을 입력해 주세요" />
          </div>

          <div className="itinerary-box">
            <div className="itinerary-header">
              <span>📋 TRAVEL ITINERARY</span>
            </div>
            
            {/* 📝 실제 줄눈이 들어간 노트패드 영역 */}
            <div className="notebook-container">
              {/* 왼쪽 빨간색 세로선 */}
              <div className="notebook-red-line"></div>
              
              {/* 실제 가로 줄들을 div로 구현 */}
              <div className="notebook-lines-wrapper">
                {[...Array(lineCount)].map((_, i) => (
                  <div key={i} className="notebook-line-item"></div>
                ))}
                
                {/* 실제 텍스트 입력은 이 위에 투명하게 올릴 수 있습니다 */}
                <textarea className="notebook-textarea" spellCheck="false"></textarea>
              </div>
            </div>
          </div>
        </section>

        {/* 오른쪽: 사이드바 */}
        <aside className="planner-sidebar">
          <div className="sidebar-header">
            <div className="header-title">
              <span>📊</span>
              <h4>플래너 가져오기</h4>
            </div>
            <span className="view-all-link">모두 보기</span>
          </div>
          
          <div className="import-dashed-box">
            <div className="import-content">
              <div className="folder-icon">📂</div>
              <p>저장된 플래너가 없습니다</p>
              <button className="btn-import-action">
                📥 가져오기
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PlannerWrite;