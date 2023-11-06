import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Home.css"

function Home() {
  const navigate = useNavigate();
  const location = useLocation(); // 追加：useLocationフックを使用してロケーションオブジェクトを取得する
  // console.log("Current state at Home: ", location.state);
  const [userLocation, setUserLocation] = useState(null); // stateの名前を変更して、React Routerのlocationと混同を避ける

  // location.stateからユーザー情報を取り出す
  const { userId, username } = location.state || {}; // ナビゲートからのstateをチェック

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //  console.log("Current Position:", position); 
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  const goToMap = () => {
    // console.log('Current user location:', userLocation);
    // console.log('Current userId:', userId); 
    if (typeof userId === 'undefined') {
      console.error('UserId is undefined at this point');
      // さらなるデバッグやエラー処理をここに追加できます。
    }
    // ユーザーの地理的位置とユーザーIDをマップページに渡す
    navigate('/map', { state: { location: userLocation, userId ,username} });
  };

  // goToSearch と goToHistory 関数は変更がないためそのままです
  const goToSearch = () => {
    navigate('/search');
  };

  const goToHistory = () => {
    navigate('/history', { state: { location: userLocation, userId ,username} });
  };

  return (
<div className="home-container">
  <h1 className="home-title">Welcome to Home, {username || 'Guest'}!</h1> {/* ユーザー名が存在する場合は表示 */}
  <div>
    <button className="home-button home-map-button" onClick={goToMap}>View Map</button>
  </div>
  <div>
    <button className="home-button home-search-button" onClick={goToSearch}>Search by Station</button>
  </div>
  <div>
    <button className="home-button home-history-button" onClick={goToHistory}>View History</button>
  </div>

  {/* その他のコンポーネントが続く */}
</div>
  );
}

export default Home;
