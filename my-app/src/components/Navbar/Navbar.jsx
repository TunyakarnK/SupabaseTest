import React from "react";
import "./Navbar.css";
import { supabase } from "src/supabaseClient";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar (props) {
  const navigate = useNavigate();
    const [showNavbar, setShowNavbar] = React.useState(false);
    // console.log(props)
     
    const handleShowNavbar = () => {
      setShowNavbar(!showNavbar);
    };

    async function signOut() {
      await supabase.auth.signOut();
      navigate("/");
    }
    // const isClicked = () =>{
    //   console.log("isClicked")
    // }
  
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
              <li>
                <div onClick={signOut}>{props.props.user_metadata.name}</div>
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
