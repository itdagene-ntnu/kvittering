import sys
import os

from flask import Flask, request
from gevent.pywsgi import WSGIServer
from handler import handle

static_file_directory = os.environ.get("STATIC_DIRECTORY", "../webapp/out/")

app = Flask(__name__, static_folder=static_file_directory, static_url_path="")


@app.route("/")
def index_route():
    return app.send_static_file("index.html")


@app.route("/kaaf", methods=["POST"])
def main_route():
    response, status = handle(request.json)
    return response, status


if __name__ == "__main__":
    http_server = WSGIServer(("", 5000), app)
    http_server.serve_forever()