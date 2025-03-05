const User = require('../Models/user.js');

module.exports.renderSignUpForm = (req, res) => {
    res.render("Users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Yumzo");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("Users/login.ejs");
};

module.exports.login = async (req, res) => { 
    req.flash("success", "Welcome back to Yumzo! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You’ve logged out. Thanks for visiting!");
        res.redirect("/listings");
    })
};