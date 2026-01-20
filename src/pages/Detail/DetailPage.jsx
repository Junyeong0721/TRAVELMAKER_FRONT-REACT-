import React, { use } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './DetailPage.css';
import { boardDetail } from '../api/게시판상세보기/detailService';

const CommunityDetail = () => {
  const { idx } = useParams();
  const [detail, setDetail] = useState(null);
  useEffect(()=>{
    boardDetail(idx)
    .then(res => {
      if(res.status === 200){
        console.log(res.data);
        setDetail(res.data);
      }
      
      
    }).catch(err => console.error(err));
  }, [idx]);
  if(!detail){
    return <div>Loading...</div>;
  }


  // 게시글 및 로드맵 더미 데이터
  const post = {
    title: "에메랄드 빛 바다와 완벽한 휴식, 나의 첫 번째 제주 한 달 살기 기록",
    author: "이지아",
    mbti: "ENFP",
    date: "2024년 5월 12일",
    views: "1,240",
    likes: 1204,
    roadmap: [
      { time: "10:00 AM", place: "오설록 티 뮤지엄", desc: "드넓은 녹차밭에서 인생샷 남기기 딱 좋은 포인트예요.", tags: ["#자연경관", "#사진맛집"], badge: "MBTI 찰떡" },
      { time: "01:30 PM", place: "엔트러사이트 한림점", desc: "공장을 개조한 카페로 ENFP의 창의력을 자극하는 분위기!", tags: ["#카페투어", "#공간디자인"], badge: "빈티지 감성" },
      { time: "04:30 PM", place: "수월봉 일몰 산책", desc: "하루를 마무리하며 노을을 감상하기 가장 좋은 곳입니다.", tags: ["#로맨틱", "#노을명소"], badge: "로맨틱" }
    ]
  };

  // 댓글 더미 데이터
  const comments = [
    { id: 1, user: "박민수", mbti: "INTJ", time: "2시간 전", text: "로드맵이 정말 효율적으로 짜여있네요. 저도 다음 제주 여행 때 참고해야겠어요!", likes: 0 },
    { id: 2, user: "김태희", mbti: "ENFP", time: "5시간 전", text: "와! 저랑 성향이 같으시네요! 추천해주신 카페 꼭 가보고 싶어요 ㅎㅎ", likes: 3 }
  ];

  return (
    <div className="detail-page">
      <div className="detail-content-wrapper">
        {/* 왼쪽 메인 콘텐츠 영역 */}
        <main className="post-main">
          <div className="back-btn">← 커뮤니티 목록으로 돌아가기</div>
          
          <header className="detail-header">
            <h1 className="detail-title">{post.title}</h1>
            <div className="author-info-row">
              <div className="author-profile-img"></div>
              <div className="author-text">
                <div className="name-mbti">{post.author} <span className="mbti-badge">{post.mbti}</span></div>
                <div className="post-meta">{post.date} · 조회수 {post.views}</div>
              </div>
            </div>
          </header>

          <article className="post-article">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80" alt="Main" className="article-main-img" />
            <p>모든 것이 낯선 곳에서 시작된 한 달. 처음에는 막막하기도 했지만 제주가 주는 특유의 여유로움이 저를 금세 매료시켰어요. 이번 글에서는 AI 플래너가 짜준 완벽한 루트와 제 MBTI인 ENFP 취향을 저격한 숨은 장소들을 소개할게요.</p>
            
            <h3>1. 아침의 시작, 해수욕장에서의 산책</h3>
            <p>협재 해변의 투명한 물빛은 언제 봐도 질리지 않아요. 아침 일찍 나가면 사람들 없이 오롯이 파도 소리만 들을 수 있답니다. ENFP인 저에게는 이런 감성적인 순간들이 하루를 지탱하는 힘이 되었어요.</p>
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" alt="Cafe" className="article-sub-img" />

            <h3>2. AI가 추천한 오늘의 루트 (Day 3)</h3>
            <p>TripMate의 AI 플래너가 제 취향과 MBTI를 분석해 제안한 셋째 날 일정이에요. 단순히 유명한 곳이 아니라, 활동적이고 사람들과 어울리기 좋아하는 저에게 딱 맞는 장소들이었죠.</p>

            {/* AI 플래너 로드맵 카드 */}
            <div className="roadmap-container">
              <div className="roadmap-header">
                <span className="sparkle-icon">✨</span>
                <div className="roadmap-title">
                  <h4>AI 플래너 로드맵</h4>
                  <p>지아님의 ENFP 성향에 맞춘 최적화 경로</p>
                </div>
              </div>
              <div className="timeline">
                {post.roadmap.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="time-dot"></div>
                    <div className="timeline-content">
                      <div className="item-header">
                        <span className="item-time-place">{item.time} - {item.place}</span>
                        <span className="item-label">{item.badge}</span>
                      </div>
                      <p className="item-desc">{item.desc}</p>
                      <div className="item-tags">
                        {item.tags.map(tag => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p>혼자 떠난 여행이었지만 TripMate 덕분에 외롭지 않았어요. 특히 실시간으로 추천되는 주변 명소들은 계획에 없던 서프라이즈 같은 기쁨을 주었죠. 여러분도 꼭 한번 사용해보세요!</p>
          </article>

          {/* 댓글 섹션 */}
          <section className="comment-section">
            <h3>댓글 24개</h3>
            <div className="comment-list">
              {comments.map(c => (
                <div key={c.id} className="comment-card">
                  <div className="comment-user-img"></div>
                  <div className="comment-body">
                    <div className="comment-user-info">
                      <span className="c-name">{c.user} <span className="c-mbti">{c.mbti}</span></span>
                      <span className="c-time">{c.time}</span>
                    </div>
                    <p className="c-text">{c.text}</p>
                    <div className="c-actions">좋아요 {c.likes > 0 ? c.likes : ''} · 답글달기</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input-area">
              <div className="comment-user-img"></div>
              <div className="input-box">
                <textarea placeholder="댓글을 남겨주세요..."></textarea>
                <button className="submit-comment">등록하기</button>
              </div>
            </div>
          </section>
        </main>

        {/* 오른쪽 사이드바 영역 */}
        <aside className="post-sidebar">
          <div className="sidebar-stats">
            <div className="stat-item"><span>❤️</span> 좋아요 <strong>{post.likes.toLocaleString()}</strong></div>
            <div className="stat-item"><span>🔗</span> 공유하기</div>
            <button className="copy-planner-btn">🪄 이 플래너 복사하기</button>
            <p className="btn-sub-text">클릭하면 나의 AI 플래너 즉시 편집 가능합니다.</p>
          </div>

          <div className="about-author-card">
            <p className="about-label">ABOUT AUTHOR</p>
            <div className="author-card-content">
              <div className="author-avatar-large"></div>
              <div className="author-card-info">
                <h4>이지아</h4>
                <p>여행하는 기획자</p>
              </div>
            </div>
            <p className="author-intro">세상의 모든 바다를 보고 싶은 여행자입니다. MBTI는 뼈속까지 ENFP!</p>
            <button className="follow-btn">팔로우 하기</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CommunityDetail;