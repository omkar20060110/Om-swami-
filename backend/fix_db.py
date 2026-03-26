from app import app, db
from models import ProductImage, Product, ContentBlock, BlogImage

with app.app_context():
    # Create tables that might not exist
    db.create_all()
    print("Database schema successfully updated!")

