import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar (props) {
    const [showNavbar, setShowNavbar] = React.useState(false);
    // console.log(props)
     
    const handleShowNavbar = () => {
      setShowNavbar(!showNavbar);
    };
  
    return (
      <nav className="navbar">
        <div className="container">
          <div className="logo">
          <NavLink to="/Profile" className="title">
        Logo
      </NavLink>
          </div>
          <div className="menu-icon" onClick={handleShowNavbar}>            
          </div>
          <div className={'nav-elements  ${showNavbar && "active"}'}>
            <ul>
              <li>
                <NavLink to="/MyMeeting">MyMeeting</NavLink>
              </li>
              <li>
                <NavLink to="/SharedMeeting">SharedMeeting</NavLink>
              </li>
              <li>{props.props.user_metadata.name}
              </li><div>
                <img className="avatar"
                    src={props.props.user_metadata.avatar_url}
                    /></div>
            </ul>
             
          </div>
        </div>
      </nav>
  );
}
export default Navbar;
