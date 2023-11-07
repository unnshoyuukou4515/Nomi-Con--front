import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import "./ViewMap.css"
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 訪問済みアイコン
const visitedIzakayaIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1321/1321913.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// 通常アイコン
const izakayaIcon = new L.Icon({
  iconUrl: 'https://i.ibb.co/J5wwLM2/041818-removebg-preview.png',
  iconSize: [55, 55],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


const ViewMap = () => {
  // コンポーネント
  const [izakayas, setIzakayas] = useState([]);
  const [visitedIzakayas, setVisitedIzakayas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [rating, setRating] = useState(3);
  const [showConquredMessage, setShowConquredMessage] = useState(false);
  //new  If the submit button is pressed fetch again for changing marker and Conqure message
  const [buttonPressed, setButtonPressed] = useState(false);



  // useLocation位置情報
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/home', { state: { userId: userId, username: username } }); // Homeコンポーネントに渡す
  };


//   console.log("location state:", location.state);
//   console.log("latitude:", location.state.location?.latitude);
// console.log("longitude:", location.state.location?.longitude);
// console.log("userIDtest", location.state.userId)
const latitude = location.state?.location?.latitude || null;
const longitude = location.state?.location?.longitude || null;
// location.stateからuserIdとusername
const userId = location.state?.userId || null;
const username = location.state?.username || null;


const fetchIzakayas = async () => {
  try {
    // console.log(`緯度=${latitude}, 経度=${longitude}`);
    const response = await axios.get(`${apiUrl}/izakayas`, {
      params: { latitude, longitude },
    });
    console.log("データ受取：", response.data);
    setIzakayas(response.data); 
  } catch (error) {
    console.error('could not get data', error);
  }
};


const fetchVisitedIzakayas = async () => {
  try {
    const response = await axios.get(`${apiUrl}/user/${userId}/visited-izakayas`);
    const visitedIds = response.data.map(item => item.restaurant_id);
    setVisitedIzakayas(visitedIds);
  } catch (error) {
    console.error('could not get data visited', error);
  }
};
  // マウント時にデータ取得
  useEffect(() => {  
    // console.log("latitude2:", latitude);
    // console.log("longitude2:", longitude);
    console.log("userId:", userId + "username",username);

    if (latitude && longitude && userId) {
      fetchIzakayas(); // 酒データ取得を実行
      // console.log("fetchIzakayasisRunning");
      fetchVisitedIzakayas();
    }
  }, [latitude, longitude, userId]); 

  // 居酒屋を訪問済みとしてマークする関数
  const handleVisit = async () => {
    // ポップアップを非表示
    setShowPopup(false);
    // console.log('selectedShophandle:', selectedShop);
    if (!selectedShop) return; // selectedShopがない時のノーアクション用
    // 訪問データをサーバーに送信
    const postData = {
      user_id: userId,
      restaurant_id: selectedShop,
      rating: rating,
      visited_at: new Date().toISOString(),
    };
    console.log(postData)
    try {

      await axios.post(`${apiUrl}/markAsEaten`, postData);
      setButtonPressed(true)
      setVisitedIzakayas((prevVisited) => [...prevVisited, selectedShop.id]);
    } catch (error) {
      console.error('failed to send data', error);
    }
  };

  const checkAllConqured = () => {
    const allConqured = izakayas.every((shop) =>
      visitedIzakayas.includes(shop.id)
    );
    setShowConquredMessage(allConqured);
  };

  // すべての店舗が訪問済みかどうか=>メッセージと画像表示のため
  useEffect(() => {
    checkAllConqured();
  }, [visitedIzakayas, izakayas]); 

  useEffect(()=>{
    setButtonPressed(false)
    fetchIzakayas(); // 酒データ取得を実行
    // console.log("fetchIzakayasisRunning");
    fetchVisitedIzakayas();
    checkAllConqured();
  },[buttonPressed]
  )

  const handleConqreMessageClose = () => {
    setShowConquredMessage(false);
  };


  // レンダリングロジック
  return (
    <div>
      <button className="VeiwMap-toHome" onClick={goHome}>Go Home</button>
      <div className="hotpepper-credit">
  <a href="https://www.hotpepper.jp/" target="_blank" rel="noopener noreferrer">
    <img src="https://webservice.recruit.co.jp/banner/hotpepper-s.gif" alt="提供：ホットペッパー Webサービス"/>
  </a>
</div>
    <div className="map-view">
      {/* 緯経取得できているならにマップを表示 */}
      {latitude && longitude ? (
        <div className="map-container"> 
          <MapContainer center={[latitude, longitude]} zoom={17} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* 現在位置マーカー */}
            <Marker position={[latitude, longitude]}>
              <Popup className="popup-current-location">
                You are here!
              </Popup>
            </Marker>
            {/* 居酒屋のマーカーをマップに配置 */}
            {izakayas.map((shop) => (
              <Marker
                key={shop.id}
                position={[shop.lat, shop.lng]}
                icon={visitedIzakayas.includes(shop.id) ? visitedIzakayaIcon : izakayaIcon}
                eventHandlers={{
                  click: () => {
                    console.log('Selected shop:', shop);
                    setSelectedShop(shop.id); 
                    setShowPopup(true); 
                  },
                }}
              >
                <Popup className="popup-shop-info"> 
                  <div className="popup-shop-content"> 
                    <img src={shop.photo.pc.l} alt={shop.name} style={{width: '150px', height: 'auto'}} />
                    <p>{shop.name}</p>
                    <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer">To Hotpepper page</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <p className="loading-map"> 
          Loading map...
        </p>
      )}
  
      {/* ポップアップ*/}
      {showPopup && selectedShop && (
        <div className="popup-modal"> 
          <div className="modal-content"> 
            <h2>Rating</h2>
            {/* 評価 */}
            <select className="rating-select" value={rating} onChange={(e) => setRating(e.target.value)}> 
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number} Star
                </option>
              ))}
            </select>
            {/* 送信ボタン */}
            <button className="submit-rating" onClick={() => handleVisit(selectedShop)}> 
              Submit
            </button>
            {/* キャンセルボタン */}
            <button className="cancel-button" onClick={() => setShowPopup(false)}> 
              Cancel
            </button>
          </div>
        </div>
      )}
      {showConquredMessage && (
          <div className="congratulations-overlay" onClick={handleConqreMessageClose}>
            <div className="congratulations-message">
              <h1>Congratulations!</h1>
              <p>You are Izakaya Master in this Area!</p>
              <button onClick={handleConqreMessageClose}>Close</button>
            </div>
          </div>
        )}
    </div>
    </div>
  );
};

export default ViewMap;
