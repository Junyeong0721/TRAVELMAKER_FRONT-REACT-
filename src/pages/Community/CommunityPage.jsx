import React from 'react';
import './CommunityPage.css';

const Community = () => {
  // 샘플 게시글 데이터
  const posts = [
    {
      id: 1,
      tag: '#발리 #한달살기',
      title: '푸른 바다와 함께한 발리에서의 2주, 완벽한 휴식',
      author: '이하늘',
      mbti: 'ENFP',
      likes: '1.2k',
      views: '4.5k',
      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      tag: '#교토 #혼자여행',
      title: 'INFJ가 추천하는 조용한 교토 산책로 Top 5',
      author: '박지민',
      mbti: 'INFJ',
      likes: '856',
      views: '3.1k',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      tag: '#파리 #미식여행',
      title: '파리의 아침, 바게트 냄새를 따라 걷는 여행',
      author: '최정호',
      mbti: 'ENTJ',
      likes: '2.4k',
      views: '7.2k',
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      tag: '#아이슬란드 #오로라',
      title: '살면서 꼭 한 번은 가봐야 할 아이슬란드 링로드',
      author: '김소연',
      mbti: 'INTJ',
      likes: '3.1k',
      views: '9.8k',
      img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=500&q=80'
    }
  ];

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
            <button className="write-post-btn">➕ 글쓰기</button>
          </div>

          <div className="content-header">
            <h2>전체 글</h2>
            <p>실시간으로 올라오는 다양한 여행 이야기들을 만나보세요.</p>
            <button className="filter-sort-btn">≡</button>
          </div>

          {/* 포스트 그리드 */}
          <div className="post-grid">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                <div className="post-img-box">
                  <img src={post.img} alt={post.title} />
                  <span className="post-tag-badge">{post.tag}</span>
                  <button className="bookmark-btn">🔖</button>
                </div>
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-footer">
                    <div className="author-info">
                      <div className="author-avatar small"></div>
                      <div className="author-text">
                        <span className="author-name">{post.author}</span>
                        <span className="author-mbti">{post.mbti}</span>
                      </div>
                    </div>
                    <div className="post-stats">
                      <span>❤️ {post.likes}</span>
                      <span>👁️ {post.views}</span>
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