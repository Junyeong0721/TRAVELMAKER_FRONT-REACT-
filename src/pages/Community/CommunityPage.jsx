import React, { useState, useEffect } from 'react';
import './CommunityPage.css';
import { useNavigate } from 'react-router-dom';
import { boardList } from '../api/게시판테스트/boardService';
import { boardCount } from '../api/게시판테스트/boardCount';
import { bestList } from '../api/게시판테스트/bestBoardService';
import { myList } from '../api/게시판테스트/myBoardService';
import { getCookie } from '../../js/getToken';
import api from '../api/axiosSetting'; // ✅ API 호출을 위해 추가

const Community = () => {
  const navigate = useNavigate();
  
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);
  // 게시글 목록 상태
  const [posts, setPosts] = useState([]);
  // 전체 게시글 수 상태
  const [totalPosts, setTotalPosts] = useState(0);
  // 현재 보고 있는 탭 상태
  const [activeTab, setActiveTab] = useState('all');

  const limit = 4;
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  // 초기 로딩
  useEffect(() => {
    boardCount().then(res => {
      setTotalPosts(res.data);
    }).catch(err => console.error("Count Error:", err));

    fetchData(1, 'all');
  }, []);

  // 통합 데이터 로딩 함수
  const fetchData = (pageNum, tab) => {
    const offset = (pageNum - 1) * limit;
    let request;

    if (tab === 'best') {
      request = bestList(offset);
    } else if (tab === 'my') {
      const token = getCookie('token');
      request = myList(offset, token);
    } else {
      request = boardList(offset);
    }

    request
      .then(res => {
        if (res.status === 200) {
          setPosts(res.data);
          setCurrentPage(pageNum);
          setActiveTab(tab);
        }
      })
      .catch(err => console.error("List Error:", err));
  };

  const handleTabClick = (tabName) => {
    fetchData(1, tabName);
  };

  // ✅ [추가] 팔로우 기능 함수
  const handleFollow = async (e, targetUserIdx) => {
    // 중요: 카드 클릭 이벤트(상세페이지 이동)가 발생하지 않도록 막음
    e.stopPropagation(); 

    if (!targetUserIdx) {
      alert("유저 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      // 팔로우 토글 API 호출
      await api.post(`/follow/${targetUserIdx}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // 성공 시 목록을 새로고침하여 상태 반영
      // (더 좋은 방법은 로컬 state만 바꾸는 것이지만, 일단 편의상 새로고침)
      fetchData(currentPage, activeTab);
      
    } catch (error) {
      console.error("팔로우 실패:", error);
      alert("로그인이 필요하거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="community-wrapper">
      <div className="community-container">
        {/* 사이드바 */}
        <aside className="sidebar">
          <section className="category-section">
            <h4>게시판 카테고리</h4>
            <ul>
              <li className={activeTab === 'all' ? 'active' : ''} onClick={() => handleTabClick('all')}>
                <span>📊</span> 전체 글
              </li>
              <li className={activeTab === 'best' ? 'active' : ''} onClick={() => handleTabClick('best')}>
                <span>📈</span> 인기 게시글
              </li>
              <li className={activeTab === 'my' ? 'active' : ''} onClick={() => handleTabClick('my')}>
                <span>📝</span> 내 게시글
              </li>
              <li><span>🔖</span> 저장한 글</li>
            </ul>
          </section>

          <section className="writer-card">
            <div className="writer-card-content">
              <h3>나만의 여행 작가가 되어보세요!</h3>
              <p>나의 특별한 여행 경험을 공유하고 다른 여행자들에게 영감을 주세요.</p>
              <button className="guide-btn" onClick={() => navigate('/WritePage')}>가이드 작성하기</button>
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
            <button className="write-post-btn">검색</button>
            <button className="write-post-btn" onClick={() => navigate('/WritePage')}>➕ 글쓰기</button>
          </div>

          <div className="content-header">
            <h2>{activeTab === 'best' ? '인기 게시글' : activeTab === 'my' ? '내 게시글' : '전체 글'}</h2>
            <p>실시간으로 올라오는 다양한 여행 이야기들을 만나보세요.</p>
          </div>

          {/* 포스트 그리드 */}
          <div className="post-grid">
            {posts.map(post => (
              <article key={post.idx} className="post-card" onClick={() => navigate(`/DetailPage/${post.idx}`)} style={{ cursor: 'pointer' }}>
                <div className="post-img-box">
                  {post.thumbnail && <img src={post.thumbnail} alt={post.title} />}
                </div>
                <div className="post-info">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-footer">
                    <div className="author-info">
                      <div className="author-text">
                        <span className="author-name">{post.nickname}</span>
                        <span className="author-mbti">{post.mbti}</span>
                      </div>
                      
                      {/* ✅ [추가] 팔로우 버튼 */}
                      {/* post.userIdx가 있어야 동작합니다. 없으면 버튼 안 보임 */}
                      {post.userIdx && (
                          <button 
                            className="mini-follow-btn"
                            onClick={(e) => handleFollow(e, post.userIdx)}
                            style={{
                                marginLeft: '10px',
                                padding: '2px 8px',
                                fontSize: '0.7rem',
                                borderRadius: '12px',
                                border: '1px solid #ddd',
                                background: post.followed ? '#eee' : '#5D5FEF',
                                color: post.followed ? '#333' : '#fff',
                                cursor: 'pointer'
                            }}
                          >
                            {post.followed ? '언팔' : '팔로우'}
                          </button>
                      )}

                    </div>
                    <div className="post-stats">a
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
            <button
              className="page-arrow"
              onClick={() => fetchData(currentPage - 1, activeTab)}
              disabled={currentPage === 1}
            > &lt; </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-num ${num === currentPage ? 'active' : ''}`}
                onClick={() => fetchData(num, activeTab)}
              >
                {num}
              </button>
            ))}

            <button
              className="page-arrow"
              onClick={() => fetchData(currentPage + 1, activeTab)}
              disabled={currentPage === totalPages || totalPages === 0}
            > &gt; </button>
          </div>
        </main>
      </div>

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