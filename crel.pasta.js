((exporter) => {
  const func = "function",
    isNode = "isNode",
    d = document,
    isType = (object, type) => typeof object === type,
    appendChild = (elem, child) => {
      if (child !== null) {
        if (Array.isArray(child)) {
          child.map((subChild) => appendChild(elem, subChild));
        } else {
          if (!crel[isNode](child)) {
            child = d.createTextNode(child);
          }
          elem.appendChild(child);
        }
      }
    };
  function crel(elem, settings) {
    let args = arguments,
      k = 1,
      key,
      attr;
    elem = crel.isElement(elem) ? elem : d.createElement(elem);
    if (
      isType(settings, "object") &&
      !crel[isNode](settings) &&
      !Array.isArray(settings)
    ) {
      k++;
      for (key in settings) {
        attr = settings[key];
        key = crel.attrMap[key] || key;
        if (isType(key, func)) {
          key(elem, attr);
        } else if (isType(attr, func)) {
          elem[key] = attr;
        } else {
          elem.setAttribute(key, attr);
        }
      }
    }
    for (; k < args.length; k++) {
      appendChild(elem, args[k]);
    }

    return elem;
  }

  crel.attrMap = {};
  crel.isElement = (object) => object instanceof Element;
  crel[isNode] = (node) => node instanceof Node;
  crel.proxy = new Proxy(crel, {
    get: (target, key) => {
      !(key in crel) && (crel[key] = crel.bind(null, key));
      return crel[key];
    },
  });
  exporter(crel, func);
})((product, func) => {
  if (typeof exports === "object") {
    module.exports = product;
  } else if (typeof define === func && define.amd) {
    define(() => product);
  } else {
    this.crel = product;
  }
});
