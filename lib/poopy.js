(function () {
  
  if (typeof Object.prototype['beget'] !== 'function') {
    // This function creates and returns a new object, whose prototype is the
    // receiver.
    // 
    // The value of the receiver’s `constructor` property is used as a
    // constructor function for the begat object.
    Object.prototype['beget'] = function (blueprint) {
      var originalPrototype = this['constructor']['prototype'];
      this['Begetter']['prototype'] = this;
      
      var descendant = new(this['constructor'])(blueprint);
      descendant['blueprint'] = blueprint;
      
      this['constructor']['prototype'] = originalPrototype;
      
      return descendant;
    }};
  
  return Object.prototype;
})();
