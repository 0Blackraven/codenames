import React from "react";
import { Link, BrowserRouter, Route, Routes } from "react-router-dom";
import { Create } from "./create";
import { Join } from "./join";

function Landing() {
  return (
    <>
        <nav>
            <div className="landing-header">
                <h1>Welcome !!!!!!!</h1>
            </div>
            <div className="landing-container">
                <div className="landing-buttons">
                    <Link to="/join">
                        <button>Join</button>
                    </Link>
                    <Link to="/create">
                        <button>Create</button>
                    </Link>
                </div>
            </div>
        </nav>
    </>
  );
}

export default Landing;