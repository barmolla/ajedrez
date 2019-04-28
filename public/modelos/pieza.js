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
    img: `${recursosURI}wb${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wb.png'
  }),
  new Pieza({
    tipo: 'alfil',
    color: 'negro',
    img: `${recursosURI}bb${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/bb.png'
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'blanco',
    img: `${recursosURI}wn${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wn.png'
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'negro',
    img: `${recursosURI}bn${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/bn.png'
  }),
  new Pieza({
    tipo: 'peon',
    color: 'blanco',
    img: `${recursosURI}wp${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wp.png'
  }),
  new Pieza({
    tipo: 'peon',
    color: 'negro',
    img: `${recursosURI}bp${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/bp.png'
  }),
  new Pieza({
    tipo: 'rey',
    color: 'blanco',
    img: `${recursosURI}wk${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wk.png'
  }),
  new Pieza({
    tipo: 'reina',
    color: 'blanco',
    img: `${recursosURI}wq${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wq.png'
  }),
  new Pieza({
    tipo: 'reina',
    color: 'negro',
    img: `${recursosURI}bq${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/bq.png'
  }),
  new Pieza({
    tipo: 'rey',
    color: 'negro',
    img: `${recursosURI}bk${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/bk.png'
  }),
  new Pieza({
    tipo: 'torre',
    color: 'negro',
    img: `${recursosURI}br${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/br.png'
  }),
  new Pieza({
    tipo: 'torre',
    color: 'blanco',
    img: `${recursosURI}wr${extension}`
    //img: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/73/wr.png'
  })
]

exports.piezas = piezas.map(pieza => Funciones.congelar(Funciones.crear(pieza)))
