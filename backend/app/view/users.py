from flask import request,Blueprint,jsonify,render_template, send_from_directory
from app.model.data_model import *
from app import db
from app.model.auth import create_auth_token, token_required
import os
from sqlalchemy import join,and_
import datetime
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
import io




users = Blueprint('users', __name__)




# Registration #
@users.route('/auth/login', methods=['POST'])
def auth_tendor():
    data = request.get_json()
    if not data:
        return jsonify({'msg': 'Missing JSON'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Invalid credentials'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Invalid email'}), 401

    if not user.verify_password(password):
        return jsonify({'message': 'Invalid password'}), 401

    token = create_auth_token(user.id)
    return jsonify({
        'message': 'Login successful',
        'user': {
            'user_id': user.id,
            'role': user.role,  # from DB
            'token': token,
            'name': user.name,
            'email': user.email
        }
    }), 200




@users.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing JSON data'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'vendor')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400


    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(
        name=name,
        email=email,
        role=role,
        password_hash=generate_password_hash(password)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


# end Registration #
@users.route('/user/createtender', methods=['POST'])
def create_tender():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Missing JSON data'}), 400

    title = data.get('title')
    description = data.get('description')
    cost = data.get('cost')
    category = data.get('category')
    image_url = data.get('imageUrl')

    # Validate required fields
    if not title or not description or cost is None or not category or not image_url:
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        cost = float(cost)
    except ValueError:
        return jsonify({'message': 'Invalid cost value'}), 400

    new_tender = Tender(
        title=title,
        description=description,
        cost=cost,
        category=category,
        image_url=image_url
    )

    db.session.add(new_tender)
    db.session.commit()

    return jsonify({
        'message': 'Tender created successfully',
        'tender': {
            'id': new_tender.id,
            'title': new_tender.title,
            'description': new_tender.description,
            'cost': new_tender.cost,
            'category': new_tender.category,
            'imageUrl': new_tender.image_url,
            'createdAt': new_tender.created_at.isoformat()
        }
    }), 201


# Student #



@users.route('/user/getalltender', methods=['GET'])
@token_required
def get_all_tender(current_user):
    tenders = Tender.query.all()

    if tenders:
        tender_list = []
        for tender in tenders:
            tender_data = {
                'id': tender.id,
                'title': tender.title,
                'description': tender.description,
                'category': tender.category,
                'rating': tender.rating,
                'image_url': tender.image_url,
                'company_name': tender.company_name,
                'cost': tender.cost,
                'status': tender.status,
                'company_id': tender.company_id,
                'evaluator_id': tender.evaluator_id,
                'buyer_id': tender.buyer_id,
                'created_at': tender.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            tender_list.append(tender_data)

        return jsonify(tender_list), 200
    else:
        return jsonify({'status': 404, 'error': 'No tenders found'}), 404







@users.route('/user/my-details', methods=['GET'])
@token_required
def get_user_details(current_user):
    user = User.query.filter_by(id=current_user.id).first()
    print(user)

    if user:
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'has_notification': user.has_notification,
            'created_at': user.created_at,
            'updated_at': user.updated_at
            # Add more fields if needed, excluding sensitive ones like password_hash
        }
        return jsonify({'status': 200, 'user': user_data}), 200
    else:
        return jsonify({'status': 404, 'error': 'User not found'}), 404




@users.route('/user/getcategory', methods=['GET'])
@token_required
def get_all_categories(current_user):
    try:
        categories = db.session.query(Tender.category).distinct().all()
        category_list = [category[0] for category in categories if category[0]]

        return jsonify(category_list), 200
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")
        return jsonify({'status': 500, 'error': 'Failed to load categories'}), 500



@users.route('/user/tenderdetails/<int:tender_id>', methods=['GET'])
def get_tender_by_id(tender_id):
    tender = Tender.query.get(tender_id)

    if not tender:
        return jsonify({'message': 'Tender not found'}), 404

    return jsonify({
        'id': tender.id,
        'title': tender.title,
        'description': tender.description,
        'cost': tender.cost,
        'category': tender.category,
        'imageUrl': tender.image_url,
        'createdAt': tender.created_at.isoformat()
    }), 200

@users.route("/user/searchtender", methods=["GET"])
def search_tender_by_name():
    name = request.args.get("name", "").strip()

    if not name:
        return jsonify({"message": "Name query parameter is required"}), 400

    matching_tenders = Tender.query.filter(Tender.title.ilike(f"%{name}%")).all()

    if not matching_tenders:
        return jsonify({"message": "No tenders found"}), 404

    results = [
        {
            "id": tender.id,
            "title": tender.title,
            "description": tender.description,
            "category": tender.category,
            "cost": tender.cost,
            "imageUrl": tender.imageUrl,
        }
        for tender in matching_tenders
    ]

    return jsonify(results), 200



@users.route('/user/getcompany', methods=['GET'])
@token_required
def get_all_company(current_user):
    try:
        # Get distinct company names from users whose role is 'company'
        company_users = (
            db.session.query(User.name)
            .filter(User.role == 'company')
            .distinct()
            .all()
        )

        # Extract names from query result
        company_name_list = [company[0] for company in company_users if company[0]]

        return jsonify({"message": company_name_list, "status": 200}), 200
    except Exception as e:
        print(f"Error fetching companies: {str(e)}")
        return jsonify({'status': 500, 'error': 'Failed to load companies'}), 500



@users.route('/user/getvendors', methods=['GET'])
@token_required
def get_all_vendor(current_user):
    try:
        # Get distinct company names from users whose role is 'company'
        company_users = (
            db.session.query(User.name)
            .filter(User.role == 'vendor')
            .distinct()
            .all()
        )

        # Extract names from query result
        company_name_list = [company[0] for company in company_users if company[0]]

        return jsonify({"message": company_name_list, "status": 200}), 200
    except Exception as e:
        print(f"Error fetching vendor: {str(e)}")
        return jsonify({'status': 500, 'error': 'Failed to load vendor'}), 500



@users.route("/tenders/<int:tender_id>/bids", methods=["POST"])
def create_bid(tender_id):
    if current_user.role != "vendor":
        return jsonify(custom_response(403, "Only vendors can create bids"))

    data = request.get_json()
    amount = data.get("amount")

    tender = Tender.query.filter_by(id=tender_id).first()

    if not tender:
        return jsonify(custom_response(404, "Tender not found"))

    if tender.status != "unsold":
        return jsonify(custom_response(400, "Tender is closed for bids"))

    if amount < tender.cost:
        return jsonify(custom_response(400, "Bidding amount must be greater than or equal to the cost of the tender"))

    new_bid = Bid(
        tender_id=tender.id,
        company_id=tender.company_id,
        vendor_id=current_user.id,
        amount=amount,
        status="pending",
        vendor_name=current_user.name,  # Assuming current_user has a name field
        location=current_user.location  # Assuming current_user has a location field
    )

    db.session.add(new_bid)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Bid created successfully",
        "data": {
            "id": new_bid.id,
            "amount": new_bid.amount,
            "status": new_bid.status,
            "vendor_id": new_bid.vendor_id,
            "created_at": new_bid.created_at
        }
    })

@users.route("/user/getallbids//<int:tender_id>", methods=["GET"])
def get_all_bids(tender_id):
    tender = Tender.query.filter_by(id=tender_id).first()

    if not tender:
        return jsonify(custom_response(404, "Tender not found"))

    bids = Bid.query.filter_by(tender_id=tender.id).all()

    bid_list = []
    for bid in bids:
        bid_list.append({
            "id": bid.id,
            "amount": bid.amount,
            "status": bid.status,
            "vendor_id": bid.vendor_id,
            "vendor_name": bid.vendor_name,
            "location": bid.location,
            "created_at": bid.created_at
        })

    return jsonify({
        "success": True,
        "message": "Bids retrieved successfully",
        "data": bid_list
    })
