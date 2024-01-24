import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar';

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [countries, setCountries] = useState([]);
  const [meeting, setMeeting] = useState([]);

  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user);
          console.log(value)
        }
      });
    }

    getUserData();
    getCountries();
    getMeeting();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  async function getMeeting() {
    const { data } = await supabase.from("meeting").select();
    setMeeting(data);
  }

  const addThai = async () => {
    const { data, error } = await supabase
      .from('countries')
      .insert({ name: 'Thailand' })
      .select();

    if (error) {
      console.log(error);
      alert('Cannot add', error);
    }

    if (data) {
      alert("Thailand's added");
      window.location.reload(false);
    }
  };

  const delThai = async () => {
    const { error } = await supabase
      .from('countries')
      .delete()
      .eq('name', 'Thailand');

    alert("Thailand's deleted");
    window.location.reload(false);

    if (error) {
      console.log(error);
      alert('Cannot delete', error);
    }
  };

  
 
    const loadGoogleApi = async () => {
      try {
        // Load the Google API client library
        await new Promise((resolve, reject) => {
          window.gapi.load('client:auth2', 'v3', resolve);
          if (reject) {
            console.log(reject);
          }
        });

        // Initialize the Google API client
        await window.gapi.client.init({
          apiKey: 'AIzaSyDYoFTA7hVwkmijam-AkpLYfLgISUrTZaA',
          clientId: '743410676927-p1ob0g0i2qvkigeacnvhspc0t9nh0arp.apps.googleusercontent.com',
          discoveryDocs: ['https://www.googleapis.com/calendar/v3/calendars/primary/events'],
          scope: 'https://www.googleapis.com/auth/calendar',
        });

        // Check if the user is signed in
        const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();

        if (isSignedIn) {
          // Call functions to interact with Google Calendar API
          listUpcomingEvents();
        } else {
          console.log('User is not signed in to Google.');
        }
      } catch (error) {
        console.error('Error loading Google API client:', error);
      }
    };

    
  

  // Function to list upcoming events from Google Calendar
  const listUpcomingEvents = async () => {
    try {
      const event = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      });

      console.log('Google Calendar Events:', event.result.items);
    } catch (error) {
      console.error('Error listing Google Calendar events:', error);
    }
  };

  return (
    <div className="App">
      {Object.keys(user).length !== 0 ? (
        <>
          <header>
            <Navbar props={user} />
          </header>
          <div className="App">
            <button onClick={addThai}>Add Thailand</button>
            <button onClick={delThai}>Delete Thailand</button>
            <h1>Supabase Doc React JSX App template</h1>

            <p>countries</p>
            {countries.map((country) => (
              <li key={country.name}>{country.name}</li>
            ))}

            <p>Meeting Name</p>
            {meeting.map((meeting) => (
              <li key={meeting.meetName}>{meeting.meetName}</li>
            ))}

            <button onClick={() => signOut()}>Sign Out</button>
            <button onClick={loadGoogleApi}>List Upcoming Events</button>
          </div>
        </>
      ) : (
        <>
          {/* if error, do something */}
        </>
      )}
    </div>
  );
}

export default Profile;
