from __main__ import app
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy(app)

class Curso(db.Model):
    __tablename__="curso"
    id= db.Column(db.Integer, primary_key=True)
    anio=db.Column(db.Integer, nullable=False)
    division=db.Column(db.Integer, nullable=False)
    idpreceptor=db.Column(db.Integer, db.ForeignKey("preceptor.id"))
    estudiantes=db.relationship('Estudiante',backref='curso', cascade="all")

class Preceptor(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    nombre=db.Column(db.String(40),nullable=False)
    apellido=db.Column(db.String(40),nullable=False)
    correo=db.Column(db.String(40),unique=True, nullable=False)
    clave=db.Column(db.String(120),nullable=False)
    cursos=db.relationship('Curso',backref='preceptor', cascade="all")
    


class Estudiante(db.Model): 
    __tablename__ = "estudiante"
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(40), nullable = False)
    apellido = db.Column(db.String(40), nullable = False)
    dni = db.Column(db.String(20), nullable = False)
    idcurso = db.Column(db.Integer, nullable = False)
    idpadre = db.Column(db.Integer, nullable = False)
    idcurso=db.Column(db.Integer, db.ForeignKey("curso.id"))
    asistencias=db.relationship('Asistencia',backref='estudiante', cascade="all")
    idpadre=db.Column(db.Integer, db.ForeignKey("padre.id"))
    registroAsistencias = None

    def creaRegistro(self, registro):
        self.registroAsistencias = registro
    
    def __lt__(self,otro):
        if self.nombre == otro.nombre:    
            return self.apellido < otro.apellido
        else:
            return self.nombre < otro.nombre

        

class Asistencia(db.Model):
    __tablename__ = "asistencia"
    id = db.Column(db.Integer, primary_key = True)
    fecha = db.Column(db.DateTime, nullable = False)
    codigoclase = db.Column(db.Integer, nullable = False)
    asistio = db.Column(db.String(1), nullable = False)
    justificacion = db.Column(db.Text, nullable = False)
    idestudiante = db.Column(db.Integer, nullable = False)
    idestudiante=db.Column(db.Integer, db.ForeignKey("estudiante.id"))

    


class Padre(db.Model):
    __tablename__ = "padre"
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(40), nullable = False)
    apellido = db.Column(db.String(40), nullable = False)
    correo = db.Column(db.String(50), unique = True, nullable = False)
    clave = db.Column(db.String(120),unique = True, nullable = False)
    hijos=db.relationship('Estudiante',backref='padre', cascade="all")


class registroAsistencias:
    def __init__(self, estudiante):
        self.__cantidadAulaP = 0
        self.__cantidadFisP = 0
        self.__cantidadAulaJ = 0
        self.__cantidadAulaI = 0
        self.__cantidadFisJ = 0
        self.__cantidadFisI = 0
        self.__cantidadTotalInas = 0
        self.__cantidadTotalAsis = 0
        self.__estudiante = estudiante
    def carga(self, asistencias):
        for asistencia in asistencias:
            if asistencia.codigoclase == 1 and asistencia.asistio == "s":
                self.__cantidadAulaP += 1
            elif asistencia.codigoclase == 2 and asistencia.asistio == "s":
                self.__cantidadFisP += 1            
            elif asistencia.codigoclase == 1 and asistencia.asistio == "n":
                if asistencia.justificacion != "":
                    self.__cantidadAulaJ += 1
                else:
                    self.__cantidadAulaI += 1
            elif asistencia.codigoclase == 2 and asistencia.asistio == "n":
                if asistencia.justificacion != "":
                    self.__cantidadFisJ += 0.5
                else:
                    self.__cantidadFisI += 0.5
        
        self.__cantidadTotalInas +=    self.__cantidadAulaJ +self.__cantidadAulaI  + self.__cantidadFisJ + self.__cantidadFisI 
        self.__cantidadTotalAsis += self.__cantidadAulaP + self.__cantidadFisP
        
    def get_cantidadAulaP(self):
        return self.__cantidadAulaP
    def get_cantidadFisP(self):
        return self.__cantidadFisP
    def get_cantidadAulaJ(self):
        return self.__cantidadAulaJ
    def get_cantidadAulaI(self):
        return self.__cantidadAulaI
    def get_cantidadFisJ(self):
        return self.__cantidadFisJ
    def get_cantidadFisI(self):
        return self.__cantidadFisI
    def get_cantidadTotalInas(self):
        return self.__cantidadTotalInas
