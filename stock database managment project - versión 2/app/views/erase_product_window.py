import customtkinter as ctk
from app.services.product_service import delete_product
from app.event_dispatcher import event_dispatcher


class EraseProductWindow(ctk.CTkToplevel):
    def __init__(self, parent):
        super().__init__(parent)
        self.title("Eliminar Producto")
        #Obtener el ancho y alto de la pantalla
        screen_width = str(self.winfo_screenwidth() * .2)
        screen_height = str(self.winfo_screenheight() *.1)
        self.geometry(screen_width + "x" + screen_height)

        self.grab_set()  # To make the window modal
        self.attributes("-topmost", True)  # Bring the window to the front

        # Label del id
        self.product_id_label = ctk.CTkLabel(self, text="Id del producto")
        self.product_id_label.grid(row=0, column=0, padx=10, pady=10)
        # Entry del id  
        self.product_id_entry = ctk.CTkEntry(self)
        self.product_id_entry.grid(row=0, column=1, padx=10, pady=10)

        # Boton eliminar
        self.erase_product_button = ctk.CTkButton(self, text="Eliminar Producto", command=self.erase_product)
        self.erase_product_button.grid(row=1, column=0, padx=10, pady=10)
        
        # Boton salir
        self.erase_product_exit = ctk.CTkButton(self, text="Salir", command=self.destroy)
        self.erase_product_exit.grid(row=1, column=1, padx=10, pady=10)

    def erase_product(self):
        # Getea id de la entry
        id = int(self.product_id_entry.get())
        # Elimina el producto de la base de datos
        delete_product(id)
        # Limpia la entrada
        self.product_id_entry.delete(0, ctk.END)

if __name__ == '__main__':
    root = ctk.CTk()
    app = EraseProductWindow(root)
    app.mainloop()
