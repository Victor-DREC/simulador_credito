let clientes = [];
let creditos = [];
let tasaInteres = 15;
let clienteSeleccionado = null;
let montoMaximo = 50000;


function ocultarSecciones() {
    document.getElementById("parametros").classList.remove("activa");
    document.getElementById("clientes").classList.remove("activa");
    document.getElementById("credito").classList.remove("activa");
    document.getElementById("historial").classList.remove("activa");
    document.getElementById("contactos").classList.remove("activa");
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
    let tasa = recuperarFloat("tasaInteres"); 

    if (tasa >= 10 && tasa <= 20) {
        tasaInteres = tasa;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}


function guardarCliente() {
    let cedula = recuperaraTexto("txtCedula");
    
    // VALIDACIÓN: Controlamos que no sea menor ni mayor a 10
    if (cedula.length !== 10) {
        alert("La cédula debe tener exactamente 10 dígitos. Usted ingresó: " + cedula.length);
        return; // El 'return' evita que el código de abajo se ejecute
    }

    // Si pasa la validación, continuamos con el resto del proceso
    let nombre = recuperaraTexto("txtNombre");
    let apellido = recuperaraTexto("txtApellido");
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");
    let correo= recuperaraTexto("txtCorreo");
    let numero= recuperaraTexto("txtNumero");

    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente == null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos,
            correo: correo,
            numero: numero
        };
        clientes.push(nuevoCliente);
    } else {
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
        clienteExistente.correo = correo;
        clienteExistente.numero = numero;
    }

    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let contenidoTabla = "";
    for (let i = 0; i < clientes.length; i++) {
        let cli = clientes[i];
        contenidoTabla += `<tr>
            <td>${cli.cedula}</td>
            <td>${cli.nombre}</td>
            <td>${cli.apellido}</td>
            <td>${cli.correo}</td>
            <td>${cli.ingresos}</td>
            <td>${cli.egresos}</td>
            <td>${cli.numero}</td>
            <td>
                <button onclick="seleccionarCliente('${cli.cedula}')">Actualizar</button>
                <button onclick="eliminarCliente('${cli.cedula}')">Eliminar</button>
            </td>
        </tr>`;
    }
    document.getElementById("tablaClientes").innerHTML = contenidoTabla;
}

function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            return clientes[i];
        }
    }
    return null;
}

function seleccionarCliente(cedula) {
    let cliente = buscarCliente(cedula);
    if (cliente != null) {
        clienteSeleccionado = cliente;
        mostrarTextoEnCaja("txtCedula", cliente.cedula);
        mostrarTextoEnCaja("txtNombre", cliente.nombre);
        mostrarTextoEnCaja("txtApellido", cliente.apellido);
        mostrarTextoEnCaja("txtIngresos", cliente.ingresos);
        mostrarTextoEnCaja("txtEgresos", cliente.egresos);
        mostrarTextoEnCaja("txtCorreo", cliente.correo);
        mostrarTextoEnCaja("txtNumero", cliente.numero);
        
        document.getElementById("txtCedula").disabled = true;
    }
}

function limpiar() {
    mostrarTextoEnCaja("txtCedula", "");
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    mostrarTextoEnCaja("txtCorreo", "");
    mostrarTextoEnCaja("txtNumero", "");
    
    document.getElementById("txtCedula").disabled = false;
    clienteSeleccionado = null;
}

function eliminarCliente(cedula) {
    // Buscamos el índice del cliente en el arreglo
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula === cedula) {
            // Eliminamos 1 elemento en la posición 'i'
            clientes.splice(i, 1);
            break; // Salimos del bucle una vez encontrado y eliminado
        }
    }
    // Refrescamos la tabla para que el cambio sea visible
    pintarClientes();
}

