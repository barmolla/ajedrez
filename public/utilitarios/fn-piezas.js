const Funciones = require('./fn-utils.js');
const { piezas } = require('../modelos/pieza.js');
const crearPiezas = (...piezas) => piezas.map(({ tipo, color, img }) => Funciones.clonar()({ tipo, color, img }));

const clonarPiezas = (resultado = []) => (veces = 1) => ({ tipo, color, img }) => {
  if (! (veces === resultado.length)) {
    resultado.push(Funciones.clonar()({ tipo, color, img }));
    clonarPiezas(resultado)(veces)({ tipo, color, img });
  }

  return resultado;
};

const obtenerPiezas = () => {
  const piezasACrear = {
    peon: 8,
    torre: 2,
    alfil: 2,
    caballo: 2,
    rey: 1,
    reina: 1
  };

  const piezasCreadas = crearPiezas(...piezas);

  const blancas = piezasCreadas.filter(({color})=> color === "blanco");
  const negras  = piezasCreadas.filter(({color})=> color === "negro");

  const piezasBlancas = Funciones.matrizAVector(blancas.map(pieza => clonarPiezas()(piezasACrear[pieza.tipo])(pieza)));
  const piezasNegras  = Funciones.matrizAVector( negras.map(pieza => clonarPiezas()(piezasACrear[pieza.tipo])(pieza)));

  return piezasBlancas.concat(piezasNegras);
};

const obtenerPosicionesIniciales = () => {
  return [
          [{tipo: "torre", color: "negro"}, {tipo: "caballo", color: "negro"}, {tipo: "alfil", color: "negro"}, {tipo: "rey", color: "negro"}, {tipo: "reina", color: "negro"}, {tipo: "alfil", color: "negro"}, {tipo: "caballo", color: "negro"}, {tipo: "torre", color: "negro"}],
          [{tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}, {tipo: "peon", color: "negro"}],
          [],
          [],
          [],
          [],
          [{tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}, {tipo: "peon", color: "blanco"}],
          [{tipo: "torre", color: "blanco"}, {tipo: "caballo", color: "blanco"}, {tipo: "alfil", color: "blanco"}, {tipo: "rey", color: "blanco"}, {tipo: "reina", color: "blanco"}, {tipo: "alfil", color: "blanco"}, {tipo: "caballo", color: "blanco"}, {tipo: "torre", color: "blanco"}]
          ];
};

exports.piezas = obtenerPiezas()
exports.obtenerPosicionesIniciales = obtenerPosicionesIniciales
