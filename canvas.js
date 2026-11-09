function dibujarCanvas(enRuta, capacidad) { //dibuja un circulo por cada espacio del repartidor
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height); //borra el dibujo anterior

  const lleno = enRuta === capacidad; //si el repartidor ya lleva todos los pedidos que puede
  const colorRelleno = lleno ? '#E63946' : '#FF6B00'; //rojo si esta lleno, naranja si aun tiene espacio
  const colorBorde = lleno ? '#E63946' : '#0057FF'; //los vacios llevan borde azul

  //calculamos el tamaño y la separacion de los circulos segun el ancho del canvas y la capacidad
  const espacio = canvas.width / capacidad;
  const radio = Math.min(espacio / 2 - 10, 35);
  const y = canvas.height / 2 - 10;

  for (let i = 0; i < capacidad; i++) {
    const x = espacio * i + espacio / 2;

    ctx.beginPath();
    ctx.arc(x, y, radio, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = colorBorde;

    if (i < enRuta) { //los primeros "enRuta" circulos van rellenos
      ctx.fillStyle = colorRelleno;
      ctx.fill();
      ctx.strokeStyle = colorRelleno;
    }
    ctx.stroke();

    //numero del espacio dentro del circulo
    ctx.fillStyle = i < enRuta ? '#FFFFFF' : colorBorde;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i + 1, x, y);
  }

  //texto debajo de los circulos que resume el estado del repartidor
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = lleno ? '#E63946' : '#0A1F44';
  ctx.fillText(
    lleno ? '¡Repartidor lleno!' : `${enRuta} de ${capacidad} pedidos en ruta`,
    canvas.width / 2,
    canvas.height - 25
  );
}
