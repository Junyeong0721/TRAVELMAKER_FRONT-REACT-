import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';
import { boardDetail } from '../api/게시판상세보기/detailService';
import { comment } from '../api/comment/commentService';
import { getCookie } from '../../js/getToken';
import { addLike } from '../api/likeService/likeInsertService';
import { deleteLike } from '../api/likeService/likeDeleteService';
import { deletePost } from '../api/delete/deleteService';

const DetailPage = () => {
  const { idx } = useParams();
  const navigate = useNavigate();
  
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 상태 관리 (중복 제거됨)
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 여부
  const [isMine, setIsMine] = useState(false);         // 내 글 여부
  const [isLiked, setIsLiked] = useState(false);       // 좋아요 여부
  const [likeCount, setLikeCount] = useState(0);       // 좋아요 개수

  useEffect(() => {
    // API 호출
    boardDetail(idx)
      .then(res => {
        if (res.status === 200) {
          console.log("🔍 게시글 상세 데이터 확인:", res.data); 
          setDetail(res.data);

          const data = res.data;
          const postData = data.post;

          // 1. 내 글인지 확인
          if (data.mine || (postData && postData.mine)) {
            setIsMine(true);
          }

          // 2. 좋아요 상태 확인 (root의 checkedLike 우선 사용)
          if (data.checkedLike) {
             setIsLiked(true);
          } else if (postData && (postData.isLiked || postData.liked)) {
             setIsLiked(true);
          }

          // 3. 팔로우 상태 확인 (root의 checkedFollow 우선 사용)
          if (data.checkedFollow) {
             setIsFollowing(true);
          } else if (postData && (postData.isFollowed || postData.followed)) {
             setIsFollowing(true);
          }

          // 4. 좋아요 개수 세팅
          if (postData) {
            setLikeCount(postData.likeCount || 0);
          }
        }
      })
      .catch(err => {
        console.error(err);
        alert("게시글을 불러오는 데 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idx]);

  if (loading) return <div>Loading...</div>;
  if (!detail) return <div>게시글 정보를 찾을 수 없습니다.</div>;

  const handleDelete = () => {
    // 1. 여기서 "정말 삭제하겠습니까?" 창을 띄웁니다.
    // 사용자가 '확인'을 누르면 true, '취소'를 누르면 false를 반환합니다.
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.")) {
      
      // 2. '확인'을 눌렀을 때만 아래 삭제 로직이 실행됩니다.
      deletePost(idx)
        .then(res => {
          alert("삭제가 완료되었습니다.");
          navigate('/CommunityPage'); // 목록 페이지로 이동
        })
        .catch(err => {
          console.error("삭제 중 에러 발생:", err);
          alert("삭제 처리에 실패했습니다.");
        });

    } else {
      // 3. '취소'를 누르면 아무 일도 일어나지 않고 창만 닫힙니다.
      console.log("사용자가 삭제를 취소했습니다.");
    }
  };

  const { post, roadmap, comments } = detail;

  // ----------------------- 핸들러 함수들 -----------------------

  // 작성자 프로필 클릭
  const handleProfileClick = () => {
    const targetUserIdx = post.userIdx || post.writerIdx;
    if (targetUserIdx) navigate(`/other/${targetUserIdx}`);
  };

  // 댓글 유저 프로필 클릭
  const handleCommentUserClick = (commentUserIdx) => {
    if (commentUserIdx) navigate(`/other/${commentUserIdx}`);
    else alert("유저 정보를 찾을 수 없습니다.");
  };

  // [기능 추가] 좋아요 버튼 핸들러 (통합 API 사용)
  const handleLike = async () => {
    const token = getCookie('token');
    if (!token) return alert("로그인이 필요한 서비스입니다.");

    try {
      // 좋아요 토글 API 호출
      await axios.post(`http://localhost:8085/api/likes/${idx}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // UI 즉시 업데이트 (낙관적 업데이트)
      if (isLiked) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("좋아요 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 팔로우 버튼 핸들러
  const handleFollow = async () => {
    const token = getCookie('token');
    if (!token) return alert("로그인이 필요한 서비스입니다.");

    const targetUserIdx = post.userIdx || post.writerIdx;
    if (!targetUserIdx) return alert("작성자 정보를 찾을 수 없습니다.");

    try {
      await axios.post(`http://localhost:8085/api/follow/${targetUserIdx}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("팔로우 실패:", error);
      alert("팔로우 처리에 실패했습니다.");
    }
  };

  // 댓글 등록 핸들러
  function inputcomment() {
    const content = document.getElementById("content");
    const token = getCookie('token');
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!content.value.trim()) return alert("내용을 입력해주세요.");

    comment({ content: content.value, token: token, postIdx: idx })
      .then(res => {
        if (res.status === 200) window.location.reload();
      })
      .catch(err => alert("댓글 등록 중 오류가 발생했습니다."));
  }

  // ----------------------- 렌더링 -----------------------

  return (
    <div className="detail-page">
      <div className="detail-content-wrapper">
        <main className="post-main">
          <div className="back-btn" onClick={() => navigate('/CommunityPage')}>← 커뮤니티 목록으로 돌아가기</div>
          {detail?.mine && (
            <div className="owner-btns">
              <button 
                type="button" 
                className="btn-edit" 
                onClick={() => navigate(`/EditPage/${idx}`)} // ✅ 수정 페이지로 이동
              >
                ✏️ 수정
              </button>
              <button 
                type="button" 
                className="btn-delete"  // ✅ 삭제 함수 호출
                onClick={handleDelete}
              >
                🗑️ 삭제
              </button>
            </div>
          )}
          <header className="detail-header">
            <h1 className="detail-title">{post.title}</h1>
            
            <div 
              className="author-info-row" 
              onClick={handleProfileClick} 
              style={{ cursor: 'pointer' }}
              title="작가 프로필 방문하기"
            >
              <div className="author-profile-img">
                {post.profileImg ? (
                  <img src={post.profileImg} alt="프로필" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#ddd' }}></div>
                )}
              </div>
              <div className="author-text">
                <div className="name-mbti">{post.nickname} <span className="mbti-badge">{post.mbti}</span></div>
                <div className="post-meta">{post.createAt} · 조회수 {post.viewCount}</div>
              </div>
            </div>
          </header>

          <article className="post-article">
            <div className="post-content-html" dangerouslySetInnerHTML={{ __html: post.content }} />

            <h3>AI가 추천한 오늘의 루트</h3>
            <div className="roadmap-container">
              <div className="roadmap-header">
                <span className="sparkle-icon">✨</span>
                <div className="roadmap-title">
                  <h4>AI 플래너 로드맵</h4>
                  <p>{post.nickname}님의 {post.mbti} 성향에 맞춘 최적화 경로</p>
                </div>
              </div>
              <div className="timeline">
                {roadmap && roadmap.length > 0 ? (
                  roadmap.map((item, index) => (
                    <div key={index} className="timeline-item">
                      <div className="time-dot"></div>
                      <div className="timeline-content">
                        <div className="item-header">
                          <span className="item-time-place">{item.visitTime} - {item.planTitle}</span>
                          <span className="item-label">{item.types}</span>
                        </div>
                        <p className="item-desc">{item.memo}</p>
                        <div className="item-tags"><span>#{item.address}</span></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>로드맵 정보가 없습니다.</p>
                )}
              </div>
            </div>
          </article>

          {/* 댓글 섹션 */}
          <section className="comment-section">
            <h3>댓글 {comments ? comments.length : 0}개</h3>
            <div className="comment-list">
              {comments && comments.map(c => (
                <div key={c.idx} className="comment-card">
                  <div 
                    className="comment-user-img"
                    onClick={() => handleCommentUserClick(c.userIdx)}
                    style={{ 
                        cursor: 'pointer',
                        backgroundImage: c.profileImg ? `url(${c.profileImg})` : 'none',
                        backgroundColor: c.profileImg ? 'transparent' : '#ddd',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                  ></div>

                  <div className="comment-body" style={{ marginLeft: '10px', marginTop: '10px' }}>
                    <div className="comment-user-info">
                      <span 
                        className="c-name" 
                        onClick={() => handleCommentUserClick(c.userIdx)}
                        style={{ cursor: 'pointer' }}
                      >
                        {c.nickname} <span className="c-mbti">{c.mbti}</span>
                      </span>
                      <span className="c-time">{c.createAt}</span>
                    </div>
                    <p className="c-text">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="comment-input-area">
              <div className="comment-user-img"></div>
              <div className="input-box">
                <textarea placeholder="댓글을 남겨주세요..." id="content"></textarea>
                <button className="submit-comment" onClick={inputcomment}>등록하기</button>
              </div>
            </div>
          </section>
        </main>

        <aside className="post-sidebar">
          <div className="sidebar-stats">
            {/* ✅ [기능 구현] 좋아요 버튼 */}
            <div 
              className="stat-item" 
              onClick={handleLike} 
              style={{ 
                cursor: 'pointer', 
                color: isLiked ? '#ff4757' : 'inherit', // 좋아요 시 빨간색
                fontWeight: isLiked ? 'bold' : 'normal'
              }}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span> 좋아요 <strong>{likeCount}</strong>
            </div>
            <div className="stat-item"><span>🔗</span> 공유하기</div>
          </div>

          <div className="about-author-card">
            <p className="about-label">ABOUT AUTHOR</p>
            <div className="author-card-content">
              <div className="author-avatar-large">
                {post.profileImg ? (
                  <img src={post.profileImg} alt="작가 프로필" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#eee' }}></div>
                )}
              </div>
              <div className="author-card-info">
                <h4>{post.nickname}</h4>
                <p>{post.userGrade || "여행자"}</p>
              </div>
            </div>
            <p className="author-intro">{post.userIntro || "소개글이 없습니다."}</p>

            {/* ✅ 팔로우 버튼 (내 글 아닐 때만 노출) */}
            {!isMine && (
              <button
                className="follow-btn"
                onClick={handleFollow}
                style={{
                  backgroundColor: isFollowing ? '#e0e0e0' : '#6c5ce7',
                  color: isFollowing ? '#555' : '#fff',
                  border: isFollowing ? '1px solid #ccc' : 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '15px'
                }}
              >
                {isFollowing ? "팔로우 취소" : "팔로우 하기"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DetailPage;