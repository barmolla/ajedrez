const matrizAVector = matriz => [].concat(...matriz);
const parseIntTodo  = (...elementos) => elementos.map(elemento => parseInt(elemento));
const clonar        = (prototipo = Object.prototype) => objeto => Object.assign(crear(prototipo), objeto);
const crear         = elemento => Object.create(elemento);
const congelar      = elemento => Object.freeze(elemento);

Array.prototype.dameClon = function() {
	return [...(this.map(clonar()))];
};

/*module.exports = {
  matrizAVector,
  clonar,
  parseIntTodo,
  crear,
  congelar
}*/

exports.matrizAVector = matrizAVector
exports.clonar = clonar
exports.parseIntTodo = parseIntTodo
exports.crear = crear
exports.congelar = congelar
