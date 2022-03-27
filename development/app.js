const express = require('express');
const cors = require('cors');
global.XMLHttpRequest = require('xhr2');
const expressFileUpload = require('express-fileupload');
const resourceRoute = require("./routes/Resource");
const eventRoute = require("./routes/Event");
const groupChatRoute = require("./routes/GroupChat");
const notificationRoute = require("./routes/Notification");
const userDetailsRoute = require("./routes/UserDetails");
const privateChatRoute = require("./routes/PrivateChat");
const storageRoute = require("./routes/Storage");

const app = express();

app.use(express.json());
app.use(expressFileUpload());
app.use(cors());
app.use('/Images',express.static('downloads'));

app.use('/Resources',resourceRoute);
app.use('/Events',eventRoute);
app.use("/GroupChat",groupChatRoute);
app.use("/PrivateChat",privateChatRoute);
app.use("/Notification",notificationRoute);
app.use("/UserDetails",userDetailsRoute);
app.use("/Storage",storageRoute);

app.listen(5000,()=> console.log("Up and running"));
