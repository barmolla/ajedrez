// IMPORTS
const Funciones = require("utilitarios/fn-utils.js");

const dibujarTablero = donde => {
  const table = document.createElement("table");

  for (let x = 1; x < 9; x++) {
    const tr = document.createElement("tr");
    let seraBlanco = true;
    
    if (x != 1 && x % 2 === 0) seraBlanco = false;
    
    for (let y = 1; y < 9; y++) {
      const td = document.createElement("td");
    
      // set real coords
      td.dataset.x = x - 1;
      td.dataset.y = y - 1;

      if (seraBlanco) {
        td.setAttribute("style", "background-color: #ffe7a0");
        seraBlanco = false;
      } else {
        td.setAttribute("style", "background-color: #cc9a08");
        seraBlanco = true;
      }

      tr.append(td);
    }

    table.append(tr);
  }

  donde.append(table);

  return donde.querySelector("table");
};

const crearMatrizTablero = tablero => {
  const iteradorCeldas = tablero.querySelectorAll("td").entries();
  const matrizTablero = [];
  let contador = 0, arrayAuxiliar = [];

  for (const td of iteradorCeldas) {
    if (contador > 7) {
      contador = 0;
      arrayAuxiliar = [];
    }

    if (contador === 0) matrizTablero.push(arrayAuxiliar);

    arrayAuxiliar.push(td[1]);
    contador++;
  }

  return matrizTablero;
};

const dibujarPiezas = (posiciones, piezas, matrizTablero) => {
  for (let fila = 0; fila < posiciones.length; fila++)
    for (let columna = 0; columna < posiciones[fila].length; columna++) {
      const { tipo, color } = posiciones[fila][columna];
      const pieza = piezas.find(pieza => pieza.tipo === tipo && pieza.color === color);
      const div = document.createElement("div");

      div.setAttribute("style", 
      `
        background-image: url('${pieza.img}');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 100%;
        width: 100%;
      `);
      div.classList.add("pieza");
      div.dataset.tipo = pieza.tipo;
      div.dataset.color = pieza.color;
      matrizTablero[fila][columna].append(div);
    }
};

module.exports = { dibujarTablero, dibujarPiezas, crearMatrizTablero };