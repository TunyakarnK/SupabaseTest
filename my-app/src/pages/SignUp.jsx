// import { React, useEffect, useState } from "react";
// import { supabase } from '../main'

export function Signup ({ session }){
//   const [loading, setLoading] = useState(true)
//   const [username, setUsername] = useState(null)
//   const [avatar_url, setAvatarUrl] = useState(null)

//   async function signOut() {
//     await supabase.auth.signOut();
//   }

//   useEffect(() => {
//     let ignore = false
//     async function getProfile() {
//       setLoading(true)
//       const { user } = session

//       const { data, error } = await supabase
//         .from('profiles')
//         .select(`username, website, avatar_url`)
//         .eq('id', user.id)
//         .single()

//       if (!ignore) {
//         if (error) {
//           console.warn(error)
//         } else if (data) {
//           setUsername(data.username)
//           setAvatarUrl(data.avatar_url)
//         }
//       }

//       setLoading(false)
//     }

//     getProfile()

//     return () => {
//       ignore = true
//     }
//   }, [session])

//   async function updateProfile(event, avatarUrl) {
//     event.preventDefault()

//     setLoading(true)
//     const { user } = session

//     const updates = {
//       id: user.id,
//       username,
//       avatar_url,
//       updated_at: new Date(),
//     }

//     const { error } = await supabase.from('profiles').upsert(updates)

//     if (error) {
//       alert(error.message)
//     } else {
//       setAvatarUrl(avatarUrl)
//     }
//     setLoading(false)
//   }

//   return (
//     <form onSubmit={updateProfile} className="form-widget">
//       <div>
//         <label htmlFor="email">Email</label>
//         <input id="email" type="text" value={session.user.email} disabled />
//       </div>
//       <div>
//         <label htmlFor="username">Name</label>
//         <input
//           id="username"
//           type="text"
//           required
//           value={username || ''}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div>
//         <button className="button block primary" type="submit" disabled={loading}>
//           {loading ? 'Loading ...' : 'Update'}
//         </button>
//       </div>

//       <div>
//         <button className="button block" type="button" onClick={signOut()}>
//           Sign Out
//         </button>
//       </div>
//     </form>
//   )
}
export default Signup;