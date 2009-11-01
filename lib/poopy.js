(function () {
  
  if (typeof Object.prototype['beget'] !== 'function') {
    
    // This function creates and returns a new object, whose prototype is the
    // receiver.
    // 
    // The value of the receiver’s `Begetter` property is used as a
    // constructor function for the begat object. This defaults to an noop
    // function, but can be overridden for any purpose. The `constructor`
    // property of begat objects will become a direct reference to that
    // function. Also, the prototype property of the `Begetter()` function
    // will be unconditionally set to the receiver… thus also causing
    // `begatObject.constructor.prototype` to point to the receiver (the
    // source mechanism of all of the magic in this method.)
    // 
    // I realize the naming of `Begetter` seems counter–intuitive;
    // unfortunately, that (not `Begetor`) is correct.
    //--
    // TODO: Should we use `this['constructor']` instead of
    //       `this['Begetter']`? That is, after all, what it’s *there* for…
    //       but I’m wary of overwriting it.
    var beget = function (blueprint) {
      if (typeof this['Begetter'] !== 'function' ||
        !this.hasOwnProperty('Begetter')) { this['Begetter'] = function () {} };
      
      this['beget'] = function () {
        var originalPrototype = this['Begetter']['prototype'];
        this['Begetter']['prototype'] = this;
        
        var descendant = new(this['Begetter'])(blueprint);
        if (!descendant.hasOwnProperty('constructor')) {
          descendant['constructor'] = this['Begetter'];
        };
        // This, unfortunately, creates a slot *on* the descendant—which means
        // that `descendant.hasOwnSlot('beget')` will return `true`. This is
        // necessary, because otherwise, `descendant['beget']` will inherit
        // from the optimized `parent['beget']`… which means
        // `descendant['beget']` will not include the `this['Begetter']`
        // initialization code.
        descendant['beget'] = beget;
        
        this['Begetter']['prototype'] = originalPrototype;
        
        return descendant;
      };
      
      return this['beget']();
    };
    
    Object.prototype['beget'] = beget;
    
  };
  
  return null;
})();
