from flask import Flask, render_template
import json
import datetime
app = Flask(__name__)

@app.route('/')
def home_age():
	return render_template("main.html")

if __name__ == '__main__':
    app.run()
