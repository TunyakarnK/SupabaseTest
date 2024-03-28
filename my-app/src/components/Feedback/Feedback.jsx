import React from "react";
import { supabase } from "src/supabaseClient";
import { useParams } from "react-router-dom";
import { Grid, NativeSelect, rem, TextInput ,ScrollArea,Button,Radio,Group,Text} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
// import "survey-core/defaultV2.min.css";
// import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';
import { useStatem, useEffect, useState } from "react";
import { useSession } from '@supabase/auth-helpers-react';


const dataComment = [
  { value: 'Good', label: 'Good' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Bad', label: 'Bad' },
];

function Feedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState();
  const [ commentDatabase, setCommentDatabase ] = useState([]);
  const [emote, setEmote] = useState("Neutral");
  const [commentCard, setCommentCard] = useState([]);
  const [ checkAns, setCheckAns ] = useState(false);
  const [ checkEnded, setCheckEnded ] = useState(false);
  const session = useSession();
  // const [user, setUser] = useState({});
  const [selectedOption1, setSelectedOption1] = useState("Male")
  const [selectedOption2, setSelectedOption2] = useState("Male")
  const [selectedOption3, setSelectedOption3] = useState("Male")
  const [selectedOption4, setSelectedOption4] = useState("Male")

  function combinedcommentCardOnClick() {
    // Create a new object representing the combined comment and emote
    const combinedCommentObject = { id: commentCard.length + 1, comment: comment, emote: emote };
    
    // Update the commentCard array by adding the new object
    setCommentCard(prevCommentCard => [...prevCommentCard, combinedCommentObject]);
    
    // Reset comment and emote to prepare for the next input
    setComment([]);
    setEmote([]);
    console.log(commentCard)
  }
  

  const scores = [1,2,3,4,5,6,7,8,9,10]
  const select = (
    <NativeSelect
    onChange={(event) => setEmote(event.currentTarget.value)}
    defaultValue={emote}
      data={dataComment}
      rightSectionWidth={28}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(92),
          marginRight: rem(-2),
        },
      }}
    />
    );

  // Function to handle the change in radio button selection
  function onValueChange1(event){
      // Updating the state with the selected radio button's value
      setSelectedOption1(event.target.value)
  }

  function onValueChange2(event){
    // Updating the state with the selected radio button's value
    setSelectedOption2(event.target.value)
}
  function onValueChange3(event){
    // Updating the state with the selected radio button's value
    setSelectedOption3(event.target.value)
}
  function onValueChange4(event){
    // Updating the state with the selected radio button's value
    setSelectedOption4(event.target.value)
}

