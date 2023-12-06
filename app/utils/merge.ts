export function merge(target: any, source: any) {
  Object.keys(source).forEach(function (key) {
<<<<<<< HEAD
    if (source[key] && typeof source[key] === "object") {
=======
    if (
      source.hasOwnProperty(key) && // Check if the property is not inherited
      source[key] &&
      typeof source[key] === "object" || key === "__proto__" || key === "constructor"
    ) {
>>>>>>> upstream/main
      merge((target[key] = target[key] || {}), source[key]);
      return;
    }
    target[key] = source[key];
  });
<<<<<<< HEAD
}
=======
} 
>>>>>>> upstream/main
