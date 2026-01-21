import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import SignUp from './pages/signUp/SignUp'; // 폴더명 소문자 주의
import MyPage from './pages/MyPage/MyPage';
import AiPage from './pages/AI/AiPage';
import FriendPage from './pages/Friend/FriendPage';
import CommunityPage from './pages/Community/CommunityPage';
import WritePage from './pages/Write/WritePage';
import DetailPage from './pages/Detail/DetailPage';
import WriteInfo from './pages/WriteInfo/WriteInfo';
import HeaderLayout from './pages/Components/HeaderLayout';
import MyTravelPage from './pages/MyPage/MyTravelPage';
import PlanEditPage from './pages/PlanEditPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 헤더 없는 페이지 */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Sign" element ={<SignUp />} />
          <Route path="/AiPage" element ={<AiPage />} />
          <Route path="/main" element={<Main />} />

          {/* 공통 헤더 적용 페이지 */}
          <Route element={<HeaderLayout />}>
            <Route path="/MyPage" element ={<MyPage />} />
            <Route path="/FriendPage" element ={<FriendPage />} />
            <Route path="/CommunityPage" element       ={<CommunityPage />} />
            <Route path="/WriteInfo" element ={<WriteInfo />} />
          </Route>

          {/* 기타 페이지 */}
          <Route path="/WritePage" element ={<WritePage />} />
          <Route path="/DetailPage/:idx" element ={<DetailPage />} />
          <Route path="/plan/edit/:planIdx" element={<PlanEditPage />} />
           <Route path="/my-travels" element={<MyTravelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;