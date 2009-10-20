(function () {
  
  if(typeof Object.prototype['beget'] !== 'function') {
    
    // This function creates and returns a new object, whose prototype is the
    // receiver.
    // 
    // The value of the receiver’s `Begetter` property is used as a constructor
    // function for the begat object. This defaults to an noop function, but can
    // be overridden for any purpose. The `constructor` property of begat
    // objects will become a direct reference to that function. Also, the
    // prototype property of the `Begetter()` function will be unconditionally
    // set to the receiver… thus also causing
    // `begat_object.constructor.prototype` to point to the receiver (the source
    // mechanism of all of the magic in this method.)
    // 
    // I realize the naming of `Begetter` seems counter–intuitive; unfortunately,
    // that (not `Begetor`) is correct.
    //--
    // TODO: Should we use `this['constructor']` instead of `this['Begetter']`?
    //       That is, after all, what it’s *there* for… but I’m wary of
    //       overwriting it.
    // FIXME: The first object in the inheritance tree to have `beget()` called
    //        will replace its own `beget()` with a non–inheritance–aware
    //        `beget()`, thus breaking `this['Begetter']` initialization for
    //        descendants.
    // TODO: Take a `blueprint` argument to `beget()`, and pass it to the
    //       `Begetter`
    Object.prototype['beget'] = function () {
      if(typeof this['Begetter'] !== 'function' || !this.hasOwnProperty('Begetter')) {
        this['Begetter'] = function () {};
      };
      
      this['beget'] = function () {
        var original_prototype = this['Begetter']['prototype'];
        this['Begetter']['prototype'] = this;
        
        var descendant = new this['Begetter']();
        if (!descendant.hasOwnProperty('constructor')) {
          descendant['constructor'] = this['Begetter'];
        };
        
        this['Begetter']['prototype'] = original_prototype;
        
        return descendant;
      };
      
      return this['beget']();
    };
    
  };
  
  return null;
})();
