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
      
      acquireFile(absolutePath)
        .addListener('success', function (result) {
          acquisition.emitSuccess(result) })
        .addListener('unreadable',  function () { acquisition.emitError() })
        .addListener('notAFile',    function () { acquisition.emitError() })
        .addListener('nonexistent', function () {
          if (libraryPaths.length === 0) { acquisition.emitError() }
          else { acquireAbsolute(acquisition, path, libraryPaths) } });
    };
    
    var acquireRelative = function (acquisition, path) {
      // TODO: Is Node.js supported on Windows? Will '/' work there?
      // FIXME: This doesn’t work; it uses the `__filename` of *this* file.
      var dir = __filename.split('/'); dir.pop(); dir = dir.join('/');
      absolutePath = dir + '/' + path;
      
      acquireFile(absolutePath)
        .addListener('success', function (result) {
          acquisition.emitSuccess(result) })
        .addListener('unreadable',  function () { acquisition.emitError() })
        .addListener('notAFile',    function () { acquisition.emitError() })
        .addListener('nonexistent', function () { acquisition.emitError() });
    };
    
    var acquireFile = function (absolutePath) {
      var acquisition = new node.EventEmitter;
      
      node.fs.stat(absolutePath)
        .addCallback(function (file) {
          if (file.isFile) {
            node.fs.cat(absolutePath)
              .addCallback(function (source) {
                acquisition.emit('success', node.compile(source, absolutePath));
              })
              .addErrback(function () { acquisition.emit('unreadable') });
          } else { acquisition.emit('notAFile') };
        })
        .addErrback(function () { acquisition.emit('nonexistent') });
      
      return acquisition;
    };
    
    // This is probably not the best way to do this, but… whatever… I don’t
    // want it to be `something.acqqire()`, so global namespace it is!
    node.mixin(process, exports);
  };
  
  return null;
})();
