import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // API 호출 필수
import './DetailPage.css';
import { boardDetail } from '../api/게시판상세보기/detailService';
import { comment } from '../api/comment/commentService';
import { getCookie } from '../../js/getToken';

const CommunityDetail = () => {
  const { idx } = useParams();
  const [detail, setDetail] = useState(null);
  
  // 팔로우 상태 관리 (false: 안함, true: 함)
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    boardDetail(idx)
      .then(res => {
        if (res.status === 200) {
          console.log("게시글 상세 데이터:", res.data);
          setDetail(res.data);
          
          // ✅ [핵심 수정] 서버에서 "이미 팔로우함(true)" 이라고 하면 버튼 상태 켜기
          // 백엔드 DTO 구조상 post 안에 isFollowed가 들어있을 확률이 높습니다.
          if (res.data.post && res.data.post.followed) {
                 setIsFollowing(true);
}
        }
      })
      .catch(err => console.error(err));
  }, [idx]);

  if (!detail) {
    return <div>Loading...</div>;
  }

  const { post, roadmap, comments } = detail;

  // 팔로우 버튼 클릭 핸들러
  const handleFollow = async () => {
    const token = getCookie('token');

    // 1. 로그인 체크
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    // 2. 팔로우 대상 ID 가져오기
    const targetUserIdx = post.userIdx || post.writerIdx || post.idx; 
    console.log("팔로우 대상 유저 ID:", targetUserIdx);

    if (!targetUserIdx) {
      alert("작성자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      // 3. API 호출 (절대 주소 사용)
      await axios.post(`http://localhost:8085/api/follow/${targetUserIdx}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 4. 성공 시 버튼 상태 반전 (켜기 <-> 끄기)
      setIsFollowing(!isFollowing);
      
    } catch (error) {
      console.error("팔로우 실패:", error);
      if (error.response && error.response.status === 404) {
        alert("서버 연결 실패: 주소를 찾을 수 없습니다. (404)");
      } else {
        alert("팔로우 처리에 실패했습니다.");
      }
    }
  };

  // 댓글 등록 함수
  function inputcomment() {
    const content = document.getElementById("content");
    const token = getCookie('token');
    if (!content.value.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const obj = {
      content: content.value,
      token: token,
      postIdx: idx
    }

    comment(obj)
      .then(res => {
        if (res.status === 200) {
          console.log("댓글 등록 성공:", res.data);
          window.location.reload();
        }
      })
  }

  return (
    <div className="detail-page">
      <div className="detail-content-wrapper">
        <main className="post-main">
          {/* 목록으로 돌아가기 */}
          <div className="back-btn" onClick={() => window.history.back()}>← 커뮤니티 목록으로 돌아가기</div>

          <header className="detail-header">
            <h1 className="detail-title">{post.title}</h1>
            <div className="author-info-row">
              <div className="author-profile-img">
                 {/* 프로필 이미지 안전 처리 */}
                 {post.profileImg && <img src={post.profileImg} alt="프로필" style={{width:'100%', height:'100%', borderRadius:'50%'}} />}
              </div>
              <div className="author-text">
                <div className="name-mbti">{post.nickname} <span className="mbti-badge">{post.mbti}</span></div>
                <div className="post-meta">{post.createAt} · 조회수 {post.viewCount}</div>
              </div>
            </div>
          </header>

          <article className="post-article">
            <div
              className="post-content-html"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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
                {roadmap && roadmap.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="time-dot"></div>
                    <div className="timeline-content">
                      <div className="item-header">
                        <span className="item-time-place">{item.visitTime} - {item.planTitle}</span>
                        <span className="item-label">{item.types}</span>
                      </div>
                      <p className="item-desc">{item.memo}</p>
                      <div className="item-tags">
                        <span>#{item.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 댓글 섹션 */}
          <section className="comment-section">
            <h3>댓글 {comments.length}개</h3>
            <div className="comment-list">
              {comments.map(c => (
                <div key={c.idx} className="comment-card">
                  <div className="comment-user-img"></div>
                  <div className="comment-body">
                    <div className="comment-user-info">
                      <span className="c-name">{c.nickname} <span className="c-mbti">{c.mbti}</span></span>
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

        {/* 오른쪽 사이드바 영역 */}
        <aside className="post-sidebar">
          <div className="sidebar-stats">
            <div className="stat-item"><span>❤️</span> 좋아요 <strong>{post.likeCount}</strong></div>
            <div className="stat-item"><span>🔗</span> 공유하기</div>
          </div>

          <div className="about-author-card">
            <p className="about-label">ABOUT AUTHOR</p>
            <div className="author-card-content">
              <div className="author-avatar-large">
                {post.profileImg && <img src={post.profileImg} alt="작가 프로필" style={{width:'100%', height:'100%', borderRadius:'50%'}} />}
              </div>
              <div className="author-card-info">
                <h4>{post.nickname}</h4>
                <p>{post.userGrade}</p>
              </div>
            </div>
            <p className="author-intro">{post.userIntro || "소개글이 없습니다."}</p>
            
            {/* 팔로우 버튼 */}
            <button 
                className="follow-btn" 
                onClick={handleFollow}
                style={{
                    backgroundColor: isFollowing ? '#e0e0e0' : '#6c5ce7',
                    color: isFollowing ? '#333' : '#fff',
                    border: isFollowing ? '1px solid #ccc' : 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                }}
            >
                {isFollowing ? "팔로우 취소" : "팔로우 하기"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityDetail;