import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 新しい訪問済みアイコン
const visitedIzakayaIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1321/1321913.png',
  iconSize: [45, 45],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// 通常の居酒屋アイコン
const izakayaIcon = new L.Icon({
  iconUrl: 'https://i.ibb.co/J5wwLM2/041818-removebg-preview.png',
  iconSize: [45, 45],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const ViewMap = () => {
  // コンポーネントの状態管理
  const [izakayas, setIzakayas] = useState([]);
  const [visitedIzakayas, setVisitedIzakayas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [rating, setRating] = useState(3);
  // console.logを使って緯度経度情報を出力します。


  // useLocationフックから位置情報を取得
  const location = useLocation();
  // URLパラメータから緯度経度を取得（あるいはデフォルト値をnullとする）
//   console.log("location state:", location.state);
//   console.log("latitude:", location.state.location?.latitude);
// console.log("longitude:", location.state.location?.longitude);
// console.log("userIDtest", location.state.userId)
const latitude = location.state?.location?.latitude || null;
const longitude = location.state?.location?.longitude || null;
// location.stateからuserIdを直接取得
const userId = location.state?.userId || null;

  // コンポーネントのマウント時に居酒屋データを取得
  useEffect(() => {
    
    // console.log("latitude2:", latitude);
    // console.log("longitude2:", longitude);
    // console.log("userId:", userId);
    // 緯度経度が正しく取得できていれば居酒屋データを取得する関数を呼び出す
    if (latitude && longitude && userId) {
      const fetchIzakayas = async () => {
        try {
          // console.log(`居酒屋を検索する座標: 緯度=${latitude}, 経度=${longitude}`);
          const response = await axios.get(`${apiUrl}/izakayas`, {
            params: { latitude, longitude },
          });
          // console.log("居酒屋のデータを受け取りました：", response.data);
          setIzakayas(response.data); // 状態を更新
        } catch (error) {
          console.error('居酒屋の情報を取得できませんでした。', error);
        }
      };

      fetchIzakayas(); // 居酒屋データを取得
      // console.log("fetchIzakayas関数の呼び出しが完了しました。");
      // 訪問済みの居酒屋データも同様に取得
      const fetchVisitedIzakayas = async () => {
        try {
          const response = await axios.get(`${apiUrl}/user/${userId}/visited-izakayas`);
          const visitedIds = response.data.map(item => item.restaurant_id);
          setVisitedIzakayas(visitedIds);
        } catch (error) {
          console.error('訪問済みの居酒屋の情報を取得できませんでした。', error);
        }
      };

      fetchVisitedIzakayas();
    }
  }, [latitude, longitude, userId]); // 依存配列

  // 居酒屋を訪問済みとしてマークする関数
  const handleVisit = async () => {
    // ポップアップを非表示にする
    setShowPopup(false);
    // console.log('selectedShophandle:', selectedShop);
    if (!selectedShop) return; // selectedShopがnullの場合は早期リターン
  
    // 訪問データをAPIに送信するためのpostDataを準備
    const postData = {
      user_id: userId,
      restaurant_id: selectedShop,
      rating: rating,
      visited_at: new Date().toISOString(),
    };
    console.log(postData)
    try {
      // '/api/markAsEaten'エンドポイントに対してポストし、成功したら状態を更新
      await axios.post(`${apiUrl}/markAsEaten`, postData);
      // 訪問済みの居酒屋リストを更新
      setVisitedIzakayas((prevVisited) => [...prevVisited, selectedShop.id]);
    } catch (error) {
      console.error('訪問済みの登録に失敗しました。', error);
    }
  };

  // レンダリングロジック
  return (
    <div>
      {/* 緯度経度が取得できている場合にマップを表示 */}
      {latitude && longitude ? (
        <MapContainer center={[latitude, longitude]} zoom={17} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
            {/* 現在位置にマーカーを追加 */}
            <Marker position={[latitude, longitude]}>
                <Popup>You are here!</Popup>
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
                  setSelectedShop(shop.id); // クリックされたshopのIDを選択
                  setShowPopup(true); // ポップアップを表示
                },
              }}
            >
              <Popup>  
                <div>
                  <img src={shop.photo.pc.l} alt={shop.name} style={{width: '150px', height: 'auto'}} />
                  <p>{shop.name}</p>
                  <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer">詳細ページへ</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}

      {/* ポップアップモーダル表示ロジック */}
      {showPopup && selectedShop && (
        <div className="popup-modal">
          <div className="modal-content">
            <h2>レストランの評価</h2>
            {/* 評価セレクター */}
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number} 星
                </option>
              ))}
            </select>
            {/* 評価送信ボタン */}
            <button onClick={() => handleVisit(selectedShop)}>評価を送信</button>
            {/* キャンセルボタン */}
            <button onClick={() => setShowPopup(false)}>キャンセル</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMap;
