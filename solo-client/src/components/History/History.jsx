import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./History.css";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const History = () => {
  const [error, setError] = useState(null);
  const [visitedIzakaya, setVisitedIzakaya] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = location.state || {};
  const {username} = location.state || {};

  // Visited居酒屋のIDを取得
  useEffect(() => {
    const fetchVisitedIzakaya = async () => {
      if (!userId) {
        setError('User ID is not provided');
        return;
      }
      
      try {

        const response = await axios.get(`${apiUrl}/user/${userId}/visited-izakayas`);
        // console.log('Response data:', response.data);
        const noDupIzakayaIds = [...new Set(response.data.map(izakaya => izakaya.restaurant_id))];
        const izakayaPromises = noDupIzakayaIds.map(id =>
          axios.get(`${apiUrl}/search-by-id/${id}`)
        );
        const izakayasResponses = await Promise.all(izakayaPromises);
        setVisitedIzakaya(izakayasResponses.map(res => res.data.results.shop[0]).reverse());
      } catch (error) {
        setError('error');
        console.error(error);
      }
    };
    fetchVisitedIzakaya();
  }, [userId]);


  const goHome = () => {
    navigate('/home', { state: { userId: userId, username: username } });
  };

  return (
    <div>
      <button className='goHome-button' onClick={goHome}>Go Home</button>
      <div className="hotpepper-credit">
        <a href="https://www.hotpepper.jp/" target="_blank" rel="noopener noreferrer">
          <img src="https://webservice.recruit.co.jp/banner/hotpepper-s.gif" alt="提供：ホットペッパー Webサービス"/>
        </a>
      </div>
      <div className="visited-izakayas">
        <h1 className='visitedIzakayas-title'>Visited Izakayas</h1>
        {error && <p>Error: {error}</p>}
        <div className="izakaya-list">
          {visitedIzakaya.map((izakaya, index) => (
            <div key={izakaya.id} className="izakaya-item">
              <div className="izakaya-info">
                <h3>{izakaya.name}</h3>
                <img src={izakaya.photo.pc.l} alt={izakaya.name} style={{width: '150px', height: 'auto'}} />
                <p>{izakaya.address}</p>
                <p>{izakaya.station_name}駅</p>
                <p>{izakaya.open}</p>
                <a href={izakaya.urls.pc} target="_blank" rel="noopener noreferrer">Visit Hotpepper page</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
