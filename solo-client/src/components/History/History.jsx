import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./History.css";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const History = () => {
  const [error, setError] = useState(null);
  const [visitedIzakaya, setVisitedIzakaya] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const { username } = location.state || {};

  const fetchVisitedIzakaya = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/user/${userId}/visited-izakayas`
      );
      const visitedIzakayaRating = response.data; 
      const izakayaPromises = visitedIzakayaRating.map(
        (visited) =>
          axios
            .get(`${apiUrl}/search-by-id/${visited.restaurant_id}`)
            .then((res) => ({
              ...res.data.results.shop[0],
              rating: visited.rating,
            }))
      );
      const izakayaResult = await Promise.all(izakayaPromises);
      setVisitedIzakaya(izakayaResult.reverse());
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchVisitedIzakaya();
  }, [userId]);

  const updateRating = async (restaurantId, newRating) => {
    try {
      const response = await axios.put(
        `${apiUrl}/user/${userId}/restaurant/${restaurantId}/rate`,
        {rating: newRating,}
      );
      fetchVisitedIzakaya();
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  const deleteVisitedIzakaya = async (restaurantId) => {
    try {
      await axios.delete(`${apiUrl}/user/${userId}/restaurant/${restaurantId}`);
      setVisitedIzakaya(currentIzakayalist => 
        currentIzakayalist.filter(izakaya => izakaya.id !== restaurantId)
      );
    } catch (error) {
      console.error('Failed to delete visit record:', error);
    }
  };

  const goHome = () => {
    navigate("/home", { state: { userId: userId, username: username } });
  };
  return (
    <div className="history-container">
    <button className="goHome-button" onClick={goHome}>
      Go Home
    </button>
    <div className="hotpepper-credit">
      <a
        href="https://www.hotpepper.jp/"
      >
        <img
          className="hotpepper-logo"
          src="https://webservice.recruit.co.jp/banner/hotpepper-s.gif"
          alt="提供：ホットペッパー Webサービス"
        />
      </a>
    </div>
    <div className="visited-izakayas">
      <h1 className="visitedIzakayas-title">Visited Izakayas</h1>

      <div className="izakaya-list">
        {visitedIzakaya.map((izakaya) => (
          <div key={izakaya.id} className="izakaya-item">
            <div className="izakaya-info">
              <h3 className="izakaya-name">{izakaya.name}</h3>
              <img
                className="izakaya-image"
                src={izakaya.photo.pc.l}
                alt={izakaya.name}
                style={{ width: "150px", height: "auto" }}
              />
              <p className="izakaya-address">{izakaya.address}</p>
              <p className="izakaya-station">{izakaya.station_name}駅</p>
              <p className="izakaya-open">Open: {izakaya.open}</p>
              <p className="izakaya-rating">Rating: {izakaya.rating} / 5</p>
              <a
                className="izakaya-link"
                href={izakaya.urls.pc}
              >
                Visit Hotpepper Page
              </a>
              <select
                className="rating-select"
                value={izakaya.rating}
                onChange={(event) => updateRating(izakaya.id, event.target.value)}
              >
                <option value="">Select a rating</option>
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button className="delete-button" onClick={() => deleteVisitedIzakaya(izakaya.id)}>
                Delete Izakaya
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default History;
