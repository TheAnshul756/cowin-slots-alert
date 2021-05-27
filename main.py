from flask import Flask, render_template
import requests
from fake_headers import Headers
import json
import datetime
app = Flask(__name__)

@app.route('/')
def home_age():
	return render_template("main.html")

if __name__ == '__main__':
    app.run()
