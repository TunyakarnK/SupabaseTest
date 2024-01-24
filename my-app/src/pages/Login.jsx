import React from "react";
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  
  useEffect(()=>{
    
    supabase.auth.onAuthStateChange(async (event) =>{
    if (event == "SIGNED_IN") {
      console.log(event)
      // signed in, go to Profile
      // navigate("/Profile");
      navigate("/MyMeeting");
  }else{
    // not signed in, go to Login
    navigate("/");
  }
  })
  },[])
  
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
  //   })
  //   throw navigate("/Profile", {state: {data}});
  // }
  
 

  
  return (
    <div className="App">
      <h1 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Welcome to</h1>
      <h2 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Web application for efficient managing conferences</h2>
      <header className="App-header" style={{width: "300px", margin: " auto"}}>
        
      <Auth
        supabaseClient={supabase}
        appearance={{theme: ThemeSupa}}
        providers={['google']}
        queryParams={{
          access_type: 'online',
          prompt: 'consent',
          // hd: 'gmail.com',
        }}
        providerScopes={{
          google: 'https://www.googleapis.com/auth/calendar',
        }}
      />
      </header>
    </div>
    // <div
    //   id="g_id_onload"
    //   data-client_id="<client ID>"
    //   data-context="signin"
    //   data-ux_mode="popup"
    //   data-callback="handleSignInWithGoogle"
    //   data-nonce=""
    //   data-auto_select="true"
    //   data-itp_support="true"
    // ><button onClick={handleSignInWithGoogle}>google Login</button>
    //   </div>
  );
}

export default Login;