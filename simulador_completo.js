let clientes = [];
let creditos = [];
let tasaInteres = 15;
let clienteSeleccionado = null;


function ocultarSecciones() {
    document.getElementById("parametros").classList.remove("activa");
    document.getElementById("clientes").classList.remove("activa");
    document.getElementById("credito").classList.remove("activa");
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
    let nombre = recuperaraTexto("txtNombre");
    let apellido = recuperaraTexto("txtApellido");
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");

    let clienteExistente = buscarCliente(cedula);

    if (clienteExistente == null) {
        let nuevoCliente = {
            cedula: cedula,
            nombre: nombre,
            apellido: apellido,
            ingresos: ingresos,
            egresos: egresos
        };
        clientes.push(nuevoCliente);
    } else {
        clienteExistente.nombre = nombre;
        clienteExistente.apellido = apellido;
        clienteExistente.ingresos = ingresos;
        clienteExistente.egresos = egresos;
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
            <td>${cli.ingresos}</td>
            <td>${cli.egresos}</td>
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
        
        document.getElementById("txtCedula").disabled = true;
    }
}

function limpiar() {
    mostrarTextoEnCaja("txtCedula", "");
    mostrarTextoEnCaja("txtNombre", "");
    mostrarTextoEnCaja("txtApellido", "");
    mostrarTextoEnCaja("txtIngresos", "");
    mostrarTextoEnCaja("txtEgresos", "");
    
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