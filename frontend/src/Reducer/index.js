import NavReducer from './Navigation';
import UserReducer from './User';
import ThirdScreenReducer from './ThirdScreen';
import { combineReducers } from 'redux';
import UpdateWindowReducer from './UpdateWindow';

const allReducer = combineReducers({
    Nav:NavReducer,
    User:UserReducer,
    ThirdScreen:ThirdScreenReducer,
    UpdateWindow:UpdateWindowReducer
});

export default allReducer;