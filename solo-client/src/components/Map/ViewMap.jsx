import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const izakayaIcon = new L.Icon({
  iconUrl: 'https://i.ibb.co/J5wwLM2/041818-removebg-preview.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const ViewMap = ({ currentLatitude, currentLongitude, userId }) => {
  const [izakayas, setIzakayas] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // ポップアップの表示制御
  const [selectedShop, setSelectedShop] = useState(null); // 選択された居酒屋
  const [rating, setRating] = useState(3); // 初期評価

  useEffect(() => {
    // 居酒屋データの取得
    const fetchIzakayas = async () => {
      try {
        const response = await axios.get(`/api/izakayas`, {
          params: { latitude: currentLatitude, longitude: currentLongitude },
        });
        setIzakayas(response.data);
      } catch (error) {
        console.error('居酒屋の情報を取得できませんでした。', error);
      }
    };

    fetchIzakayas();
  }, [currentLatitude, currentLongitude]);

  // 訪問登録処理の関数
  const handleVisit = async () => {
    setShowPopup(false); // ポップアップを閉じる

    const postData = {
      user_id: userId,
      restaurant_id: selectedShop, // 選択された居酒屋のIDを使用
      rating: rating, // 選択された評価を使用
      visited_at: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`/api/markAsEaten`, postData);
      alert(response.data.message);
    } catch (error) {
      console.error('訪問済みの登録に失敗しました。', error);
      alert('エラー: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <MapContainer center={[currentLatitude, currentLongitude]} zoom={15} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {izakayas.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lng]}
            icon={izakayaIcon}
          >
            <Popup>
              <div>
                <strong>{shop.name}</strong><br />
                {shop.address}<br />
                <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer">ウェブサイト</a><br />
                <img src={shop.photo.pc.m} alt={`${shop.name}`} style={{ width: '100px', height: 'auto' }}/><br />
                <button onClick={() => { setShowPopup(true); setSelectedShop(shop.id); }}>行った</button>
              </div>
            </Popup>
          </Marker>
        ))}
        <Marker position={[currentLatitude, currentLongitude]}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>

      {/* ポップアップが表示される条件のモーダル */}
      {showPopup && (
        <div className="popup-modal">
          <div className="modal-content">
            <h2>レストランの評価</h2>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((number) => (
                <option key={number} value={number}>
                  {number} 星
                </option>
              ))}
            </select>
            <button onClick={handleVisit}>評価を送信</button>
            <button onClick={() => setShowPopup(false)}>キャンセル</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMap;
