import React from "react";
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
// import { google } from "googleapis";


function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [user, setUser] = useState({});
  // const google = window.google;
  
  useEffect(()=>{   
    supabase.auth.onAuthStateChange(async (event) =>{
    if (event == "SIGNED_IN") {
      console.log(event)
      // getUserData();
      // handleSignInWithGoogle(user);
      // signed in, go to Profile
      navigate("/Profile");
      // navigate("/MyMeeting");
  }else{
    // not signed in, go to Login
    navigate("/");
  }})

  async function getUserData() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        // console.log(value)
      }
    });
  }
  
  
  },[])

  // useEffect(() => {
  //   // Load Google Sign-In script dynamically
  //   const script = document.createElement('script');
  //   script.src = 'https://accounts.google.com/gsi/client';
  //   script.async = true;
  //   document.head.appendChild(script);

  //   // Initialize Google Sign-In
  //   script.onload = () => {
  //     window.gapi.load('auth2', () => {
  //       window.gapi.auth2.init({
  //         client_id: '743410676927-b5vf4q3sie5ovii9g9mblta14hivk4a9.apps.googleusercontent.com',
  //       });
  //     });
  //   };

  //   // Cleanup on unmount
  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  

  async function handleSignInWithGoogle(response) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
    nonce: 'NONCE', // must be the same one as provided in data-nonce (if any)
  })
  setUserData(data)
}

  
  
  // async function handleSignInWithGoogle(response) {
  //   const { data, error } = await supabase.auth.signInWithIdToken({
  //     provider: 'google',
  //     token: response.credential,
  //     options: {
  //       queryParams: {
  //         access_type: 'offline',
  //         prompt: 'consent',
  //       },
  //     },
  //     if(error){
  //     console.log(error)
  //   }})
  //   throw navigate("/Profile", {state: {data}}); 
  // }
  
 

  
  return (
    <div className="App">
      <h1 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Welcome to</h1>
      <h2 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Web application for efficient managing conferences</h2>
      <header className="App-header" style={{width: "300px", margin: " auto"}}>
        
      <Auth
        supabaseClient={supabase} showLinks={false}
        appearance={{theme: ThemeSupa}}
        providers={['google']}
        queryParams={{
          access_type: 'offline',
          prompt: 'consent',
          // hd: 'gmail.com',
        }}
        providerScopes={{
          google: 'https://www.googleapis.com/auth/calendar',
        }}        
      />

{/* <div
        id="g_id_onload"
        data-client_id="743410676927-b5vf4q3sie5ovii9g9mblta14hivk4a9.apps.googleusercontent.com"
        data-context="signup"
        data-ux_mode="popup"
        data-login_uri="https://oymrhotncbnylwsroxra.supabase.co/auth/v1/callback"
        data-itp_support="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
        // data-callback={handleSignInWithGoogle}
      ></div> */}
   
     


      </header>
    </div>
  );
}

export default Login;