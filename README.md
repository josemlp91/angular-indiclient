# Angular INDI Dashboard

## Panel de control astronómicos bajo el protocolo INDI.

Aplicación web, destinada a controlar observatorios astronómicos de forma remota bajo protocolo [INDI](http://indilib.org/).
Usando tecnologías web, tales como el framework javascript [Angularjs](https://angularjs.org/) y conexión a websocket.


### Requisitos.
* [NodeJS](http://nodejs.org/) ([NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)

### Instalación aplicación Angular.
1. Clona el repositorio: `git clone https://github.com/rdash/rdash-angular.git`
2. Instalar dependencias NodeJS : `sudo npm install`.
3. Instalar Bower: `bower install`.
4. Comprobar que se ha instalado gulp correctamente: `gulp –v`
5. Ejecutar tarea de construcción: `gulp build`.
6. Ejecutar tarea por defecto : `gulp`.  Debe crear un servidor local en el puerto 8888, y activar livereload.
 [http://localhost:8888](http://localhost:8888).


### Conexión a Servidor Indi.

* Iniciamos el servidor INDI, esto crea un socket TCP/IP (en el puerto por defecto 7624)
* "Websockikycamos" tal socket creando un proxy web ``websockify localhost:9999 localhost:7624``
* Desde el cliente atacamos a la dirección y puerto del proxy.


## Referencia.

Plantilla base [https://github.com/rdash/rdash-angular](https://github.com/rdash/rdash-angular)

* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
