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
    content = request.json
    textRaw = gpt.get_resp(content["messages"])
    text = bleach.clean(textRaw)
    text = md.render(src=text)
    return jsonify(contentRaw=textRaw,content=text)

app.run()