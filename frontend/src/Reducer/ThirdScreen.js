const initialState = {
    type:"",
    content:null
}

const thirdScreenReducer=(state=initialState,action)=>{
    switch(action.type){
        case "CHATS":
            return {type:"Chats",content:action.data}
        case "RESOURCES":
            return {type:"Resources",content:action.data}
        case "EVENTS":
            return {type:"Events",content:action.data}
        case "PROFILES":
            return {type:"Profiles",content:action.data}
        case "GROUP_CHATS":
            return {type:"Group_Chats",content:action.data}
        case "GROUP_PROFILES":
            return {type:"Group_Profiles",content:action.data}
        case "RESET":
            return {type:"",content:null}
        default: 
            return state;
    }
}

export default thirdScreenReducer;