import os

class Config:
    ACCESS_TOKEN_SECRET= os.getenv("ACCESS_TOKEN_SECRET", "jwtsecret")
    REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET", "supersecret")
    ENV = os.getenv("ENV", "development")