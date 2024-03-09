import React, { useEffect, useState } from 'react';

function CalendarApi() {
      const [tokenClient, setTokenClient] = useState(null);
      const [gapiInited, setGapiInited] = useState(false);
      const [gisInited, setGisInited] = useState(false);
    
      useEffect(() => {
        document.getElementById('authorize_button').style.visibility = 'hidden';
        document.getElementById('signout_button').style.visibility = 'hidden';
    
        const loadScript = (src, onload) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          script.onload = onload;
          document.head.appendChild(script);
        };
    
        loadScript('https://apis.google.com/js/api.js', gapiLoaded);
        loadScript('https://accounts.google.com/gsi/client', gisLoaded);
    
        // Cleanup on unmount
        return () => {
          document.head.removeChild(document.getElementById('gapiScript'));
          document.head.removeChild(document.getElementById('gisScript'));
        };
      }, []); // Run only once on mount
    
      const gapiLoaded = () => {
        window.gapi.load('client', initializeGapiClient);
      };
    
      const initializeGapiClient = async () => {
        await window.gapi.client.init({
          apiKey: 'AIzaSyDYoFTA7hVwkmijam-AkpLYfLgISUrTZaA',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        setGapiInited(true);
        maybeEnableButtons();
      };
    
      const gisLoaded = () => {
        setTokenClient(
          window.google.accounts.oauth2.initTokenClient({
            client_id: '743410676927-p1ob0g0i2qvkigeacnvhspc0t9nh0arp.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: '', // defined later
          })
        );
        setGisInited(true);
        maybeEnableButtons();
      };
    
      const maybeEnableButtons = () => {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      };
    
      const handleAuthClick = async () => {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw resp;
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await listUpcomingEvents();
        };
    
        if (window.gapi.client.getToken() === null) {
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      };
    
      const handleSignoutClick = () => {
        const token = window.gapi.client.getToken();
        if (token !== null) {
          window.google.accounts.oauth2.revoke(token.access_token);
          window.gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      };
    
      const listUpcomingEvents = async () => {
        let response;
        try {
          const request = {
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: 'startTime',
          };
          response = await window.gapi.client.calendar.events.list(request);
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
    
        const events = response.result.items;
        if (!events || events.length === 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
    
        const output = events.reduce(
          (str, event) =>
            `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
          'Events:\n'
        );
        document.getElementById('content').innerText = output;
      };
  return (
    <div>
        <div>CalendarApi</div>
    <p>Google Calendar API Quickstart</p>
    <button id="authorize_button" onClick={handleAuthClick}>
      Authorize
    </button>
    <button id="signout_button" onClick={handleSignoutClick}>
      Sign Out
    </button>
    <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
  </div>

);
};
    
 
export default CalendarApi