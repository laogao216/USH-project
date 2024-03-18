var signups = [];
var username = "";

window.onload = init;

function init() {
    // set bg img
    setBgImg(localStorage.getItem("bgIdx"));

    // on signup.html
    if (document.getElementById("link-to-signup")) {
        // get username, and check validity of token
        displayGreeting();

        // populate signup table
        getList();
    }

    // cancel signup
    if (document.getElementById("cancel-btn")) document.getElementById("cancel-btn").onclick = async () => {
        document.getElementById("cancel-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
        await fetch(localStorage.getItem("apiDomain") + "/signup/cancel/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "token": localStorage.getItem("token"),
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.ret_status == 0) {
                    return;
                }
                if (data.ret_status == 1) {
                    alert("You have not signed up yet");
                }
                if (data.ret_status == 2) {
                    alert("Please login again");
                    window.location.replace("/login/login.html");
                }
            });
        displayGreeting();
        getList();
        document.getElementById("cancel-btn").innerHTML = "<div>Cancel signup</div>";
    };

    // signup
    if (document.getElementById("sign-up-btn")) document.getElementById("sign-up-btn").onclick = async () => {
        var bsRole = "";
        document.getElementsByName("bs-role").forEach((option) => {
            if (option.checked) {
                bsRole = option.value;
                return;
            }
        });
        var supportRole = "";
        document.getElementsByName("support-role").forEach((option) => {
            if (option.checked) {
                supportRole = option.value;
                return;
            }
        });
        if (bsRole == "" || supportRole == "") {
            alert("Please pick a BS role and a support role");
            return;
        }
        document.getElementById("sign-up-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
        await fetch(localStorage.getItem("apiDomain") + "/signup/post/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "token": localStorage.getItem("token"),
                "bs_role": bsRole,
                "miner_ts_role": supportRole,
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.ret_status == 0) {
                    window.location.replace("/signup/signup-list.html");
                } else {
                    alert("Please login again");
                    window.location.replace("/login/login.html");
                }
            });
        document.getElementById("sign-up-btn").innerHTML = "<div>Sign up</div>";
    };

    if (document.getElementById("clear-btn")) document.getElementById("clear-btn").onclick = async () => {
        document.getElementById("clear-btn").innerHTML = '<img src="/res/loading.svg" alt="loading..." style="height: 40px;"/>';
        await fetch(localStorage.getItem("apiDomain") + "/signup/clear/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "token": localStorage.getItem("token"),
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.ret_status == 0) {
                    window.location.replace("/signup/signup-list.html");
                } else {
                    alert(data.msg);
                    if (data.ret_status == 1 || data.ret_status == 2) window.location.replace("/login/login.html");
                }
            });
        document.getElementById("clear-btn").innerHTML = "<div>Sign up</div>";
    };

}

// get username, and check validity of token
async function displayGreeting() {
    await fetch(localStorage.getItem("apiDomain") + "/login/username/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": localStorage.getItem("token"),
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.ret_status == 0) {
                username = data.username;
                document.getElementById("greeting").innerText = "Hello, " + data.username;
            } else {
                alert("Please login again");
                window.location.replace("/login/login.html");
            }
        });
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

// reaize when window size change
window.onresize = () => {
    resizeBgImg();
    rearrangeTable();
};

// populate signup table
async function getList() {
    signups = [];
    await fetch(localStorage.getItem("apiDomain") + "/signup/get/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": localStorage.getItem("token"),
        })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.ret_status == 0) {
                signups = data.signups;
                document.getElementById("loading").style.display = "none";
                rearrangeTable();
            } else {
                alert("Please login again");
                window.location.replace("/login/login.html");
            }
        });
}

// when window becomes too small, change to mobile view
function rearrangeTable() {
    document.getElementById("link-to-signup").innerText = "Sign up for WS";
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width >= 630) {
        // desktop view
        document.getElementById("table").innerHTML = "<tr><th><b>#</b></th><th><b>Name</b></th><th><b>BS Role</b></th><th><b>Support Role</b></th></tr>";
        counter = 1;
        signups.forEach((signup) => {
            line = "<tr>";
            line += "<th>" + counter++ + "</th>";
            line += "<th>" + signup.username + "</th>";
            line += "<th>" + signup.bs_role + "</th>";
            line += "<th>" + signup.miner_ts_role + "</th>";
            line += "</tr>";
            document.getElementById("table").innerHTML += line;
        });
    } else {
        // mobile view
        document.getElementById("table").innerHTML = '<tr><th><b>#</b></th><th><b>Name</b></th><th><b>BS Role<br>Support Role</b></th></tr>';
        counter = 1;
        signups.forEach((signup) => {
            line = "<tr>";
            line += "<th>" + counter++ + "</th>";
            line += "<th>" + signup.username + "</th>";
            line += "<th>" + signup.bs_role + "<br>";
            line += signup.miner_ts_role + "</th>";
            document.getElementById("table").innerHTML += line;
        });
    }
    // mod signup link if user already signed up
    if (signups.username == username) {
        document.getElementById("link-to-signup").innerText = "Edit my signup";
    }
}

