// API domain
var apiDomain = "http://135.181.90.225:8000";
localStorage.setItem("apiDomain", apiDomain);

// rand bg img
localStorage.setItem("bgIdx", Math.floor(Math.random() * 5));

// redirect to login page
window.location.replace("/login/login.html");
