from flask import Flask, request, jsonify
from auth.utils import verify_access_token

EXCLUDED_ROUTES = ['/api/auth/signin', '/api/auth/signup', '/api/auth/logout', '/api/auth/refresh-token']

def register_middleware(app):
    @app.before_request
    def check_token():
        if request.path in EXCLUDED_ROUTES or request.path.startswith('/static/'):
            return

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token missing"}), 401

        token = auth_header.split(" ")[1]
        decoded = verify_access_token(token)

        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 403

        # Optional: attach user to request context if needed
        request.user = decoded.get("email")
