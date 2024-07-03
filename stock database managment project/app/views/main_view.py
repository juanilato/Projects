import tkinter as tk
from tkinter import ttk, Menu
from app.views.product_view import ProductView
from app.views.add_product_window import AddProductWindow
from app.views.erase_product_window import EraseProductWindow
from app.views.modify_product_window import ModifyProductWindow
from app.views.revenue_calculator_window import RevenueCalculatorWindow

class MainView(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Stock Management App")
        self.geometry("1250x300")
        
        #Menu de opciones:
        self.create_menu()

        self.tab_control = ttk.Notebook(self)
        self.product_tab = ProductView(self.tab_control)
        self.tab_control.add(self.product_tab, text="Productos")
        self.tab_control.pack(expand=1, fill='both')

    def create_menu(self):
        #menu bar
        menu_bar = Menu(self)
        #menu file
        file_menu = Menu(menu_bar, tearoff=0)
        file_menu.add_command(label="Agregar producto", command=self.add_product)
        file_menu.add_command(label="Modificar producto", command=self.modify_product)
        file_menu.add_command(label="Quitar producto", command=self.erase_product)
        file_menu.add_command(label= "Calculo ganancia total", command= self.total_revenue)



        file_menu.add_separator()
        file_menu.add_command(label="Salir", command=self.quit)
        menu_bar.add_cascade(label="Archivo", menu=file_menu)
        
        #configuracion menu 

        self.config(menu=menu_bar)
    def add_product(self):
        AddProductWindow(self)

    def erase_product(self):
        EraseProductWindow(self)


    def modify_product(self):
        ModifyProductWindow(self)

    def total_revenue(self):
        RevenueCalculatorWindow(self)

if __name__ == '__main__':
    app = MainView()
    app.mainloop()
