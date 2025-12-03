from flask import Flask, g, request, jsonify, abort
import sqlite3, os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from datetime import timedelta
from flask_cors import CORS
import time

load_dotenv()

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(os.getenv('DATABASE'), detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row
    return g.db

def user_exists(name: str) -> bool:
    db = get_db()
    user = db.execute("SELECT username FROM user WHERE username = ?", (name,)).fetchone()
    if user: return True


app = Flask(__name__)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_ACCESS_COOKIE_PATH"] = '/'
app.config["JWT_ACCESS_COOKIE_NAME"] = 'token'
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app,
     origins=['http://localhost:5173'], 
     supports_credentials=True,
     methods=["GET", "POST", "DELETE", "PATCH"],
     allow_headers=["Content-Type"]
)

@app.route("/")
@jwt_required(optional=True)
def main():
    user = get_jwt_identity()
    if not user:
        return {"sucess": True}, 200
    db = get_db()
    row = db.execute("SELECT username FROM user WHERE id = ?", (user,)).fetchone()
    return {
        "user": row['username']
    }, 200

@app.post("/register")
def registration():
    username = request.get_json()["username"]
    password = request.get_json()["password"]
    hashed_psw = bcrypt.generate_password_hash(password)
    if not user_exists(username):
        db = get_db()
        db.execute("INSERT INTO user (username, password) VALUES (?, ?)", (username, hashed_psw))
        db.commit()
        return {"msg": "Registration completed"}, 200
    return {"error": "Username already taken, choose something else."}, 400

@app.post("/login")
def login():
    username = request.get_json()["username"]
    password = request.get_json()["password"]
    db = get_db()
    user = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()
    if not user: return {"error": "User doesn't exists."}, 400
    if bcrypt.check_password_hash(user["password"], password):
        token = create_access_token(identity=str(user["id"]))
        resp = jsonify({"token": token})
        resp.set_cookie("token", token)
        return resp, 200
    return {"error": "Invalid username or password."}, 400

@app.get("/logout")
@jwt_required()
def logout():
    resp = jsonify({"msg": "Logged out."})
    unset_jwt_cookies(resp)
    return resp

@jwt.expired_token_loader
def expired_token_revoke(jwt_header, jwt_payload):
    resp = jsonify(msg="Token expired, log in again.")
    unset_jwt_cookies(resp)
    return resp


@app.route("/vehicles", methods=['GET', 'POST'])
@jwt_required()
def user_vehicles():
    user_id = get_jwt_identity()
    db = get_db()
    if request.method == 'GET':
        vehicles = db.execute("SELECT * FROM vehicle WHERE owner_id = ?", (user_id,)).fetchall()
        if not vehicles: return jsonify({"msg": "You have no vehicles added yet."}), 200
        return {"Vehicles": {vehicle['id'] : {"brand": vehicle['brand'], "model": vehicle['model'], "year": vehicle['year'], "fuel": vehicle['fuel_type']} for vehicle in vehicles}}, 200
    if request.method == 'POST':
        data = request.get_json(silent=True)['newCar']
        brand = data.get("brand")
        model = data.get("model")
        year = data.get("year")
        fuel = data.get("fuel")
        db.execute("INSERT INTO vehicle (brand, model, year, fuel_type, owner_id) VALUES (?,?,?,?,?)",(brand, model, year, fuel, user_id))
        db.commit()
        return jsonify({"msg": "Vehicle added to your garage."}), 200

@app.get("/services")
@jwt_required()
def user_services():
    user_id = get_jwt_identity()
    db = get_db()
    services = db.execute("SELECT * FROM service WHERE owner_id=?", (user_id,)).fetchall()
    if not services: return jsonify({"msg": "You have no services added yet."}), 200
    return {"Services": {service['id'] : {"name": service['name'], "description": service['description'], "odometer": service['odometer'], "time": service['time'], "cost": service['labor_cost'], "vehicle_id": service['vehicle_id']} for service in services}}, 200


