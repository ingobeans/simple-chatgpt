from flask import Flask, render_template, request, jsonify
from markdown_it import MarkdownIt
import gpt, bleach

app = Flask(__name__)
md = MarkdownIt()

@app.route("/", methods=["GET"])
def home():
    return render_template("chat.html")

@app.route("/api/get_response", methods=["POST"])
def get_response():
    try:
        content = request.json
        success = True
        textRaw = gpt.get_resp(content["messages"])
    except Exception as e:
        textRaw = str(e)
        success = False
    text = bleach.clean(textRaw)
    text = md.render(src=text)
    return jsonify(contentRaw=textRaw,content=text,success=success)

app.run()