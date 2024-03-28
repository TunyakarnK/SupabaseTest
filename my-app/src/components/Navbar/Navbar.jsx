import React from "react";
import { useState } from 'react';
import classes from "./Navbar.module.css";
import { supabase } from "src/supabaseClient";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Group, Burger, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const links = [
  { link: '/', label: 'Profile' },
  { link: '/MyMeeting', label: 'MyMeeting' },
  { link: '/SharedMeeting', label: 'SharedMeeting' }, 
];

function Navbar (props) {
  const navigate = useNavigate();
    const [showNavbar, setShowNavbar] = React.useState(false);
    const [opened, { toggle }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    // console.log(props)
    const items = links.map((link) => (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
        data-active={active === link.link || undefined}
        onClick={(event) => {
          event.preventDefault();
          setActive(link.link);
        }}
      >
        {link.label}
      </a>
    ));
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
          <NavLink to="/MyMeeting" className="title">
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
                <NavLink to="/SharedMeeting">Shared with me</NavLink>
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
