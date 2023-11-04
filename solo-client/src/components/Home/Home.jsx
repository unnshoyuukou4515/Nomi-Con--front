import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
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
    navigate('/map', { state: { location } });
  };

  const goToSearch = () => {
    navigate('/search');
  };

  const goToHistory = () => {
    navigate('/history');
  };

  return (
    <div className="home-container">
      <h1>Welcome to Home</h1>
      <button onClick={goToMap}>View Map</button>
      <button onClick={goToSearch}>Search by Station</button>
      <button onClick={goToHistory}>View History</button>
      {/* その他のコンポーネントが続く */}
    </div>
  );
}

export default Home;
