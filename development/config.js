const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyDXoh0zLGb4by8JsD8RKzYwhmDl8_dcCcE",
  authDomain: "nodejs-restapi-a4219.firebaseapp.com",
  projectId: "nodejs-restapi-a4219",
  storageBucket: "nodejs-restapi-a4219.appspot.com",
  messagingSenderId: "83789109578",
  appId: "1:83789109578:web:fe80b85f1012bcf26c09b3"
};

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const data = firebase.storage();
  module.exports ={db,data};