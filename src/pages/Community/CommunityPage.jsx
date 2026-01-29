import React from 'react';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import { boardList } from '../api/게시판테스트/boardService';
import { useState, useEffect } from 'react';
import { boardCount } from '../api/게시판테스트/boardCount';
import { bestList } from '../api/게시판테스트/bestBoardService';
import { myList } from '../api/게시판테스트/myBoardService';
import { getCookie } from '../../js/getToken';


const Community = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [posts, setPosts] = useState([]);

  const [totalPosts, setTotalPosts] = useState(0);

  const limit = 4;
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  const [activeCategory, setActiveCategory] = useState('all');

  // 1. 검색어 상태 추가
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  // 전체 개수를 가져오는 API 호출 (예: boardCount())
  boardCount().then(res => {
    setTotalPosts(res.data);
  });
  
  ViewList(1); // 첫 페이지 목록 불러오기
  }, []);
  // 3. 데이터를 불러오는 함수
  const ViewList = (pagenum) => {
    const offset = (pagenum - 1) * 4; 


    boardList(offset)
          .then(res => {
            if (res.status === 200) {
              setPosts(res.data);
              setCurrentPage(pagenum); // UI 상태는 사용자가 누른 번호로 저장
            }
          })
          .catch(err => console.error(err));
    };

  // 5. 페이지가 마운트(로드)될 때 실행되는 useEffect
  useEffect(() => {
    ViewList(1); // 첫 페이지 로드
  }, []);
  const BestList = (pagenum) => {
    const offset = (pagenum - 1) * 4; 


    bestList(offset)
          .then(res => {
            if (res.status === 200) {
              setPosts(res.data);
              setCurrentPage(pagenum); // UI 상태는 사용자가 누른 번호로 저장
            }
          })
          .catch(err => console.error(err));
    };
  const MyList = (pagenum) => {
    const offset = (pagenum - 1) * 4; 

    const token = getCookie('token');
    myList(offset, token)
          .then(res => {
            if (res.status === 200) {
              setPosts(res.data);
              setCurrentPage(pagenum); // UI 상태는 사용자가 누른 번호로 저장
            }
          })
          .catch(err => console.error(err));
    };
      // 2. 검색 실행 함수
  const handleSearch = (pagenum = 1) => {
  const offset = (pagenum - 1) * 4;
  setActiveCategory('search'); // 현재 상태를 '검색'으로 변경

  // 1. 검색 결과 목록 가져오기
  boardList(offset, searchTerm)
    .then(res => {
      setPosts(res.data);
      setCurrentPage(pagenum);
    });

  // 2. 검색 결과 전체 개수 가져오기 (이걸 해야 페이지 번호가 바뀝니다!)
  // 백엔드 주소(/api/board/searchCount)에 맞춰서 호출
  fetch(`/api/board/searchCount?keyword=${searchTerm}`)
    .then(res => res.json())
    .then(data => setTotalPosts(data));
};


  return (
    <div className="community-wrapper">
      <div className="community-container">
        {/* 사이드바 */}
        <aside className="sidebar">
          <section className="category-section">
            <h4>게시판 카테고리</h4>
            <div className="category-buttons">
              <button 
                className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`} 
                onClick={() => { ViewList(1); setActiveCategory('all'); }}
              >
                <span>📊</span> 전체 글
              </button>
              
              <button 
                className={`category-btn ${activeCategory === 'best' ? 'active' : ''}`} 
                onClick={() => { BestList(1); setActiveCategory('best'); }}
              >
                <span>📈</span> 인기 게시글
              </button>
              
              <button 
                className={`category-btn ${activeCategory === 'my' ? 'active' : ''}`} 
                onClick={() => { MyList(1); setActiveCategory('my'); }}
              >
                <span>📝</span> 내 게시글
              </button>
              
              
            </div>
          </section>

          <section className="writer-card">
            <div className="writer-card-content">
              <h3>나만의 여행 작가가 되어보세요!</h3>
              <p>나의 특별한 여행 경험을 공유하고 다른 여행자들에게 영감을 주세요.</p>
              <button className="guide-btn" onClick={e => navigate('/WritePage')}>지금 시작하기</button>
            </div>
          </section>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="community-main">
          <div className="search-filter-bar">
            <div className="search-input-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="여행지, 키워드, MBTI로 검색해보세요" value={searchTerm} // 추가
              onChange={(e) => setSearchTerm(e.target.value)} // 추가: 입력값 실시간 저장
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)} // 추가: 엔터키 지원
            />
            </div>
            <button className="write-post-btn" onClick={() => handleSearch(1)}>검색</button>
            <button className="write-post-btn" onClick={e=> navigate('/WritePage')}>➕ 글쓰기</button>
          </div>

          <div className="content-header">
            <h2>전체 글</h2>
            <p>실시간으로 올라오는 다양한 여행 이야기들을 만나보세요.</p>
          </div>

          {/* 포스트 그리드 */}
          <div className="post-grid" key={posts.length}>
            {posts.map(post => (
              <article key={post.idx} className="post-card" onClick={e => navigate(`/DetailPage/${post.idx}`)} style={{ cursor: 'pointer' }}>
                <div className="post-img-box">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-footer">
                    <div className="author-info">
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
            {/* 이전 버튼 */}
            <button 
              className="page-arrow" 
              onClick={() => ViewList(currentPage - 1)}
              disabled={currentPage === 1}
            > &lt; </button>

            {/* totalPages 수만큼 버튼 생성 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-num ${num === currentPage ? 'active' : ''}`}
                onClick={() => ViewList(num)}
              >
                {num}
              </button>
            ))}

            {/* 다음 버튼 */}
            <button 
              className="page-arrow" 
              onClick={() => ViewList(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            > &gt; </button>
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