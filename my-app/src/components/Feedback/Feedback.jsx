import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { supabase } from "src/supabaseClient";
import { useParams } from "react-router-dom";
import { Grid, Text } from "@mantine/core";
// import "survey-core/defaultV2.min.css";
// import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';
 
import { useState } from "react";

function Feedback() {
  const { id } = useParams();
  const [selectedOption1, setSelectedOption1] = useState("Male")
  const [selectedOption2, setSelectedOption2] = useState("Male")
  const [selectedOption3, setSelectedOption3] = useState("Male")
  const [selectedOption4, setSelectedOption4] = useState("Male")
  
  const scores = [1,2,3,4,5,6,7,8,9,10]
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

  // Function to handle the form submission
  function submit(event) {
    // Preventing the default form submission behaviour
    event.preventDefault();
    
    // Logging the selected option
    console.log(selectedOption1)
    
    //test 
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
  supabase.from("answers").insert([
    {
    questId: data[0].qId,
    answer: data[0].answer,
    meetId: id,
    userId: 1
  },
  {
    questId: data[1].qId,
    answer: data[1].answer, 
    meetId: id,
    userId: 1
  },
  {
    questId: data[2].qId,
    answer: data[2].answer, 
    meetId: id,
    userId: 1
  },
  {
    questId: data[3].qId,
    answer: data[3].answer, 
    meetId: id,
    userId: 1
  }
]
  )
  .then(result => {
    console.log(result);
  });
   console.log(data);   
   console.log(data[1].qId);
   console.log(data[1].answer);
   console.log(id);
  }

  return (
    <div>
      <Grid grow style={{height:"auto"}}><Grid.Col span='auto' >
<form >
        <h3>ท่านได้รับข้อมูลชุดใหม่ที่มีความสำคัญกับท่านมากน้อยแค่ไหน</h3>
        {/* Radio button for "Male" */}
        {scores.map((score)=> {
          return(
            <label>
            <input
              type="radio"
              value={`${score}`}
              // Checking this radio button if the selected option is "Male"
              checked={selectedOption1 === `${score}`}
              onChange={onValueChange1}/>
            {score}
          </label>
        )})}
        <h3>การประชุมในครั้งนี้ช่วยให้เกิดการพัฒนาในส่วนของการทำงานร่วมกันเป็นทีมได้หรือไม่</h3>
        {/* Radio button for "Male" */}
        {scores.map((score)=> {
          return(
            <label>
            <input
              type="radio"
              value={`${score}`}
              // Checking this radio button if the selected option is "Male"
              checked={selectedOption2 === `${score}`}
              onChange={onValueChange2}/>
            {score}
          </label>
        )})}
        <h3>ท่านรู้สึกพึงพอใจแค่ไหนกับความสัมพันธ์ของเวลาในการเตรียมการ, การประชุม, และผลลัพธ์ที่ได้รับ</h3>
        {/* Radio button for "Male" */}
        {scores.map((score)=> {
          return(
            <label>
            <input
              type="radio"
              value={`${score}`}
              // Checking this radio button if the selected option is "Male"
              checked={selectedOption3 === `${score}`}
              onChange={onValueChange3}/>
            {score}
          </label>
        )})}
        <h3>ท่านรู้สึกพึงพอใจกับการประชุมครั้งนี้มากน้อยแค่ไหน</h3>
        {/* Radio button for "Male" */}
        {scores.map((score)=> {
          return(
            <label>
            <input
              type="radio"
              value={`${score}`}
              // Checking this radio button if the selected option is "Male"
              checked={selectedOption4 === `${score}`}
              onChange={onValueChange4}/>
            {score}
          </label>
        )})}
     
        <br/>

        
 
        <br/>
        <br/>
        
        {/* Displaying the selected option */}
        {/* <div>
          Selected option is : {selectedOption}
        </div> */}
        <br/>
        
        {/* Submit button */}
        <button className="btn btn-default" onClick={submit} type="submit">
          Submit
        </button>
      </form>
      </Grid.Col>
      <Grid.Col span='auto' style={{backgroundColor: "#EE5D20"}}><div >comment</div></Grid.Col>
      </Grid>

      </div>
  )
}

export default Feedback;


// const feedback = {
//   pages: [
//     {
//       name: "page1",
//       elements: [
//         {
//           type: "rating",
//           name: "q1",
//           title:
//             "How many new and important information did you get during the meeting?",
//           description: "Numeric rating scale",
//           autoGenerate: false,
//           rateCount: 10,
//           rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         },
//         {
//           type: "rating",
//           name: "q2",
//           title: "Did the meeting improve your team collaboration?",
//           description: "Numeric rating scale",
//           autoGenerate: false,
//           rateCount: 10,
//           rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         },
//         {
//           type: "rating",
//           name: "q3",
//           title:
//             "How satisfied are you with the relation between the time spend for the preparation, the meeting itself and the outcome?",
//           description: "Numeric rating scale",
//           autoGenerate: false,
//           rateCount: 10,
//           rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         },
//         {
//           type: "rating",
//           name: "q4",
//           title: "How satisfied have you been with the meeting?",
//           description: "Numeric rating scale",
//           autoGenerate: false,
//           rateCount: 10,
//           rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         },
//       ],
//     },
//   ],
//   showQuestionNumbers: "off",
// };
// // function insertanswer() {
// //     supabase.from("answer").insert({
// //         quest: name,
// //         answer: d,
// //         meetId: d,
// //         userId: d,
// //       })
// //       .eq('meetId', id)
// //       .then(result => {
// //         console.log(result);
// //       });
// // }

// function SurveyComponent() {
//   const { id } = useParams();
//   const survey = new Model(feedback);
//   survey.onComplete.add((sender, options) => {
//     const res = JSON.stringify(sender.data, null, 3);
//     const res1 = JSON.parse(res);
//     // try {
//     //   supabase
//     //     .from("answers")
//     //     .insert({
//     //       questId: 2,
//     //       answer: res1.q2,
//     //       meetId: 7,
//     //       userId: 9,
//     //     })
//     //     .single()
//     //     .then((result) => {
//     //       console.log(result);
//     //     });
//     //   if (error) throw error;
//     //   window.location.reload();
//     // } catch (error) {
//     //   alert("error");
//     // }
//     // supabase.from("answers").update({
//     //     answer: res1.q4,
//     //     answer: res1.q3
//     // })
//     // .eq('ansId', 48)
//     // .eq('questId', 4)
//     // .eq('meetId', 7)
//     // .eq('userId', 8)
//     // .then(result => {
//     //     console.log(result);
//     // });
//     console.log(res1.q1);
//     console.log(res1.q2);
//     console.log(res1.q3);
//     console.log(res1.q4);
//   });
//   return <Survey model={survey} />;
// }

// export default SurveyComponent;
