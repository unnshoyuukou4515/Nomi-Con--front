import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./History.css"
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


const History = () => {
  const [visitedRestaurants, setVisitedRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  const { userId } = location.state || {};
  const {username}= location.state  || {};

  // 訪問済みレストランのIDを取得する
  useEffect(() => {
    const fetchVisitedRestaurants = async () => {
      const { userId } = location.state || {};
      console.log(userId)
      if (!userId) {
        setError('User ID is not provided');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/user/${userId}/visited-izakayas`);
        // Set the state with unique restaurant IDs
        const uniqueRestaurantIds = Array.from(new Set(response.data.map(restaurant => restaurant.restaurant_id)));
        setVisitedRestaurants(uniqueRestaurantIds);
      } catch (error) {
        setError('An error occurred while fetching the visited restaurants');
      }
    };

    fetchVisitedRestaurants();
  }, [location.state]);

  // ホームに戻る関数
  const goHome = () => {
    navigate('/home', { state: { userId: userId, username: username } })
  };

  return (
    <div>
        <button onClick={goHome}>Go Home</button>
        <div className="hotpepper-credit">
  <a href="https://www.hotpepper.jp/" target="_blank" rel="noopener noreferrer">
    <img src="https://webservice.recruit.co.jp/banner/hotpepper-s.gif" alt="提供：ホットペッパー Webサービス"/>
  </a>
</div>
    <div>
      <h1>Visited Restaurants</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {visitedRestaurants.map((restaurantId) => (
          <li key={restaurantId}>
            {restaurantId} {/* Here you might want to fetch and display restaurant names */}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default History;

