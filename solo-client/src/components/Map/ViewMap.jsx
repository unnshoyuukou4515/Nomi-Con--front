import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "./ViewMap.css";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 訪問済みアイコン
const visitedIzakayaIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1321/1321913.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// 通常アイコン
const izakayaIcon = new L.Icon({
  iconUrl: "https://i.ibb.co/J5wwLM2/041818-removebg-preview.png",
  iconSize: [55, 55],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

//現在位置アイコン（Leafletのデフォルトが使えないため）
const drunkguy = new L.Icon({
  iconUrl:
    "https://i.ibb.co/Q8hKNGB/3a1f104dd63aa49ddb01f711654e8119-t-removebg-preview.png",
  iconSize: [100, 100],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ViewMap = () => {
  const [izakayas, setIzakayas] = useState([]);
  const [visitedIzakayas, setVisitedIzakayas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [rating, setRating] = useState(3);
  const [showConquredMessage, setShowConquredMessage] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  // useLocation位置情報
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home", { state: { userId: userId, username: username } });
  };

  const latitude = location.state?.location?.latitude || null;
  const longitude = location.state?.location?.longitude || null;
  const userId = location.state?.userId || null;
  const username = location.state?.username || null;

  const fetchIzakayas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/izakayas`, {
        params: { latitude, longitude },
      });
      setIzakayas(response.data);
    } catch (error) {
      console.error("could not get data", error);
    }
  };

  const fetchVisitedIzakayas = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/user/${userId}/visited-izakayas`
      );
      const visitedIds = response.data.map((item) => item.restaurant_id);
      setVisitedIzakayas(visitedIds);
    } catch (error) {
      console.error("could not get data visited", error);
    }
  };

  useEffect(() => {
    if (latitude && longitude && userId) {
      fetchIzakayas();
      fetchVisitedIzakayas();
    }
  }, [latitude, longitude, userId]);

  const handleVisit = async () => {
    setShowPopup(false);
    if (!selectedShop) return;

    const postData = {
      user_id: userId,
      restaurant_id: selectedShop,
      rating: rating,
      visited_at: new Date().toISOString(),
    };

    try {
      await axios.post(`${apiUrl}/markAsEaten`, postData);
      setButtonPressed(true);
      setVisitedIzakayas((prevVisited) => [...prevVisited, selectedShop.id]);
    } catch (error) {
      console.error("failed to send data", error);
    }
  };

  const checkAllConqured = () => {
    const allConqured = izakayas.every((shop) =>
      visitedIzakayas.includes(shop.id)
    );
    setShowConquredMessage(allConqured);
  };

  useEffect(() => {
    checkAllConqured();
  }, [visitedIzakayas, izakayas]);

  useEffect(() => {
    setButtonPressed(false);
    fetchIzakayas();
    fetchVisitedIzakayas();
    checkAllConqured();
  }, [buttonPressed]);

  const handleConqreMessageClose = () => {
    setShowConquredMessage(false);
  };

  return (
    <div>
      <button className="ViewMap-toHome" onClick={goHome}>
        Go Home
      </button>
      <div className="viewmap-title">Izakaya Around You</div>

      <div className="map-view">
        {latitude && longitude ? (
          <div className="map-container">
            <MapContainer
              center={[latitude, longitude]}
              zoom={17}
              style={{ height: "100vh", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]} icon={drunkguy}>
                <Popup className="popup-current-location">You are here!</Popup>
              </Marker>
              {izakayas.map((shop) => (
                <Marker
                  key={shop.id}
                  position={[shop.lat, shop.lng]}
                  icon={visitedIzakayas.includes(shop.id)
                      ? visitedIzakayaIcon
                      : izakayaIcon
                  }
                  eventHandlers={{
                    click: () => {
                      setSelectedShop(shop.id);
                      setShowPopup(true);
                    },
                  }}
                >
                  <Popup className="popup-shop-info">
                    <div className="popup-shop-content">
                      <img
                        className="popUpImage"
                        src={shop.photo.pc.l}
                        alt={shop.name}
                        style={{ width: "150px", height: "auto" }}
                      />
                      <p className="popUpStoreName">{shop.name}</p>
                      <a
                        className="popUpLink"
                        href={shop.urls.pc}
                        target="_blank"
                        rel="noopener noreferrer"
                      >To Hotpepper page
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <p className="loading-map">Loading map...</p>
        )}

        {showPopup && selectedShop && (
          <div className="popup-modal">
            <div className="modal-content">
              <h2>Rating</h2>

              <select
                className="rating-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((number) => (
                  <option key={number} value={number}>
                    {number} Star
                  </option>
                ))}
              </select>

              <button
                className="submit-rating"
                onClick={() => handleVisit(selectedShop)}
              >Submit
              </button>

              <button
                className="cancel-button"
                onClick={() => setShowPopup(false)}
              >Cancel
              </button>
            </div>
          </div>
        )}
        {showConquredMessage && (
          <div
            className="congratulations-overlay"
            onClick={handleConqreMessageClose}
          >
            <div className="congratulations-message">
              <h1 className="meessage1">Congratulations!</h1>
              <p className="message2">
                You are the Izakaya Master in this Area!
              </p>
              <button
                className="messageButton"
                onClick={handleConqreMessageClose}
              >Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hotpepper-credit">
        <a
          href="https://www.hotpepper.jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://webservice.recruit.co.jp/banner/hotpepper-s.gif"
            alt="提供：ホットペッパー Webサービス"
          />
        </a>
      </div>
    </div>
  );
};

export default ViewMap;
