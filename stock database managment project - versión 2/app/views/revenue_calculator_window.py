import tkinter as tk
from tkinter import ttk, messagebox
import customtkinter as ctk  # Importar customtkinter
from app.services.product_service import get_product_by_id, modify_stock
from app.event_dispatcher import event_dispatcher

class RevenueCalculatorWindow(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Vender Producto")
        

        # Obtener el ancho y alto de la pantalla
        screen_width = int(self.winfo_screenwidth() * 0.3)
        screen_height = int(self.winfo_screenheight() * 0.5)
        self.geometry(f"{screen_width}x{screen_height}")

        # Variable para almacenar la ganancia total acumulada
        self.total_revenue = 0
        
        # Variable para almacenar el total facturado
        self.total = 0

        # Frame principal con estilo customtkinter
        frame = ctk.CTkFrame(self)
        frame.pack(expand=True, fill='both')

        # Label y entrada para el ID del producto
        self.product_id_label = ctk.CTkLabel(frame, text="ID del producto")
        self.product_id_label.grid(row=0, column=0, padx=10, pady=10)
        self.product_id_entry = ctk.CTkEntry(frame)
        self.product_id_entry.grid(row=0, column=1, padx=10, pady=10)
        self.product_id_entry.bind("<Return>", self.load_product)  # Cargar producto al presionar Enter

        # Label y entrada para el nombre del producto
        self.product_name_label = ctk.CTkLabel(frame, text="Nombre del producto")
        self.product_name_label.grid(row=1, column=0, padx=10, pady=10)
        self.product_name_entry = ctk.CTkEntry(frame)
        self.product_name_entry.grid(row=1, column=1, padx=10, pady=10)
       
       # Label y entrada para el precio
        self.product_price_label = ctk.CTkLabel(frame, text="Precio")
        self.product_price_label.grid(row=3, column=0, padx=10, pady=10)
        self.product_price_entry = ctk.CTkEntry(frame)
        self.product_price_entry.grid(row=3, column=1, padx=10, pady=10)

        # Label y entrada para la ganancia
        self.product_revenue_label = ctk.CTkLabel(frame, text="Costo")
        self.product_revenue_label.grid(row=4, column=0, padx=10, pady=10)
        self.product_revenue_entry = ctk.CTkEntry(frame)
        self.product_revenue_entry.grid(row=4, column=1, padx=10, pady=10)

        # Label y entrada para el stock
        self.product_stock_label = ctk.CTkLabel(frame, text="Stock a vender")
        self.product_stock_label.grid(row=5, column=0, padx=10, pady=10)
        self.product_stock_entry = ctk.CTkEntry(frame)
        self.product_stock_entry.grid(row=5, column=1, padx=10, pady=10)

        # Botón para cargar venta
        self.modify_product_button = ctk.CTkButton(frame, text="Cargar venta", command=self.modify_stock)
        self.modify_product_button.grid(row=6, column=0, columnspan=1, pady=10)

        # Botón para salir
        self.exit_button = ctk.CTkButton(frame, text="Salir", command=self.show_revenue_and_exit)
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
        
        # Obtiene el stock desde el campo de entrada
        stock_str = self.product_stock_entry.get()

        # Valida si el campo de stock está vacío
        if stock_str.strip() == '':
            messagebox.showerror("Error", "Debe ingresar un valor para el stock.")
            return

        # Intenta convertir el stock a entero
        try:
            stock = int(stock_str)
        except ValueError:
            messagebox.showerror("Error", "El valor ingresado para el stock no es válido.")
            return
        
        # Obtiene el costo por unidad
        cost_per_unit_str = self.product_revenue_entry.get()
        
        # Valida si el campo de costo está vacío
        if cost_per_unit_str.strip() == '':
            messagebox.showerror("Error", "Debe ingresar un valor para la ganancia.")
            return

        # Intenta convertir la ganancia por unidad a float
        try:
            cost_per_unit = float(cost_per_unit_str)
        except ValueError:
            messagebox.showerror("Error", "El valor ingresado para la ganancia no es válido.")
            return
        
        # Obtiene el precio por unidad
        price_per_unit_str = self.product_price_entry.get()
        
        # Valida si el campo de precio está vacío
        if price_per_unit_str.strip() == '':
            messagebox.showerror("Error", "Debe ingresar un valor para el precio.")
            return

        # Intenta convertir el precio por unidad a float
        try:
            price_per_unit = float(price_per_unit_str)
        except ValueError:
            messagebox.showerror("Error", "El valor ingresado para el precio no es válido.")
            return

        # Modifica el producto en la base de datos
        modify_stock(product_id, stock)

        # Calcula la ganancia y la acumula
        revenue_per_unit = price_per_unit - cost_per_unit

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
        messagebox.showinfo("Ganancia Total", f"La ganancia total acumulada es de: {self.total_revenue}")
        messagebox.showinfo("Facturación Total", f"La facturación total acumulada es de: {self.total}")

        # Cierra la ventana
        self.destroy()

if __name__ == '__main__':
    root = tk.Tk()
    app = RevenueCalculatorWindow(root)
    root.mainloop()
