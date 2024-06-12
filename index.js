const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoose } = require("./connection");
const URL = require('./models/url');

const app = express();
const PORT = 8123;

connectToMongoose("mongodb://localhost:27017/urlshortener")
.then(()=> console.log('Mongodb started'));

app.use(express.json());


app.use("/url", urlRoute);

app.get("/:shortId", async(req,res)=>{
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