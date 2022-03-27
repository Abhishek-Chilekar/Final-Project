export const chats = (data)=>{
    return {
        type:"CHATS",
        data:data
    }
}

export const resources = (data)=>{
    return {
        type:"RESOURCES",
        data:data
    }
}

export const events = (data)=>{
    console.log(data);
    return {
        type:"EVENTS",
        data:data
    }
}

export const profiles = (data)=> {
    return {
        type:"PROFILES",
        data:data
    }
} 

export const group_chats = (data) =>{
    return {
        type:"GROUP_CHATS",
        data:data
    }
}

export const reset = ()=>{
    return {
        type:"RESET",
        data:null
    }
}

export const group_profiles = (data)=>{
    return {
        type:"GROUP_PROFILES",
        data:data
    }
}