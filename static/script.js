const inputElement = document.getElementById('user-input');
const responseElement = document.getElementById('response-text');

let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0');
let day = String(today.getDate()).padStart(2, '0');

let formattedDate = `${year}-${month}-${day}`;

const DEFAULT_SYSTEM_PROMPT = `You are ChatGPT, a large language model trained by OpenAI, based on the GPT-3.5 architecture. Knowledge cutoff: 2022-01. Current date: `+formattedDate;
const WRONG_AMOUNT_ARGUMENTS = "Wrong amount of command arguments."
const THEMES = {
    "dark": ["rgb(39, 39, 39)","rgb(238, 238, 238)","rgb(27, 27, 27)","rgb(255, 255, 255)"],
    "light": ["rgb(238, 238, 238)","rgb(39, 39, 39)","rgb(255, 255, 255)","rgb(27, 27, 27)"],
    "aquatic":["rgb(28, 29, 43)","rgb(200, 206, 230)","rgb(20, 19, 32)","rgb(255, 255, 255)"]
}

var systemPrompt = DEFAULT_SYSTEM_PROMPT
var helpMessage = `/help - display this help message
/system get - displays the current system prompt
/system set <new system prompt> - set the system prompt. If no new system prompt is specified, revert to default
/theme <new theme> - sets the theme. If no theme is specified, list all themes.
/clear - clears the conversation`

var messages = [{"role":"system","content":systemPrompt}]

function setTheme(theme){
    var r = document.querySelector('body');

    r.style.setProperty('--backgroundColor', THEMES[theme][0]);
    r.style.setProperty('--textColor', THEMES[theme][1]);
    r.style.setProperty('--accentColor', THEMES[theme][2]);
    r.style.setProperty('--highlightColor', THEMES[theme][3]);
}

function autoHeight(elem) {
    elem.style.height = '1px';
    elem.style.height = `${Math.min(elem.scrollHeight+20,229)}px`;
}

async function fetchData() {
    const url = '/api/get_response';
    const data = {
        "messages":messages
    };

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });

        if (!response.ok) {
        throw new Error('Network response was not ok.');
        }

        const textResponse = await response.json();
        console.log('Raw text response:', textResponse["contentRaw"]);
        receiveResponse(textResponse["content"],textResponse["contentRaw"]);
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}

function receiveResponse(response,raw){
    displayRawTextResponse(response)
    messages.push({"role":"assistant","content":raw});
}

function displayRawTextResponse(text){
    responseElement.innerHTML = text
}

function displayTextResponse(text){
    responseElement.innerText = text
}

function runCommand(command){
    args = command.split(" ");
    keyword = args.shift()

    switch (keyword){
        case "help":
            displayTextResponse(helpMessage);
            break;
        case "theme":
            if (args.length != 1){
                displayTextResponse("Available themes: "+Object.keys(THEMES).join(', '))
                break;
            }
            setTheme(args[0]);
            break;
        case "system":
            if (args.length < 1){
                displayTextResponse(WRONG_AMOUNT_ARGUMENTS);
                break;
            }
            if (args[0] == "get"){
                displayTextResponse(systemPrompt);
                break;
            }
            else if (args[0] == "set"){
                if (args.length == 1){
                    systemPrompt = DEFAULT_SYSTEM_PROMPT;
                }else{
                    systemPrompt = command.substring(10);
                }
                displayTextResponse("Set system prompt to " + command.substring(10));
            }
            break;
        case "clear":
            messages = [{"role":"system","content":systemPrompt}];
            displayTextResponse("Cleared the conversation!");
    }
}

inputElement.onkeydown =  function(event) {
    if (event.code === "Enter") {
        console.log("Enter pressed");
        if ((messages.length > 0 && messages[messages.length - 1].role != "user") && !event.shiftKey) {
            if (inputElement.value.startsWith("/")){
                runCommand(inputElement.value.slice(1));
                inputElement.value = "";
                autoHeight(inputElement);
                return false;
            }
            messages.push({"role":"user","content":inputElement.value});
            inputElement.value = "";
            autoHeight(inputElement);
            displayRawTextResponse('<div class="dot-elastic"></div>');
            fetchData();
            return false;
        }else {
            console.log("new line");
        }
  }
};

document.addEventListener('DOMContentLoaded', function() {
    inputElement.focus();
    autoHeight(inputElement);
    setTheme("dark");
});