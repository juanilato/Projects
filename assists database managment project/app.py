from datetime import datetime
from flask  import Flask, request, render_template, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dateutil.parser import parse

import re
import hashlib


app=Flask(__name__)
app.config.from_pyfile('config.py')



from models import db
from models import Estudiante,Preceptor,Padre,Curso,Asistencia,registroAsistencias

@app.route('/')
def inicio():
    if not session.get("usuario_id"):
        return redirect('iniciarSesion.html')

@app.route('/usuarios')
def obtenerUsuarios():
    usuarios = Preceptor.query.all()  # Obtener todos los usuarios (Preceptores)
    return render_template('usuarios.html', usuarios=usuarios)

@app.route('/iniciarSesion.html', methods = ['GET', 'POST'])
def iniciarSesion():
    if request.method == "POST":
        if not request.form["usuario"] or not request.form["contraseña"] or not request.form["rol"]:
            return render_template("iniciarSesion.html", error="Ingrese correo y contraseña")
        else:
            clave = request.form["contraseña"]
            
            result = hashlib.md5(bytes(clave, encoding='utf-8'))
            
            rol = request.form["rol"]
            correo = request.form["usuario"]

                
            if rol == "preceptor":
                usuario = Preceptor.query.filter_by(correo=correo).first()
            elif rol == "padre":
                usuario = Padre.query.filter_by(correo=correo).first()
            
            
            

            if usuario and usuario.clave == result.hexdigest():

                session['usuario_id'] = usuario.id
                session["rol"] = rol
                str(rol)
                return redirect("/index"+ rol +".html")
            
            
            elif usuario == None or clave != usuario.clave:
                return render_template("iniciarSesion.html", error="Se Ingreso un Gmail o Contraseña Incorrecta.")
    
    return render_template('iniciarSesion.html')


@app.route("/indexpreceptor.html")
def iniciopreceptor():
    if session.get("rol") == "preceptor":
        usuario_id = session.get('usuario_id')
        preceptor = Preceptor.query.get(usuario_id)
        return render_template("indexpreceptor.html", usuario = preceptor)
    else:
        rol = session.get("rol")
        str(rol)
        return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))
    
      
    
@app.route("/indexpadre.html")
def iniciopadre():
    if session.get("rol") == "padre":
        usuario_id = session.get('usuario_id')
        padre = Padre.query.get(usuario_id)
        return render_template("indexpadre.html", usuario = padre)
    else:
        rol = session.get("rol")
        str(rol)
        return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))


@app.route("/registraAsistencia.html", methods =["POST", "GET"])
def registraAsistencia():

    if request.method == "POST":   
            
            tipo = request.form["tipo"]
            fecha = request.form["fecha"]
            idcurso = request.form["curso"]
            curso = Curso.query.get(idcurso)
            estudiantes = curso.estudiantes
            estudiantes.sort()
            return render_template("registraAsistencia.html", tipo = tipo, fecha = fecha, curso = curso, estudiantes = estudiantes, band = False)
            
    
    if session.get("rol") == "preceptor":
        usuario_id = session.get('usuario_id')
        preceptor = Preceptor.query.get(usuario_id)
        cursos_preceptor = preceptor.cursos
        return render_template("registraAsistencia.html", usuario = preceptor, cursos = cursos_preceptor, band = True)
    else:
        rol = session.get("rol")
        str(rol)
        return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))

    return redirect(url_for("inicio"+ rol))

