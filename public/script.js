// IMPORTS
const { dibujarTablero, dibujarPiezas, crearMatrizTablero } = require('./utilitarios/fn-tablero.js')
const { piezas, obtenerPosicionesIniciales } = require('./utilitarios/fn-piezas.js')
const Funciones = require('./utilitarios/fn-utils.js')

let turno = 'blanco'
const historial = []
const posicionesIniciales = obtenerPosicionesIniciales()
const posiciones = posicionesIniciales.dameClon()

const contenedor = document.querySelector('.tablero')
const tablero = dibujarTablero(contenedor)
const matrizTablero = crearMatrizTablero(tablero)

dibujarPiezas(posicionesIniciales, piezas, crearMatrizTablero(tablero))

const cbJugar = ({ target }) => {
  const huboSeleccion = jugadaPrevia.pieza !== undefined
  const esUnDiv = target.nodeName === 'DIV'
  const esUnTD  = target.nodeName === 'TD'

  revertirColores()
  if (target.dataset.color === turno || jugadaPrevia.color === turno)
    if (!huboSeleccion && esUnDiv) dibujarPosiblesMovimientos(target)
    else if (huboSeleccion && esUnDiv && jugadaPrevia.pieza !== target) comerPieza(target)
    else if (huboSeleccion && esUnTD) moverPieza(target)
    else {
      jugadaPrevia.pieza = undefined 
      jugadaPrevia.color = undefined 
    }
  else {
    const div = document.querySelector('.mensaje')
    const caja = document.querySelector('.caja')
    const label = document.querySelector('.mensaje label')

    div.style.display = 'block'
    div.classList.add('mostrar-mensaje')
    caja.classList.add('alerta')

    caja.append(label)
    label.innerHTML = 'Turno de color ' + turno

    setTimeout(() => {
      document.querySelector('.mensaje').style.display = 'none'
      div.classList.remove('mostrar-mensaje')
      caja.classList.remove('alerta')
    }, 2000)
  }
}

const puedeTomar              = ({ x, y, color }) => !verificarPosicionLibre({ x, y }) && posiciones[x][y].color !== color
const estaDentroTablero       = ({ x, y }) => x >= 0 && y >= 0 && x <= 7 && y <= 7
const verificarValidez        = ({ x, y }) => jugadaPrevia.posicionesCalculadas.some(posicion => posicion.x === x && posicion.y === y)
const verificarPosicionLibre  = ({ x, y }) => posiciones[x][y] === undefined
const verificarMovimiento     = ({ x, y }) => verificarValidez({ x, y }) && verificarPosicionLibre({ x, y })
const componerCapturaToma     = ({ x, y, color }) => verificarCapturaAlPaso({ x, y, color }) || puedeTomar({ x, y, color })
const verificarCapturaAlPaso  = ({ x, y, color }) => {
  if (historial.length === 0) return false
  const ultimoMovimiento = historial[historial.length - 1]

  const qqqq = ultimoMovimiento.pieza.dataset.tipo === 'peon' && ultimoMovimiento.x === x && (ultimoMovimiento.y + 1 === y || ultimoMovimiento.y - 1 === y)
  console.log("ultimo ",ultimoMovimiento)
  console.log("actual ", x, y, color)
  console.log(qqqq)
  return qqqq
}

const comerPieza = div => {
  const td = div.parentNode
  const posicionPiezaAmenazada = {
    x: parseInt(td.dataset.x),
    y: parseInt(td.dataset.y)
  }

  // agregar restricción para peón

  if (verificarValidez(posicionPiezaAmenazada) && puedeTomar({ x: posicionPiezaAmenazada.x, y: posicionPiezaAmenazada.y, color: jugadaPrevia.color })) {
    console.log('comiendo')
    td.removeChild(div)
    posiciones[posicionPiezaAmenazada.x][posicionPiezaAmenazada.y] = undefined
    moverPieza(td)
    actualizarHistorial(div)

  } else jugadaPrevia.pieza = undefined
}

const actualizarHistorial = div => {
  const ultimoMovimiento = historial.pop()

  ultimoMovimiento.piezaComida = div
  historial.push(ultimoMovimiento)

  const piezaComidaEvento = new CustomEvent('piezaComida', { 'detail': ultimoMovimiento })

  document.body.dispatchEvent(piezaComidaEvento)
}

const cambiarTurno = () => turno = (turno === 'blanco') ? 'negro' : 'blanco'
const moverPieza = (td) => {
  const { pieza, tipo, color } = jugadaPrevia
  const posicionFutura = {
    x: parseInt(td.dataset.x),
    y: parseInt(td.dataset.y)
  }

  if (verificarMovimiento(posicionFutura)) {
    cambiarTurno()
    matrizTablero[posicionFutura.x][posicionFutura.y].append(pieza)
    posiciones[jugadaPrevia.posicion.x][jugadaPrevia.posicion.y] = undefined
    posiciones[posicionFutura.x][posicionFutura.y] = { tipo, color }
    historial.push({ pieza, x: posicionFutura.x, y: posicionFutura.y })
  }
  jugadaPrevia.pieza = undefined
}

let tdsARevertir = []
const revertirColores = () => {
  if (tdsARevertir.length > 0) tdsARevertir.forEach(obj => matrizTablero[obj.x][obj.y].style.backgroundColor = obj.color)

  tdsARevertir = []
}

const dibujarPosiblesMovimientos = elemento => {
  jugadaPrevia.pieza = elemento
  calcularMovimientos(elemento)
}

