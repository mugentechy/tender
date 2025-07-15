from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    role = db.Column(db.String, default='vendor')
    bio = db.Column(db.String)
    image = db.Column(db.String)
    cover_image = db.Column(db.String)
    profile_image = db.Column(db.String)
    password_hash = db.Column(db.String)
    document = db.Column(db.String)
    has_notification = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bought_tenders = db.relationship('Tender', foreign_keys='Tender.buyer_id', backref='buyer', lazy=True)
    owned_tenders = db.relationship('Tender', foreign_keys='Tender.company_id', backref='owner', lazy=True)
    evaluated_tenders = db.relationship('Tender', foreign_keys='Tender.evaluator_id', backref='evaluator', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    questions = db.relationship('Question', backref='user', lazy=True)
    answers = db.relationship('Answer', backref='owner', lazy=True)
    bid_as_company = db.relationship('Bid', foreign_keys='Bid.company_id', backref='company', lazy=True)
    bid_as_vendor = db.relationship('Bid', foreign_keys='Bid.vendor_id', backref='vendor', lazy=True)

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)


class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    tender_id = db.Column(db.Integer, db.ForeignKey('tenders.id'))
    company_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String)
    amount = db.Column(db.Float)
    vendor_name = db.Column(db.String)
    location = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Tender(db.Model):
    __tablename__ = 'tenders'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    category = db.Column(db.String)
    rating = db.Column(db.Integer)
    image_url = db.Column(db.String)
    company_name = db.Column(db.String)
    cost = db.Column(db.Float)
    status = db.Column(db.String, default='unsold')
    company_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    evaluator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bids = db.relationship('Bid', backref='tender', lazy=True)


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    answers = db.relationship('Answer', backref='question', lazy=True)


class Answer(db.Model):
    __tablename__ = 'answers'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
