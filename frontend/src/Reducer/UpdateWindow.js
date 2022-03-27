const initialState = {    
    width:window.innerWidth
}

const UpdateWindowReducer = (state=initialState,action) =>{
    switch(action.type){
        case "UPDATED_WINDOW":
            return {
                width:window.innerWidth
            }
        default:
            return state;
    }
}

export default UpdateWindowReducer;