module.exports = function(app,requireAuth,flash){
	// default route
	app.get('/',function(req, res){
		res.render('index', { title:"Nutts!",userObject: req.user,message: req.flash('error')});

	});
	// registration page
	app.get('/registration',function(req, res){
		if(req.user)
			res.redirect('/home')
		else{
			res.render('registration', {
				title: 'Registration'
				,userForm: regForm.toHTML()
			});
		}
	});
	// home route
	app.get('/home',requireAuth,function(req, res){
		res.render('home', {
			title: 'home'
			,userObject: req.user
			,message: req.flash('success')
		});
		console.log(req.session)
	});
	// create action
	app.post('/create',function(req, res){
		regForm.handle(req, {
			// success action
	    success: function (form) {
	    	// sucess method
				var user = new userModel(req.body);
				user.save(function (err) {
				  if (!err)
				  	res.render('create',{title: "Home"});
				  else
				  	res.render('registration',{title: "Registration"});
				});
	    },
	    error: function (form) {
	    	res.render('registration', {
					title: 'Registration'
					,userForm: form.toHTML()
				});
	      
	    }
	  });
	  
	});
	// logout routes
	// logout
	app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
    req.flash('error','Log out successfully')
	});
	// about routes
	app.get('/about',function(req,res){
		res.render('about',{title:'About'})
		
	});
	

}