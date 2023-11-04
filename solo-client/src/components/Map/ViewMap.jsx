import React from 'react';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ViewMap() {
  const location = useLocation();
  const position = location.state.location; // Homeコンポーネントから渡された位置情報を取得

  // 地図のマーカーに使用するカスタムアイコンを設定（必要に応じて）
  const customMarker = new L.Icon({
    iconUrl: require('/path/to/image.png'), // アイコンのURLを指定
    iconSize: [35, 35], // アイコンのサイズを設定
  });

  if (!position) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer center={[position.latitude, position.longitude]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[position.latitude, position.longitude]} icon={customMarker}>
        <Popup>
          You are here!
        </Popup>
      </Marker>
      {/* ここに他のマーカーまたは地図関連の要素を追加可能 */}
    </MapContainer>
  );
}

export default ViewMap;
