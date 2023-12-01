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
      // signed in, go to Profile
      navigate("/Profile");
  }else{
    // not signed in, go to Login
    navigate("/");
  }
  })
  },[])
  
  
  return (
    <div className="App">
      <header className="App-header" style={{width: "300px", margin: "150px auto"}}>
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
  );
}

export default Login;