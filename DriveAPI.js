const CLIENT_ID = '937980650213-plvit6vn9vpaf2fnp3ikejdnke5sjoh0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04qU4z1nbIy11CgYIARAAGAQSNwF-L9IrzQ6hcYAeyP97EZF0Sc-cpVP6DbrTr_l5ez3g-AJLKrBvR0SvUaVZp8VIQ_WPDYZlgtI';
const API_KEY = 'AIzaSyD6JWAnY0eTutXI9Ec48EtzMKVZGX6QhIE';

// Discovery URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Set API access scope before proceeding authorization request
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async(resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').value = 'Refresh';
        await uploadFile();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').style.display = 'none';
        document.getElementById('content').innerHTML = '';
        document.getElementById('authorize_button').value = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Upload file to Google Drive.
 */
async function uploadFile() {
    var fileContent = './data.json'; // As a sample, upload a text file.
    var file = new Blob([fileContent], { type: 'text/plain' });
    var metadata = {
        'name': 'data.js', // Filename at Google Drive
        'mimeType': 'text/plain', // mimeType at Google Drive
        // TODO [Optional]: Set the below credentials
        // Note: remove this parameter, if no target is needed
        'parents': ['1e5nUfwf6dJqdcdhQSRYZaMNZ7ZjtFU2t'], // Folder ID at Google Drive which is optional
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    console.log('accessToken')
    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
        document.getElementById('content').innerHTML = "File uploaded successfully. The Google Drive file id is <b>" + xhr.response.id + "</b>";
        document.getElementById('content').style.display = 'block';
    };
    xhr.send(form);
}