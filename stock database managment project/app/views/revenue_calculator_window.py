import tkinter as tk
from tkinter import ttk, messagebox
from app.services.product_service import get_product_by_id, modify_stock
from app.event_dispatcher import event_dispatcher

class RevenueCalculatorWindow(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Modificar Producto")
        self.geometry("300x250")
        # Variable para almacenar la ganancia total acumulada
        self.total_revenue = 0
        
        # Variable para almacenar el total facturado
        self.total = 0

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
        self.product_stock_label = ttk.Label(self, text="Stock a vender")
        self.product_stock_label.grid(row=5, column=0, padx=10, pady=10)
        self.product_stock_entry = ttk.Entry(self)
        self.product_stock_entry.grid(row=5, column=1, padx=10, pady=10)

        # Botón para modificar producto
        self.modify_product_button = ttk.Button(self, text="Cargar venta", command=self.modify_stock)
        self.modify_product_button.grid(row=6, column=0, columnspan=1, pady=10)

        # Botón para salir
        self.exit_button = ttk.Button(self, text="Salir", command=self.show_revenue_and_exit)
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
            self.product_price_entry.delete(0, tk.END)
            self.product_price_entry.insert(0, product.price)
            self.product_revenue_entry.delete(0, tk.END)
            self.product_revenue_entry.insert(0, product.revenue)

    def modify_stock(self):
        # Obtiene los datos de los campos de entrada
        product_id = int(self.product_id_entry.get())
        stock = int(self.product_stock_entry.get())
        revenue_per_unit = float(self.product_revenue_entry.get())
        price_per_unit = float(self.product_price_entry.get())
        # Modifica el producto en la base de datos
        modify_stock(product_id, stock)

        # Calcula la ganancia y la acumula
        total_revenue = stock * revenue_per_unit
        self.total_revenue += total_revenue

        total = stock * price_per_unit
        self.total += total

        # Limpia los campos de entrada
        self.product_id_entry.delete(0, tk.END)
        self.product_name_entry.delete(0, tk.END)
        self.product_price_entry.delete(0, tk.END)
        self.product_revenue_entry.delete(0, tk.END)
        self.product_stock_entry.delete(0, tk.END)
        
        return total_revenue

    def show_revenue_and_exit(self):
        # Muestra la ganancia total acumulada
        messagebox.showinfo("Ganancia Total", f"La ganancia total acumulada es: {self.total_revenue}")
        messagebox.showinfo("Facturación Total", f"La facturación total acumulada es: {self.total}")

        # Cierra la ventana
        self.destroy()