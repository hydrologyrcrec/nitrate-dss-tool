from flask import Flask, request, jsonify
from auth.utils import verify_access_token

EXCLUDED_ROUTES = ['/api/auth/signin', '/api/auth/signup', '/api/auth/logout', '/api/auth/refresh-token']

def register_middleware(app):
    @app.before_request
    def check_token():
        if request.method == "OPTIONS":
            return
         
        if request.path in EXCLUDED_ROUTES or request.path.startswith('/static/'):
            return
        cookies = request.cookies
        token = request.cookies.get("accessToken")
        if not token:
            return jsonify({"error": "Token missing"}), 401

        decoded = verify_access_token(token)

        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 403

        # Optional: attach user to request context if needed
        request.user = decoded.get("email")