const jugadaPrevia = {
  pieza: undefined,
  tipo: undefined,
  color: undefined,
  posicion: {},
  posicionesCalculadas: []
}

const calcularMovimientos = (elemento) => {
  const pieza = elemento.dataset.tipo

  const td = elemento.parentNode
  const posicionActual = {
    x: parseInt(td.dataset.x),
    y: parseInt(td.dataset.y)
  }

  jugadaPrevia.tipo = elemento.dataset.tipo
  jugadaPrevia.color = elemento.dataset.color
  jugadaPrevia.posicion = posicionActual
  jugadaPrevia.posicionesCalculadas = []

  switch(pieza) {
    case 'peon':
      const esBlanco = jugadaPrevia.color === 'blanco',
            _x1 = esBlanco ? -1 : 1

      const posiblesMovimientos = [
        {
          x: posicionActual.x + _x1,
          y: posicionActual.y - 1,
          color: jugadaPrevia.color
        },
        {
          x: posicionActual.x + _x1,
          y: posicionActual.y + 1,
          color: jugadaPrevia.color
        }
      ]
      .filter(puedeTomar)
      .map(({ x, y }) => Funciones.crear({ x: x - posicionActual.x, y }))

      posiblesMovimientos.push({ x: _x1, y: posicionActual.y })

      if (posicionesIniciales[posicionActual.x][posicionActual.y] !== undefined) {
        posiblesMovimientos.push({
          x: (esBlanco) ? -2 : 2,
          y: posicionActual.y
        })
      }

      posiblesMovimientos.forEach(({ x, y }) => calcularMovimientoPeon({ x: posicionActual.x + x, y }))

      break

    case 'rey':
      [
        { x:  1, y:  0 },
        { x:  0, y:  1 },
        { x: -1, y:  0 },
        { x:  0, y: -1 },
        { x:  1, y:  1 },
        { x:  1, y: -1 },
        { x: -1, y:  1 },
        { x: -1, y: -1 }
      ].forEach(({ x, y }) => calcularMovimientoRey({
          x: posicionActual.x + x,
          y: posicionActual.y + y,
          })
        )
      break

    case 'reina':
      [
        { x:  1, y:  0 },
        { x:  0, y:  1 },
        { x: -1, y:  0 },
        { x:  0, y: -1 },
        { x:  1, y:  1 },
        { x:  1, y: -1 },
        { x: -1, y:  1 },
        { x: -1, y: -1 }
      ].forEach(({ x, y }) => calcularMovimientoReina({
          x: posicionActual.x,
          y: posicionActual.y,
          deltaX: x,
          deltaY: y })
        )
      break

    case 'torre':
      [
        { x:  1, y:  0 },
        { x:  0, y:  1 },
        { x: -1, y:  0 },
        { x:  0, y: -1 }
      ].forEach(({ x, y }) => calcularMovimientoTorre({
          x: posicionActual.x,
          y: posicionActual.y,
          deltaX: x,
          deltaY: y })
        )
      break

    case 'caballo':
      [
        { x: -1, y: -2 },
        { x:  1, y: -2 },
        { x: -1, y:  2 },
        { x:  1, y:  2 },
        { x: -2, y: -1 },
        { x:  2, y: -1 },
        { x: -2, y:  1 },
        { x:  2, y:  1 }
        ].forEach(({ x, y }) => calcularMovimientoRey({
          x: posicionActual.x + x,
          y: posicionActual.y + y,
          })
        )
      break

    case 'alfil':
        [
          { x:  1, y:  1 },
          { x:  1, y: -1 },
          { x: -1, y:  1 },
          { x: -1, y: -1 }
        ].forEach(({ x, y }) => calcularMovimientoAlfil({
            x: posicionActual.x,
            y: posicionActual.y,
            deltaX: x,
            deltaY: y })
          )

      break
  }
}

const calcularMovimiento = ({ x, y }) => {
  if (estaDentroTablero({ x, y })) {
    const tdAColorear = matrizTablero[x][y]

    tdsARevertir.push({ x: tdAColorear.dataset.x, y: tdAColorear.dataset.y, color: tdAColorear.style.backgroundColor })
    jugadaPrevia.posicionesCalculadas.push({ x, y })

    if (verificarPosicionLibre({ x, y })) {
      tdAColorear.style.backgroundColor = 'green'

      return true
    } else tdAColorear.style.backgroundColor = 'red'
  }
}

const calcularMovimientoPeon  = calcularMovimiento
const calcularMovimientoRey   = calcularMovimientoPeon
const calcularMovimientoAlfil = ({ x, y, deltaX, deltaY }) => {
  const _x = x + deltaX,
        _y = y + deltaY

  if (calcularMovimiento({ x: _x, y: _y }) === true) calcularMovimientoAlfil({ x: _x, y: _y, deltaX, deltaY })
}
const calcularMovimientoCaballo = calcularMovimientoRey
const calcularMovimientoTorre   = calcularMovimientoAlfil
const calcularMovimientoReina   = calcularMovimientoTorre

tablero.addEventListener('click', cbJugar)

document
  .querySelector('form')
  .addEventListener('submit', e => {
    e.preventDefault()
    document.querySelector('form').append('Registrado!')
    setTimeout(() => document.querySelector('form').style.display = 'none', 3000)
  })

document.body.addEventListener('piezaComida', ({ detail }) => {
  const color = detail.piezaComida.dataset.color
  const clase = `.historial-${color}`
  document
    .querySelector(clase)
    .append(detail.piezaComida)
})

console.clear()
