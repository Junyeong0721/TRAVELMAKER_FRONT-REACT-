import React from 'react';
import './WritePage.css';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { getCookie } from '../../js/getToken';
import { write } from '../api/게시판테스트/writeService';


const PostWrite = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null); // 에디터 내용을 가져오기 위한 ref
  const [title, setTitle] = useState(''); // 제목 상태 관리
 // 1. 썸네일 이미지를 담을 상태 (하나만 저장)
  const [thumbnail, setThumbnail] = useState('');

  // 2. 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 무조건 첫 번째 파일만 선택
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result); // Base64 경로 저장
      };
      reader.readAsDataURL(file);
    }
  };
  const 삭제하기 = (e) => {
    e.stopPropagation(); // 영역 클릭 이벤트가 겹치지 않게 방지
    setThumbnail('');    // 상태를 빈 값으로 만들어 미리보기를 지움
  };

  // 게시하기 버튼 클릭 시 실행
 const 글쓰기 = () => {
    if (!editorRef.current) return;
    const title = document.getElementById("title");
    const content = editorRef.current.getContent(); 
    const token = getCookie('token'); 

    // 서버로 보낼 데이터 객체 구성
    const obj = {
      title: title.value,      // 제목 상태값
      content: content,  // 에디터 HTML 내용
      thumbnail: thumbnail,
      planidx: 1, 
      token: token
    };

    console.log("서버로 전송할 데이터:", obj);

    // 실제 서버 전송 API 호출
    write(obj)
      .then(res => {
        console.log("서버 응답:", res);

        if (res.status === 200) {
          alert("글이 성공적으로 저장되었습니다!");
          navigate('/CommunityPage'); // 성공 시 커뮤니티 페이지로 이동
        } else {
          alert("서버 오류가 발생했습니다.");
        }
      })
      .catch(err => {
        console.error("통신 에러:", err);
        alert("네트워크 연결을 확인해주세요.");
      });
  };



  return (
    <div className="post-write-wrapper">
      <main className="write-container">
        {/* 상단 경로 및 제목 영역 */}
        <header className="write-header">
          <nav className="breadcrumb">커뮤니티 {'>'} <span>게시글 작성</span></nav>
          <div className="header-flex">
            <h2 className="main-title">여행 이야기 공유하기</h2>
            <div className="action-btns">
              <button className="btn-publish" onClick={글쓰기}>게시하기</button>
            </div>
          </div>
        </header>

        <div className="write-layout">
          {/* 왼쪽: 에디터 영역 */}
          <section className="editor-section">
            <div className="input-card">
              <label className="input-label">🖋️ 제목</label>
              <input type="text" className="title-input" placeholder="당신의 여행에 멋진 제목을 붙여주세요" id="title"/>
            </div>

            <div className="input-card">
              <label className="input-label">📝 내용</label>
              <div className="editor-container">
                <Editor
                  apiKey = 'd1y2skf5ovre6zinkxg4evgq170a6emydjbkkeyejxffoxuj'
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue="<p>어떤 여행이었나요? 이곳에 자세한 이야기를 들려주세요...</p>"
                  init={{
                    height: 800,
                    menubar: false,
                    statusbar: false,
                    language: 'ko_KR', 
                    language_url: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/7/langs/ko_KR.js',
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'image | removeformat | help',
                    // 이미지 업로드 관련 설정 (Base64 저장을 위해 필요)
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>
            </div>
          </section>

          {/* 오른쪽: 사이드바 영역 */}
          <aside className="write-sidebar">
            {/* 여행 플래너 추가 */}
            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🗺️</span>
                <h4>여행 플래너 추가</h4>
              </div>
              <div className="load-planner-box">
                <button className="btn-load-planner">
                  <span>📅</span> 플래너 불러오기
                </button>
              </div>
            </div>

            {/* 미디어 업로드 */}
            <div className="sidebar-card">
              <div className="card-header">
                <span className="icon">🖼️</span>
                <h4>대표 썸네일</h4>
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
                      /* 이미지가 있을 때: 미리보기 이미지 출력 */
                      <div className="upload-info">
                        <img src={thumbnail} alt="썸네일 미리보기" style={{ width: '100%', borderRadius: '8px' }} />
                        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>클릭하여 사진 변경</p>
                      </div>
                    ) : (
                      /* 이미지가 없을 때: 기본 UI */
                      <div className="upload-info">
                        <div className="upload-icon">📸</div>
                        <p>대표 사진을 선택해주세요</p>
                        <span>목록에 보여질 썸네일입니다.</span>
                      </div>
                    )}
                <button className="btn-file-select">파일 선택</button>
              </div>

              <div className="upload-tip">
                <h5>ⓘ 업로드 팁</h5>
                <ul>
                  <li>고화질 사진은 최대 20MB까지 업로드 가능합니다.</li>
                  <li>여행 분위기가 잘 드러나는 사진을 선택해주세요.</li>
                  <li>부적절한 미디어는 제재될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="write-footer">
        <p>© 2024 TripMate. All rights reserved.</p>
        <div className="footer-links">
          <span>이용약관</span> <span>개인정보처리방침</span> <span>고객센터</span>
        </div>
      </footer>
    </div>
  );
};

export default PostWrite;