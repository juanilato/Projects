import tkinter as tk
from tkinter import ttk
from app.services.product_service import create_product
from app.event_dispatcher import event_dispatcher

class AddProductWindow(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Agregar Producto")
        self.geometry("300x250")

        #Label nombre producto
        self.product_name_label = ttk.Label(self, text="Nombre del producto")
        self.product_name_label.grid(row=0, column=0, padx=10, pady=10)
        #Entrada nombre del producto   
        self.product_name_entry = ttk.Entry(self)
        self.product_name_entry.grid(row=0, column=1, padx=10, pady=10)
        #Label descripcion
        self.product_description_label = ttk.Label(self, text="Descripción")
        self.product_description_label.grid(row=1, column=0, padx=10, pady=10)
        #Entrada descripcion
        self.product_description_entry = ttk.Entry(self)
        self.product_description_entry.grid(row=1, column=1, padx=10, pady=10)
        #label precio
        self.product_price_label = ttk.Label(self, text="Precio")
        self.product_price_label.grid(row=2, column=0, padx=10, pady=10)
        #Entrada precio
        self.product_price_entry = ttk.Entry(self)
        self.product_price_entry.grid(row=2, column=1, padx=10, pady=10)
        #label Ganancia
        self.product_revenue_label = ttk.Label(self, text="Ganancia")
        self.product_revenue_label.grid(row=3, column=0, padx=10, pady=10)
        #Entrada Ganancia
        self.product_revenue_entry = ttk.Entry(self)
        self.product_revenue_entry.grid(row=3, column=1, padx = 10, pady=10)
        #Label Stock
        self.product_stock_label = ttk.Label(self, text="Stock")
        self.product_stock_label.grid(row=4, column=0, padx=10, pady=10)
        #Entrada stock
        self.product_stock_entry = ttk.Entry(self)
        self.product_stock_entry.grid(row=4, column=1, padx = 10, pady=10)
        
        #boton agrega producto
        self.add_product_button = ttk.Button(self, text="Agregar Producto", command=self.add_product)
        self.add_product_button.grid(row=5, column=0, columnspan=1, pady=10)
        #boton elimina producto
        self.add_product_exit = ttk.Button(self, text = "Salir", command=self.destroy)
        self.add_product_exit.grid(row = 5, column=1, columnspan=2, pady = 10)

    #Crea el producto
    def add_product(self):
        #getea datos de los entries
        name = self.product_name_entry.get()
        description = self.product_description_entry.get()
        price = float(self.product_price_entry.get())
        revenue = float(self.product_revenue_entry.get())
        stock = int(self.product_stock_entry.get())
        
        #crea el producto (guarda en base de datos)
        create_product(name, description, price, revenue, stock)
        


        #limpia los entrys para que agregues otro producto
        self.product_name_entry.delete(0, tk.END)
        self.product_description_entry.delete(0, tk.END)
        self.product_price_entry.delete(0, tk.END)
        self.product_revenue_entry.delete(0, tk.END)
        self.product_stock_entry.delete(0, tk.END)


