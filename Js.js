document.addEventListener('DOMContentLoaded', function() {
    //Variables que alamacenan la informacion de numeros y operaciones por realizar
    let NumeroAnterior //Primera varible numero
    let NumeroNuevo //Segunda variable numero
    let OperacionAnterior //Primera variable operacion
    let OperacionNueva //Segunda variable operacion
    
    //Listas con un diccionario que almancena estilos que se usan para animaciones de la calculadora
    const AnimacionGuardarNumero = [
        {transform: "translateY(-5px)", opacity: "0"},
    ]
    const AnimacionLLegaNumero = [
        {transform: "translateY(5px)", opacity: "0"},
    ]
    const AnimacionReset = [
        {transform: "translateX(-10px)", opacity:"0.3"},
    ]
    //Diccionario que tiene la informacacion de las propiedades de la animacion, duracion en ms y cantidad de repeticiones
    const ConfiAnimacion = {
        duration: 150,
        iterations: 1,
    }

    //Variables que mas adelante se inializan y cuya funcion almancenar las animaciones para poder llamar a los metodos de las mismas
    let AnimacionOperacion
    let animacionResultado 
    let AnimacionResetDatosPantallaOperacion
    let AnimacionResetDatosPantallaResultado

    //Se crean contantes para  elementos de html y poder manipular sus propiedades.
    const img = document.getElementById("ImgError");
    const pantallaResultado = document.getElementById('resultado');
    const pantallaOperacion = document.getElementById('operacion');
    pantallaResultado.value = ""
    pantallaOperacion.value = ""

    /* Funciones de animacion, cada una de estas funciones se encargan de inicialiazar las animaciones. las funciones regresan un promise
    la cual funciona para utilizar operadores como await que permite detener el flujo hasta que la linea donde se declara termine su tarea*/
    /* Cada promesa que se cree tiene que tener su Resolve para que sea validad, las promesas tiene otro parametro que regresara 
    en caso de error pero en este caso no se usan*/

    function AnimacionGuardar(){
        return new Promise(resolve => {
            AnimacionOperacion = pantallaResultado.animate(AnimacionGuardarNumero,ConfiAnimacion)
            //Metodo que le dice al navegardor que se desea hacer una animacion, recibe como parametro una funcion
            requestAnimationFrame(tiempoAnimacion)             
            //Funcion llamada anteriormente cuya funcion es verificar si la animacion termino y entregar el resolve. De lo contraio sigue con la animacion llamado nuevamente a requestAnimationFrame
            function tiempoAnimacion(){ 
                if(AnimacionOperacion.playState == "finished"){
                    resolve()
                }else{
                    requestAnimationFrame(tiempoAnimacion)
                }
            }
        })
    }
    function AnimacionResultado(){
        return new Promise(resolve =>{
            animacionResultado = pantallaOperacion.animate(AnimacionLLegaNumero,ConfiAnimacion)
            requestAnimationFrame(tiempoAnimacionResultado)
            function tiempoAnimacionResultado(){
                if(animacionResultado.playState == "finished"){
                    resolve()
                }else{
                    requestAnimationFrame(tiempoAnimacionResultado)
                }
            }
        })
    }
    function AnimacionResetDatos(){
        return new Promise(resolve => {
            AnimacionResetDatosPantallaOperacion = pantallaOperacion.animate(AnimacionReset,ConfiAnimacion)
            AnimacionResetDatosPantallaResultado = pantallaResultado.animate(AnimacionReset,ConfiAnimacion)
            requestAnimationFrame(tiempoAnimacionReset)
            function tiempoAnimacionReset(){
                if (AnimacionResetDatosPantallaOperacion.playState == "finished" && AnimacionResetDatosPantallaResultado.playState == "finished"){
                    resolve()
                }else{
                    requestAnimationFrame(tiempoAnimacionReset)
                }
            }
        })
    }
    //Metodos que utiliza la calculadora para cumplir su objetivo
    
    //Metodo que añade los numero a la pantalla. El window es para que la funcion sea visible fuera del javascript
    window.NumeroBoton = function(num){
        numero = num;
        pantallaResultado.value = pantallaResultado.value + numero;
    }
    //Igual que el metodo anterior solo que añade la coma a la pantalla 
    window.ComaBoton = function(coma){
        pantallaResultado.value = pantallaResultado.value + coma
    }
    /*Esta funcion se encarga de tomar los numeros y almacenarlos en las variables junto con las operaciones. Permitiendo hacer operaciones consecutuvas
    La funcion tiene un async y un parametro. El async es una caracteristicas que deden tener las funciones que adentro tiene un await
    el parametro contiene el operador que ingresa el usuario*/
    window.Operacion = async function(operador){
        await AnimacionGuardar() //El flujo espera al que la funcion animar termine para continuar
        /*Este if pregunta si la primera variable que almacena numero esta vacia. 
        Si esta vacia, toma el valor de la pantalla, lo comvierte en numero y lo almacena. 
        Limpiar la pantallaResultado y pinta el numero en la otra pantalla junto con el operador ingresado 
        Despues almacena el operador en la primera variable*/
        if (NumeroAnterior == null){
            NumeroAnterior = Number(pantallaResultado.value);
            pantallaResultado.value = "";
            pantallaOperacion.value = String(NumeroAnterior+operador)
            OperacionAnterior = operador
        
        }else{ 
            /*Este else if tiene como funcion ingresar el segundo numero en la segunda variable. Junto con el nuevo operador*/
            if(NumeroNuevo == null){
                NumeroNuevo = Number(pantallaResultado.value);
                pantallaResultado.value = "";
                OperacionNueva = operador
                
            }
        }
        /*Este if entra en accion cuando los numeros ya estan definidos. 
        Lo que hace es verificar cual es la primera operacion que tiene que realizar con if. Despues hace la operacion con los dos numeros
        Y muestra en la pantalla de arriba el resultado concatenado con la ultima operacion ingresada. 
        Luego cambiar la primera variable por el resultado y la segunda la deja vacia, Haciendo que el if anterior entre nuevamente en accion
        Al final del if se cambiar la variable de la primera operacion por la segunda operacion y la variable de la segunda operacion se deja vacia
        Esto se porque la primera operacion ya se realizo*/
        if (NumeroAnterior != null && NumeroNuevo != null){
            
            if (OperacionAnterior == "+"){
                let resultado = NumeroAnterior + NumeroNuevo;
                pantallaOperacion.value = String(resultado + OperacionNueva);
                pantallaResultado.value = "";
                NumeroAnterior = resultado
                NumeroNuevo = null; 
            }
            if (OperacionAnterior == "-"){
                let resultado = NumeroAnterior - NumeroNuevo;
                pantallaOperacion.value = String(resultado + OperacionNueva);
                pantallaResultado.value = "";
                NumeroAnterior = resultado
                NumeroNuevo = null; 
            }
            if (OperacionAnterior == "*"){
                let resultado = NumeroAnterior * NumeroNuevo
                pantallaOperacion.value = String(resultado + OperacionNueva)
                pantallaResultado.value = ""
                NumeroAnterior = resultado
                NumeroNuevo = null;
            }
            if (OperacionAnterior == "/"){
                //Este if dentro el if de dividir se encarga de controlar el error de divicion entre 0. 
                // lo que hace es ocultar la pantalla resulto y en su lugar mostrar una img con el error. Si no hay error el flujo se desarrolla normalmente
                if(NumeroNuevo == 0){ 
                    pantallaResultado.style.display = "none"
                    img.style.display = "block"
                    pantallaOperacion.value = "" //limpiar la otra pantalla
                }else{
                    let resultado = NumeroAnterior / NumeroNuevo
                    pantallaOperacion.value = String(resultado + OperacionNueva)
                    pantallaResultado.value = ""
                    NumeroAnterior = resultado
                    NumeroNuevo = null;
                }
            } 
            OperacionAnterior = OperacionNueva
            OperacionNueva = null
        }
        
    }
    /*Esta funcion es la que permite al boton resultados funcionar. hace el mismo trabajo que la funcion anterior tiene como un async*/
    window.Calcular = async function(){
        let ultimoNumero = Number(pantallaResultado.value); //toma el valor que esta en la pantalla resultado
        await AnimacionResultado() //Espera a que termine esta animacion
        /*Comprueba cual es la operacion a realizar. Y hace el proceso con el numero alcenado en la primera variable y la variable obtenida de la pantalla
        Despues limpia la pantalla de arriba y muestra el resultado total en la pantalla de abajo*/
        if(OperacionAnterior == "+"){
            let resultado = NumeroAnterior + ultimoNumero;
            pantallaResultado.value = ""
            pantallaOperacion.value = ""
            pantallaResultado.value = resultado;    
        }
        if(OperacionAnterior == "-"){
            let resultado = NumeroAnterior - ultimoNumero;
            pantallaResultado.value = ""
            pantallaOperacion.value = ""
            pantallaResultado.value = resultado;    
        }
        if(OperacionAnterior == "*"){
            let resultado = NumeroAnterior * ultimoNumero;
            pantallaResultado.value = ""
            pantallaOperacion.value = ""
            pantallaResultado.value = resultado;    
        }
        if(OperacionAnterior == "/"){
            if(ultimoNumero == 0){ //Este uf controla la diviciones entre 0. Mostrando un error si se presenta
                    pantallaResultado.style.display = "none"
                    img.style.display = "block"
                    pantallaOperacion.value = ""
            }else{
                let resultado = NumeroAnterior / ultimoNumero;
                pantallaResultado.value = ""
                pantallaOperacion.value = ""
                pantallaResultado.value = resultado; 
            }     
        }
        //Se limpian todas las varibles al terminar
        NumeroAnterior = null;
        NumeroNuevo = null;
        OperacionAnterior = null
        OperacionNueva = null
        
    }
    /*Funcion que se encarga de resetear o limpiar todas las variables y pantallas. tiene un async */
    window.BotonReset = async function(){
        await AnimacionResetDatos() //detiene el flujo hasta terminar la animacion
        //Regresa todo a la normalidad
        NumeroAnterior = null
        NumeroNuevo = null
        OperacionAnterior = null
        OperacionNueva = null
        pantallaResultado.value = ""
        pantallaOperacion.value = ""
        pantallaResultado.style.display = "block"
        img.style.display = "none"
    }
    //Funcion que borra el ultimo digito del numero actual en la pantalla de abajo (pantallaResultado)
    window.BotonBorrar = function(){
        let numero = pantallaResultado.value //Se obtiene el valor de numero actual en pantalla
        //Con el metodo slice hacer una nueva cadena apartir del numero obtenido. Hacemos la nueva cadena tomando todos menos el ultimo caracter y lo mostramos en pantalla
        pantallaResultado.value = numero.slice(0,-1) 
        
    }
});