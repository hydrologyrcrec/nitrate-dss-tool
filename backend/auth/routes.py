from flask import Blueprint, request, jsonify, make_response, current_app
from auth.service import signin, signup
import json
from flask_cors import CORS 

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signin", methods=["POST", "OPTIONS"], provide_automatic_options=True)
def signin_route():
    if request.method == "OPTIONS":
        return '', 200
    data = request.get_json()
    response = signin(data)
    if response["authenticated"]:
        res = make_response(jsonify({
            "email": data["email"],
            "username": response["username"],
            "authenticated": True,
            "message": response["message"]
        }))

        res.set_cookie("accessToken", json.dumps({
            "act": response["access_token"],
            "email": data["email"]
        }), secure=True, httponly=False, samesite="Strict", max_age=900)

        res.set_cookie("auth", json.dumps({
            "rft": response["refresh_token"],
            "email": data["email"]
        }), secure=True, httponly=True, samesite="Strict", max_age=86400)

        res.headers["authorization"] = response["access_token"]
        return res
    else:
        return jsonify({"authenticated": False, "message": response["message"]}), 401


@auth_bp.route("/signup", methods=["POST", "OPTIONS"], provide_automatic_options=True)
def signup_route():
    data = request.get_json()
    response = signup(data)
    if response["authenticated"]:
        res = make_response(jsonify({
            "email": data["email"],
            "username": response["username"],
            "authenticated": True,
            "message": response["message"]
        }))

        res.set_cookie("accessToken", json.dumps({
            "act": response["access_token"],
            "email": data["email"]
        }), secure=True, httponly=False, samesite="Strict", max_age=900)

        res.set_cookie("auth", json.dumps({
            "rft": response["refresh_token"],
            "email": data["email"]
        }), secure=True, httponly=True, samesite="Strict", max_age=86400)

        res.headers["authorization"] = response["access_token"]
        return res
    else:
        return jsonify({"authenticated": False, "message": response["message"]}), 400