function buscarClienteCredito() {
    let cedulaABuscar = recuperaraTexto("buscarCedulaCredito");
    
    if (cedulaABuscar.length !== 10) {
        alert("Por favor, ingrese una cédula válida de 10 dígitos para buscar.");
        return;
    }

    let clienteEncontrado = buscarCliente(cedulaABuscar);

    if (clienteEncontrado != null) {
        clienteSeleccionado = clienteEncontrado;

        let contenedorDatos = document.getElementById("datosClienteCredito");
        contenedorDatos.innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${clienteEncontrado.cedula}</p>
            <p><strong>Nombre:</strong> ${clienteEncontrado.nombre}</p>
            <p><strong>Apellido:</strong> ${clienteEncontrado.apellido}</p>
            <p><strong>Ingresos:</strong> ${clienteEncontrado.ingresos}</p>
            <p><strong>Egresos:</strong> ${clienteEncontrado.egresos}</p>
        `;
    } else {
        mostrarTexto("datosClienteCredito", "Cliente no encontrado.");
        clienteSeleccionado = null;
    }
}

function calcularCredito() {
    if (clienteSeleccionado == null) {
        alert("Debe buscar un cliente primero");
        return;
    }

    montoCalculado = recuperarFloat("montoCredito"); 
    plazoCalculado = recuperarInt("plazoCredito");

    // NUEVA VALIDACIÓN: Control de Monto Máximo
    if (montoCalculado > montoMaximo) {
        alert("Error: El monto solicitado ($" + montoCalculado + ") supera el monto máximo permitido por el sistema ($" + montoMaximo + ").");
        mostrarTextoEnCaja("montoCredito", ""); // Limpia la caja de texto del monto solicitado
        return; // Detiene la ejecución para que no calcule ni apruebe el crédito
    }

    let capacidadPago = clienteSeleccionado.ingresos - clienteSeleccionado.egresos;
    let totalPagar = montoCalculado + (montoCalculado * tasaInteres / 100);
    
    cuotaCalculada = totalPagar / plazoCalculado;

    creditoAprobado = cuotaCalculada <= capacidadPago;

    let resultado = document.getElementById("resultadoCredito");
    resultado.innerHTML = `
        Capacidad de pago: ${capacidadPago}<br>
        Total a pagar: ${totalPagar}<br>
        Cuota mensual: ${cuotaCalculada}<br>
        RESULTADO: ${creditoAprobado ? "APROBADO" : "RECHAZADO"}
    `;

    let btnAsignar = document.getElementById("btnAsignarCredito");
    if (creditoAprobado) {
        resultado.className = "aprobado";
        btnAsignar.disabled = false; 
    } else {
        resultado.className = "rechazado";
        btnAsignar.disabled = true;
    }
}

function asignarCredito() {
    let credito = {
        cedula: clienteSeleccionado.cedula,
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        monto: montoCalculado,
        tasa: tasaInteres,
        plazo: plazoCalculado,
        cuota: cuotaCalculada
    };

    creditos.push(credito);

    alert("Crédito registrado con éxito");
    console.log(creditos);
}

function buscarCreditos(cedula) {
    let creditosFiltrados = [];
    for (let i = 0; i < creditos.length; i++) {
        if (creditos[i].cedula === cedula) {
            creditosFiltrados.push(creditos[i]);
        }
    }
    return creditosFiltrados;
}

function pintarCreditos(listaCreditos) {
    let contenido = "";
    for (let i = 0; i < listaCreditos.length; i++) {
        let cre = listaCreditos[i];
        contenido += `<tr>
            <td>${cre.cedula}</td>
            <td>${cre.nombre}</td>
            <td>${cre.apellido}</td>
            <td>${cre.monto}</td>
            <td>${cre.tasa}%</td>
            <td>${cre.plazo} meses</td>
            <td>${cre.cuota.toFixed(2)}</td>
        </tr>`;
    }
    document.getElementById("tablaCreditos").innerHTML = contenido;
}

function buscarCreditosCliente() {
    let cedula = recuperaraTexto("buscarCedulaListado");
    let filtrados = buscarCreditos(cedula);
    pintarCreditos(filtrados);
}

function mostrarTodosLosCreditos() {
    pintarCreditos(creditos); 
}

function limpiarSeccionCredito() {
    mostrarTextoEnCaja("buscarCedulaCredito", "");
    mostrarTextoEnCaja("montoCredito", "");
    mostrarTextoEnCaja("plazoCredito", "");

    mostrarTexto("datosClienteCredito", "");
    mostrarTexto("resultadoCredito", "");

    let resultado = document.getElementById("resultadoCredito");
    resultado.className = ""; 

    clienteSeleccionado = null;
    document.getElementById("btnAsignarCredito").disabled = true;
    
    document.getElementById("buscarCedulaCredito").focus();
}

function limpiarTablaHistorial() {
    mostrarTextoEnCaja("buscarCedulaListado", "");

    document.getElementById("tablaCreditos").innerHTML = "";
    
}

function guardarParametros() {
    let tasa = recuperarFloat("tasaInteres"); 
    let maximo = recuperarFloat("montoMaximoInput"); // Captura el nuevo input

    let mensaje = "";

    // Validar tasa
    if (tasa >= 10 && tasa <= 20) {
        tasaInteres = tasa;
        mensaje += "Tasa configurada en: " + tasaInteres + "%. ";
    } else {
        mensaje += "Error: La tasa debe estar entre 10% y 20%. ";
    }

    // Validar y guardar Monto Máximo
    if (!isNaN(maximo) && maximo > 0) {
        montoMaximo = maximo;
        mensaje += "Monto máximo permitido: $" + montoMaximo;
    } else {
        mensaje += "Error: Ingrese un monto máximo válido.";
    }

    mostrarTexto("mensajeTasa", mensaje);
}

// Función para filtrar los créditos mayores a 5000
function filtrarCreditosVIP() {
    let vipFiltrados = [];
    for (let i = 0; i < creditos.length; i++) {
        // REQUERIMIENTO: Únicamente los créditos mayores a 5000
        if (creditos[i].monto > 5000) {
            vipFiltrados.push(creditos[i]);
        }
    }
    return vipFiltrados;
}

// Función que se ejecuta al presionar el botón "Créditos VIP"
function mostrarCreditosVIP() {
    let listaVIP = filtrarCreditosVIP();
    
    if (listaVIP.length === 0) {
        alert("No se encontraron créditos VIP registrados (mayores a $5000).");
    }
    
    // Reutiliza tu función pintarCreditos para visualizar la información en la tabla
    pintarCreditos(listaVIP); 
}