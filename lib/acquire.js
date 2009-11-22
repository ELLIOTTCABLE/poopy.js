(function () {
  var posix = require('posix'),
        sys = require('sys');
    
  // This file is dual-compatible with both `require()` (as of Node.js 0.1.17)
  // and `acquire()` itself. This is generally bad practice, but is uniquely
  // necessary here.
  var acquire = exports;
  
  // TODO: Seperate acquire.resolve() function to resolve paths; should be
  // accessible externally so that other systems can determine how acquire()
  // would evolve a path.
  
  // .js is before .node; if you want to ensure that your .node file gets loaded, you can create a
  // .js file of the same name, and require the .node file explicitly.
  // 
  // The exact path will *always* be checked first; if you `acquire.package('foo/bar.node')`, then
  // 'foo/bar.node' will supercede 'foo/bar.node.js' and 'foo/bar.node.node'.
  acquire['extensions'] = ['js', 'node'];
  
  acquire['errors'] = {};
  acquire['errors']['unreadable'] = new(Error)("Path can not be read.");
  acquire['errors']['incorrectType'] = new(Error)("Path does not refer to the correct type of filesystem entry.");
  acquire['errors']['doesNotExist'] = new(Error)("Nothing exists at this path.");
  
  acquire['absolute'] = function (absolutePath) {
    // TODO: This should really be an EventEmitter, but the Promise.wait()
    //       functionality is absolutely essiential. Really, they should be
    //       the same thing; I don’t know if I can get @ryah to implement that
    //       though.
    var acquisition = new(process.Promise);
    
    posix.stat(absolutePath)
      .addCallback(function (file) {
        if (file.isFile) {
          posix.cat(absolutePath)
            .addCallback(function (source) {
              acquisition.emitSuccess(process.compile(source, absolutePath)) })
            .addErrback(function () {
              acquisition.emitError(acquire.errors.unreadable) });
        } else { acquisition.emitError(acquire.errors.incorrectType) };
      })
      .addErrback(function () {
        acquisition.emitError(acquire.errors.doesNotExist) });
    
    return acquisition;
  };
  
  acquire['relative'] = function (path) {
    throw new(Error)("Due to a current defenciency of Node.js, I can’t support relative acquires. I suggest you use `require('./name')` in the meantime.");
  };
  
  acquire['package'] = function (path, libraryPaths) {
    // This doesn’t currently look in the current directory, for the same reason as
    // acquire.relative; I really want a way around this, as one of the major uses for this is sub-
    // packages and other local-directory stuff.
    var acquisition = new(process.Promise);
    if (typeof libraryPaths === 'undefined') {
      // TODO: Support disparate acquire.paths and require.paths
      libraryPaths = require.paths.slice(0) };
    
    acquireInLibraries(acquisition, path, libraryPaths);
    
    return acquisiton;
  };
  var acquireInLibraries = function (acquisition, path, libraries) {
    var library = libraries.shift();
    posix.stat(library)
      .addCallback(function (directory) {
        if (directory.isDirectory) {
          posix.readdir(library)
            .addCallback(function (packages) {
              acquireInLibrary(acquisition, path, library, packages) }
            .addErrback(function () {
              acquisition.emitError(acquire.errors.unreadable) });
        } else {
          if (libraries.length === 0) {
            acquisition.emitError(acquire.errors.incorrectType) }
          else { acquireInLibraries(acquisition, path, libraries) } });
  }
  var acquireInLibrary = function (acquisition, path, library, packages) {
    if (typeof extensions === 'undefined') {
      extensions = acquire.extensions.slice(0); extensions.unshift('') };
    
    var package = packages.shift();
    posix.stat(library + '/' + package + '/' + path)
      .addCallback(function (file) {
        if (file.isFile) {
          posix.cat(absolutePath)
            .addCallback(function (source) {
              acquisition.emitSuccess(process.compile(source, absolutePath)) })
            .addErrback(function () {
              acquisition.emitError(acquire.errors.unreadable) });
        } else {
          if (packagePaths.length === 0) {
            acquisition.emitError(acquire.errors.incorrectType) }
          else { acquireInLibrary(acquisition, path, libraryPath, packages) } });
  }
  var acquireInPackage = function (acquisition, path, library, package) {
    
  }
    
  return acquire;
})();
