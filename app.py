from flask import Flask, render_template, request
import os
from DTMFdetector import DTMFdecoder
app = Flask(__name__)

@app.route("/")
def homePage():
    return  render_template("home.html")

@app.route("/uploadFile", methods=['POST'])
def extractAudio():
    if request.method=="POST":
        try:
            audioFile = request.files["fileInput"]
            fileName = audioFile.filename
            audioFile.save(fileName)
            data = DTMFdecoder(fileName)
            print(data)
            os.remove(fileName)
            return render_template("home.html", data={"number": data})
        except Exception as exe:
            return render_template("home.html", error={"error":exe})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)