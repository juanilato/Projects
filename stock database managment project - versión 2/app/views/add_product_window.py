import customtkinter as ctk
from app.services.product_service import create_product
from app.event_dispatcher import event_dispatcher

class AddProductWindow(ctk.CTkToplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Agregar Producto")
        
        #Obtener el ancho y alto de la pantalla
        screen_width = str(self.winfo_screenwidth() * .2)
        screen_height = str(self.winfo_screenheight() *.3)
        self.geometry(screen_width + "x" + screen_height)

        self.grab_set()  # To make the window modal
        self.attributes("-topmost", True)  # Bring the window to the front

        # Label nombre producto
        self.product_name_label = ctk.CTkLabel(self, text="Nombre del producto")
        self.product_name_label.grid(row=0, column=0, padx=10, pady=10)
        # Entrada nombre del producto   
        self.product_name_entry = ctk.CTkEntry(self)
        self.product_name_entry.grid(row=0, column=1, padx=10, pady=10)
        # Label descripcion
        self.product_description_label = ctk.CTkLabel(self, text="Descripción")
        self.product_description_label.grid(row=1, column=0, padx=10, pady=10)
        # Entrada descripcion
        self.product_description_entry = ctk.CTkEntry(self)
        self.product_description_entry.grid(row=1, column=1, padx=10, pady=10)
        # Label precio
        self.product_price_label = ctk.CTkLabel(self, text="Precio")
        self.product_price_label.grid(row=2, column=0, padx=10, pady=10)
        # Entrada precio
        self.product_price_entry = ctk.CTkEntry(self)
        self.product_price_entry.grid(row=2, column=1, padx=10, pady=10)
        # Label Ganancia
        self.product_revenue_label = ctk.CTkLabel(self, text="Costo")
        self.product_revenue_label.grid(row=3, column=0, padx=10, pady=10)
        # Entrada Ganancia
        self.product_revenue_entry = ctk.CTkEntry(self)
        self.product_revenue_entry.grid(row=3, column=1, padx=10, pady=10)
        # Label Stock
        self.product_stock_label = ctk.CTkLabel(self, text="Stock")
        self.product_stock_label.grid(row=4, column=0, padx=10, pady=10)
        # Entrada stock
        self.product_stock_entry = ctk.CTkEntry(self)
        self.product_stock_entry.grid(row=4, column=1, padx=10, pady=10)

        # Boton agrega producto
        self.add_product_button = ctk.CTkButton(self, text="Agregar Producto", command=self.add_product)
        self.add_product_button.grid(row=5, column=0, padx=10, pady=10)
        # Boton elimina producto
        self.add_product_exit = ctk.CTkButton(self, text="Salir", command=self.destroy)
        self.add_product_exit.grid(row=5, column=1, padx=10, pady=10)

    # Crea el producto
    def add_product(self):
        # Obtiene datos de los entries
        name = self.product_name_entry.get()
        description = self.product_description_entry.get()
        price = float(self.product_price_entry.get())
        revenue = float(self.product_revenue_entry.get())
        stock = int(self.product_stock_entry.get())

        # Crea el producto (guarda en base de datos)
        create_product(name, description, price, revenue, stock)

        # Limpia los entries para que agregues otro producto
        self.product_name_entry.delete(0, ctk.END)
        self.product_description_entry.delete(0, ctk.END)
        self.product_price_entry.delete(0, ctk.END)
        self.product_revenue_entry.delete(0, ctk.END)
        self.product_stock_entry.delete(0, ctk.END)

if __name__ == '__main__':
    root = ctk.CTk()
    app = AddProductWindow(root)
    app.mainloop()
