import React from 'react';
import './WritePage.css';

const PostWrite = () => {
  return (
    <div className="post-write-wrapper">
      <main className="write-container">
        {/* 상단 경로 및 제목 영역 */}
        <header className="write-header">
          <nav className="breadcrumb">커뮤니티 {'>'} <span>게시글 작성</span></nav>
          <div className="header-flex">
            <h2 className="main-title">여행 이야기 공유하기</h2>
            <div className="action-btns">
              <button className="btn-draft">임시 저장</button>
              <button className="btn-publish">게시하기</button>
            </div>
          </div>
        </header>

        <div className="write-layout">
          {/* 왼쪽: 에디터 영역 */}
          <section className="editor-section">
            <div className="input-card">
              <label className="input-label">🖋️ 제목</label>
              <input type="text" className="title-input" placeholder="당신의 여행에 멋진 제목을 붙여주세요" />
            </div>

            <div className="input-card">
              <label className="input-label">📝 내용</label>
              <div className="editor-container">
                <div className="toolbar">
                  <button>B</button>
                  <button>I</button>
                  <button>☰</button>
                  <button>🔗</button>
                  <div className="v-line"></div>
                  <button>📍</button>
                </div>
                <textarea className="content-textarea" placeholder="어떤 여행이었나요? 이곳에 자세한 이야기를 들려주세요..."></textarea>
              </div>
            </div>
          </section>

          {/* 오른쪽: 사이드바 영역 */}
          <aside className="write-sidebar">
            {/* 여행 플래너 추가 */}
            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🗺️</span>
                <h4>여행 플래너 추가</h4>
              </div>
              <div className="load-planner-box">
                <button className="btn-load-planner">
                  <span>📅</span> 플래너 불러오기
                </button>
              </div>
            </div>

            {/* 미디어 업로드 */}
            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🖼️</span>
                <h4>미디어 업로드</h4>
              </div>
              <div className="upload-zone">
                <div className="upload-info">
                  <div className="upload-icon">📸</div>
                  <p>당신의 여행 사진을 공유해보세요</p>
                  <span>사진 또는 영상을 이곳으로 드래그하거나<br/>클릭하여 파일을 선택하세요.</span>
                </div>
                <button className="btn-file-select">파일 선택</button>
              </div>
              
              <div className="uploaded-list">
                <div className="upload-count">업로드된 파일 (0) <span>최대 10장</span></div>
                <div className="file-grid">
                  <div className="file-placeholder">🖼️</div>
                  <div className="file-placeholder">🖼️</div>
                  <div className="file-add-btn">+</div>
                </div>
              </div>

              <div className="upload-tip">
                <h5>ⓘ 업로드 팁</h5>
                <ul>
                  <li>고화질 사진은 최대 20MB까지 업로드 가능합니다.</li>
                  <li>여행 분위기가 잘 드러나는 사진을 선택해주세요.</li>
                  <li>부적절한 미디어는 제재될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="write-footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span> <span>개인정보처리방침</span> <span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default PostWrite;