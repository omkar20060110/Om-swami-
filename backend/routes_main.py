from flask import Blueprint, request, jsonify, current_app, send_from_directory
from models import Product, ProductImage, Category, ContentBlock, Inquiry, db
import os
from werkzeug.utils import secure_filename
from datetime import datetime

main_bp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm', 'svg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Setup Upload Folder
UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@main_bp.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@main_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({'url': f'/uploads/{filename}'}), 200
    return jsonify({'message': 'File type not allowed'}), 400

# Products CRUD
@main_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    results = []
    for p in products:
        results.append({
            'id': p.id, 'name': p.name, 'hs_code': p.hs_code, 
            'description': p.description, 'export_country': p.export_country, 
            'price': p.price, 'currency': p.currency, 'image_url': p.image_url, 'category_id': p.category_id,
            'additional_images': [img.image_url for img in p.additional_images]
        })
    return jsonify(results), 200

@main_bp.route('/products', methods=['POST'])
def add_product():
    data = request.json
    new_product = Product(
        name=data.get('name'), hs_code=data.get('hs_code'),
        description=data.get('description'), export_country=data.get('export_country'),
        price=data.get('price'), currency=data.get('currency', 'INR'), image_url=data.get('image_url'), category_id=data.get('category_id')
    )
    db.session.add(new_product)
    db.session.flush() # To get the new_product.id
    
    additional_images = data.get('additional_images', [])
    for img_url in additional_images:
        new_img = ProductImage(product_id=new_product.id, image_url=img_url)
        db.session.add(new_img)
        
    db.session.commit()
    return jsonify({'message': 'Product added successfully'}), 201

@main_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.json
    product = Product.query.get_or_404(id)
    product.name = data.get('name', product.name)
    product.hs_code = data.get('hs_code', product.hs_code)
    product.description = data.get('description', product.description)
    product.export_country = data.get('export_country', product.export_country)
    product.price = data.get('price', product.price)
    product.currency = data.get('currency', product.currency)
    product.image_url = data.get('image_url', product.image_url)
    product.category_id = data.get('category_id', product.category_id)
    
    if 'additional_images' in data:
        # Simple approach: clear and re-add
        ProductImage.query.filter_by(product_id=id).delete()
        for img_url in data['additional_images']:
            new_img = ProductImage(product_id=id, image_url=img_url)
            db.session.add(new_img)
            
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'}), 200

@main_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'}), 200

# Categories
@main_bp.route('/categories', methods=['GET', 'POST'])
def categories():
    if request.method == 'GET':
        cats = Category.query.all()
        return jsonify([{'id': c.id, 'name': c.name, 'description': c.description} for c in cats])
    data = request.json
    new_cat = Category(name=data.get('name'), description=data.get('description'))
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({'message': 'Category added'}), 201

@main_bp.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.json
    cat = Category.query.get_or_404(id)
    cat.name = data.get('name', cat.name)
    cat.description = data.get('description', cat.description)
    db.session.commit()
    return jsonify({'message': 'Category updated'}), 200

@main_bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    cat = Category.query.get_or_404(id)
    db.session.delete(cat)
    db.session.commit()
    return jsonify({'message': 'Category deleted'}), 200

# Content Management
@main_bp.route('/content', methods=['GET'])
def get_content():
    blocks = ContentBlock.query.all()
    return jsonify({b.section_name: {'content': b.content, 'image_url': b.image_url} for b in blocks})

@main_bp.route('/content/<section_name>', methods=['PUT'])
def update_content(section_name):
    data = request.json
    block = ContentBlock.query.filter_by(section_name=section_name).first()
    if not block:
        block = ContentBlock(section_name=section_name)
        db.session.add(block)
    
    if 'content' in data: block.content = data['content']
    if 'image_url' in data: block.image_url = data['image_url']
    
    db.session.commit()
    return jsonify({'message': 'Content updated'}), 200

# Inquiries
@main_bp.route('/inquiries', methods=['GET', 'POST'])
def inquiries():
    if request.method == 'POST':
        data = request.json
        new_inq = Inquiry(
            name=data.get('name'),
            company_name=data.get('company_name'),
            country=data.get('country'),
            email=data.get('email'),
            phone=data.get('phone'),
            product_category=data.get('product_category'),
            product_name=data.get('product_name'),
            message=data.get('message', '')
        )
        db.session.add(new_inq)
        db.session.commit()
        return jsonify({'message': 'Inquiry submitted'}), 201
    
    # GET method for admin
    inqs = Inquiry.query.order_by(Inquiry.id.desc()).all()
    return jsonify([{
        'id': i.id, 'name': i.name, 'email': i.email, 'phone': i.phone,
        'company_name': i.company_name, 'country': i.country,
        'product_category': i.product_category, 'product_name': i.product_name,
        'message': i.message, 'date': i.date_submitted.strftime("%Y-%m-%d %H:%M:%S")
    } for i in inqs]), 200

@main_bp.route('/inquiries/<int:id>', methods=['DELETE'])
def delete_inquiry(id):
    inquiry = Inquiry.query.get_or_404(id)
    db.session.delete(inquiry)
    db.session.commit()
    return jsonify({'message': 'Inquiry deleted successfully'}), 200
