if(typeof process['aquire'] !== 'function') {
  
  // This function is an alternative to Node.js’s `require()` that doesn’t
  // make the mistake of presuming to know how you want your module object
  // created. It expects the required file to create and return its own object.
  // 
  // This function is fully asynchronous, and returns a `node.Promise`. If you
  // want synchronicity, use `Promise.wait()`.
  // 
  // On success, we pass the result of compiling the acquired file; FIXME: on
  // failure, we pass nothing.
  exports['acquire'] = function (path, libraryPaths) {
    if (typeof libraryPaths === "undefined") {
      libraryPaths = node.libraryPaths.splice(0);
    };
    
    // I am fully aware of the effects of using `arguments.callee`
    // on tail recursion optimizations… and frankly, I don’t care. My
    // stylistic standards (including avoiding named functions) outweigh
    // some edge optimization benefits… if you really need the extra
    // speed, implement your own copy of this function as a named
    // recursive function.
    var acquire = arguments.callee;
    var acquisition = new node.Promise;
    
    if (path[0] == '/') {
      var absolute_path = libraryPaths.shift() + path;
      
      node.fs.stat(absolute_path)
        .addCallback(function (file) {
          if (file.isFile) {
            node.fs.cat(absolute_path)
              .addCallback(function (content) {
                var compilation_result = node.compile(content, absolute_path);
                acquisition.emitSuccess(compilation_result);
              })
              .addErrback(function () {
                // TODO: Real `Error` objects
                acquisition.emitError();
              });
              
          } else { acquisition.emitError(error) };
        })
        .addErrback(function () {
          if (libraryPaths.length === 0) {
            acquisition.emitError();
          } else {
            acquire(path, libraryPaths)
              .addCallback(function (file) {
                acquisition.emitError();
              })
              .addErrback(function (compilation_result) {
                acquisition.emitSuccess(compilation_result);
              });
          };
        });
        
    } else {
      
      // TODO: Is Node.js supported on Windows? Will this work there?
      var dir = __filename.split('/'); dir.pop(); dir = dir.join('/');
      absolute_path = dir + '/' + path;
      
      node.fs.stat(absolute_path)
        .addCallback(function (file) {
          if (file.isFile) {
            node.fs.cat(absolute_path)
              .addCallback(function (content) {
                var compilation_result = node.compile(content, absolute_path);
                acquisition.emitSuccess(compilation_result);
              })
              .addErrback(function () {
                acquisition.emitError();
              });
          } else { acquisition.emitError(error) };
        })
        .addErrback(function () {
          acquisition.emitError();
        });
        
    };
    
    return acquisition;
  };
  
  // This is probably not the best way to do this, but… whatever…
  node.mixin(process, exports);
};
