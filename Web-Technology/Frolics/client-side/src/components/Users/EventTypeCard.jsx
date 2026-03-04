import React from 'react';

const EventTypeCard = ({ title, subtitle, icon = '🎫', color = '#3b82f6' , onClick}) => {
  const style = {
    '--card-accent': color,
  };

  return (
    <button className="event-type-card" style={style} onClick={onClick} aria-label={title}>
      <div className="event-type-icon" aria-hidden>
        {icon}
      </div>
      <div className="event-type-body">
        <div className="event-type-title">{title}</div>
        {subtitle && <div className="event-type-sub">{subtitle}</div>}
      </div>
    </button>
  );
};

export default EventTypeCard;
