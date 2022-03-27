const initialState = {
    active:"Chats"
}
const navReducer = (state = initialState,action)=>{
    switch(action.type){
        case "CHAT":
            return {
                active:"Chats"
            }
        case "RESOURCE":
            return {
                active:"Resources"
            }
        case "EVENT":
            return{
                active:"Events"
            }
        case "ABOUT":
            return{
                active:"About"
            }
        case "NOTIFICATION":
            return{
                active:"Notification"
            }
        case "PROFILE":
            return{
                active:"Profile"
            }
        case "SEARCH":
            return{
                active:"Search"
            }
        default:
            return state;
            
    }
}

export default navReducer;