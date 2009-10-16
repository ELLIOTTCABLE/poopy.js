if(typeof Object.prototype['beget'] !== 'function') {
  
  // This function creates and returns a new object, whose prototype is the
  // receiver.
  // 
  // I realize the naming of `Begetter` seems counter–intuitive; unfortunately,
  // that (not `Begetor`) is correct.
  Object.prototype['beget'] = function () {
    if(typeof this['Begetter'] !== 'function' || !this.hasOwnProperty('Begetter')) {
      this['Begetter'] = function () {};
    };
    
    this['beget'] = function () {
      this['Begetter']['prototype'] = this;
      
      var descendant = new this['Begetter']();
      if (!descendant.hasOwnProperty('constructor')) {
        descendant['constructor'] = this['Begetter'];
      };
      return descendant;
    };
    
    return this['beget']();
  };
  
};
