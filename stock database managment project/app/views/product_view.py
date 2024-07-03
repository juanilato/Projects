import tkinter as tk
from tkinter import ttk
from app.services.product_service import create_product, get_all_products, delete_product
from app.event_dispatcher import event_dispatcher

class ProductView(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)

        #Tabla de productos
        self.products_tree = ttk.Treeview(self, columns=("ID", "Name", "Description", "Price", "Revenue", "Stock"), show='headings')
        self.products_tree.heading("ID", text="ID")
        self.products_tree.heading("Name", text="Nombre")
        self.products_tree.heading("Description", text="Descripcion")
        self.products_tree.heading("Price", text="Precio")
        self.products_tree.heading("Revenue", text = "Ganancia")
        self.products_tree.heading("Stock", text = "Stock")
        self.products_tree.grid(row=0, column=0, columnspan=2, padx=10, pady=10)
        
        #carga los elementos(productos)
        
        self.load_products()
        
        #Conectador de eventos
        event_dispatcher.connect("product_added", lambda: self.on_product_added("product_added"))
        event_dispatcher.connect("product_deleted", lambda: self.on_product_deleted("product_deleted"))
        event_dispatcher.connect("product_modified", lambda: self.on_product_deleted("product_modified"))
        event_dispatcher.connect("revenue_calculator", lambda: self.on_product_deleted("revenue_calculator"))

        
        #Carga los productos en la tabla
    def load_products(self):
        for item in self.products_tree.get_children():
            self.products_tree.delete(item)
        products = get_all_products()
        for product in products:
            self.products_tree.insert('', 'end', values=(product.id, product.name, product.description, product.price, product.revenue, product.stock))
    
    
    #se encarga de manejar el evento correspondiente
    def on_product_added(self, event_name):
        self.load_products()

    def on_product_deleted(self, event_name):
        self.load_products()

    def on_product_modified(self, event_name):
        self.load_products()

    def on_revenue_calculator(self, event_name):
        self.load_products()