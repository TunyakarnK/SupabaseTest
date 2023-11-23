import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY

// const supabase = createClient(supabaseUrl,supabaseAnonKey)

 const supabase = createClient("https://oymrhotncbnylwsroxra.supabase.co", 
 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bXJob3RuY2JueWx3c3JveHJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODk5NzY4NCwiZXhwIjoyMDE0NTczNjg0fQ.R0ShSBDZW2WtO7LpJSszsfTHfwOyvk2rC6mP8-ztan0");

function App() {
  const [countries, setCountries] = useState([]);
  const [meeting, setMeeting] = useState([])
  

  useEffect(() => {
    getCountries();
  },[]);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
      setCountries(data);
  }

  useEffect(() => {
    getMeeting();
  }, []);
  async function getMeeting() {
    const { data } = await supabase.from("meeting").select();
      setMeeting(data);
  }

const addThai = async () =>{
  const { data,error } = await supabase
  .from('countries')
  .insert({ name: 'Thailand' })
  .select()
  if (error) {
    console.log(error);
    alert('cannot add', error);
  }
  if (data){
    alert("Thailand's added");
    window.location.reload(false);
  }
}
const delThai = async () =>{
const { error } = await supabase
  .from('countries')
  .delete()
  .eq('name', 'Thailand')
  alert("Thailand's deleted");
    window.location.reload(false);
  if (error) {
    console.log(error)
    alert('cannot delete', error)
  
}

}
  
  return (
    
      <ul>
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
     
      </ul>
      
      

  );
}

export default App;