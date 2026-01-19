import React from 'react';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import { boardList } from '../api/게시판테스트/boardService';
import { useState, useEffect } from 'react';

const Community = () => {
  const navigate = useNavigate();

const [posts, setPosts] = useState([]);

  // 3. 데이터를 불러오는 함수
  const ViewList = (pagenum) => {
    boardList(pagenum)
      .then(res => {
        console.log("서버 응답:", res);

        if (res.status !== 200) {
          console.log('error');
          return;
        }

        // 서버 컨트롤러에서 ResponseEntity.ok(boardlist)로 보냈으므로 res.data가 리스트입니다.
        const data = res.data;
        console.log("받은 데이터:", data);
        
        setPosts(data); // 4. 가져온 데이터를 상태에 저장 (화면 갱신)
      })
      .catch(err => {
        console.error("데이터 로딩 실패:", err);
      });
  };

  // 5. 페이지가 마운트(로드)될 때 실행되는 useEffect
  useEffect(() => {
    ViewList(1); // 첫 페이지 로드
  }, []);


  return (
    <div className="community-wrapper">
      {/* 헤더 */}
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">TripMate <small>AI Travel</small></h1>
          <nav className="header-nav">
            <span>홈</span><span>기능</span><span>여행지</span><span className="active">커뮤니티</span><span>도움말</span>
          </nav>
          <div className="header-right">
            <span>🌙</span>
            <div className="profile-circle"></div>
            <span className="user-name">김여행</span>
          </div>
        </div>
      </header>

      <div className="community-container">
        {/* 사이드바 */}
        <aside className="sidebar">
          <section className="category-section">
            <h4>게시판 카테고리</h4>
            <ul>
              <li className="active"><span>📊</span> 전체 글</li>
              <li><span>📈</span> 인기 게시글</li>
              <li><span>📝</span> 내 게시글</li>
              <li><span>🔖</span> 저장한 글</li>
            </ul>
          </section>

          <section className="writer-card">
            <div className="writer-card-content">
              <h3>나만의 여행 작가가 되어보세요!</h3>
              <p>나의 특별한 여행 경험을 공유하고 다른 여행자들에게 영감을 주세요.</p>
              <button className="guide-btn">가이드 작성하기</button>
            </div>
          </section>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="community-main">
          <div className="search-filter-bar">
            <div className="search-input-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="여행지, 키워드, MBTI로 검색해보세요" />
            </div>
            <button className="write-post-btn" onClick={e => ViewList(1)}>검색</button>
            <button className="write-post-btn" onClick={e=> navigate('/WritePage')}>➕ 글쓰기</button>
          </div>

          <div className="content-header">
            <h2>전체 글</h2>
            <p>실시간으로 올라오는 다양한 여행 이야기들을 만나보세요.</p>
          </div>

          {/* 포스트 그리드 */}
          <div className="post-grid">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                <div className="post-img-box">
                  <img src='https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80' alt={post.title} />
                </div>
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-footer">
                    <div className="author-info">
                      <div className="author-avatar small"></div>
                      <div className="author-text">
                        <span className="author-name">{post.nickname}</span>
                        <span className="author-mbti">{post.mbti}</span>
                      </div>
                    </div>
                    <div className="post-stats">
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                      <span>👁️ {post.viewCount}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button className="page-arrow">‹</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <span className="page-dots">...</span>
            <button className="page-num">10</button>
            <button className="page-arrow">›</button>
          </div>
        </main>
      </div>

      {/* 푸터 */}
      <footer className="footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span><span>개인정보처리방침</span><span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default Community;