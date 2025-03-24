const {getUser} = require("../service/auth");


async function restrictToLoggedinUserOnly(req, res, next){
    // const userid = req.cookies?.uid;
    const userUid = req.headers["authorization"];

    if(!userUid) return res.redirect("/login");
    const token = userUid.split("Bearer ")[1];  //Bearer 2232234jsjkndskln
    const user = getUser(token);
    
    if(!user) return res.redirect("/login");

    req.user = user;
    next();
}
// bearer 
// https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/
async function checkAuth(req, res, next){
    const userUid = req.headers["authorization"];
    const token = userUid.split("Bearer ")[1];
    const user = getUser(token);

    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
}