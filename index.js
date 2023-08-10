const express = require('express');
const path = require ('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');




dotenv.config();

const app = express();




//routers
const serviceRouter = require('./server/routers/serviceRouter');
const userRouter = require('./server/routers/userRouter');



//configuration ejs-mate
app.engine('ejs', ejsMate);

//configuration and parse from data
app.set('views',path.join(__dirname, '/client/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true }));

//configure method-override
app.use(methodOverride('_method'));

app.use('/static', express.static(path.join(__dirname, 'client/views/public')));


app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// //express Session
const sessionConfig = {
  secret: 'thisismysecret',
  cookie : {
      expires: Date.now() + 1000 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));


//connect flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use((req, res, next) => {
  res.locals.username = req.user ? req.user.username : null;
  next();
});


// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//excute Routers
app.use('', serviceRouter); 
app.use('', userRouter);


//for request that do not exist: 404 route
app.use('*',( req, res, next) => {
  next(new ExpressError('Page not found', 404));
})

// error middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', {err});
});



app.listen(process.env.PORT || 8080, function () {
  console.log('Server is running on port 8080');
});