import React, { useEffect, useState, useRef } from 'react';
import './EditPage.css'; // 기존 CSS 그대로 사용
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../js/getToken';
import { edit } from '../api/edit/editService';   // 게시글 정보 불러오는 API
import { update } from '../api/edit/updateService'; // 수정 저장 API
import { SelectPlan } from '../api/plan/PlanService';

const PostEdit = () => {
  const { idx } = useParams(); // URL의 :idx
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  // 상태 관리 (PostWrite와 동일하게 유지)
  const [title, setTitle] = useState(''); // 제목을 상태로 관리해야 기존값 노출 가능
  const [thumbnail, setThumbnail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plannerList, setPlannerList] = useState([]);
  const [selectedPlanner, setSelectedPlanner] = useState(null);

  // 1. [핵심] 페이지 로딩 시 기존 데이터 불러와서 셋팅
  useEffect(() => {
    if (!idx) return;

    edit(idx)
      .then(res => {
        const data = res.data;
        setTitle(data.title);      // 제목 채우기
        setThumbnail(data.thumbnail); // 썸네일 채우기
        
        // 플래너 정보가 있으면 셋팅
        if (data.planIdx) {
          setSelectedPlanner({ 
            idx: data.planIdx, 
            title: data.planTitle || "연결된 플래너" 
          });
        }

        // 에디터 내용은 에디터가 로드된 후 setContent로 주입 (아래 onInit에서 처리)
      })
      .catch(err => {
        console.error("로드 실패:", err);
        alert("정보를 불러올 수 없습니다.");
      });
  }, [idx]);

  // 플래너 리스트 불러오기 (기존 함수 동일)
  function planner(){
    const token = getCookie('token');
    SelectPlan(token)
      .then(res => {
        setPlannerList(res.data);
        setIsModalOpen(true);
      }).catch(err => console.log("error"));
  }

  // 파일 변경 (기존 함수 동일)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 썸네일 삭제 (기존 함수 동일)
  const 삭제하기 = (e) => {
    e.stopPropagation();
    setThumbnail('');
  };

  // 2. [핵심] 게시하기 대신 실행될 '수정완료' 함수
  const 수정완료 = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.getContent(); 
    const token = getCookie('token'); 

    const obj = {
      idx: idx, // 수정 시 필수인 글 번호
      title: title, 
      content: content,
      thumbnail: thumbnail,
      planIdx: selectedPlanner ? selectedPlanner.idx : 0,
      token: token
    };

    update(obj)
      .then(res => {
        if (res.status === 200) {
          alert("글이 성공적으로 수정되었습니다!");
          navigate(`/DetailPage/${idx}`);
        }
      })
      .catch(err => {
        console.error("수정 에러:", err);
        alert("수정 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="post-write-wrapper">
      <main className="write-container">
        <header className="write-header">
          <nav className="breadcrumb">커뮤니티 {'>'} <span>게시글 수정</span></nav>
          <div className="header-flex">
            <h2 className="main-title">여행 이야기 수정하기</h2>
            <div className="action-btns">
              {/* 글쓰기 함수 대신 수정완료 함수 연결 */}
              <button className="btn-publish" onClick={수정완료}>수정완료</button>
            </div>
          </div>
        </header>

        <div className="write-layout">
          {/* 왼쪽: 에디터 영역 */}
          <section className="editor-section">
            <div className="input-card">
              <label className="input-label">🖋️ 제목</label>
              <input 
                type="text" 
                className="title-input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                id="title"
              />
            </div>

            <div className="input-card">
              <label className="input-label">📝 내용</label>
              <div className="editor-container">
                <Editor
                  apiKey='d1y2skf5ovre6zinkxg4evgq170a6emydjbkkeyejxffoxuj'
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                    // 에디터 로드 완료 후 기존 본문 주입
                    edit(idx).then(res => editor.setContent(res.data.content));
                  }}
                  init={{
                    height: 800,
                    menubar: false,
                    language: 'ko_KR',
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help',
                  }}
                />
              </div>
            </div>
          </section>

          {/* 오른쪽: 사이드바 영역 (기존 형식 100% 복구) */}
          <aside className="write-sidebar">
            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🗺️</span>
                <h4>여행 플래너 변경</h4>
              </div>
              <div className="load-planner-box">
                <button className="btn-load-planner" onClick={planner}>
                  <span>📅</span> {selectedPlanner ? selectedPlanner.title : "플래너 불러오기"}
                </button>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🖼️</span>
                <h4>대표 썸네일 수정</h4>
              </div>
              <div className="upload-zone" onClick={() => document.getElementById('thumb-input').click()} style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  id="thumb-input" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
                {thumbnail ? (
                  <div className="upload-info">
                    <img src={thumbnail} alt="미리보기" style={{ width: '100%', borderRadius: '8px' }} />
                    <button type="button" onClick={삭제하기} className="btn-file-select" style={{marginTop: '10px'}}>이미지 삭제</button>
                  </div>
                ) : (
                  <div className="upload-info">
                    <div className="upload-icon">📸</div>
                    <p>대표 사진을 선택해주세요</p>
                  </div>
                )}
                {!thumbnail && <button className="btn-file-select">파일 선택</button>}
              </div>
              <div className="upload-tip">
                <h5>ⓘ 업로드 팁</h5>
                <ul>
                  <li>기존 등록된 사진을 변경할 수 있습니다.</li>
                  <li>고화질 사진은 최대 20MB까지 가능합니다.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 모달 영역 (기존 형식 100% 유지) */}
      {isModalOpen && (
        <div className="planner-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="planner-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>나의 여행 플래너 변경</h3>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <div className="modal-body">
              <ul className="planner-select-list">
                {plannerList && plannerList.length > 0 ? (
                  plannerList.map((item) => (
                    <li key={item.idx} onClick={() => { 
                      setSelectedPlanner(item);
                      setIsModalOpen(false);
                    }}>
                      <span className="p-icon">📍</span>
                      <span className="p-title">{item.title}</span>
                    </li>
                  ))
                ) : (
                  <p className="no-data">생성된 플래너가 없습니다.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEdit;