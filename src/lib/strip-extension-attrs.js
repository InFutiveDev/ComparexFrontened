export const EXTENSION_ATTRS = [
  "bis_skin_checked",
  "bis_register",
  "bis_id",
  "cz-shortcut-listen",
  "data-new-gr-c-s-check-loaded",
  "data-gr-ext-installed",
];

export const stripExtensionScript = `
(function () {
  var attrs = ${JSON.stringify(EXTENSION_ATTRS)};
  var shouldStrip = function (name) {
    if (!name) return false;
    if (attrs.indexOf(name) !== -1) return true;
    return name.indexOf("__processed_") === 0;
  };
  var strip = function () {
    try {
      var nodes = document.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        for (var j = el.attributes.length - 1; j >= 0; j--) {
          var attr = el.attributes[j];
          if (shouldStrip(attr.name)) el.removeAttribute(attr.name);
        }
      }
    } catch (e) {}
  };
  strip();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", strip, { once: true });
  }
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(strip);
    requestAnimationFrame(function () {
      requestAnimationFrame(strip);
    });
  }
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.type === "attributes" && shouldStrip(record.attributeName)) {
          record.target.removeAttribute(record.attributeName);
        }
      }
      strip();
    }).observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: attrs,
    });
  }
})();
`;
