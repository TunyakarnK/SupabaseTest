import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

//import pages 
import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import SignUp from "./pages/SignUp";
import MyMeeting from "./pages/MyMeeting/MyMeeting"
import SharedMeeting from "./pages/SharedMeeting/SharedMeetingFoldder";
import EditMeeting from "./components/EditMeeting";
import MeetingList from "./pages/MyMeeting/MeetingList";
import StartMeeting from "./pages/MyMeeting/StartMeeting";
import MeetingPage from "./pages/MyMeeting/MeetingPage";
import FolderStatisticPage from "./components/FolderStatisticPage";
import Feedback from "./components/Feedback/Feedback";
import InmeetingPage from "./pages/MyMeeting/InmeetingPage";
import Conclusion from "./pages/MyMeeting/Conclusion";
import SharedMeetingList from "./pages/SharedMeeting/SharedMeetingList";

function App() {
  return (
    <MantineProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MyMeeting" element={<MyMeeting />} />
      <Route path="/Folder/:folderid" element={<MeetingList/>} />
      <Route path="/Folder/:folderid/statistic" element={<FolderStatisticPage />} />
      <Route path="/MeetingPage/:id" element={<MeetingPage />} />
      <Route path="/SharedMeeting" element={<SharedMeeting />} />
      <Route path="/SharedMeeting/:folderid" element={<SharedMeetingList />} />
      <Route path="/EditMeeting" element={<EditMeeting />} />
      <Route path="/Inmeeting/:id" element={<InmeetingPage />} />
      <Route path="/Conclusion/:id" element={<Conclusion />} />
      <Route path="/Feedback" element={<Feedback />} />
      <Route path="/StartMeeting" element={<StartMeeting />} />
      <Route path="/MeetingPage/:id" element={<MeetingPage />} />

      
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>
    </MantineProvider>
  );
}

export default App;