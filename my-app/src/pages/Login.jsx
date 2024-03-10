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

  useEffect(()=>{   
    supabase.auth.onAuthStateChange(async (event) =>{
    if (event == "SIGNED_IN") {
      console.log(event)
      // getUserData();
      // handleSignInWithGoogle(user);
      // signed in, go to Profile
      navigate("/MyMeeting");
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
  async function handleSignInWithGoogle(response) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
    nonce: 'NONCE', // must be the same one as provided in data-nonce (if any)
  })
  setUserData(data)
}

  
  return (
    <div className="App">
      <h1 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Welcome to</h1>
      <h2 style={{display: 'flex', alignItems: 'center',justifyContent: 'center'}} >Web application for efficient managing conferences</h2>
      <header className="App-header" style={{width: "300px", margin: " auto"}}>
        
      <Auth
        supabaseClient={supabase} 
        // showLinks={false}
        appearance={{theme: ThemeSupa}}
        theme="light"
        providers={['google']}
        // queryParams={{
        //   access_type: 'offline',
        //   prompt: 'consent',
        //   // hd: 'gmail.com',
        // }}
        // providerScopes={{
        //   google: 'https://www.googleapis.com/auth/calendar',
        // }}        
      />
     


      </header>
    </div>
  );
}

export default Login;

// const google = window.google;
//   useEffect(()=>{   
//     supabase.auth.onAuthStateChange(async (event) =>{
//     if (event == "SIGNED_IN") {
//       console.log(event)
//       // getUserData();
//       // handleSignInWithGoogle(user);
//       // signed in, go to Profile
//       // navigate("/Profile");
//       navigate("/MyMeeting");
//   }else{
//     // not signed in, go to Login
//     navigate("/");
//   }})
//   async function getUserData() {
//     await supabase.auth.getUser().then((value) => {
//       if (value.data?.user) {
//         setUser(value.data.user);
//         // console.log(value)
//       }
//     });
//   }
//   },[]) 
//   async function handleSignInWithGoogle(response) {
//   const { data, error } = await supabase.auth.signInWithIdToken({
//     provider: 'google',
//     token: response.credential,
//     nonce: 'NONCE', // must be the same one as provided in data-nonce (if any)
//   })
//   setUserData(data)
// }
// import React from "react";
// import { useEffect, useState } from "react";
// import { supabase } from '../supabaseClient';
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { useNavigate } from "react-router-dom";


// function Login() {
//   const navigate = useNavigate();

//   useEffect(()=>{
//     supabase.auth.onAuthStateChange(async (event) =>{
//     if (event == "SIGNED_IN") {
//       // signed in, go to Profile
//       navigate("/MyMeeting");
//   }else{
//     // not signed in, go to Login
//     navigate("/");
//   }
//   })
//   },[])


//   return (
//     <div className="App">
//       <header className="App-header" style={{width: "300px", margin: "150px auto"}}>
//       <Auth
//         supabaseClient={supabase}
//         appearance={{theme: ThemeSupa}}
//         providers={['google']}
//         queryParams={{
//           access_type: 'online',
//           prompt: 'consent',
//           // hd: 'gmail.com',
//         }}
//         providerScopes={{
//           google: 'https://www.googleapis.com/auth/calendar',
//         }}
//       />
//       </header>
//     </div>
//   );
// }

// export default Login;