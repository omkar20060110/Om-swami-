from flask import Blueprint, request, jsonify
from models import BlogPost, BlogImage, db

extra_bp = Blueprint('extra', __name__)

# Blogs
@extra_bp.route('/blog', methods=['GET'])
def get_blogs():
    posts = BlogPost.query.all()
    return jsonify([{
        'id': p.id, 'title': p.title, 'content': p.content,
        'author_id': p.author_id, 'image_url': p.image_url,
        'additional_images': [img.image_url for img in p.additional_images],
        'created_at': p.created_at.strftime('%Y-%m-%d %H:%M')
    } for p in posts])

@extra_bp.route('/blog', methods=['POST'])
def add_blog():
    data = request.json
    post = BlogPost(
        title=data.get('title'), content=data.get('content'),
        author_id=data.get('author_id'), image_url=data.get('image_url')
    )
    db.session.add(post)
    db.session.flush()
    
    additional_images = data.get('additional_images', [])
    for img_url in additional_images:
        new_img = BlogImage(blog_post_id=post.id, image_url=img_url)
        db.session.add(new_img)
        
    db.session.commit()
    return jsonify({'message': 'Blog post added'}), 201

@extra_bp.route('/blog/<int:id>', methods=['PUT'])
def update_blog(id):
    data = request.json
    post = BlogPost.query.get_or_404(id)
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    post.image_url = data.get('image_url', post.image_url)
    
    if 'additional_images' in data:
        BlogImage.query.filter_by(blog_post_id=id).delete()
        for img_url in data['additional_images']:
            new_img = BlogImage(blog_post_id=id, image_url=img_url)
            db.session.add(new_img)
            
    db.session.commit()
    return jsonify({'message': 'Blog post updated'}), 200

@extra_bp.route('/blog/<int:id>', methods=['DELETE'])
def delete_blog(id):
    post = BlogPost.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Blog post deleted'}), 200
