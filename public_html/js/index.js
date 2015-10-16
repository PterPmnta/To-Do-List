/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function (){
    
    var btn_guardar, text_area, contador, mensaje, error, task;
    
    error = 'No hay una tarea para guardar';
    
    btn_guardar = $('#btn-guardar');
    text_area = $("#textarea1");
    contador = $("#contador");
    mensaje = $("#mensaje");
   
    $('textarea#textarea1').characterCounter();
    
    text_area.keyup(function(){
         contador.text($(this).val().length);
     });    
    
    var cero = 0;
    contador.html(cero);
    
    tareas.Tabla();
    tareas.Consultar();
    
    btn_guardar.on('click', function (){
        
        if(text_area.val() === ''){ 
            mensaje.empty();
            mensaje.append(error);
        }else{
            task = text_area.val();
            text_area.val('');
            tareas.Insertar(task);
        }
        
    });
    
    $(document).on('click', '#lista button', function(){
         
         var fila;
         
         fila = $(this).data('fila');         
         
         tareas.Eliminar(fila);
         
     }); 
    
    
});


var tareas = new Tareas();

function Tareas (){};
    
Tareas.prototype.CrearDB = function (){

    var nombrecorto = 'DB Tareas';
    var version = '1.0';
    var nombrebase = 'List To-Do';
    var size = 50*1024*1024;    

    var db = openDatabase(nombrecorto, version, nombrebase, size);
    return db;

};

Tareas.prototype.Tabla = function (){

    var db, SqlLista;

    db = tareas.CrearDB();
    SqlLista = 'CREATE TABLE IF NOT EXISTS Tareas(fila integer primary key, tarea text)';

    db.transaction(function (tx){

        tx.executeSql(SqlLista);

    });

};

Tareas.prototype.Insertar = function (task){

    var db, SqlInsert, SqlConsulta, cantidad, cero, fila, mensaje, success, contador;

    db = tareas.CrearDB();
    SqlInsert = 'INSERT INTO Tareas(fila, tarea) VALUES(?,?)';
    SqlConsulta = 'SELECT * FROM Tareas';
    mensaje = $("#mensaje");
    success = 'Tarea guardada';
    contador = $("#contador");
    cero = 0;    

    db.transaction(function (tx){

        tx.executeSql(SqlConsulta, [], function (tx, results){

            cantidad = results.rows.length;
            //console.log(cantidad);
            
            if(cantidad === cero){
                fila = cantidad + 1;
                tx.executeSql(SqlInsert,[fila, task]);
                mensaje.empty();
                mensaje.append(success);
                var cero = 0;
                contador.html(cero);
            }else{
                fila = cantidad + 1;
                tx.executeSql(SqlInsert,[fila, task]);
                mensaje.empty();
                mensaje.append(success);
                var cero = 0;
                contador.html(cero);
            }

        });
        tareas.Consultar();
    });
    

};

Tareas.prototype.Consultar = function (){
    
    var db, SqlConsulta, cantidad, cero, lista_tareas, i, html, task, error, mensaje;

    db = tareas.CrearDB();
    SqlConsulta = 'SELECT * FROM Tareas';
    lista_tareas = $('#lista');
    mensaje = $("#mensaje");
    error = 'No hay una tarea para guardar';
    cero = 0;   
    
    db.transaction(function (tx){
        
        tx.executeSql(SqlConsulta, [], function (tx, results){
            
            cantidad = results.rows.length;
            
            if(cantidad === 0){
                
                 lista_tareas.empty();
                
                 html = '<tr>';
                 html += '<td class="row">';
                 html += '<div class="col s10">No hay Tareas</div>';                 
                 html += '</td>';
                 html += '</tr>';
                
                  lista_tareas.append(html);
                
            }else{
                lista_tareas.empty();
            
                for(i=0; i<cantidad; i++){

                    task = results.rows.item(i);
                    //console.log(task);

                     html = '<tr>';
                     html += '<td class="row">';
                     html += '<div class="col s10">'+ task.tarea +'</div>';
                     html += '<button class="col s2 btn-flat" data-fila="'+ task.fila +'">';
                     html += '<i class="fa fa-times fa-lg"></i>';
                     html += '</button>';
                     html += '</td>';
                     html += '</tr>';

                     lista_tareas.append(html);

                }
            }
            
            
            
        });
        
    });
    
};

Tareas.prototype.Eliminar = function (fila){
             
     var db, sqlDelete, mensaje, eliminado;
     //console.log(fila);

     db = tareas.CrearDB();
     sqlDelete = 'DELETE FROM Tareas WHERE fila = ?';
     mensaje = $("#mensaje");
     eliminado = 'Tarea eliminada';

     db.transaction(function(tx){
         
             tx.executeSql(sqlDelete, [fila]);
             mensaje.append(eliminado);
             tareas.Consultar();
        
     });
 };
    


