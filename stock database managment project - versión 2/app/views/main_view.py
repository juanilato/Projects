import customtkinter as ctk
from app.views.product_view import ProductView
from app.views.add_product_window import AddProductWindow
from app.views.erase_product_window import EraseProductWindow
from app.views.modify_product_window import ModifyProductWindow
from app.views.revenue_calculator_window import RevenueCalculatorWindow

class MainView(ctk.CTk):
    def __init__(self):
        super().__init__()

        #Obtener el ancho y alto de la pantalla
        screen_width = str(self.winfo_screenwidth() * .3)
        screen_height = str(self.winfo_screenheight() *.4)
        

        self.title("Stock Management App")
        self.geometry(screen_width + "x" + screen_height)

        ctk.set_appearance_mode("Light")  # Modo: "System" (default), "Dark", "Light"
        ctk.set_default_color_theme("dark-blue")  # Temas: "blue" (default), "green", "dark-blue"

        # Crear estilo de fuente personalizado para la tabla
        custom_font = ctk.CTkFont(size=40)  # Tamaño de fuente más grande

        # Botones de opciones
        self.create_buttons()

        # Crear CTkTabview para gestionar las pestañas
        self.tab_control = ctk.CTkTabview(self)
        self.tab_control.pack(expand=1, fill='both', padx=10, pady=10)
        
         # Añadir pestaña "Productos" con formato personalizado
        self.product_tab = self.tab_control.add("Productos")
        
        # Crear vista de productos dentro de la pestaña "Productos"
        product_view = ProductView(self.tab_control.tab("Productos"))
        product_view.pack(expand=1, fill='both')

    def create_buttons(self):
        # Crear marco para botones
        button_frame = ctk.CTkFrame(self)
        button_frame.pack(fill='x', padx=10, pady=5)

        # Crear botones para diferentes opciones
        add_button = ctk.CTkButton(button_frame, text="Agregar producto", command=self.add_product)
        add_button.pack(side='left', padx=5, pady=5)

        modify_button = ctk.CTkButton(button_frame, text="Modificar producto", command=self.modify_product)
        modify_button.pack(side='left', padx=5, pady=5)

        erase_button = ctk.CTkButton(button_frame, text="Quitar producto", command=self.erase_product)
        erase_button.pack(side='left', padx=5, pady=5)

        revenue_button = ctk.CTkButton(button_frame, text="Calculo ganancia total", command=self.total_revenue)
        revenue_button.pack(side='left', padx=5, pady=5)

        quit_button = ctk.CTkButton(button_frame, text="Salir", command=self.quit)
        quit_button.pack(side='left', padx=5, pady=5)

    def add_product(self):
        # Abre ventana para agregar producto
        AddProductWindow(self)

    def erase_product(self):
        # Abre ventana para quitar producto
        EraseProductWindow(self)

    def modify_product(self):
        # Abre ventana para modificar producto
        ModifyProductWindow(self)

    def total_revenue(self):
        # Abre ventana para calcular ganancia total
        RevenueCalculatorWindow(self)

if __name__ == '__main__':
    # Inicia la aplicación principal
    app = MainView()
    app.mainloop()