import React from "react";
import '../styles/Homepage.css'
import { Link } from "react-router-dom";

export const Homepage = () => {
    return <>
        <video autoPlay muted loop id="myVideo">
        <source src="/assets/video/bg.mp4" type="video/mp4" />
      </video>
      <div className="content">
        <div className="card w-25">
          <img src="/assets/images/logo.png" height={200} width={200} alt="logo" />
          <hr />
          <div className="card-body" style={{ marginTop: "-60px" }}>
            <h5 className="card-title">Nepal No #1 Carrer Platform</h5>
            <p className="card-text">
              Search and manage your jobs with ease. free and open source job
              ortal application by ImageTech.
            </p>
            <div className="d-flex justify-content-between mt-5">
              <p>
                Not a user Register <Link to="/register">Here !</Link>{" "}
              </p>
              <p>
                <Link to="/login" className="myBtn">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
}