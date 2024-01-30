# Overview

Just a basic WebUI for ChatGPT access. Doesn't require OpenAI API key, uses another website for the API (which means that anything sent to chatgpt can't be considered particularly secure).
Uses model gpt-3.5-turbo-0613 (can be configured to also support PAI-001 as fallback model). The UI will by default be hosted at http://127.0.0.1:5000/.

Type /help as prompt on the Web UI for a list of commands.

# Installation

1. Install Python if necessary
2. Download the repository (and extract)
3. In a terminal, run `pip install flask markdown-it-py bleach`
4. In the directory you downloaded, run `python server.py` to run the server

To add a fallback model, in case the default API fails, you can create a txt file called pawankrd_key.txt in the root directory.
In the pawankrd_key.txt, you will write your API key for the PAI-001 model. If you don't have one, you can get one for free at [their discord](https://discord.gg/pawan)
The server will now fallback to the PAI-001 model if the default API fails, which can happen from ex. reaching the token limit.