const express = require("express");
const { connectToMongoose } = require("./connection");

const { restrictToLoggedinUserOnly,checkAuth } = require("./middlewares/auth");

const URL = require('./models/url');
const path = require('path');

const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8123;

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

connectToMongoose("mongodb://localhost:27017/urlshortener")
.then(()=> console.log('Mongodb started'));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());    
app.use(express.urlencoded({extended:false}))    
app.use(cookieParser());  

app.use("/url", restrictToLoggedinUserOnly ,urlRoute);
app.use('/user',userRoute);   
app.use('/',checkAuth, staticRoute);
         

app.get("/url/:shortId", async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId,
        },
        { 
            $push: { visitHistory: { timestamp: Date.now() } }
        },
    );
    res.redirect(entry.redirectURL);
});


app.listen(PORT, ()=>console.log(`Server started at PORT:${PORT}`));