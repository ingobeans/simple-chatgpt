from flask import Flask, render_template, request, jsonify
import gpt, re, html

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return render_template("chat.html")

def sanitize_and_format(text):
    #BEWARE: ChatGPT generated code, because apparently the bleach library and the MarkdownIT library don't behave well together
    sanitized_text = html.escape(text)
    formatted_text = sanitized_text.replace("\n","<br>")
    formatted_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', formatted_text)
    formatted_text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', formatted_text)
    formatted_text = re.sub(r'```(.*?)```', r'<pre class="prettyprint">\1</pre>', formatted_text, flags=re.DOTALL)
    formatted_text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', formatted_text)

    return formatted_text

@app.route("/api/get_response", methods=["POST"])
def get_response():
    try:
        content = request.json
        print(content)
        success = True
        textRaw = gpt.get_resp(content["messages"])
    except Exception as e:
        textRaw = str(e)
        success = False
        
    #text = bleach.clean(textRaw)
    #text = md.render(src=text)
    
    text = sanitize_and_format(textRaw)
    return jsonify(contentRaw=textRaw,content=text,success=success)

app.run(host="127.0.0.1",port=5000)