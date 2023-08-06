const mongoose = require('mongoose');
const User = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');




mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connection Open');
  })
  .catch((err) => {
    console.log(err);
  });

exports.registrationForm = (req, res) => {
    res.render('users/registrationForm');
}

exports.registerUser = catchAsync(async (req, res) => {
    try {
    const {email, username, password, firstName, lastName} = req.body;
    const user = new User({email, username,firstName, lastName});
    const registeredUser = await User.register(user, password,);
    console.log(registeredUser);
    res.redirect('/');

   } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
  
})
 
//login form
exports.loginForm = (req, res) => {
    res.render('users/loginForm');
}

//login a user
exports.loginUser = (req, res) => {
  const { username } = req.user; 
  req.flash('success', `Welcome back, ${username}!`);
  res.redirect('dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}