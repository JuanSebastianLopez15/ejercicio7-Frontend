function mostrarUbicacion() { //obtiene la ubicacion del dispositivo, que representa al repartidor
  const ubicacion = document.getElementById('ubicacion');

  if (!('geolocation' in navigator)) { //si el navegador no tiene la API de geolocalizacion, avisamos y no seguimos
    ubicacion.textContent = 'Tu navegador no soporta geolocalización.';
    return;
  }

  ubicacion.textContent = 'Buscando ubicación del repartidor...';

  navigator.geolocation.getCurrentPosition(
    (posicion) => { //se ejecuta si se pudo obtener la ubicacion
      const lat = posicion.coords.latitude.toFixed(4);
      const lon = posicion.coords.longitude.toFixed(4);
      const precision = Math.round(posicion.coords.accuracy); //en metros
      ubicacion.textContent = `Ubicación del repartidor: Lat ${lat}, Lon ${lon} (precisión: ${precision} m)`;
    },
    (error) => { //se ejecuta si hubo un error, cada codigo tiene su propio mensaje
      switch (error.code) {
        case 1: //PERMISSION_DENIED
          ubicacion.textContent = 'Permiso de ubicación denegado. Actívalo para ver dónde está el repartidor.';
          break;
        case 2: //POSITION_UNAVAILABLE
          ubicacion.textContent = 'No se pudo determinar la ubicación del repartidor.';
          break;
        case 3: //TIMEOUT
          ubicacion.textContent = 'Se agotó el tiempo buscando la ubicación. Recarga la página para intentar de nuevo.';
          break;
        default:
          ubicacion.textContent = 'Ocurrió un error desconocido al obtener la ubicación.';
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } //pide la ubicacion mas precisa posible y espera maximo 10 segundos
  );
}
