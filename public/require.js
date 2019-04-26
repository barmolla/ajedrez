require.cache = Object.create(null);

function readFile(name){
  const xhr = new XMLHttpRequest();

  xhr.open('GET', name, false);
  xhr.send();

  return xhr.responseText;
}

/* tomado de https://eloquentjavascript.net/10_modules.html */
function require(name) {
  if (!(name in require.cache)) {
    const extension = name.split(".").pop();
    const code = readFile(name);

    if (extension === "js") {
      const module = {exports: {}};
      const wrapper = Function("require, exports, module", code);
      
      require.cache[name] = module;
      wrapper(require, module.exports, module);

      return require.cache[name].exports;
    } 

    return code;
  }
  
  return require.cache[name].exports;
}