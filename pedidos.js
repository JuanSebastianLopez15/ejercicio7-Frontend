const CAPACIDAD = 3; //El repartidor solo puede llevar 3 pedidios

const pedidosIniciales = [ //cada uno es un pedido con 4 propiedades
  { id: 1, cliente: 'Ana Gómez', direccion: 'Cra 23 # 45-12', estado: 'pendiente' },
  { id: 2, cliente: 'Luis Pérez', direccion: 'Calle 50 # 20-30', estado: 'pendiente' },
  { id: 3, cliente: 'Marta Ríos', direccion: 'Av. Santander # 10-5', estado: 'pendiente' },
  { id: 4, cliente: 'Carlos Díaz', direccion: 'Cra 21 # 60-18', estado: 'pendiente' },
  { id: 5, cliente: 'Sofía Mejía', direccion: 'Calle 23 # 24-40', estado: 'pendiente' },
  { id: 6, cliente: 'Juan Torres', direccion: 'Cra 19 # 30-22', estado: 'pendiente' }
];

let pedidos = JSON.parse(localStorage.getItem('simulador-entregas-pedidos')) ?? pedidosIniciales; //indica que si no hay pedidos en el localStorage, se inicializa con los pedidosIniciales

//con estas contantes evito siempre estar llamando al document.getElementById
const zonaPendientes = document.getElementById('pendientes');
const zonaEnRuta = document.getElementById('en-ruta');
const contador = document.getElementById('contador');
const mensaje = document.getElementById('mensaje');

function crearTarjeta(pedido) { //recibe un objeto del array (un pedido), esta es la representacion visual del pedido
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';
  tarjeta.id = `pedido-${pedido.id}`;
  tarjeta.draggable = true;

  const titulo = document.createElement('strong');
  titulo.textContent = `Pedido #${pedido.id}`;
  const cliente = document.createElement('p');
  cliente.textContent = pedido.cliente;
  const direccion = document.createElement('p');
  direccion.textContent = pedido.direccion;

  tarjeta.append(titulo, cliente, direccion);

  tarjeta.addEventListener('dragstart', (e) => { //se activa cuando se empieza a arrastrar la tarjeta
    e.dataTransfer.setData('text/plain', tarjeta.id);
  });

  return tarjeta;
}

function guardar() {//se llama cuando el pedido cambie de estado
  localStorage.setItem('simulador-entregas-pedidos', JSON.stringify(pedidos)); //mira el array pedidos y lo guarda en el navegador
}

function pintar() { //Muestra en pantalla el estado actual de todos los pedidos
  zonaPendientes.innerHTML = '';
  zonaEnRuta.innerHTML = '';

  pedidos.forEach((pedido) => {
    const tarjeta = crearTarjeta(pedido);
    if (pedido.estado === 'en-ruta') {//miramos a que columna va el pedido dependiendo su estado
      zonaEnRuta.appendChild(tarjeta);
    } else {
      zonaPendientes.appendChild(tarjeta);
    }
  });

  const enRuta = pedidos.filter((p) => p.estado === 'en-ruta').length;
  contador.textContent = `(${enRuta}/${CAPACIDAD})`;
  dibujarCanvas(enRuta, CAPACIDAD); //llama a la funcion de canvas.js para dibujar
}

function moverPedido(id, nuevoEstado) { //cambia el estado de mi pedido
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido || pedido.estado === nuevoEstado) return; //Si el pedido no existe o ya esta en ese estado, no hace nada

  const enRuta = pedidos.filter((p) => p.estado === 'en-ruta').length;//mira cuandos pedidos hay en ruta
  if (nuevoEstado === 'en-ruta' && enRuta >= CAPACIDAD) { //si se va a pasar un pedido a en-ruta y ya hay 3 pedidos en ruta, no deja pasar el pedido y muestra un mensaje
    mensaje.textContent = `El repartidor ya lleva ${CAPACIDAD} pedidos. Entrega uno antes de asignar otro.`;
    return;
  }

  pedido.estado = nuevoEstado; //cambia el estado del pedido en el array, ej: pasa de pendiente a en-ruta o viceversa
  mensaje.textContent = `Pedido #${pedido.id} ahora está ${nuevoEstado === 'en-ruta' ? 'en ruta' : 'pendiente'}.`; //escribe en pantalla un aviso como “Pedido #2 ahora está en ruta.”
  guardar();
  pintar();
}

function activarZona(zona, nuevoEstado) {//convierte una columna en un lugar donde se pueden soltar tarjetas
  zona.addEventListener('dragover', (e) => { //se activa cuando una tarjeta esta por encima de la zona
    e.preventDefault();
    zona.classList.add('encima');//Marca la zona con un borde naranja, definido en el css
  });

  zona.addEventListener('dragleave', () => { //se activa cuando una tarjeta sale de la zona
    zona.classList.remove('encima'); //quita el borde naranja
  });

  zona.addEventListener('drop', (e) => { //se activa cuando una tarjeta se suelta en la zona
    e.preventDefault();//evita que el navegador haga su comportamiento por defecto
    zona.classList.remove('encima');
    const idTarjeta = e.dataTransfer.getData('text/plain');//lee el id de la tajeta que se guardo
    const id = Number(idTarjeta.replace('pedido-', ''));//lo convierte a numero
    moverPedido(id, nuevoEstado);
  });
}

activarZona(zonaPendientes, 'pendiente');//Lo que se suelte en “Pedidos” pasa a 'pendiente'
activarZona(zonaEnRuta, 'en-ruta');//Lo que se suelte en “En ruta” pasa a 'en-ruta'

//punto de partida, activan todas las funciones necesarias para que la pagina funcione
pintar();//dibuja las tarjetas en su columna apenas carga la pagina, usando el array pedidos (el del localStorage o el de pedidosIniciales)
mostrarUbicacion();//pide la ubicación del dispositivo, que representa al repartidor