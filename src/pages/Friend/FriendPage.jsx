import React, { useState, useEffect } from 'react';
// api 설정 파일 경로가 맞는지 꼭 확인하세요!
import api from '../api/axiosSetting'; 
import './FriendPage.css';

const FriendPage = () => {
  // 1. 상태 관리
  const [activeTab, setActiveTab] = useState('following'); 
  const [userList, setUserList] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // 2. 검색 모달용 상태
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [keyword, setKeyword] = useState("");            
  const [searchResult, setSearchResult] = useState([]);  

  const myInfo = {
    nickname: "김여행",
    mbti: "ENFP",
    count: 12
  };

  useEffect(() => {
    fetchFollowList();
  }, [activeTab]);

  // 목록 가져오기
  const fetchFollowList = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'following' ? '/follow/following' : '/follow/follower';
      
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        setUserList([]); 
      }
    } catch (error) {
      console.error("목록 불러오기 실패:", error);
      setUserList([]); 
    } finally {
      setLoading(false);
    }
  };

  // 3. 검색 기능 함수
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    try {
      const response = await api.get(`/follow/search?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (Array.isArray(response.data)) {
        setSearchResult(response.data);
      } else {
        console.warn("검색 결과가 배열이 아님:", response.data);
        setSearchResult([]); 
      }

    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResult([]); 
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  // ★ 4. 팔로우/언팔로우 버튼 동작 (수정됨: 모달 닫기 기능 추가)
  const handleToggleFollow = async (targetIdx) => {
    try {
      // API 요청 (팔로우 또는 언팔로우 토글)
      await api.post(`/follow/${targetIdx}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // 1. 메인 목록(뒷배경) 새로고침
      fetchFollowList(); 
      
      // 2. 모달이 열려있다면 -> 닫아버리기 (요청하신 기능)
      if (isModalOpen) {
        setIsModalOpen(false);
        // (선택) 깔끔하게 검색어와 결과도 초기화
        setKeyword("");
        setSearchResult([]);
      }

    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="friend-page-wrapper">
      
      {/* 검색 모달 UI */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>👥 유저 찾기</h3>
            
            <div className="search-bar-modal">
              <input 
                type="text" 
                placeholder="닉네임을 입력하세요" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>검색</button>
            </div>
            
            <div className="search-result-list">
              {!Array.isArray(searchResult) || searchResult.length === 0 ? (
                <p className="no-result">검색 결과가 없습니다.</p>
              ) : (
                searchResult.map(user => (
                  <div key={user.userIdx} className="friend-item modal-item">
                     <div className="friend-avatar-wrapper small">
                        <div className="friend-avatar" style={{backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none', backgroundColor: '#ddd'}}></div>
                     </div>
                     <div className="friend-details">
                        <span className="friend-name">{user.nickname}</span>
                        {user.mbti && <span className={`mbti-tag ${user.mbti.toLowerCase()}`}>{user.mbti}</span>}
                     </div>
                     <button 
                        className={`action-btn ${ (user.followBack || user.isFollowBack) ? 'unfollow' : 'follow' }`}
                        onClick={() => handleToggleFollow(user.userIdx)}
                     >
                        { (user.followBack || user.isFollowBack) ? "언팔로우" : "팔로우" }
                     </button>
                  </div>
                ))
              )}
            </div>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
      {/* --- 모달 끝 --- */}


      {/* 메인 컨텐츠 */}
      <main className="friend-container">
        <div className="friend-header-row">
          <div className="title-area">
            <h2>내 여행 네트워크</h2>
            <p>함께 여행할 사람들을 팔로우하고 소통하세요.</p>
          </div>
          <div className="action-area">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="목록 내 필터링..." />
            </div>
            <button className="add-friend-btn" onClick={() => setIsModalOpen(true)}>
                + 유저 찾기
            </button>
          </div>
        </div>

        <div className="friend-layout-grid">
          {/* 왼쪽 사이드바 */}
          <aside className="friend-sidebar">
            <div className="user-mini-profile">
              <div className="mini-avatar"></div>
              <div className="mini-info">
                <strong>{myInfo.nickname}</strong>
                <span>{myInfo.mbti} • {myInfo.count}개의 여행</span>
              </div>
            </div>

            <nav className="sidebar-menu">
              <div className="menu-item">👤 내 정보 관리</div>
              <div className="menu-item active">👥 네트워크 관리</div>
              <div className="menu-item">⚙️ AI 맞춤 설정</div>
              <div className="menu-item">🧠 MBTI 분석</div>
              <div className="menu-item logout">📤 로그아웃</div>
            </nav>
            <div className="invite-banner">
                 <div className="banner-content">
                    <h4>친구 초대하기</h4>
                    <p>링크를 공유해서 친구를 초대해보세요!</p>
                    <button className="copy-link-btn">초대 링크 복사</button>
                 </div>
            </div>
          </aside>

          {/* 오른쪽 리스트 영역 */}
          <section className="friend-list-area">
            <div className="filter-tabs">
              <button 
                className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                onClick={() => setActiveTab('following')}
              >
                팔로잉 (내가 구독)
              </button>
              <button 
                className={`tab ${activeTab === 'follower' ? 'active' : ''}`}
                onClick={() => setActiveTab('follower')}
              >
                팔로워 (나를 구독)
              </button>
            </div>

            <div className="friend-list-card">
              {loading && <div className="loading-msg">데이터를 불러오는 중...</div>}

              {!loading && Array.isArray(userList) && userList.length === 0 && (
                <div className="empty-msg">
                    {activeTab === 'following' ? "아직 팔로우한 사람이 없습니다." : "나를 팔로우한 사람이 없습니다."}
                </div>
              )}

              {!loading && Array.isArray(userList) && userList.length > 0 && (
                userList.map((user, index) => (
                  <div key={user.userIdx || index} className="friend-item">
                    <div className="friend-avatar-wrapper">
                      <div 
                        className="friend-avatar" 
                        style={{backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none', backgroundColor: '#ddd'}}
                      ></div>
                    </div>
                    
                    <div className="friend-details">
                      <div className="name-row">
                        <span className="friend-name">{user.nickname || "알 수 없음"}</span>
                        {user.mbti && (
                            <span className={`mbti-tag ${user.mbti.toLowerCase()}`}>{user.mbti}</span>
                        )}
                      </div>
                      <p className="friend-info-text">{user.statusMessage || "상태 메시지가 없습니다."}</p>
                    </div>

                    <div className="friend-action">
                        {activeTab === 'following' ? (
                            <button 
                                className="action-btn unfollow"
                                onClick={() => handleToggleFollow(user.userIdx)}
                            >
                                언팔로우
                            </button>
                        ) : (
                            <button 
                                className={`action-btn ${user.isFollowBack ? 'unfollow' : 'follow'}`}
                                onClick={() => handleToggleFollow(user.userIdx)}
                            >
                                {(user.isFollowBack || user.followBack) ? "언팔로우" : "맞팔로우"}
                            </button>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 TripMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FriendPage;