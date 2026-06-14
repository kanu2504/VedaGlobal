import React from 'react';

const StatCard = ({ title, value, icon, onClick }) => {
  return (
    <div className="admin-stat-card" onClick={onClick}>
      <div className="admin-stat-card-left">
        <h4>{title}</h4>
        <div className="stat-value">{value}</div>
      </div>
      <div className="admin-stat-card-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
