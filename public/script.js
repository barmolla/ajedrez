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
const enrocar = target => {
  const { tipo, color } = jugadaPrevia
  const td = target.parentNode
  const torre = target
  const posicionTorre = {
    x: parseInt(td.dataset.x),
    y: parseInt(td.dataset.y)
  }
  const posicionRey = {
    x: jugadaPrevia.posicion.x,
    y: jugadaPrevia.posicion.y
  }

  if (!verificarValidez(posicionTorre) || torre.dataset.tipo !=='torre') {
    reset()
    return
  } 
  td.removeChild(torre)
  posiciones[posicionTorre.x][posicionTorre.y] = undefined
  moverPieza(td)
  matrizTablero[posicionRey.x][posicionRey.y].append(torre)
  posiciones[jugadaPrevia.posicion.x][jugadaPrevia.posicion.y] = undefined
  posiciones[posicionRey.x][posicionRey.y] = { tipo, color }
}

const verificarJaque = (x) => {
  // 1 buscar posición del rey cuyo color es el del jugador que le corresponde jugar
  // 2 buscar todas las piezas del color adversario adyacentes al rey
  // 3 por cada pieza hallada, calcular sus posibles movimientos legales y almacenarlos en un arreglo { x, y, piezaAComer? }
  // 4 filtrar posibles movimientos piezaAComer === 'rey' y almacenarlos en un arreglo
  // 5 si filtro > 1 jaque -> 
  //     Si elige mover rey --> Evaluar las posiciones filtradas al calcular los movimientos legales del rey y tener en cuenta:
  //      a. No puede enrocar estando en jaque
  //      b. Puede comer la pieza que lo pone en jaque -> validar con paso 3 y 4
  //      c. Puede comer otra pieza para salir del jaque -> validar con paso 3 y 4
  //      d. Puede moverse a un escaque libre
  //     Si elige cubrir al rey (bloqueando o comiendo con otra pieza aliada)
  //        Por cada movimiento legal de la pieza elegida, repetir paso 3 y 4 asumiendo ese movimiento (sea moverse a un escaque libre o comer)
  //        , si paso 4 devuelve 0, la pieza seleccionada puede efectivamente cubrir al rey sino la pieza seleccionada 
  //        no es candidata a cubrir al rey (anular jugada)
  //    
  // 6 sino puede mover cualquier pieza

  const rey = buscarRey()
  const piezasAdversariasAdyacentes = buscarPiezasAdversariasAdyacentes(rey)

  piezasAdversariasAdyacentes.forEach(pieza => { 
    calcularMovimientos(pieza.el)
    const r = jugadaPrevia.posicionesCalculadas.find(pos => {
      const estaLibre = verificarPosicionLibre(pos)
      const pieza = matrizTablero[pos.x][pos.y].firstElementChild
      const esRey = !estaLibre && pieza.dataset.tipo === 'rey' && pieza.dataset.color === turno

      if (esRey) return true 

      return false
    })

    if (r) console.log("5 - JAQUE!!!")

    jugadaPrevia = jugadaPreviaAux
  })

} 

const buscarRey = () => {
  for (let x = 0; x < matrizTablero.length; x++) {
    for (let y = 0; y < matrizTablero[x].length; y++) {
      const pos = matrizTablero[x][y]
      const el = pos.firstElementChild

      if (el && el.dataset.tipo === 'rey' && el.dataset.color === turno) {
        return { x, y, el }
      }
    }
  }
}

