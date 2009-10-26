(function () {
  
  if (typeof process['aquire'] !== 'function') {
    
    // This function is an alternative to Node.js’s `require()` that doesn’t
    // make the mistake of presuming to know how you want your module object
    // created. It expects the required file to create and return its own
    // object.
    // 
    // This function is fully asynchronous, and returns a `node.Promise`. If
    // you want synchronicity, use `node.Promise.wait()`.
    // 
    // On success, we pass the result of compiling the acquired file;
    // FIXME: on failure, we pass nothing.
    exports['acquire'] = function (path, libraryPaths) {
      var acquisition = new node.Promise;
      
      if (path[0] === '/') {
        acquireAbsolute(acquisition, path, libraryPaths) }
      else { acquireRelative(acquisition, path) };
      
      return acquisition;
    };
    
    var acquireAbsolute = function (acquisition, path, libraryPaths) {
      if (typeof libraryPaths === "undefined") {
        libraryPaths = node.libraryPaths.splice(0) };
      
      var absolutePath = libraryPaths.shift() + path;
      
      node.fs.stat(absolutePath)
        .addCallback(function (file) {
          if (file.isFile) {
            node.fs.cat(absolutePath)
              .addCallback(function (content) {
                var compilationResult = node.compile(content, absolutePath);
                acquisition.emitSuccess(compilationResult);
              })
              .addErrback(function () {
                // TODO: Real `Error` objects!
                acquisition.emitError();
              });
          }
          else { acquisition.emitError(error) };
        })
        .addErrback(function () {
          if (libraryPaths.length === 0) { acquisition.emitError(); }
          else { acquireAbsolute(acquisition, path, libraryPaths) };
        });
    };
    
    var acquireRelative = function (acquisition, path) {
      // TODO: Is Node.js supported on Windows? Will '/' work there?
      // FIXME: This doesn’t work; it uses the `__filename` of *this* file.
      var dir = __filename.split('/'); dir.pop(); dir = dir.join('/');
      absolutePath = dir + '/' + path;
      
      node.fs.stat(absolutePath)
        .addCallback(function (file) {
          if (file.isFile) {
            node.fs.cat(absolutePath)
              .addCallback(function (content) {
                var compilationResult = node.compile(content, absolutePath);
                acquisition.emitSuccess(compilationResult);
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
    
    // This is probably not the best way to do this, but… whatever…
    node.mixin(process, exports);
  };
  
  return null;
})();
