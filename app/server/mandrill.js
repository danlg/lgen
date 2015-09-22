// server code
/*Mandrill.config({
 username: process.env.MANDRILL_API_USER,  // the email address you log into Mandrill with. Only used to set MAIL_URL.
 key: process.env.MANDRILL_API_KEY,  // get your Mandrill key from https://mandrillapp.com/settings/index
 port: 587,  // defaults to 465 for SMTP over TLS
 // host: 'smtp.mandrillapp.com',  // the SMTP host
 // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
 });*/

Mandrill.config({
  username: process.env.MANDRILL_USERNAME,   // the email address you l""og into Mandrill with. Only used to set MAIL_URL.
  key: process.env.MANDRILL_KEY,   // the email address you l""og into Mandrill with. Only used to set MAIL_URL.
  port: process.env.MANDRILL_PORT  // defaults to 465 for SMTP over TLS
  // host: 'smtp.mandrillapp.com',  // the SMTP host
  // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
});


/*console.log(Mandrill.users.ping());*/


Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  return '<h1>welcome to Little Genius :) </h1><br> <h1>You re going to love it!</h1> <p>The first step is to <a href="' + url + '">verify your email</a>.</p>';
};
