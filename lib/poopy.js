if(typeof Object.prototype['beget'] !== 'function') {
  
  // This function creates and returns a new object, whose prototype is the
  // receiver.
  // 
  // I realize the naming of `Begetter` seems counter–intuitive; unfortunately,
  // that (not `Begetor`) is correct.
  Object.prototype['beget'] = function () {
    if(typeof this['Begetter'] !== 'function' || !this.hasOwnProperty('Begetter')) {
      this['Begetter'] = function () {};
      this['Begetter']['prototype'] = this;
    };
    
    this['beget'] = function () {
      return new this['Begetter']();
    };
    
    return this['beget']();
  };
  
};
