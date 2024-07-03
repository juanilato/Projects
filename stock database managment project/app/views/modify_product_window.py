import tkinter as tk
from tkinter import ttk
from app.services.product_service import get_product_by_id, modify_product
from app.event_dispatcher import event_dispatcher

class ModifyProductWindow(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Modificar Producto")
        self.geometry("300x300")

        # Label y entrada para el ID del producto
        self.product_id_label = ttk.Label(self, text="ID del producto")
        self.product_id_label.grid(row=0, column=0, padx=10, pady=10)
        self.product_id_entry = ttk.Entry(self)
        self.product_id_entry.grid(row=0, column=1, padx=10, pady=10)
        self.product_id_entry.bind("<Return>", self.load_product)  # Cargar producto al presionar Enter

        # Label y entrada para el nombre del producto
        self.product_name_label = ttk.Label(self, text="Nombre del producto")
        self.product_name_label.grid(row=1, column=0, padx=10, pady=10)
        self.product_name_entry = ttk.Entry(self)
        self.product_name_entry.grid(row=1, column=1, padx=10, pady=10)

        # Label y entrada para la descripción
        self.product_description_label = ttk.Label(self, text="Descripción")
        self.product_description_label.grid(row=2, column=0, padx=10, pady=10)
        self.product_description_entry = ttk.Entry(self)
        self.product_description_entry.grid(row=2, column=1, padx=10, pady=10)

        # Label y entrada para el precio
        self.product_price_label = ttk.Label(self, text="Precio")
        self.product_price_label.grid(row=3, column=0, padx=10, pady=10)
        self.product_price_entry = ttk.Entry(self)
        self.product_price_entry.grid(row=3, column=1, padx=10, pady=10)

        # Label y entrada para la ganancia
        self.product_revenue_label = ttk.Label(self, text="Ganancia")
        self.product_revenue_label.grid(row=4, column=0, padx=10, pady=10)
        self.product_revenue_entry = ttk.Entry(self)
        self.product_revenue_entry.grid(row=4, column=1, padx=10, pady=10)

        # Label y entrada para el stock
        self.product_stock_label = ttk.Label(self, text="Stock")
        self.product_stock_label.grid(row=5, column=0, padx=10, pady=10)
        self.product_stock_entry = ttk.Entry(self)
        self.product_stock_entry.grid(row=5, column=1, padx=10, pady=10)

        # Botón para modificar producto
        self.modify_product_button = ttk.Button(self, text="Modificar Producto", command=self.modify_product)
        self.modify_product_button.grid(row=6, column=0, columnspan=1, pady=10)

        # Botón para salir
        self.exit_button = ttk.Button(self, text="Salir", command=self.destroy)
        self.exit_button.grid(row=6, column=1, columnspan=2, pady=10)

    def load_product(self, event=None):
        # Obtiene el ID del producto
        product_id = int(self.product_id_entry.get())

        # Obtiene el producto de la base de datos
        product = get_product_by_id(product_id)

        if product:
            # Rellena los campos de entrada con los datos del producto
            self.product_name_entry.delete(0, tk.END)
            self.product_name_entry.insert(0, product.name)
            self.product_description_entry.delete(0, tk.END)
            self.product_description_entry.insert(0, product.description)
            self.product_price_entry.delete(0, tk.END)
            self.product_price_entry.insert(0, product.price)
            self.product_revenue_entry.delete(0, tk.END)
            self.product_revenue_entry.insert(0, product.revenue)
            self.product_stock_entry.delete(0, tk.END)
            self.product_stock_entry.insert(0, product.stock)

    def modify_product(self):
        # Obtiene los datos de los campos de entrada
        product_id = int(self.product_id_entry.get())
        name = self.product_name_entry.get()
        description = self.product_description_entry.get()
        price = float(self.product_price_entry.get())
        revenue = float(self.product_revenue_entry.get())
        stock = int(self.product_stock_entry.get())

        # Modifica el producto en la base de datos
        modify_product(product_id, name, description, price, revenue, stock)

        # Limpia los campos de entrada
        self.product_id_entry.delete(0, tk.END)
        self.product_name_entry.delete(0, tk.END)
        self.product_description_entry.delete(0, tk.END)
        self.product_price_entry.delete(0, tk.END)
        self.product_revenue_entry.delete(0, tk.END)
        self.product_stock_entry.delete(0, tk.END)
