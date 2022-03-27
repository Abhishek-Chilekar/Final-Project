const firebase = require("firebase");
const firebaseConfig = {
    apiKey: "AIzaSyD_ayynLSNa-etJCmwFk-xkF_r9acJZ73w",
    authDomain: "restapi-bb22e.firebaseapp.com",
    databaseURL: "https://restapi-bb22e-default-rtdb.firebaseio.com",
    projectId: "restapi-bb22e",
    storageBucket: "restapi-bb22e.appspot.com",
    messagingSenderId: "335601535996",
    appId: "1:335601535996:web:206cc87904609e87190079"
  };

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  
  module.exports = db;