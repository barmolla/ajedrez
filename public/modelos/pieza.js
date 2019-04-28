const Funciones = require('../utilitarios/fn-utils.js')

class Pieza {
  constructor({tipo, color, img}) {
    Object.assign(this, { tipo, color, img })
  }
}

const piezas = [
  new Pieza({
    tipo: 'alfil',
    color: 'blanco',
    /*img: 'https://i.imgur.com/XacgTeY.png'*/
    img: 'https://i.imgur.com/iLHINs1.png'
  }),
  new Pieza({
    tipo: 'alfil',
    color: 'negro',
    /*img: 'https://i.imgur.com/kvT7W63.png'*/
    img: 'https://i.imgur.com/YZALUga.png'
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'blanco',
    /*img: 'https://i.imgur.com/YOYjodU.png'*/
    img: 'https://i.imgur.com/uBD3ply.png'
  }),
  new Pieza({
    tipo: 'caballo',
    color: 'negro',
    /*img: 'https://i.imgur.com/1UzK5YX.png'*/
    img: 'https://i.imgur.com/hDP9gb1.png'
  }),
  new Pieza({
    tipo: 'peon',
    color: 'blanco',
    /*img: 'https://i.imgur.com/QHQjSZo.png'*/
    img: 'https://i.imgur.com/aZJNcDM.png'
  }),
  {
    tipo: 'peon',
    color: 'negro',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/b9ed6fb95e680648ce21915f7491e0ed-full.png'*/
    img: 'https://i.imgur.com/q3jWzjF.png'
  },
  {
    tipo: 'rey',
    color: 'blanco',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/0228e9d8337930d26be8ce1df6c5fc9c-full.png'*/
    img: 'https://i.imgur.com/JPLlolB.png'
  },
  {
    tipo: 'reina',
    color: 'blanco',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/7d82c278aceb20966b30fbdd079cb48a-full.png'*/
    img: 'https://i.imgur.com/LzZguJL.png'
  },
  {
    tipo: 'reina',
    color: 'negro',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/1f405fd3a1a57930b53b2e860cc3b93e-full.png'*/
    img: 'https://i.imgur.com/PtWhir9.png'
  },
  {
    tipo: 'rey',
    color: 'negro',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/72de82326f75fb787877b62892e23279-full.png'*/
    img: 'https://i.imgur.com/dDKForW.png'
  },
  {
    tipo: 'torre',
    color: 'negro',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/72de82326f75fb787877b62892e23279-full.png'*/
    img: 'https://i.imgur.com/ZYmOK7F.png'
  },
  {
    tipo: 'torre',
    color: 'blanco',
    /*img: 'https://cdn1.imggmi.com/uploads/2018/9/16/2f4044fa2c5bcfa77b28aa3d8e175898-full.png'*/
    img: 'https://i.imgur.com/x2zkZ3V.png'
  }
]

exports.piezas = piezas.map(pieza => Funciones.congelar(Funciones.crear(pieza)))
