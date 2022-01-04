import React, { useEffect, useState } from "react";
import WorldDataCard from "./WorldDataCard";
import "./Homepage.css";
import GrayColor from "../login/GrayColor";
import EmissionPage from "../EmissionPage";
import { NavLink } from "react-router-dom";
import Footer from "../Footer";
import Charts from "./Charts";
import ChartSelector from "./ChartSelector";

//Prevents scrolling on homepage
//document.body.style.overflow = "hidden";

function Homepage({ user, loggedIn, setUser, setLoggedIn }) {
  const [worldData, setWorldData] = useState([]);
  const [hideNewForm, setHideNewForm] = useState(true);
  const [chartSelector, setChartSelector] = useState("");

  const totalFlightCarbon = user.flightHistory.reduce(
    (count, flight) => (count += flight.carbon_lb / flight.passengers),
    0
  );
  const totalShippingCarbon = user.shippingHistory.reduce(
    (count, shipping) => (count += shipping.carbon_lb),
    0
  );

  const totalVehicleCarbon = user.vehicleHistory.reduce(
    (count, vehicle) => (count += vehicle.carbon_lb),
    0
  );

  //Logs out of account
  const logoutHandler = () => {
    fetch("http://localhost:3001/users")
      .then((r) => r.json())
      .then((userData) => {
        setUser(userData[0]);
        setLoggedIn(false);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3001/countryAverageCapita")
      .then((r) => r.json())
      .then((data) => {
        setWorldData(data.sort((a, b) => (a.average < b.average ? 1 : -1)));
        setChartSelector("mode-of-transport");
      });
  }, []);

  const selectHandler = (e) => {
    setChartSelector(e.target.value);
  };

  return (
    <div>
      <div>
        <GrayColor setHideNewForm={setHideNewForm} hideNewForm={hideNewForm} />
        <EmissionPage hideNewForm={hideNewForm} />
      </div>
      <div className="homepage-container">
        <div className="user-data-container"></div>
        <div className="world-data-container">
          <div className="homepage-user-info">
            <h1>Where do you rank in the world?</h1>
            <div>
              <div className="profile-image">
                <NavLink to={loggedIn ? "/user" : "/login"}>
                  <img
                    src={user.image}
                    alt="profile"
                    className="user-profile-img"
                  />
                </NavLink>
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                {loggedIn ? (
                  <NavLink to="/home">
                    <button onClick={logoutHandler}>Log Out</button>
                  </NavLink>
                ) : (
                  <NavLink to="/login">
                    <button>Log In</button>
                  </NavLink>
                )}
              </div>
              <div className="user">
                <h5>Total Carbon Footprint</h5>
                <h1>
                  {user.flightHistory.length !== 0
                    ? `${(
                        Math.round(
                          (totalFlightCarbon +
                            totalShippingCarbon +
                            totalVehicleCarbon) *
                            100
                        ) / 100
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} lbs`
                    : 0}
                </h1>
              </div>
            </div>
          </div>
          <div className="data">
            <h2>Average aviation emission per country</h2>
            <small>Statistics taken from 2018</small>
            <WorldDataCard worldData={worldData} />
          </div>
        </div>
        <div className="map-and-charts">
          <ChartSelector selectHandler={selectHandler} />
          <Charts chartSelector={chartSelector} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
