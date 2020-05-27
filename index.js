const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
const cookieparser = require('cookie-parser');
const cors = require('cors');
const app = express();

const userRoute = require('./route/user')
const courseRoute = require("./route/course");
const moduleRoute = require("./route/module");
const authRoute = require("./route/auth");
const studentRoute = require("./route/student");
const notifyRoute = require("./route/notification");





mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("CONNECTED TO DB")
});

app.use(express.json())
//middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(cookieparser());
app.use(cors());

app.use('/api',userRoute);
app.use("/api",courseRoute);
app.use("/api",moduleRoute);
app.use("/api",authRoute)
app.use("/api",studentRoute);
app.use("/api",notifyRoute)


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app is up and running in port ${port}`)
});