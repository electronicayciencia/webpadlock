document.getElementById('testme_button').onclick =
    function () { sendRequest(); }


function sendRequest() {
    var url = localServerUrl + "?requestId=" + requestId

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
    cssclass = "info") {

    div = document.getElementById('status_div');

    div.innerHTML = `
        <p class="${cssclass}"><span class="statusMsg">${status}<span></p>
        <p class="${cssclass}"><span class="causeMsg">${message}</span></p>
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

    fillStatusDiv(statusMsg, causeMsg, "error")
}


function processToken(token) {
    console.log("Web Padlock device info token:\n" + token);
    fillStatusDiv("Processing token...")

    var url = "/check?token=" + token;

    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.timeout = 5000

    req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4) {
            if (req.status === 200) {
                processTokenResult(req.responseText);
            } else {
                errorProcessingToken(req.status);
            }
        }
    };

    req.send(null);
}


function errorProcessingToken(msg) {
    fillStatusDiv(
        "Error processing your token",
        "HTTP status code: " + msg,
        "error"
    );
}


function processTokenResult(msg) {
    fillStatusDiv("Ok", msg);

}
