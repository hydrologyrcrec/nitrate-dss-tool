from flask import Blueprint, request, jsonify, make_response, current_app
from auth.service import signin, signup
import json
from flask_cors import CORS 
from auth.utils import generate_new_access_token

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
            "message": response["message"],
            "accessToken": response["access_token"]
        }))

        res.set_cookie("refreshToken", response["refresh_token"], secure=True, httponly=True, samesite="None", max_age=86400, path="/")
        res.set_cookie("accessToken", response["access_token"], secure=True, httponly=True, samesite="None", max_age=86400, path="/")
        res.headers["authorization"] = response["access_token"]
        return res
    else:
        return jsonify({"authenticated": False, "message": response["message"]}), 200


@auth_bp.route("/signup", methods=["POST", "OPTIONS"], provide_automatic_options=True)
def signup_route():
    if request.method == "OPTIONS":
        return '', 200
    data = request.get_json()
    response = signup(data)
    if response["authenticated"]:
        res = make_response(jsonify({
            "email": data["email"],
            "username": response["username"],
            "authenticated": True,
            "message": response["message"],
            "accessToken": response["access_token"]
        }))

        res.set_cookie("accessToken", response["access_token"], secure=True, httponly=True, samesite="None", max_age=86400, path="/")
        res.set_cookie("refreshToken", response["refresh_token"], secure=True, httponly=True, samesite="None", max_age=86400, path="/")
        res.headers["authorization"] = response["access_token"]
        return res
    else:
        return jsonify({"authenticated": False, "message": response["message"]}), 200

@auth_bp.route("/refresh-token", methods=["POST"])
def refresh_token_route():
    refresh_token = request.cookies.get("refreshToken")
    if not refresh_token:
        return jsonify({"error": "No refresh token"}), 401
    new_access_token = generate_new_access_token(refresh_token)
    if not new_access_token:
        return jsonify({"error": "Refresh token Expired. Please Login again"}), 401
    res = make_response(jsonify({"accessToken": new_access_token}))
    res.set_cookie("accessToken", new_access_token, secure=True, httponly=True, samesite="None", max_age=86400, path="/")
    return res

@auth_bp.route("/logout", methods=["POST"])
def logout_route():
    res = make_response(jsonify({"message": "Logged out"}))
    res.set_cookie("accessToken", "", max_age=0, secure=True, httponly=True, samesite="None")
    res.set_cookie("refreshToken", "", max_age=0, secure=True, httponly=True, samesite="None")
    return res