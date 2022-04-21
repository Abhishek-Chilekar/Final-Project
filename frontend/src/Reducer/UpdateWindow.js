const initialState = {    
    width:window.innerWidth,
    toggle:false
}

const UpdateWindowReducer = (state=initialState,action) =>{
    switch(action.type){
        case "UPDATED_WINDOW":
            return {
                width:window.innerWidth,
                toggle:action.data
            }
        default:
            return state;
    }
}

export default UpdateWindowReducer;