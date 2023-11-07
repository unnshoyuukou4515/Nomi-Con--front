import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./Home.css"

function Home() {
  const navigate = useNavigate();
  const location = useLocation(); 
  // console.log("Current state at Home: ", location.state);
  const [userLocation, setUserLocation] = useState(null); 

  // location.stateユーザー情報
  const { userId, username } = location.state || {}; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
         console.log("Current Position:", position); 
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

    }
    // 位置とユーザーID、名前をマップへ
    navigate('/map', { state: { location: userLocation, userId ,username} });
  };

  //not yet
  const goToSearch = () => {
    navigate('/searchstation',{ state: { location: userLocation, userId ,username} });
  };
  //位置とユーザーID、名前を
  const goToHistory = () => {
    navigate('/history', { state: { location: userLocation, userId ,username} });
  };

  return (
<div className="home-container">
  <h1 className="home-title">let's get drunk! {username || 'Guest'}!</h1> 
  <div>
    <button className="home-button home-map-button" onClick={goToMap}>View Map</button>
  </div>
  <div>
    <button className="home-button home-search-button" onClick={goToSearch}>Search by Station</button>
  </div>
  <div>
    <button className="home-button home-history-button" onClick={goToHistory}>View History</button>
  </div>


</div>
  );
}

export default Home;
