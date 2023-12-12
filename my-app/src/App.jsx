import React from "react";
import { Route, Router, Routes } from "react-router-dom";

//import pages 
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import MyMeeting from "./pages/MyMeeting/MeetingFolder"
import SharedMeeting from "./pages/SharedMeeting/SharedMeetingFoldder";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MyMeeting" element={<MyMeeting />} />
      <Route path="/SharedMeeting" element={<SharedMeeting />} />
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>

  );
}

export default App;