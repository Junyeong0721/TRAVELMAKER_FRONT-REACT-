import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosSetting'; 
import './OtherPage.css';

const OtherPage = () => {
  const { userIdx } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');

  // 데이터 상태
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 1. 데이터 불러오기 (userIdx나 page가 바뀌면 실행)
  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        setLoading(true);

        // ✅ [수정 핵심] 프로필 정보와 '내 팔로우 목록'을 동시에(혹은 순차적으로) 가져옵니다.
        // Promise.all을 사용하면 두 요청을 병렬로 처리해 더 빠릅니다.
        const [resProfile, resFollowing] = await Promise.all([
           api.get(`/other/${userIdx}?page=${page}`),      // 상대방 프로필 정보
           api.get('/follow/following').catch(() => ({ data: [] })) // 내 팔로우 목록 (에러나면 빈 배열 처리)
        ]);
        
        if (resProfile.status === 200) {
          let profileData = resProfile.data.profile;
          const postsData = resProfile.data.posts;
          
          // ✅ [수정 핵심] 내 팔로우 목록에 현재 보고 있는 유저(userIdx)가 있는지 검사합니다.
          // userIdx는 URL 파라미터라 문자열일 수 있으니 String()으로 변환해 비교합니다.
          const myFollowingList = Array.isArray(resFollowing.data) ? resFollowing.data : [];
          const isActuallyFollowed = myFollowingList.some(user => 
            String(user.userIdx) === String(userIdx)
          );

          // 프로필 데이터의 isFollowed 값을 실제 검사 결과로 덮어씁니다.
          profileData = {
            ...profileData,
            isFollowed: isActuallyFollowed
          };

          setProfile(profileData);
          setPosts(postsData);
          setTotalPages(resProfile.data.totalPages || 1);
        }
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        alert("유저 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchOtherData();
  }, [userIdx, page]); 

  // 팔로우 버튼 핸들러
  const handleFollow = async () => {
    try {
      await api.post(`/follow/${userIdx}`);
      
      // UI 즉시 업데이트 (낙관적 업데이트)
      setProfile(prev => ({
        ...prev,
        isFollowed: !prev.isFollowed,
        followerCount: prev.isFollowed ? prev.followerCount - 1 : prev.followerCount + 1
      }));
    } catch (err) {
      console.error(err);
      alert("처리에 실패했습니다.");
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        window.scrollTo(0, 0); // 페이지 변경 시 맨 위로
    }
  };

  if (loading && !profile) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;
  if (!profile) return <div style={{textAlign:'center', marginTop:'50px'}}>유저 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="other-page-wrapper">
      <div className="other-page-container">
        
        {/* 상단 프로필 영역 */}
        <section className="profile-header">
          <div className="profile-main-info">

            <div className="profile-details">
              <div className="name-row">
                <h2 className="user-id">{profile.nickname}</h2>
                <button 
                    className={`follow-btn ${profile.isFollowed ? 'following' : ''}`}
                    onClick={handleFollow}
                    style={{
                        backgroundColor: profile.isFollowed ? '#e0e0e0' : '#6c5ce7',
                        color: profile.isFollowed ? '#333' : '#fff',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginLeft: '15px'
                    }}
                >
                    {/* ✅ isFollowed 상태에 따라 텍스트 변경 */}
                    {profile.isFollowed ? "언팔로우" : "팔로우"}
                </button>
              </div>

              <div className="stats-row">
                <span><strong>{profile.postCount}</strong> 게시물</span>
                <span><strong>{profile.followerCount}</strong> 팔로워</span>
                <span><strong>{profile.followingCount}</strong> 팔로우</span>
              </div>
              
              <div className="mbti-info">
                <span className="mbti-label" style={{background:'#eee', padding:'2px 8px', borderRadius:'4px', fontSize:'0.8rem'}}>
                    {profile.mbti || "MBTI 미설정"}
                </span>
                <span style={{marginLeft:'10px', fontSize:'0.9rem', color:'#666'}}>
                    {profile.statusMessage}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 탭 메뉴 */}
        <nav className="profile-tabs">
          <div className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
            📋 게시물
          </div>
        </nav>

        {/* 게시물 그리드 */}
        <main className="posts-grid">
          {posts.length === 0 ? (
              <div style={{width:'100%', textAlign:'center', padding:'50px', color:'#999'}}>
                  작성한 게시물이 없습니다.
              </div>
          ) : (
              posts.map(post => (
                <article 
                  key={post.idx} 
                  className="post-item-card"
                  onClick={() => navigate(`/DetailPage/${post.idx}`)}
                  style={{ cursor: 'pointer' }} 
                >
                  <div className="post-thumb-box">
                    {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} />
                    ) : (
                        <div style={{width:'100%', height:'100%', backgroundColor:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center'}}>No Image</div>
                    )}
                  </div>
                  <div className="post-text-content">
                    <h3 className="post-item-title">{post.title}</h3>
                    <span className="post-item-date">{post.createAt}</span>
                  </div>
                </article>
              ))
          )}
        </main>

        {/* 페이지네이션 버튼 영역 */}
        {posts.length > 0 && (
            <div className="pagination-area" style={{display:'flex', justifyContent:'center', marginTop:'30px', gap:'10px'}}>
                <button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page === 1}
                    style={{padding:'5px 10px', border:'1px solid #ddd', borderRadius:'4px', cursor: page===1?'default':'pointer', opacity: page===1?0.5:1}}
                >
                    &lt;
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        style={{
                            padding: '5px 12px',
                            border: num === page ? 'none' : '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: num === page ? '#6c5ce7' : '#fff',
                            color: num === page ? '#fff' : '#333',
                            cursor: 'pointer',
                            fontWeight: num === page ? 'bold' : 'normal'
                        }}
                    >
                        {num}
                    </button>
                ))}

                <button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page === totalPages}
                    style={{padding:'5px 10px', border:'1px solid #ddd', borderRadius:'4px', cursor: page===totalPages?'default':'pointer', opacity: page===totalPages?0.5:1}}
                >
                    &gt;
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default OtherPage;