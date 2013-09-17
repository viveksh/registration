
/**
 * Module dependencies.
 */

var express = require('express')
,routes = require('./routes')
,user = require('./routes/user')
,http = require('http')
,path = require('path')
,flash = require('connect-flash')
,passport = require('passport')
,forms = require('express-form')
,mongoose = require('mongoose')
,LocalStrategy = require('passport-local').Strategy
,FacebookStrategy = require('passport-facebook').Strategy;
// form variables
var forms = require('forms')
,fields = forms.fields
,validators = forms.validators;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('secret'));
//app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
//serialize and deserialize in passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userModel.findOne(id, function (err, user) {
    done(err, user);
  });
});
//serialize and deserialize in passport
// authentication for passport
function requireAuth(req, res, next) {
  if(req.user) {
  		req.flash('success','Sign in successfully')
      next();
  } else {
      res.redirect('/');
      req.flash('error','Please sigin before continue!')
  }
}
// local strategy passport
passport.use(new LocalStrategy(
	function(username, password, done) {
		userModel.findOne({ username: username }, function (err, user) {
			if (err) { 
				return done(err); 
			}
			if (!user) {
				return done(null, false);
			}
			if (!user.validPassword(password)) {
				return done(null, false);
			}
			return done(null, user);
		});
	}
));
//facebook strategy
passport.use(new FacebookStrategy({
    clientID: "176584029176982",
    clientSecret: "e38e81e3a49aa193017141460da89c33",
    callbackURL: "/auth/facebook/callback"

  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({'facebookData.id' : profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));
// mongoose connect
mongoose.connect('mongodb://localhost/express')
,Schema = mongoose.Schema
,ObjectId = Schema.ObjectId;
// including appSchema
require('./appSchema.js').make(Schema,mongoose);
// includinf horm helpers
require ('./helpers/form/formHelpers.js').formHelper(forms,fields,validators);
//including routes
require('./routes/routes.js')(app,requireAuth,flash);
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
// user list routes
app.get('/users',function(res,req){
	res.render('index',{
		title: "users"
	})
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
// login routes
app.get('/login',requireAuth);
app.post('/login', passport.authenticate('local', { successRedirect: '/home',
    failureRedirect: '/registration',
    messages: true }));

// facebook routes
app.get('/auth/facebook/callback', 
passport.authenticate('facebook', { successRedirect: '/',
                                    failureRedirect: '/login' }));

//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));







