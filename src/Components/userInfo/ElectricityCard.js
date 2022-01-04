import "./UserInfo.css";

function ElectricityCard({electricity, onElectricityDelete}) {
    return (
        <div className="flight-card">
          <h4 className="card-header">{electricity.date.slice(0,10)}</h4>
          <ul>
            <p>Country: {electricity.country}</p>
            <p>State: {electricity.state}</p>
            <p>Electricity used: {electricity.electricity_value}</p>
            <p>Estimated carbon: {electricity.carbon_lb} </p>
          </ul>
          <button
            onClick={() => onElectricityDelete(electricity)}
            className="carbon-estimate-btn"
          >
            Delete Flight
          </button>
        </div>
      );
        
}

export default ElectricityCard;
