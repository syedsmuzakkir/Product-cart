// "use client"
import { createSlice } from "@reduxjs/toolkit";

const initialState = []
const cartSlice = createSlice(
    {
        name:'cart',
        initialState,
        reducers:{
            add(state, action){
                state.push(action.payload)
            },
            remove(state, action){
                 return state.filter((item)=> item.id !== action.payload)
            }
        }
    }
)

// For creating a slice or redux state 
// we createSlice then inside the slice we will give a name and initialstate and methods in reducers 
export const {add, remove} = cartSlice.actions; // actions will give methods
export default cartSlice.reducer; //reducer will give the state


// We have created a state here 

// we will create a store to hold all our state(methods and actions) in 