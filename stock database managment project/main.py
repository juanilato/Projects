import sys
import os

# Add the root directory to the Python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app'))

from app.views.main_view import MainView
from app.database import init_db


def main():
    init_db()
    app = MainView()
    app.mainloop()

if __name__ == '__main__':
    main()
    
