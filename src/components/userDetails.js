import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import GoogleMapReact from "google-map-react";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import { useParams } from "react-router-dom";

export default function UserDetails() {
  const [user, setUser] = useState({}); // holds the current user

  // holds the coordinates to present, I had to hold it in 'state' because GoogleMapReact 'center' property
  // must have initial value of (0,0) even if the component not renders at all (before the fetch).
  const [coordinates, setCoordinates] = useState({
    lat: 0,
    lng: 0,
  });

  const { username, page } = useParams(); // react hook to require the url params

  // fetch the user data using the seed,page and username from the table component
  // I will explain further in the description document why I had to use 'page'.
  useEffect(() => {
    fetch(`https://randomuser.me/api/?page=${page}&results=10&seed=dudiTal`)
      .then((result) => result.json())
      .then((data) => {
        data.results.forEach((user) => {
          //
          if (user.login.username === username) {
            setUser(user);
            setCoordinates(() => {
              return {
                lat: parseInt(user.location.coordinates.latitude),
                lng: parseInt(user.location.coordinates.longitude),
              };
            });
          }
        });
      });
  }, [page, username]);

  return (
    <div>
      {Object.keys(user).length > 0 && ( // only renders if user object is not empty.
        <div className="user--profile">
          <h1>User Details</h1>
          <div className="user--details">
            <div className="user--picture">
              <Avatar
                src={user.picture.thumbnail}
                style={{ width: "100px", height: "100px" }}
              />
              <span>{`${user.name.first} ${user.name.last}`}</span>
            </div>
            <br></br>
            <div className="user--further--info">
              <div>Gender: {user.gender}</div>
              <div>Email: {user.email}</div>
              <div>Age: {user.dob.age}</div>
            </div>
          </div>

          <div
            className="map--container"
            style={{ height: "250px", width: "250px" }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Google key placed in .env file
              }}
              center={coordinates}
              defaultZoom={5}
            >
              <PersonPinCircleOutlinedIcon // Icon for the location pin on the map
                lat={coordinates.lat}
                lng={coordinates.lng}
                style={{ color: "#993833" , padding:'10px' }}
              />
            </GoogleMapReact>
          </div>
        </div>
      )}
    </div>
  );
}
