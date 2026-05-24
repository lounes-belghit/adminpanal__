import mysql.connector
import bcrypt
import sys
import requests
import json

# Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'BikeRentalDB',
    'port': 3306
}

# API Configuration
API_LOGIN_URL = "http://localhost:8080/api/v1/auth/login"

def test_login(email, password):
    print(f"\n--- Testing API Login for {email} ---")
    payload = {
        "email": email,
        "password": password
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(API_LOGIN_URL, json=payload, headers=headers)
        if response.status_code == 200:
            print("[SUCCESS] Login successful!")
            print("Response Data:", json.dumps(response.json(), indent=2))
        else:
            print(f"[FAILED] Login failed with status code: {response.status_code}")
            try:
                print("Error Response:", json.dumps(response.json(), indent=2))
            except:
                print("Raw Response:", response.text)
    except requests.exceptions.ConnectionError:
        print("[ERROR] Could not connect to the backend server. Is it running on port 8080?")
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred: {e}")

def create_super_admin(name, email, password):
    try:
        # Connect to MySQL
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Hash the password using BCrypt (compatible with Java backend)
        # Force "2a" prefix as the Java backend strictly checks for it
        salt = bcrypt.gensalt(rounds=12, prefix=b"2a")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

        # SQL Query
        query = """
        INSERT INTO Users (name, email, password_hash, user_type, is_verified, is_active)
        VALUES (%s, %s, %s, 'super_admin', TRUE, TRUE)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            password_hash = VALUES(password_hash),
            is_active = TRUE;
        """
        
        cursor.execute(query, (name, email, hashed_password))
        conn.commit()

        print(f"Successfully created/updated Super Admin in Database: {email}")
        
        # Test the login via API
        test_login(email, password)

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    print("--- BykerAntel Super Admin Creator ---")
    
    # Defaults
    name = "Super Admin"
    email = "superadmin@bykerantel.dz"
    password = "superadmin123"

    # Optional command line override
    if len(sys.argv) > 1:
        email = sys.argv[1]
    if len(sys.argv) > 2:
        password = sys.argv[2]

    create_super_admin(name, email, password)

    print("\nNext steps:")
    print("1. Ensure Docker is running (docker-compose up -d)")
    print("2. Run this script: python create_superadmin.py")
    print("3. Log in at http://localhost:5173")
