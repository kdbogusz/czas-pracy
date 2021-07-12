import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { State, Action, ActionType } from "../common/reducer";


const CreateTeam = (props: { state: State; dispatch: React.Dispatch<Action> }) => {
    const [nameofTeams, setNameofTeams]=useState("")
    const makeid=(length:number)=> {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    const addTeam=async (e:React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(props.state.db){
            const docRef = await addDoc(collection(props.state.db, "teams"), {
                leaderID: props.state.userID,
                name: nameofTeams, 
                passcode: makeid(15)
              }).then(async()=>{
                  if(props.state.db){
                    const userQuery = query(
                        collection(props.state.db, "teams"),
                        where("name", "==", nameofTeams)
                      );
                      const userQuerySnapshot = await getDocs(userQuery);
                      userQuerySnapshot.forEach(async (document) => {
                          if(props.state.db){
                            const userRef = doc(props.state.db, "users", props.state.userID);
                            await updateDoc(userRef, {
                                teamID: document.id,
                              });
                              props.dispatch({
                                type: ActionType.SetTeamID,
                                payload: document.id,
                              });
                              props.dispatch({
                                type: ActionType.SetStageStart,
                                payload: "",
                              });
                              props.dispatch({
                                type: ActionType.SetIsTeamLeader,
                                payload: true,
                              });
                              props.dispatch({
                                type: ActionType.SetTeamPasscode,
                                payload: document.data().passcode
                              });
                              props.dispatch({
                                type: ActionType.ShowNavBar,
                                payload: true
                              });
                          }

                      })
                  }     
              })

        }

    }
    return (
        <div>
            <form onSubmit={addTeam}>
                <input type="text" placeholder="nazwa zespołu"
                value={nameofTeams} onChange={(e)=>setNameofTeams(e.target.value)}></input>
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    )
}

export default CreateTeam
