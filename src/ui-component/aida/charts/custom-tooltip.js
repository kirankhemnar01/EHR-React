import './custom-tooltip.scss';

export function CustomTooltip(props) {
  const { active, payload, label } = props;
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className='title'>{label}</p>
        {payload && payload.map(item => (
          <div className='item' key={item.name}>
            <span>
              <span style={{ color: item.color }}>&#9679;</span>
              <span style={{ marginLeft: 8 }}>{item.name}:</span>
            </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
