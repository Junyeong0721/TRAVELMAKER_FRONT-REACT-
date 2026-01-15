import React from 'react';
import './WriteInfo.css';

const MyPage = () => {
  // 게시글 관리 더미 데이터
  const posts = [
    {
      id: 1,
      category: '여행기',
      title: '가을 교토 여행, 숨겨진 단풍 명소 5곳',
      date: '2023.11.20',
      desc: '유명한 관광지보다 조용하게 사색을 즐길 수 있는 교토의 숨겨진 명소들을 소개합니다. 사람이 붐비지 않는 아침 시간에 방문하면 더욱 좋습니다.',
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      category: '리뷰',
      title: '제주도 서귀포 오션뷰 카페 추천 BEST 3',
      date: '2023.10.05',
      desc: '바다를 보며 멍 때리기 좋은 서귀포 카페 세 곳을 직접 다녀왔습니다. 커피 맛은 기본이고, 인테리어까지 완벽한 곳들만 모았어요.',
      likes: 89,
      comments: 42
    },
    {
      id: 3,
      category: '여행기',
      title: '나홀로 떠나는 파리 배낭여행 꿀팁 총정리',
      date: '2023.09.12',
      desc: '처음 혼자 떠나는 유럽 여행이라 걱정이 많았는데, 생각보다 훨씬 좋았습니다. 파리 지하철 이용법부터 소매치기 예방법까지 공유합니다.',
      likes: 256,
      comments: 56
    }
  ];

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        {/* 상단 타이틀 영역 */}
        <header className="mypage-header">
          <h1>마이 페이지</h1>
          <p>나의 여행 기록을 확인하고 관리하세요.</p>
        </header>

        <div className="mypage-layout">
          {/* 왼쪽 사이드바 */}
          <aside className="mypage-sidebar">
            <div className="profile-card">
              <div className="profile-img-area">
                <div className="profile-avatar"></div>
                <button className="edit-profile-btn">✎</button>
              </div>
              <h2 className="user-name">김여행</h2>
              <p className="user-email">traveler@tripmate.com</p>
              <div className="user-badges">
                <span className="badge premium">PREMIUM</span>
                <span className="badge mbti">ENFP</span>
              </div>
              <div className="user-stats">
                <div className="stat"><strong>12</strong><span>나의 여행</span></div>
                <div className="stat"><strong>5</strong><span>리뷰</span></div>
              </div>
            </div>

            <nav className="mypage-nav">
              <ul>
                <li><span className="icon">👤</span> 내 정보 관리</li>
                <li className="active"><span className="icon">📑</span> 내 게시글</li>
                <li><span className="icon">🔖</span> 저장된 여행지</li>
                <li><span className="icon">⚙️</span> AI 맞춤 설정</li>
                <li><span className="icon">📊</span> MBTI 분석</li>
                <li className="logout"><span className="icon">↪</span> 로그아웃</li>
              </ul>
            </nav>
          </aside>

          {/* 오른쪽 메인 콘텐츠 */}
          <main className="mypage-content">
            <div className="content-top-bar">
              <div className="content-title">
                <h3>게시글 관리</h3>
                <span className="total-count">Total 12</span>
              </div>
              <button className="new-post-btn">➕ 새 글 쓰기</button>
            </div>

            <div className="post-management-list">
              {posts.map(post => (
                <div key={post.id} className="manage-post-card">
                  <div className="post-thumb">
                    <span className="post-category-tag">{post.category}</span>
                  </div>
                  <div className="post-details">
                    <div className="post-header-row">
                      <h4 className="post-title">{post.title}</h4>
                      <span className="post-date">{post.date}</span>
                    </div>
                    <p className="post-desc-snippet">{post.desc}</p>
                    <div className="post-footer-row">
                      <div className="post-stats">
                        <span>♡ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                      <button className="more-btn">···</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination-area">
              <button className="page-arrow">〈</button>
              <button className="page-num active">1</button>
              <button className="page-num">2</button>
              <button className="page-num">3</button>
              <button className="page-arrow">〉</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPage;