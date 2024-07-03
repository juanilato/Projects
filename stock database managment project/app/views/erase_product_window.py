import tkinter as tk
from tkinter import ttk
from app.services.product_service import delete_product
from app.event_dispatcher import event_dispatcher


class EraseProductWindow(tk.Toplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Eliminar Producto")
        self.geometry("250x100")
        #Label del id
        self.product_id_label = ttk.Label(self, text="Id del producto")
        self.product_id_label.grid(row=0, column=0, padx=10, pady=10)
        #Entry del id  
        self.product_id_entry = ttk.Entry(self)
        self.product_id_entry.grid(row=0, column=1, padx=10, pady=10)

        #Boton eliminar
        self.erase_product_button = ttk.Button(self, text="Eliminar Producto", command=self.erase_product)
        self.erase_product_button.grid(row=1, column=0, columnspan=1, pady=10)
        
        #Boton salir
        self.erase_product_exit = ttk.Button(self, text="Salir", command=self.destroy)
        self.erase_product_exit.grid(row=1, column=1, columnspan=1, pady=10)

    def erase_product(self):
        #getea id de la entry
        id = int(self.product_id_entry.get())
        #elimina el producto de la base de datos
        delete_product(id)
        #limpia la entrada
        self.product_id_entry.delete(0, tk.END)