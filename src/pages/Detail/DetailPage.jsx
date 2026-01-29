import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';
import { boardDetail } from '../api/게시판상세보기/detailService';
import { comment } from '../api/comment/commentService';
import { getCookie } from '../../js/getToken';

const DetailPage = () => {
  const { idx } = useParams();
  const navigate = useNavigate();
  
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 팔로우 상태 관리
  const [isFollowing, setIsFollowing] = useState(false);
  // 내 글인지 여부
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    boardDetail(idx)
      .then(res => {
        if (res.status === 200) {
          setDetail(res.data);

          if (res.data.mine) setIsMine(true);
          if (res.data.post && res.data.post.isFollowed) setIsFollowing(true);
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

  const { post, roadmap, comments } = detail;

  // ✅ [핵심 기능] 로드맵을 일차(Day)별로 그룹화하는 함수
  const getGroupedRoadmap = () => {
    if (!roadmap || roadmap.length === 0) return {};

    let currentDay = 1;
    const grouped = {};

    roadmap.forEach((item, index) => {
      // 1. 첫 번째 아이템이 아니고,
      // 2. 현재 시간이 이전 시간보다 빠르다면 (예: 18:00 -> 09:00) 다음 날로 간주
      if (index > 0) {
        const prevTime = roadmap[index - 1].visitTime; // "18:00:00"
        const currTime = item.visitTime;               // "09:00:00"
        
        // 문자열 비교로 시간 역전 감지
        if (currTime < prevTime) {
          currentDay++;
        }
      }

      // 그룹 배열이 없으면 생성
      if (!grouped[currentDay]) {
        grouped[currentDay] = [];
      }
      
      // 해당 일차에 아이템 추가
      grouped[currentDay].push(item);
    });

    return grouped;
  };

  // 그룹화된 데이터 가져오기
  const groupedRoadmap = getGroupedRoadmap();

  // 이동 핸들러들
  const handleProfileClick = () => {
    const targetUserIdx = post.userIdx || post.writerIdx;
    if (targetUserIdx) navigate(`/other/${targetUserIdx}`);
  };

  const handleCommentUserClick = (commentUserIdx) => {
    if (commentUserIdx) navigate(`/other/${commentUserIdx}`);
    else alert("유저 정보를 찾을 수 없습니다.");
  };

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

  function inputcomment() {
    const content = document.getElementById("content");
    const token = getCookie('token');
    if (!token) return alert("로그인 후 이용해주세요.");
    if (!content.value.trim()) return alert("내용을 입력해주세요.");

    comment({ content: content.value, token: token, postIdx: idx })
      .then(res => { if (res.status === 200) window.location.reload(); })
      .catch(err => alert("댓글 등록 중 오류가 발생했습니다."));
  }

  return (
    <div className="detail-page">
      <div className="detail-content-wrapper">
        <main className="post-main">
          <div className="back-btn" onClick={() => window.history.back()}>← 커뮤니티 목록으로 돌아가기</div>

          <header className="detail-header">
            <h1 className="detail-title">{post.title}</h1>
            <div 
              className="author-info-row" 
              onClick={handleProfileClick} 
              style={{ cursor: 'pointer' }}
              title="작가 프로필 방문하기"
            >

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

              {/* ✅ [수정] 일차별로 렌더링 */}
              <div className="timeline">
                {Object.keys(groupedRoadmap).length > 0 ? (
                  Object.keys(groupedRoadmap).map((day) => (
                    <div key={day} className="day-section">
                      
                      {/* 일차 표시 헤더 (Day 1, Day 2 ...) */}
                      <div className="day-header" style={{
                          padding: '10px 0', 
                          fontWeight: 'bold', 
                          color: '#5D5FEF', 
                          borderBottom: '1px dashed #ddd',
                          marginBottom: '15px',
                          marginTop: day > 1 ? '30px' : '0'
                      }}>
                        📅 Day {day}
                      </div>

                      {groupedRoadmap[day].map((item, index) => (
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
                      ))}
                    </div>
                  ))
                ) : (
                  <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>로드맵 정보가 없습니다.</p>
                )}
              </div>
            </div>
          </article>

          <section className="comment-section">
            <h3>댓글 {comments ? comments.length : 0}개</h3>
            <div className="comment-list">
              {comments && comments.map(c => (
                <div key={c.idx} className="comment-card">

                  <div className="comment-body" style={{ marginLeft: '10px' ,
                    marginTop: '10px'
                  }}>
                    <div className="comment-user-info">
                      <span className="c-name" onClick={() => handleCommentUserClick(c.userIdx)} style={{ cursor: 'pointer' }}>
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
              <div className="input-box">
                <textarea placeholder="댓글을 남겨주세요..." id="content"></textarea>
                <button className="submit-comment" onClick={inputcomment}>등록하기</button>
              </div>
            </div>
          </section>
        </main>

        <aside className="post-sidebar">
          <div className="sidebar-stats">
            <div className="stat-item"><span>❤️</span> 좋아요 <strong>{post.likeCount || 0}</strong></div>
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