@app.route("/<vehicle_id>", methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def vehicle(vehicle_id):
    user_id = get_jwt_identity()
    db = get_db()
    vehicle = db.execute("SELECT * FROM vehicle WHERE id=? AND owner_id=?", (vehicle_id, user_id)).fetchone()
    if request.method == 'GET':
        return jsonify({"vehicle": {"brand": vehicle['brand'], "model": vehicle['model'], "year": vehicle['year'], "fuel": vehicle['fuel_type']}})
    if request.method == 'POST':
        data = request.get_json(silent=True)['newCar']
        brand = data.get("brand")
        model = data.get("model")
        year = data.get("year")
        fuel = data.get("fuel")
        db.execute("UPDATE vehicle SET brand=?, model=?, year=?, fuel_type=? WHERE id=?",(brand, model, year, fuel, vehicle_id))
        db.commit()
        vehicle = db.execute("SELECT * FROM vehicle WHERE id=? AND owner_id=?", (vehicle_id, user_id)).fetchone()
        return jsonify({"vehicle": {"brand": vehicle['brand'], "model": vehicle['model'], "year": vehicle['year'], "fuel": vehicle['fuel_type']}})
    if request.method == 'DELETE':
        if vehicle:
            db.execute("DELETE FROM vehicle WHERE id=?", (vehicle_id))
            db.commit()
            return jsonify({"deleted": f"{vehicle['id']}"})
        return jsonify({"error": "vehicle not found."})
    

@app.route("/<vehicle_id>/<service_id>", methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def edit_delete_service(vehicle_id, service_id):
    user_id = get_jwt_identity()
    db = get_db()
    if request.method == 'GET':
        service = db.execute("SELECT * FROM service WHERE owner_id = ? AND id = ?", (user_id, service_id)).fetchone()
        return {"name": service['name'], "description": service['description'], "odometer": service['odometer'], "time": service['time'], "cost": service['labor_cost'], "vehicle_id": service['vehicle_id']}, 200
    if request.method == 'POST':
        data = request.get_json(silent=True)['updatedService']
        print(data)
        name = data.get("name")
        description = data.get("description")
        date = data.get("date")
        odometer = data.get("odometer")
        cost = data.get("cost")
        db.execute("UPDATE service SET name=?, description=?, time=?, odometer=?, labor_cost=?, owner_id=?, vehicle_id=?",(name, description, date, odometer, cost, user_id, vehicle_id))
        db.commit()
        return {"msg": "Service data updated successfully"}, 200
    if request.method == 'DELETE':
        db.execute("DELETE FROM service WHERE id=?", (service_id,))
        db.commit()
        return {"msg": "Service data deleted successfully"}, 200
    

@app.route("/<vehicle_id>/services", methods=['GET', 'POST'])
@jwt_required()
def service(vehicle_id):
    user_id = get_jwt_identity()
    db = get_db()
    if request.method == 'GET':
        services = db.execute("SELECT * FROM service WHERE vehicle_id=?", (vehicle_id,)).fetchall()
        parts = db.execute("SELECT * FROM part WHERE vehicle_id = ?", (vehicle_id,)).fetchall()
        if not services: return jsonify({"msg": "No services yet."})
        return jsonify({"Services": {row["id"]: {"name": row["name"], "description": row['description'], "odometer": row['odometer'], "time": row['time']} for row in services}})
    if request.method == 'POST':
        data = request.get_json(silent=True)['newService']
        name = data.get("name")
        description = data.get("description")
        date = data.get("date")
        odometer = data.get("odometer")
        cost = data.get("cost")
        db.execute("INSERT INTO service (name, description, time, odometer, labor_cost, owner_id, vehicle_id) VALUES (?,?,?,?,?,?,?)",(name, description, date, odometer, cost, user_id, vehicle_id))
        db.commit()
        return {"msg": "Service upload success."}
        

@app.route("/<vehicle_id>/parts", methods=['GET', 'POST'])
@jwt_required()
def parts(vehicle_id):
    user_id = get_jwt_identity()
    db = get_db()
    vehicle = db.execute("SELECT * FROM vehicle WHERE id = ?", (vehicle_id,)).fetchone()
    if not vehicle: return abort(404)
    if request.method == 'GET':
        parts = db.execute("SELECT * FROM part WHERE vehicle_id = ?", (vehicle_id,)).fetchall()
        if not parts: return jsonify({"msg": "No parts available for this vehicle."})
        return jsonify({"Parts": {row["id"]: {"name": row["name"], "number": row['number'], "quantity": row['quantity'], "price": row['price']} for row in parts}})
    if request.method == 'POST':
        name = request.get_json()["name"]
        number = request.get_json()["number"]
        quantity = request.get_json()["quantity"]
        price = request.get_json()["price"]
        db.execute("INSERT INTO part (name, number, quantity, price, owner_id, vehicle_id) VALUES (?,?,?,?,?,?)",(name, number, quantity, price, user_id, vehicle_id))
        db.commit()
        return {"msg": "Part upload success."}


app.run(debug=True, host='localhost')