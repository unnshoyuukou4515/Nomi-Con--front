import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './components/Login/Login'; // LoginFormコンポーネントのインポート
import RegistrationForm from './components/Register/Register'; // RegistrationFormコンポーネントのインポート
import Home from './components/Home/Home'; // Homeコンポーネントのインポート
import ViewMap from './components/Map/ViewMap'; // ViewMapコンポーネントのインポートを追加
import History from './components/History/History'
import SearchStation from './components/SearchStation/SearchStation'

function App() {
  // useStateの使用がここでは見当たらないので、不要であれば削除可能
  // const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path="/Register" element={<RegistrationForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Map" element={<ViewMap />} />
        <Route path="/History" element={<History />} />
        <Route path="/SearchStation" element={<SearchStation />} />
        {/* 他のルート */}
      </Routes>
    </Router>
  );
}

export default App;