const buscarPiezasAdversariasAdyacentes = rey => {
  const { x, y, pieza } = rey

  const movimientos = [
    { x:  0, y: -1 }, // arriba
    { x:  0, y: 1  }, // abajo
    { x: -1, y: 0  }, // izquierda
    { x:  1, y: 0  }, // derecha
    { x:  1, y: 1  }, // diagonal abajo derecha
    { x: -1, y: 1  }, // diagonal abajo izquierda
    { x: -1, y: -1 }, // diagonal arriba izquierda
    { x:  1, y: -1  }, // diagonal arriba derecha
    // movimientos del caballo
    { x: -1, y: -2, deltaX: 0, deltaY: 0 },
    { x:  1, y: -2, deltaX: 0, deltaY: 0 },
    { x: -1, y:  2, deltaX: 0, deltaY: 0 },
    { x:  1, y:  2, deltaX: 0, deltaY: 0 },
    { x: -2, y: -1, deltaX: 0, deltaY: 0 },
    { x:  2, y: -1, deltaX: 0, deltaY: 0 },
    { x: -2, y:  1, deltaX: 0, deltaY: 0 },
    { x:  2, y:  1, deltaX: 0, deltaY: 0 }
  ];

  const piezasHalladas = []
  
  movimientos.forEach(pos => {
    const resultado = []

    buscarAdversarioEnDireccion({ x: x + pos.x, y: y + pos.y, deltaX: pos.deltaX !== undefined ? pos.deltaX : pos.x, deltaY: pos.deltaY !== undefined ? pos.deltaY : pos.y, resultado })
    piezasHalladas.push(...resultado)
  })

  return piezasHalladas
}

const buscarAdversarioEnDireccion = ({ x, y, deltaX, deltaY, resultado }) => {
  // si no está dentro del tablero no hay adversario en esta dirección
  if (!estaDentroTablero({ x, y })) return

  const colorRival = dameTurnoContrario()
  const pos = matrizTablero[x][y]
  const el = pos.firstElementChild

  // si hay una pieza y es del adversario
  if (el && el.dataset.color === colorRival) {
    resultado.push({ x, y, el })
    return
  }
  // si hay una pieza aliada
  else if (el && el.dataset.color === turno) return
  // sino (si el escaque está libre y es válido) sigo buscando
  else if (!(deltaX === 0 && deltaY === 0)) buscarAdversarioEnDireccion({ x: x + deltaX, y: y + deltaY, deltaX, deltaY, resultado }) 
} 
const reset = () => jugadaPrevia.pieza = jugadaPrevia.color = undefined 
const cbJugar = ({ target }) => {
  verificarJaque()
  const huboSeleccion = jugadaPrevia.pieza !== undefined
  const esUnDiv = target.nodeName === 'DIV'
  const esUnTD  = target.nodeName === 'TD'

  revertirColores()
  if (target.dataset.color === turno || jugadaPrevia.color === turno)
    if (!huboSeleccion && esUnDiv) dibujarPosiblesMovimientos(target) // sugerir movimientos
    else if (huboSeleccion && esUnDiv && jugadaPrevia.pieza !== target && jugadaPrevia.pieza.dataset.tipo !== 'rey') comerPieza(target) // comer pieza
    else if (huboSeleccion && esUnTD) moverPieza(target) // movimiento libre
    else if (huboSeleccion && jugadaPrevia.pieza.dataset.tipo === 'rey') enrocar(target) // posible enroque
    else reset()
  else { // jugador equivocado
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
    }, 1000)
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

const dameTurnoContrario = () => turno === 'blanco' ? 'negro' : 'blanco'
const cambiarTurno = () => turno = dameTurnoContrario()
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

let jugadaPrevia = {
  pieza: undefined,
  tipo: undefined,
  color: undefined,
  posicion: {},
  posicionesCalculadas: []
};

let jugadaPreviaAux;

