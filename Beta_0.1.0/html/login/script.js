window.onload = init;

function init() {
    // set bg img
    setBgImg(localStorage.getItem("bgIdx"));

    // login
    if (document.getElementById("login-btn")) document.getElementById("login-btn").onclick = async () => {
        if (noEmptyInput(["username", "password"])) {
            document.getElementById("login-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            await fetch(localStorage.getItem("apiDomain") + "/login/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password,
                })
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.ret_status == 0) {
                        token = data.access_token;
                        localStorage.setItem("token", token);
                        localStorage.setItem("bgIdx", Math.floor(Math.random() * 5));
                        window.location.replace("/signup/signup-list.html");
                    } else {
                        document.getElementById("login-btn").innerHTML = "<div>Login</div>";
                        alert(data.msg);
                    }
                });
        }
    };

    // change password
    if (document.getElementById("next-btn")) document.getElementById("next-btn").onclick = async () => {
        if (noEmptyInput(["username"])) {
            document.getElementById("next-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
            var username = document.getElementById("username").value;
            await fetch(localStorage.getItem("apiDomain") + "/login/security_question/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                })
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.ret_status == 0) {
                        document.getElementById("reset-password-1").style = "display: none;";
                        document.getElementById("reset-password-2").style = "display: block;";
                        document.getElementById("security-question").innerText = data.security_question;
                        document.getElementById("reset-password-btn").onclick = async () => {
                            if (noEmptyInput(["password", "password-again"])) {
                                document.getElementById("reset-password-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
                                var securityQuestionAnswer = document.getElementById("security-question-answer").value;
                                var password = document.getElementById("password").value;
                                var passwordAgain = document.getElementById("password-again").value;
                                if (passwordsMatch(password, passwordAgain)) {
                                    await fetch(localStorage.getItem("apiDomain") + "/login/forget_password/", {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "username": username,
                                            "new_password": password,
                                            "security_question_answer": securityQuestionAnswer
                                        })
                                    })
                                        .then(resp => resp.json())
                                        .then(data => {
                                            if (data.ret_status == 0) {
                                                window.location.replace("login.html");
                                            } else {
                                                document.getElementById("reset-password-btn").innerHTML = "<div>Reset password</div>";
                                                alert(data.msg);
                                            }
                                        });
                                    }
                            }
                        }
                    } else {
                        document.getElementById("next-btn").innerHTML = "<div>Next</div>";
                        alert(data.msg);
                    }
                });
        }
    };

    // register
    if (document.getElementById("register-btn")) document.getElementById("register-btn").onclick = async () => {
        if (noEmptyInput(["username", "password", "password-again", "security-question", "security-question-answer"])) {
            document.getElementById("register-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            var passwordAgain = document.getElementById("password-again").value;
            var securityQuestion = document.getElementById("security-question").value;
            var securityQuestionAnswer = document.getElementById("security-question-answer").value;
            if (passwordsMatch(password, passwordAgain)) {
                await fetch(localStorage.getItem("apiDomain") + "/login/useradd/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "username": username,
                        "password": password,
                        "security_question": securityQuestion,
                        "security_question_answer": securityQuestionAnswer,
                    })
                })
                    .then(resp => resp.json())
                    .then(data => {
                        if (data.ret_status == 0) {
                            window.location.replace("login.html");
                        } else {
                            document.getElementById("register-btn").innerHTML = "<div>Register</div>";
                            alert(data.msg);
                        }
                    });
            } else {
                document.getElementById("register-btn").innerHTML = '<div>Register</div>';
            }
        }
    };

    function noEmptyInput(ids) {
        var numErr = 0;
        ids.forEach((id) => {
            if (!document.getElementById(id)) {
                numErr = -1;
                return;
            }
        });
        if (numErr < 0) return false;
        ids.forEach((id) => {
            if (document.getElementById(id).value == "") {
                document.getElementById(id).style = "border-color: #FBB6C8; background-color: rgba(251, 182, 200, 0.4);";
                numErr++;
            } else {
                document.getElementById(id).style = "border-color: #9FE5FF; background-color: rgba(0, 0, 0, 0.75);";
            }
        });
        if (numErr > 0) return false;
        else return true;
    }

    function passwordsMatch(password, passwordAgain) {
        if (password != passwordAgain) {
            document.getElementById("password").style = "border-color: #FBB6C8; background-color: rgba(251, 182, 200, 0.4);";
            document.getElementById("password-again").style = "border-color: #FBB6C8; background-color: rgba(251, 182, 200, 0.4);";
            alert("passwords do not match");
            return false;
        }
        return true;
    }
}

// for sizing bg img
function setBgImg(bgIdx) {
    document.body.style.backgroundImage = "url('/res/bgs/" + bgIdx + ".jpg')";
    bgNms = ["Supernova", "Ice Planet", "Black Citadel", "Battleship", "Jump Gate"]
    Array.from(document.getElementsByClassName("credit")).forEach((e) => e.innerHTML = 'Background Image: Gabriel Björk Stiernström "' + bgNms[bgIdx] + '"');
    resizeBgImg();
}
function resizeBgImg() {
    if (window.innerWidth / window.innerHeight > 1920 / 1080) {
        document.body.style.backgroundSize = "100% auto";
    } else {
        document.body.style.backgroundSize = "auto 100%";
    }
}
window.onresize = () => resizeBgImg();
