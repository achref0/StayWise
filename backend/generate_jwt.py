import jwt
import secrets
import datetime

# Generate a random secret key
secret_key = secrets.token_hex(32)

# Create a sample payload
payload = {
    'user_id': 123,
    'username': 'testuser',
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
}

# Encode the payload into a JWT
token = jwt.encode(payload, secret_key, algorithm='HS256')

print(f"Secret Key: {secret_key}")
print(f"Generated JWT: {token}")