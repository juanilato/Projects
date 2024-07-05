import tkinter as tk
from tkinter import ttk
from app.services.product_service import create_product, get_all_products, delete_product
from app.event_dispatcher import event_dispatcher

class ProductView(ttk.Frame):
    def __init__(self, parent):
        super().__init__(parent)

        # Inicialización del estilo ttk
        self.style = ttk.Style()
        
        # Aplicar el tema predeterminado y configurar estilos personalizados
        self.style.theme_use("default")
        
        self.style.configure("Treeview",
                             background="#2a2d2e",
                             foreground="white",
                             rowheight=25,
                             fieldbackground="#343638",
                             bordercolor="#343638",
                             borderwidth=0,
                             font=('Arial', 18))
        self.style.map('Treeview', background=[('selected', '#22559b')])
        
        self.style.configure("Treeview.Heading",
                             background="#565b5e",
                             foreground="white",
                             relief="flat",
                             font=('Arial', 22, 'bold'))
        self.style.map("Treeview.Heading",
                       background=[('active', '#3484F0')])

        # Tabla de productos
        self.products_tree = ttk.Treeview(self, columns=("ID", "Name", "Description", "Price", "Revenue", "Stock"), show='headings')
        self.products_tree.heading("ID", text="ID")
        self.products_tree.heading("Name", text="Nombre")
        self.products_tree.heading("Description", text="Descripción")
        self.products_tree.heading("Price", text="Precio")
        self.products_tree.heading("Revenue", text="Costo")
        self.products_tree.heading("Stock", text="Stock")
        self.products_tree.grid(row=0, column=0, columnspan=2, padx=10, pady=10)
        
        # Centrar texto en columnas
        self.products_tree.column("ID", anchor='center')
        self.products_tree.column("Name", anchor='center')
        self.products_tree.column("Description", anchor='center')
        self.products_tree.column("Price", anchor='center')
        self.products_tree.column("Revenue", anchor='center')
        self.products_tree.column("Stock", anchor='center')
        # Carga los elementos (productos)
        self.load_products()

        # Conectador de eventos
        event_dispatcher.connect("product_added", lambda: self.on_product_added("product_added"))
        event_dispatcher.connect("product_deleted", lambda: self.on_product_deleted("product_deleted"))
        event_dispatcher.connect("product_modified", lambda: self.on_product_modified("product_modified"))
        event_dispatcher.connect("revenue_calculator", lambda: self.on_revenue_calculator("revenue_calculator"))

    # Carga los productos en la tabla
    def load_products(self):
        for item in self.products_tree.get_children():
            self.products_tree.delete(item)
        products = get_all_products()
        for product in products:
            self.products_tree.insert('', 'end', values=(product.id, product.name, product.description, product.price, product.revenue, product.stock))

    # Maneja el evento de producto agregado
    def on_product_added(self, event_name):
        self.load_products()

    # Maneja el evento de producto eliminado
    def on_product_deleted(self, event_name):
        self.load_products()

    # Maneja el evento de producto modificado
    def on_product_modified(self, event_name):
        self.load_products()

    # Maneja el evento del calculador de ganancias
    def on_revenue_calculator(self, event_name):
        self.load_products()

if __name__ == "__main__":
    # Ejemplo de cómo integrar ProductView en una aplicación principal
    root = tk.Tk()
    product_view = ProductView(root)
    product_view.pack(expand=True, fill="both")
    root.mainloop()
