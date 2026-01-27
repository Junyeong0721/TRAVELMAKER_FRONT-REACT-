import React, { use } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './DetailPage.css';
import { boardDetail } from '../api/게시판상세보기/detailService';
import { comment } from '../api/comment/commentService';
import { getCookie } from '../../js/getToken';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '../api/delete/deleteService';
import { addLike } from '../api/likeService/likeInsertService';
import { deleteLike } from '../api/likeService/likeDeleteService';



const CommunityDetail = () => {

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const navigate = useNavigate();
  const { idx } = useParams();
  const [detail, setDetail] = useState(null);
  useEffect(()=>{
    boardDetail(idx)
    .then(res => {
      if(res.status === 200){
        console.log(res.data);
        setDetail(res.data);
        setIsLiked(res.data.checkedLike);
        setLikeCount(res.data.post.likeCount);
      }
      
      
    }).catch(err => console.error(err));
  }, [idx]);
  if(!detail){
    return <div>Loading...</div>;
  }
  const { post, roadmap, comments } = detail;



  const handleLikeToggle = () => {
    const token = getCookie('token');


    if (isLiked) {
      // 1. 이미 좋아요 상태라면 -> 삭제(취소) API 호출
      deleteLike(idx, token)
        .then(res => {
          setIsLiked(false);
          setLikeCount(prev => prev - 1);
        })
        .catch(err => console.error("좋아요 취소 실패", err));
    } else {
      // 2. 좋아요가 아니라면 -> 추가 API 호출
      addLike(idx, token) 
        .then(res => {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        })
        .catch(err => console.error("좋아요 추가 실패", err));
    }
  };

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

  function inputcomment(){
    const content = document.getElementById("content");
    const token = getCookie('token');
    if (!content.value.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    console.log(idx);

    const obj = {
      content: content.value,   
      token: token,
      postIdx: idx
    }
    console.log(obj);
    comment(obj)
    .then(res => {
      if(res.status === 200){
        console.log(res.data);
        window.location.reload();
      }
    })
    
  }


  return (
    <div className="detail-page">
      <div className="detail-content-wrapper">
        <main className="post-main">
          {/* 목록으로 돌아가기 버튼 (useNavigate 활용 추천) */}
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
            {/* ✅ 제목 매칭 */}
            <h1 className="detail-title">{post.title}</h1>
            <div className="author-info-row">
              <div className="author-profile-img"></div>
              <div className="author-text">
                {/* ✅ 작성자, MBTI 매칭 */}
                <div className="name-mbti">{post.nickname} <span className="mbti-badge">{post.mbti}</span></div>
                {/* ✅ 작성일, 조회수 매칭 */}
                <div className="post-meta">{post.createAt} · 조회수 {post.viewCount}</div>
              </div>
            </div>
          </header>

          <article className="post-article">
            {/* 이미지 컬럼이 DB에 있다면 추가하고, 없다면 우선 고정 이미지를 유지합니다 */}
            
            
            {/* ✅ 본문 내용 매칭 */}
            <div 
              className="post-content-html"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <h3>AI가 추천한 오늘의 루트</h3>

            {/* AI 플래너 로드맵 카드 */}
            <div className="roadmap-container">
              <div className="roadmap-header">
                <span className="sparkle-icon">✨</span>
                <div className="roadmap-title">
                  <h4>AI 플래너 로드맵</h4>
                  <p>{post.nickname}님의 {post.mbti} 성향에 맞춘 최적화 경로</p>
                </div>
              </div>
              <div className="timeline">
                {/* ✅ 로드맵 리스트 매칭 (PLAN_DETAIL 데이터) */}
                {roadmap && roadmap.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="time-dot"></div>
                    <div className="timeline-content">
                      <div className="item-header">
                        {/* ✅ 시간 - 장소명 매칭 */}
                        <span className="item-time-place">{item.visitTime} - {item.planTitle}</span>
                        {/* ✅ 태그/배지 매칭 (DB의 types 활용) */}
                        <span className="item-label">{item.types}</span>
                      </div>
                      {/* ✅ 메모 매칭 */}
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
              {/* ✅ 댓글 리스트 매칭 */}
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
                <textarea placeholder="댓글을 남겨주세요..." id = "content"></textarea>
                <button className="submit-comment" onClick={inputcomment}>등록하기</button>
              </div>
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 영역 */}
        <aside className="post-sidebar">
          <div className="sidebar-stats">
            {/* ✅ 좋아요 수 매칭 */}
            <div 
              className={`stat-item like-btn ${isLiked ? 'active' : ''}`} 
              onClick={handleLikeToggle}
              style={{ cursor: 'pointer' }}
            >
              <span style={{ color: isLiked ? 'red' : 'inherit' }}>
                {isLiked ? '❤️' : '🤍'}
              </span> 
              좋아요 <strong>{likeCount}</strong>
            </div>
          </div>

          <div className="about-author-card">
            <p className="about-label">ABOUT AUTHOR</p>
            <div className="author-card-content">
              <div className="author-card-info">
                <h4>{post.nickname}</h4>
                <p>{post.userGrade}</p>
              </div>
            </div>
            {/* ✅ 작가 소개 매칭 */}
            <p className="author-intro">{post.userIntro || "소개글이 없습니다."}</p>
            <button className="follow-btn">팔로우 하기</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityDetail;