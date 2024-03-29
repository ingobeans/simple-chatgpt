const inputElement = document.getElementById('user-input');
const responseElement = document.getElementById('response-text');

let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0');
let day = String(today.getDate()).padStart(2, '0');

let formattedDate = `${year}-${month}-${day}`;

const INTRO_MESSAGE = `Welcome to simple-chatgpt. Use /help for a list of commands, or type a prompt to ask GPT-3.5.
    
Press Shift+Enter to make a newline. Use /clear to clear the conversation and reset. Have fun! 😎🍲`
const DEFAULT_SYSTEM_PROMPT = `you are bob, an AI assistant. you will speak in the style found in online chat rooms with missing capitalization and punctuations. **never** use emojis.`;
const WRONG_AMOUNT_ARGUMENTS = "Wrong amount of command arguments."
const THEMES = {
    "dark": ["rgb(39, 39, 39)","rgb(238, 238, 238)","rgb(27, 27, 27)","rgb(255, 255, 255)","'Fira Code', monospace","sunburst.css"],
    "light": ["rgb(238, 238, 238)","rgb(39, 39, 39)","rgb(255, 255, 255)","rgb(27, 27, 27)","'Fira Code', monospace","default.css"],
    "aquatic":["rgb(28, 29, 43)","rgb(200, 206, 230)","rgb(20, 19, 32)","rgb(255, 255, 255)","'Fira Code', monospace","sunburst.css"],
    "field":["rgb(92, 172, 97)","rgb(0, 0, 0)","rgb(88, 155, 83)","rgb(0, 0, 0)","'Fira Code', monospace","default.css"],
    "sand":["rgb(134, 99, 61)","rgb(226, 230, 200)","rgb(132, 81, 16)","rgb(255, 255, 255)","'Fira Code', monospace","sunburst.css"],
    "mint":["rgb(179, 213, 163)","rgb(39, 39, 39)","rgb(144, 189, 151)","rgb(0, 0, 0)","'Fira Code', monospace","default.css"],
    "kirby":["rgb(244, 142, 234)","rgb(0, 0, 0)","rgb(247, 123, 221)","rgb(0, 0, 0)","'Fira Code', monospace","default.css"],
    "discord":["rgb(49, 51, 56)","rgb(219, 222, 225)","rgb(43, 45, 49)","rgb(56, 58, 64)","'Fira Code', monospace","desert.css"],
    "openai":["rgb(52, 53, 65)","rgb(209, 213, 219)","rgb(0, 0, 0)","rgb(86, 86, 98)","'Segoe UI', Tahoma, Geneva, Verdana, sans-serif","sunburst.css"],
}

var systemPrompt = "";
var helpMessage = `/help - display this help message

/system get - displays the current system prompt

/system set <new system prompt> - set the system prompt. Eg: /system set You are ChatGPT, a Large Language Model...

/system reset - resets system prompt to default

/theme <new theme> - sets the theme. If no theme is specified, list all themes.

/clear - clears the conversation`

var messages = [{"role":"system","content":systemPrompt}]

function setSystemPromt(prompt){
    systemPrompt = prompt;
    localStorage.setItem("system",systemPrompt);
    messages[0]["content"] = systemPrompt;
}

function setTheme(theme){
    var r = document.querySelector('body');

    r.style.setProperty('--backgroundColor', THEMES[theme][0]);
    r.style.setProperty('--textColor', THEMES[theme][1]);
    r.style.setProperty('--secondaryColor', THEMES[theme][2]);
    r.style.setProperty('--highlightColor', THEMES[theme][3]);
    r.style.setProperty('--fontFamily', THEMES[theme][4]);

    document.getElementById("code-theme").href = "static/code-themes/"+THEMES[theme][5];
    PR.prettyPrint();
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
        console.log('Formatted text response:', textResponse["content"]);
        receiveResponse(textResponse["content"],textResponse["contentRaw"],textResponse["success"]);
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}

function receiveResponse(response,raw,success=true){
    if (!success){
        displayRawTextResponse("GPT API ran an in to an error: <strong>"+response+"</strong>")
        messages.push({"role":"assistant","content":"Ran in to an error, sorry!"});
        return;
    }
    displayRawTextResponse(response)
    messages.push({"role":"assistant","content":raw});
}

function displayRawTextResponse(text){
    responseElement.innerHTML = text
    PR.prettyPrint();
}

function displayTextResponse(text){
    responseElement.innerText = text
    PR.prettyPrint();
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
                displayTextResponse("Available themes: "+Object.keys(THEMES).join(', '));
                break;
            }
            if (!THEMES[args[0]]){
                displayTextResponse("Theme "+ args[0] + ", doesn't exist. Available themes: "+Object.keys(THEMES).join(', '));
                break;
            }
            localStorage.setItem("theme",args[0]);
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
                    displayRawTextResponse("No system prompt specified.");
                }else{
                    setSystemPromt(command.substring(10));
                    
                    displayRawTextResponse("Set system prompt to <strong>" + command.substring(10) +"</strong>.<br><br>Note that changes may not be apparent until chat reset (/clear).");
                }
            }else if (args[0] == "reset"){
                setSystemPromt(DEFAULT_SYSTEM_PROMPT);
                displayRawTextResponse("Reset sytem prompt.<br><br>Note that changes may not be apparent until chat reset (/clear).");
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
            var inputValue = inputElement.value.trim();
            if (inputValue.startsWith("/")){
                runCommand(inputValue.slice(1));
                inputElement.value = "";
                autoHeight(inputElement);
                return false;
            }
            messages.push({"role":"user","content":inputValue});
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

    if(localStorage.getItem("theme") == null){
        localStorage.setItem("theme","dark");
        localStorage.setItem("system",DEFAULT_SYSTEM_PROMPT);
    }
    setSystemPromt(localStorage.getItem("system"));
    setTheme(localStorage.getItem("theme"));
    displayTextResponse(INTRO_MESSAGE);
});