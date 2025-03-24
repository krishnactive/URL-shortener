const {getUser} = require("../service/auth");


function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies?.token; // reason: we are using cookies to store the token and not headers becoz we are not using any front end framework like react or angular
    req.user = null;
    if(!tokenCookie){
        return next();
    }
    const token = tokenCookie;
    const user =  getUser(token);

    req.user = user;
    return next();

}

function restrictTo(roles){
    return function(req, res, next){
        if(!req.user){
            return res.redirect("/login");
        } 
        if(!roles.includes(req.user.role)){
            return res.end("Unauthorised");
        }
        next();
    };
}


module.exports = {
    checkForAuthentication,
    restrictTo,
};