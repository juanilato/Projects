from app.event_dispatcher import event_dispatcher
from app.models.product import Product
from app.database import SessionLocal
from sqlalchemy import update

def create_product(name, description, price, revenue, stock):
    #abre sesion, crea producto, lo agrega y cierra la sesion
    session = SessionLocal()
    new_product = Product(name=name, description=description, price=price, revenue = revenue, stock = stock)
    session.add(new_product)
    session.commit()
    session.refresh(new_product)
    session.close()
    #dispara el evento de producto añadido
    event_dispatcher.dispatch("product_added")

    return new_product


def modify_product(product_id, name=None, description=None, price=None, revenue=None, stock=None):
    #busca producto
    session = SessionLocal()
    product = session.query(Product).filter(Product.id == product_id).first()
    #no encuentra producto sale
    if not product:
        session.close()
        return False
    
    #cuando encuentra algo distinto, cambia lo distinto

    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if revenue is not None:
        product.revenue = revenue
    if stock is not None:
        product.stock = stock

    session.commit()
    session.close()
    
    event_dispatcher.dispatch("product_modified")
    return True

#getea el producto del id correspondiente
def get_product_by_id(product_id):
    session = SessionLocal()
    product = session.query(Product).filter(Product.id == product_id).first()
    session.close()
    return product

#Elimina producto
def delete_product(product_id):
    session = SessionLocal()
    product = session.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        session.close()
        return False
    
    session.delete(product)
    session.commit()

    # Consultar todos los productos y reasignar los IDs secuencialmente
    products = session.query(Product).order_by(Product.id).all()
    for idx, product in enumerate(products, start=1):
        session.execute(update(Product).where(Product.id == product.id).values(id=idx))
    
    session.commit()
    session.close()

    # Disparar evento de producto eliminado
    event_dispatcher.dispatch("product_deleted")

    return True
def modify_stock(product_id, stock):
    #busca producto
    session = SessionLocal()
    product = session.query(Product).filter(Product.id == product_id).first()
    #no encuentra producto sale
    if not product:
        session.close()
        return False
    
    #cuando encuentra stock distinto, lo cambia 

    if stock is not None:
        #calculo stocknuevo

        product.stock -= stock

    session.commit()
    session.close()

    event_dispatcher.dispatch("revenue_calculator")

#getea todos los productos
def get_all_products():
    session = SessionLocal()
    products = session.query(Product).all()
    session.close()
    return products
