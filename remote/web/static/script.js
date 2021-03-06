var authSessionVars;

window.onload =
    function () { requestAuthSession(); }

document.getElementById('testme_button').onclick =
    function () { getToken(); }


function getToken() {
    // add session variables when request token
    var url = localServerUrl + "?"
    for (var name in authSessionVars) {
        url = url + "&" + name + "=" + authSessionVars[name]
    }

    fillStatusDiv("Retrieving Web Padlock device token...")

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 500

    req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4) {
            if (req.status === 200) {
                processToken(req.responseText);
            } else {
                errorRetrievingToken(req.status);
            }
        }
    };

    req.send(null);
}


function fillStatusDiv(
    status = "",
    message = "",
    cssclass = "alert alert-info") {

    div = document.getElementById('status_div');

    div.innerHTML = `
            <div class="statusMsg ${cssclass} strong">
                ${status}
            </div>
            <div class="container causeMsg">
                ${message}
            </div>
        `;
}


function errorRetrievingToken(status) {
    var causeMsg;
    var statusMsg = "Cannot get your Web Padlock token"

    switch (status) {
        case 0:
            causeMsg = `
            Please make sure: 
            <ul>
            <li>Your device is running the local server part.</li>
            <li>The local_server_url is correctly configured in remote server config. Check the port.</li>
            <li>The remote server domain is included in allowed_requesters in the local server config.</li>
            </ul>`
            break;

        default:
            causeMsg = "Error " + status;
    }

    fillStatusDiv(statusMsg, causeMsg, "alert alert-danger")
}


function processToken(token) {
    console.log("Web Padlock device info token:\n" + token);
    fillStatusDiv("Processing token...")

    var url = "/democheck?token=" + token;

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 5000

    req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4) {
            if (req.status === 200) {
                processTokenResult(req.responseText);
            } else {
                errorProcessingToken(req.status, req.responseText);
            }
        }
    };

    req.send(null);
}


function errorProcessingToken(status, msg) {
    switch (status) {
        case 401:
            fillStatusDiv(
                "Device not allowed. Why?",
                msg,
                "alert alert-warning"
            );
            break;
        default:
            fillStatusDiv(
                "Error processing your token",
                "HTTP status code: " + status,
                "alert alert-danger"
            );
    }
}


function processTokenResult(msg) {
    fillStatusDiv(
        "Great! Now you can log-in!",
        msg,
        "alert alert-success"
    );
}


function requestAuthSession() {
    var url = "/start_auth";

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 500

    req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4) {
            if (req.status === 200) {
                authSessionVars = JSON.parse(req.responseText);
                for (var name in authSessionVars) {
                    console.log(name + ": " + authSessionVars[name])
                }
            } else {
                console.log("Error requesting new auth session.")
            }
        }
    };

    req.send(null);
}