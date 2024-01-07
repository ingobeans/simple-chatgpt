Just a basic WebUI for ChatGPT access. Doesn't require OpenAI API key, uses another website for the API (which means that anything sent to chatgpt can't be considered particularly secure).
Uses model gpt-3.5-turbo-0613. The UI will by default be hosted at http://127.0.0.1:5000/.

Packages required to install: flask, markdown-it-py, bleach

Can be installed with: `pip install flask markdown-it-py bleach`

Type /help as prompt on the Web UI for a list of commands.
