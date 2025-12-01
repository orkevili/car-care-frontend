
from flask import current_app
from back import app, get_db

def init_db():
    with app.app_context():
        db = get_db()
        with current_app.open_resource('schema.sql') as f:
            db.executescript(f.read().decode('utf-8'))

if __name__ == "__main__":
    init_db()