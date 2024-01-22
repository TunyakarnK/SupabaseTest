import React from "react";
import { Route, Router, Routes } from "react-router-dom";

//import pages 
import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar/Navbar";
import MyMeeting from "./pages/MyMeeting/MeetingFolder"
import SharedMeeting from "./pages/SharedMeeting/SharedMeetingFoldder";
import EditMeeting from "./pages/MyMeeting/EditMeeting";
import MeetingPage from "./pages/MyMeeting/MeetingPage";
import InmeetingPage from "./pages/MyMeeting/InmeetingPage";
import Conclusion from "./pages/MyMeeting/Conclusion";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MyMeeting" element={<MyMeeting />} />
      <Route path="/SharedMeeting" element={<SharedMeeting />} />
      <Route path="/EditMeeting" element={<EditMeeting />} />
      <Route path="/MeetingPage/:id" element={<MeetingPage />} />
      <Route path="/Inmeeting/:id" element={<InmeetingPage />} />
      <Route path="/Conclusion/:id" element={<Conclusion />} />
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>

  );
}

export default App;