const User = require('../models/user');

module.exports.renderRegister =  (req, res) => {
   res.render('users/register');
};

module.exports.register = async (req, res) => {
   try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const newUser = await User.register(user, password);
   
      // login the user after registeration
      req.logIn(newUser, (err) => {
         if(err) return next(err);
      })

      req.flash('success', 'Welcome to Yelp Camp');
      res.redirect('/campgrounds')  ;
   } 
   catch (error) {
      if(error.index == 0)
         req.flash('error', 'Email already registered')
      else
         req.flash('error', error.message);

      res.redirect('/register');
   }
};

module.exports.renderLogin = (req, res) => {
   res.render('users/login');
};

module.exports.login = (req, res) => {
   req.flash('success', 'Welcome back!!')

   // depends from where we landed on this route;
   const redirectUrl = req.session.returnTo || '/campgrounds';
   delete req.session.returnTo;

   res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
   req.logout();
   req.flash('success', 'GoodBye!')
   res.redirect('/campgrounds');
};