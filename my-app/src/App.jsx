import React, { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

//import pages 
import Login from "./pages/Login";
import Profile from "./pages/Profile";
// import SignUp from "./pages/SignUp";
import MyMeeting from "./pages/MyMeeting/MyMeeting"
import SharedMeeting from "./pages/SharedMeeting/SharedMeeting";
import EditMeeting from "./components/EditMeeting";
import MeetingList from "./pages/MyMeeting/MeetingList";
import StartMeeting from "./pages/MyMeeting/StartMeeting";
import MeetingPage from "./pages/MyMeeting/MeetingPage";
import FolderStatisticPage from "./components/FolderStatisticPage";
import Feedback from "./components/Feedback/Feedback";
import InmeetingPage from "./pages/MyMeeting/InmeetingPage";
import Conclusion from "./pages/MyMeeting/Conclusion";
import Note from "./components/Note";
import Detail_Conclusion from "./components/Detail_Conclusion";
import Navbar from "./components/Navbar/Navbar";
import Folder from "./pages/MyMeeting/Folder";
import SharedMeetingFoldder from "./pages/SharedMeeting/SharedMeetingFoldder";
import SharedMeetingList from "./pages/SharedMeeting/SharedMeetingList";

function App() {
  return (
    <MantineProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />

      <Route path="/MyMeeting" element={<MyMeeting />} />
      <Route path="/MyMeeting/Folder/:id"  element={<Folder />} />

      <Route path="/SharedMeeting" element={<SharedMeeting />} />
      <Route path="/SharedMeeting/Folder/:id" element={< SharedMeetingList/>} />
      <Route path="/EditMeeting" element={<EditMeeting />} />
      <Route path="/Inmeeting/:id" element={<InmeetingPage />} />
      <Route path="/Conclusion/:id" element={<Conclusion />} />
      <Route path="/Feedback" element={<Feedback />} />
      <Route path="/StartMeeting" element={<StartMeeting />} />
      <Route path="/MeetingPage/:id" element={<MeetingPage />} />
      <Route path="/MeetingPage/feedback/:id" element={<Feedback />} />
      {/* <Route path="/Detail_Note/:id" element={<Note />} /> */}
      {/* <Route path="/Detail_Conclusion/:id" element={<Detail_Conclusion />} /> */}
      <Route path="/Inmeeting/:id" element={<InmeetingPage />} />
      <Route path="/Conclusion/:id" element={<Conclusion />} />
      {/* <Route path="/Folder/:id" element={<Folder />}/> */}
      {/* <Route path="/MyMeeting/:folder" render={(props) => <MeetingDetails {...props} items={[]} />}
        /> */}
      
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
    </Routes>
    </MantineProvider>
  );
}

export default App;