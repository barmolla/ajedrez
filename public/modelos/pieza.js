const Funciones = require('../utilitarios/fn-utils.js')

class Pieza {
  constructor({tipo, color, img}) {
    Object.assign(this, { tipo, color, img })
  }
}

const recursosURI = '../recursos/imgs/piezas/'
const extension   = '.png'

const piezas = [
  new Pieza({
    tipo: 'alfil',
    color: 'blanco',
    img: `${recursosURI}alfil-blanco${extension}`
  }),
  new Pieza({
    tipo: 'alfil',
    color: 'negro',
    img: `${recursosURI}alfil${extension}`
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'blanco',
    img: `${recursosURI}caballo-blanco${extension}`
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'negro',
    img: `${recursosURI}caballo${extension}`
  }),
  new Pieza({
    tipo: 'peon',
    color: 'blanco',
    img: `${recursosURI}peon-blanco${extension}`
  }),
  new Pieza({
    tipo: 'peon',
    color: 'negro',
    img: `${recursosURI}peon${extension}`
  }),
  new Pieza({
    tipo: 'rey',
    color: 'blanco',
    img: `${recursosURI}rey-blanco${extension}`
  }),
  new Pieza({
    tipo: 'reina',
    color: 'blanco',
    img: `${recursosURI}reina-blanco${extension}`
  }),
  new Pieza({
    tipo: 'reina',
    color: 'negro',
    img: `${recursosURI}reina${extension}`
  }),
  new Pieza({
    tipo: 'rey',
    color: 'negro',
    img: `${recursosURI}rey${extension}`
  }),
  new Pieza({
    tipo: 'torre',
    color: 'negro',
    img: `${recursosURI}torre${extension}`
  }),
  new Pieza({
    tipo: 'torre',
    color: 'blanco',
    img: `${recursosURI}torre-blanco${extension}`
  })
]

exports.piezas = piezas.map(pieza => Funciones.congelar(Funciones.crear(pieza)))
