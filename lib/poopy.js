return (function () {
  
  if (typeof Object.prototype['beget'] !== 'function') {
    // This function creates and returns a new object, whose prototype is the
    // receiver.
    // 
    // The value of the receiver’s `constructor` property is used as a
    // constructor function for the begat object.
    Object.prototype['beget'] = function (blueprint) {
      var originalPrototype = this['constructor']['prototype'];
      this['constructor']['prototype'] = this;
      
      // For some things (like `Object`), we can’t set the `prototype`
      // property without things blowing up horribly. That would create a
      // circular prototypal inheritance chain, which interpreters *really*
      // don’t like. Generally, they simply ignore the assignment. Thus, we’re
      // going to check that the assignment *actually happened*, and then if
      // not, use a new, beget-safe, constructor.
      if (this['constructor']['prototype'] !== this) {
        if (this.hasOwnProperty('constructor')) {
          var originalConstructor = this['constructor'] }
        else { var originalConstructor };
        
        this['constructor'] = new(Function);
        var descendant = arguments.callee.apply(this, arguments);
        
        if (typeof originalConstructor !== 'undefined') {
          this['constructor'] = originalConstructor }
        else { delete this['constructor'] };
        
        return descendant;
      }
      
      var descendant = new(this['constructor'])(blueprint);
      descendant['blueprint'] = blueprint;
      
      this['constructor']['prototype'] = originalPrototype;
      
      return descendant;
    }};
  
  return Object.prototype;
})()
