window.onload = init;

function init() {
    // rand bg img
    setBgImg(Math.floor(Math.random() * 5));

    // collecting input from login page
    if (document.getElementById("login-btn")) document.getElementById("login-btn").onclick = () => {
        if (noEmptyInput(["username", "password"])) {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            // TODO - send these to server for auth, if 200:
            if (true) window.location.replace("dashboard.html");
        }
    };
    if (document.getElementById("next-btn")) document.getElementById("next-btn").onclick = () => {
        if (noEmptyInput(["username"])) {
            var username = document.getElementById("username").value;
            // TODO - check with server, if found:
            if (true) {
                document.getElementById("reset-password-1").style = "display: none;";
                document.getElementById("reset-password-2").style = "display: block;";
                // TODO - get security question:
                var securityQuestion = "asdfasdf";
                document.getElementById("security-question").innerText = securityQuestion;
                document.getElementById("reset-password-btn").onclick = () => {
                    if (noEmptyInput(["password", "password-again"])) {
                        var password = document.getElementById("password").value;
                        var passwordAgain = document.getElementById("password-again").value;
                        if (passwordsMatch(password, passwordAgain)) {
                            // TODO - send new password to server, if 200:
                            if (true) window.location.replace("dashboard.html");
                        }
                    }
                }
            } else {
                alert("user not found");
            }
        }
    };
    if (document.getElementById("security-question")) document.getElementById("register-btn").onclick = () => {
        if (noEmptyInput(["username", "password", "password-again", "security-question", "security-question-answer"])) {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            var passwordAgain = document.getElementById("password-again").value;
            var securityQuestion = document.getElementById("security-question").value;
            var securityQuestionAnswer = document.getElementById("security-question-answer").value;
            if (passwordsMatch(password, passwordAgain)) {
                // TODO - send these to server for register, if 200
                if (true) window.location.replace("dashboard.html");
            }
        }
    };
    function noEmptyInput(idArr) {
        var numErr = 0;
        idArr.forEach((id) => {
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

    /*
    // post to api
    document.getElementById("asdf-btn").onclick = async function () {
        await fetch("http://72.167.133.198:8000/endpoint/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "a": 0,
                "b": 1,
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.status == 200) {
                    // success!
                }
            })
    };
    */
}

// for sizing bg img
function setBgImg(bgIdx) {
    document.body.style.backgroundImage = "url('bgs/" + bgIdx + ".jpg')";
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

/*
// get from api
async function getList() {
    await fetch("http://72.167.133.198:8000/endpoint/", {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.status == 200) {
                // success
            }
        })
}
*/
