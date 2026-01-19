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
                <h4>미디어 업로드</h4>
              </div>
              <div className="upload-zone">
                <div className="upload-info">
                  <div className="upload-icon">📸</div>
                  <p>당신의 여행 사진을 공유해보세요</p>
                  <span>사진 또는 영상을 이곳으로 드래그하거나<br/>클릭하여 파일을 선택하세요.</span>
                </div>
                <button className="btn-file-select">파일 선택</button>
              </div>
              
              <div className="uploaded-list">
                <div className="upload-count">업로드된 파일 (0) <span>최대 10장</span></div>
                <div className="file-grid">
                  <div className="file-placeholder">🖼️</div>
                  <div className="file-placeholder">🖼️</div>
                  <div className="file-add-btn">+</div>
                </div>
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