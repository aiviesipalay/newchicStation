const mongoose = require('mongoose');
const User = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const Activity = require('../../models/activitylog');




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

// Function to log activity
const logActivity = async (user, action) => {
  const activity = new Activity({
    user: user,
    action: action,
    timestamp: new Date(),
  });
  await activity.save();
};



exports.registrationForm = (req, res) => {
    res.render('users/registrationForm');
}

exports.registerUser = catchAsync(async (req, res) => {
    try {
    const {email, username, password, firstName, lastName} = req.body;
    const user = new User({email, username,firstName, lastName});
    const registeredUser = await User.register(user, password,);
    req.flash('success', 'You have Successfully Registered!!');
    // console.log(registeredUser);
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
exports.loginUser = async (req, res) => {
  const { username } = req.user;

  // Log sign-in activity
  await logActivity(username, 'signed in');

  req.flash('success', `Welcome back, ${username}!`);
  res.redirect('dashboard');
};


//logout
exports.logout = (req, res, next) => {
  req.logout(function(err) {
      if(err) {
          return next(err) ;
      }
  })
  req.flash('success', 'You are now logged out');
  res.redirect('/');
}