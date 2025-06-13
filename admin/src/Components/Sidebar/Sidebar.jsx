import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/volunteer-request')}>
        Volunteer Req
      </button>
      <button onClick={() => navigate('/donate-history')}>
        Donate History
      </button>
      <button onClick={() => navigate('/event-mgt')}>
        Events
      </button>
      <button onClick={() => navigate('/shop')}>
        Shop
      </button>
      <button onClick={() => navigate('/order')}>
        Orders
      </button>
    </div>
  );
};

export default Sidebar;