console.log(session.user.id);
  // Function to handle the form submission
  function submit(event) {
    // Preventing the default form submission behaviour
    event.preventDefault();
    
    // Logging the selected option
    console.log(selectedOption1)
    
    
    const data = [{
      qId: 1,
      answer: selectedOption1, 
   },
   {
    qId: 2,
    answer: selectedOption2
   },
   {
    qId: 3,
    answer: selectedOption3
   },
   {
    qId: 4,
    answer: selectedOption4
   },

  ];
  supabase.from("answer").insert([
    {
    questId: data[0].qId,
    answer: data[0].answer,
    meetId: id,
    userId: session.user.id
  },
  {
    questId: data[1].qId,
    answer: data[1].answer, 
    meetId: id,
    userId: session.user.id
  },
  {
    questId: data[2].qId,
    answer: data[2].answer, 
    meetId: id,
    userId: session.user.id
  },
  {
    questId: data[3].qId,
    answer: data[3].answer, 
    meetId: id,
    userId: session.user.id
  }
]
  )
  .then(result => {
    console.log(result);
    supabase
    .from("attendee")
    .update({checkFb: true})
    .eq("meetId", id)
    .eq("userId", session.user.id)
    .select("checkFb")
    .then((result) => {
      console.log(result);
      checkAnswer();
    })
  });
   console.log(data);   
   console.log(data[1].qId);
   console.log(data[1].answer);
   console.log(id);
  }

  const radioGroup = (
    <Group mt="xs">
        <Radio color="#EE5D20" value="1" label="1" />
        <Radio color="#EE5D20" value="2" label="2" />
        <Radio color="#EE5D20" value="3" label="3" />
        <Radio color="#EE5D20" value="4" label="4" />
        <Radio color="#EE5D20" value="5" label="5" />
        <Radio color="#EE5D20" value="6" label="6" />
        <Radio color="#EE5D20" value="7" label="7" />
        <Radio color="#EE5D20" value="8" label="8" />
        <Radio color="#EE5D20" value="9" label="9" />
        <Radio color="#EE5D20" value="10" label="10" />
      </Group>
  )
  useEffect(() => {
    fetchComment();
    checkAnswer();
    checkEndedMeeting();
  }, []);

  const checkEndedMeeting = async () => {
    const { data, error } = await supabase
    .from("meeting")
    .select("meetStatus")
    .eq("meetId", id)
    if ( data) {
      console.log("Check Meeting Status", data[0].meetStatus);
      setCheckEnded(data[0].meetStatus);
    }
  }
  const checkAnswer = async () => {
    const { data, error } = await supabase
    .from("attendee")
    .select("checkFb")
    .eq("meetId", id)
    .eq("userId", session.user.id)
    if ( data ){
      console.log("check answer", data[0].checkFb);
      setCheckAns(data[0].checkFb);
    }
  }

  const fetchComment = async () => {
    const { data, error } = await supabase
    .from("comment")
    .select("comId, comment, senId")
    .eq("meetId", id)
    if ( data ){
      console.log("comment", data);
      setCommentDatabase(data);
    }
  }

  const insertComment = async () => {
    supabase
    .from("comment")
    .insert({
      comment: comment,
      meetId: id,
      senId: emote
    })
    .then((result) => {
      console.log("comment insert", result);
      setComment("");
      fetchComment();
    });
  }
  const deleteComment = async () => {
    await supabase
    .from("comment")
    .delete()
    .eq("conId", commentDatabase)
    .then((result) => {
      console.log("delete comment", result);
    })
  }
 
  return (
     <div className="App">
        {Object.keys(session.user).length !== 0 ?
    <>
        <header>
        <Navbar props={session.user} />
        </header>

       <div style={{backgroundColor:'#FDEFE9', margin:"30px", padding:'20px'}}>
       <Grid align="center">
       <Button variant='outline' color='#EE5D20' radius="xl" onClick={() => navigate(-1)} style={{marginLeft:rem(20),width:'auto'}}>Back</Button>
          <Grid.Col span={9.5}><Text size='30px' fw={'500'} style={{marginTop:'10px',marginLeft:'20px',marginBottom:'10px'}}>FeedBack</Text></Grid.Col>
          <Grid.Col span={1}></Grid.Col>
          <Grid.Col span={0.5}></Grid.Col>
        </Grid>
    <div>
      <Grid grow style={{height:"auto"}}><Grid.Col span='auto' >
    { (checkAns === false && checkEnded === true) && ( <div>
    <Radio.Group
      name="Q1"
      label="ฉันได้รับข้อมูลชุดใหม่ที่มีความสำคัญกับฉัน"
      size="lg"
      style={{margin:'20px'}}
      onClick={(event)=>setSelectedOption1(event.target.value)}
      withAsterisk
    >
      {radioGroup}
    </Radio.Group>
  
    <Radio.Group
      name="Q2"
      label="การประชุมในครั้งนี้ช่วยให้เกิดการพัฒนาในส่วนของการทำงานร่วมกันเป็นทีม"
      size="lg"
      style={{margin:'20px'}}
      onClick={(event)=>setSelectedOption2(event.target.value)}
      withAsterisk
    >
      {radioGroup}
    </Radio.Group>

    <Radio.Group
      name="Q3"
      label="ฉันรู้สึกว่าการประชุมมีประสิทธิภาพ"
      size="lg"
      style={{margin:'20px'}}
      onClick={(event)=>setSelectedOption3(event.target.value)}
      withAsterisk
    >
      {radioGroup}
    </Radio.Group>

    <Radio.Group
      name="Q4"
      label="ฉันรู้สึกพึงพอใจกับการประชุมครั้งนี้"
      size="lg"
      style={{margin:'20px'}}
      onClick={(event)=>setSelectedOption4(event.target.value)}
      withAsterisk
    >
      {radioGroup}
    </Radio.Group> 
    <Button style={{margin:'20px'}} color="#EE5D20" onClick={submit} type="submit">Submit</Button> </div>
    )}
      </Grid.Col>
      <Grid.Col span='auto' style={{backgroundColor: "#EE5D20",borderRadius:'5px',}}>
        <ScrollArea h={430}>
        <div >
            {commentDatabase.map((commentCards) => (
              
            <div key={commentCards.id} style={{width:'auto', backgroundColor:'#FDEFE9', borderRadius:'5px', margin:'10px',padding:'10px'}}>
              <Grid align="center">
                <Grid.Col span={9.5} >{commentCards.comment}</Grid.Col>
                <Grid.Col span={1} >{commentCards.senId}</Grid.Col>
              </Grid></div>
          ))}
        </div>
        </ScrollArea>
        <Grid align="center" style={{backgroundColor: "#FDEFE9", borderRadius:'5px', padding:'5px'}}>
        <Grid.Col span={9.5}>
          <TextInput
          defaultValue={comment}
          onChange={(event) => setComment(event.currentTarget.value)}
          type="text"
          placeholder="Write a Comment"
          rightSection={select}
          rightSectionWidth={92}
          /></Grid.Col>
        <Grid.Col span={2.5}><Button color="#EE5D20" fullWidth onClick={()=>insertComment()}>Send</Button></Grid.Col>
        </Grid>
        
        </Grid.Col>
      </Grid>
      </div></div>
      <div style={{height:'10px', backgroundColor:'#EE5D20',position: 'fixed',bottom: '0', width: '100%'}}></div>
      </>
      :
      <></>
      }</div>
  )
}

export default Feedback;