const calcularMovimientos = (elemento) => {
  const pieza = elemento.dataset.tipo
  const td = elemento.parentNode
  const posicionActual = {
    x: parseInt(td.dataset.x),
    y: parseInt(td.dataset.y)
  }

  jugadaPreviaAux = Funciones.clonar()(jugadaPrevia)
  jugadaPrevia.tipo = elemento.dataset.tipo
  jugadaPrevia.color = elemento.dataset.color

  const esBlanco = jugadaPrevia.color === 'blanco'

  jugadaPrevia.posicion = posicionActual
  jugadaPrevia.posicionesCalculadas = []

  switch(pieza) {
    case 'peon':
      const _x1 = esBlanco ? -1 : 1

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

      if (posicionesIniciales[posicionActual.x][posicionActual.y] !== undefined && // si no se movió
        verificarPosicionLibre({ x: esBlanco ? posicionActual.x - 1 : posicionActual.x + 1, y: posicionActual.y})) { // si no hay piezas entre medio
        posiblesMovimientos.push({
          x: esBlanco ? -2 : 2,
          y: posicionActual.y
        })
      }

      posiblesMovimientos.forEach(({ x, y }) => calcularMovimientoPeon({ x: posicionActual.x + x, y }))

      break

    case 'rey':
      const seMovioRey = historial.find(obj => obj.pieza.dataset.tipo === 'rey' && obj.pieza.dataset.color === jugadaPrevia.color)
      const torresMovidas = historial.filter(obj => obj.pieza.dataset.tipo === 'torre' && obj.pieza.dataset.color === jugadaPrevia.color)
      const coordX = jugadaPrevia.color === 'blanco' ? 7 : 0
      const movimientosEnroque = []
      // 1_ El rey nunca se movió.
      // 2_ La torre a usar en el enroque nunca fue movida.
      // 3_ El rey no está en jaque.
      // 4_ Ninguno de los escaques por los que el rey pasará o quedará, está bajo ataque.
      // 5_ Los escaques entre el rey y la torre estén desocupados.
      // 6_ El rey no termina en jaque (válido para cualquier movimiento legal).
      if (!seMovioRey) { // 1
        const posicionesIzq = [1, 2]
        const posicionesDer = [4, 5, 6]

        if (torresMovidas.length === 0) { // 2
          if ([...posicionesDer].every(y => Object.values(posiciones[coordX])[y] === undefined)) {  // 5
            movimientosEnroque.push({ x: 0, y: 4 })
          }

          if ([...posicionesIzq].every(y => Object.values(posiciones[coordX])[y] === undefined)) { // 5
            movimientosEnroque.push({ x: 0, y: -3 })
          }
        } else {
          const izq = torresMovidas.find(t => t.pieza.dataset.codigo === '70' || t.pieza.dataset.codigo === '00')
          const der = torresMovidas.find(t => t.pieza.dataset.codigo === '77' || t.pieza.dataset.codigo === '07')

          if (! (izq && der)) { // Si no se movieron ambas torres
            if (izq && !der) { // Si no se movió la torre derecha
              if ([...posicionesDer].every(y => Object.values(posiciones[coordX])[y] === undefined)) {  // 5
                movimientosEnroque.push({ x: 0, y: 4 })
              }
            } else { // Si no se movió la torre izquierda                
              if ([...posicionesIzq].every(y => Object.values(posiciones[coordX])[y] === undefined)) { // 5
                movimientosEnroque.push({ x: 0, y: -3 })
              }
            }
          }
        }
      } 

      [
        { x:  1, y:  0 },
        { x:  0, y:  1 },
        { x: -1, y:  0 },
        { x:  0, y: -1 },
        { x:  1, y:  1 },
        { x:  1, y: -1 },
        { x: -1, y:  1 },
        { x: -1, y: -1 },
        ...movimientosEnroque
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
        ].forEach(({ x, y }) => calcularMovimientoCaballo({
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

const calcularMovimientoPeon    = calcularMovimiento
const calcularMovimientoRey     = calcularMovimientoPeon
const calcularMovimientoAlfil   = ({ x, y, deltaX, deltaY }) => calcularMovimiento({ x: x + deltaX, y: y + deltaY }) === true  && calcularMovimientoAlfil({ x: x + deltaX, y: y + deltaY, deltaX, deltaY })
const calcularMovimientoCaballo = calcularMovimientoRey
const calcularMovimientoTorre   = calcularMovimientoAlfil
const calcularMovimientoReina   = calcularMovimientoTorre;

// Inicialización
(() => {
  dibujarPiezas(posicionesIniciales, piezas, matrizTablero)
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
})(tablero, cbJugar, posicionesIniciales, piezas, matrizTablero);