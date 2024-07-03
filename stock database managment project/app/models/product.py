from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    revenue = Column(Float, nullable = False, default = 0.0)
    stock = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
