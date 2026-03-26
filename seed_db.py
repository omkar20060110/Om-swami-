import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app import app, db
from models import Category, Product, ProductImage

def seed():
    with app.app_context():
        # Ensure category exists
        cat = Category.query.filter_by(name='Premium Grains').first()
        if not cat:
            cat = Category(name='Premium Grains')
            db.session.add(cat)
            db.session.commit()
            print("Category 'Premium Grains' added.")
        
        # Ensure product exists
        prod_name = 'Verified Basmati Rice'
        prod = Product.query.filter_by(name=prod_name).first()
        if not prod:
            prod = Product(
                name=prod_name,
                description='High-quality long-grain Basmati rice, aged for 2 years. Perfect for Biryani and Pulav. Export quality with strict quality assurance.',
                hs_code='1006.30',
                price=1240.50,
                export_country='Middle East, USA, Europe',
                image_url='/static/uploads/rice_main.jpg', 
                category_id=cat.id
            )
            db.session.add(prod)
            db.session.commit()
            
            # Additional Images
            img1 = ProductImage(product_id=prod.id, image_url='/static/uploads/rice_1.jpg')
            img2 = ProductImage(product_id=prod.id, image_url='/static/uploads/rice_2.jpg')
            db.session.add_all([img1, img2])
            db.session.commit()
            print(f"Product '{prod_name}' and additional images added.")
        else:
            print(f"Product '{prod_name}' already exists.")

if __name__ == '__main__':
    seed()