@app.route("/cargaDatos", methods = ["POST"])
def cargaDatos():
    if request.method == "POST":
        tipo = request.args.get("tipo")
        fecha = request.args.get("fecha")
        nombreCurso = request.args.get("curso")
        match = re.search(r'\d+', nombreCurso)
        curso_id = int(match.group())
        curso = Curso.query.filter_by(id=curso_id).first()
        if curso != None:
            estudiantes = curso.estudiantes
            for estudiante in estudiantes:
                if request.form.getlist(str(estudiante.id)):
                    justificativo = " "
                    asistencia = "s"
                else:
                    justificacion = request.form.get("justificativo" + str(estudiante.id))
                    justificativo = justificacion
                    asistencia = "n"
                fecha_transformada = datetime.strptime(fecha, "%Y-%m-%d").date()
                nueva_asistencia = Asistencia(fecha=fecha_transformada, codigoclase=tipo, asistio=asistencia, justificacion = justificativo, idestudiante = estudiante.id)
                db.session.add(nueva_asistencia)
                db.session.commit()
            
      
    rol = session.get("rol")
    str(rol)
    return redirect(url_for("inicio"+ rol))



@app.route("/informaAsistencia.html", methods =["POST", "GET"])
def informaAsistencia():
    
    if request.method == "POST":
        idcurso = request.form["curso"]
        curso = Curso.query.get(idcurso)
        estudiantes = curso.estudiantes
        estudiantes.sort()
        for estudiante in estudiantes:
            registro_asistencia = registroAsistencias(estudiante)
            estudiante.creaRegistro(registro_asistencia)
            asistencias = estudiante.asistencias
            registro_asistencia.carga(asistencias)
            
        return render_template(url_for("informaAsistencia"), band = False, estudiantes = estudiantes )
    if session.get("rol") == "preceptor":
        usuario_id = session.get('usuario_id')
        preceptor = Preceptor.query.get(usuario_id)
        cursos_preceptor = preceptor.cursos
        return render_template(url_for("informaAsistencia"),usuario = preceptor,cursos = cursos_preceptor, band = True)
    else:
        rol = session.get("rol")
        str(rol)
        return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))    
    

    return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))

@app.route("/informeTotal.html", methods=["POST","GET"])
def informeTotal():
    
    if request.method == "POST":   
            
        tipo = int(request.form["tipo"])
        fecha = request.form["fecha"]
        idcurso = request.form["curso"]
        curso = Curso.query.get(idcurso)
        estudiantes = curso.estudiantes
        
        estudiantes.sort()
        lista=[]
        for estudiante in estudiantes:
            asistencias = estudiante.asistencias
            for asistencia in asistencias:
                
                fecha1=str(asistencia.fecha)
                nuevafecha=fecha1.split(" ")
                
                if nuevafecha[0] == fecha and tipo == asistencia.codigoclase:
                    lista.append(asistencia.asistio)
                 

        
        return render_template("informeTotal.html", tipo = tipo, fecha = fecha, curso = curso, estudiantes = estudiantes, band = False,lista=lista,cant=len(estudiantes))
            
    
    if session.get("rol") == "preceptor":
        usuario_id = session.get('usuario_id')
        preceptor = Preceptor.query.get(usuario_id)
        cursos_preceptor = preceptor.cursos
        return render_template("informeTotal.html", usuario = preceptor, cursos = cursos_preceptor, band = True)
    else:
        rol = session.get("rol")
        str(rol)
        return redirect(url_for("inicio"+ rol, error = "Ingreso no autorizado"))


@app.route("/index.html")
def pruebas():
    return render_template("index.html")


@app.route("/logout")
def logout():
    session['usuario_id'] = None
    return redirect("/")

@app.route("/asistenciahijo.html", methods=['GET', 'POST'])
def asistenciahijo():
    if request.method == 'POST':
        id_est = request.form['dni']
        estudiante = Estudiante.query.get(id_est)

        return render_template("asistenciahijo.html", band=False, asistencias=estudiante.asistencias)

    if session.get("rol") == "padre":
        usuario_id = session.get('usuario_id')
        padre = Padre.query.get(usuario_id)
        hijos = padre.hijos
        
        return render_template("asistenciahijo.html", usuario=padre, hijos=hijos, band=True)
    else:
        rol = session.get("rol")
        return redirect(url_for("inicio" + rol, error="Ingreso no autorizado"))
        

if __name__ =="__main__":

    with app.app_context(): 
        db.create_all()
        app.run(debug=True)