// === Philosophy

// This is a complex system. Inspired by both Ruby (packages are
// folders with lib/ inside them, and file extensions are optional) and Python
// (the ability to import the specific things that you want from a package,
// the equivalent of an __init__.py file), this system also introduces several
// new or different features and concepts:
// 
//  - Packages are as absolutely simple as possible; a ‘package’ is really
//    nothing more than some `.tar.gz`ipped code. This frees the community up
//    to use any distribution, organization, and dependency resolution systems
//    they please; a `.tar.gz` on S3 is just as valid as a GitHub repository
//    or a `.zip` you e-mail to a friend. This also leaves us free, as a
//    community, to build more complex systems that build on top of this
//    system *without* precluding the use of this simple system by any
//    authors, opening up the possibility of systems like RubyForge, CPAN, or
//    Gemcutter.
//  - Packages can be organized Ruby style, with `./submodule.js` adjacent to
//    `./submodule/`… or Python style, with a twist: `submodule.js` can
//    instead be placed *inside* `./submodule/` as `./submodule/submodule.js`,
//    preforming the function of Python’s __ini__.py., but with a more
//    semantic name (submodule.js is welcome to do far more than ‘init’ the
//    submodule; you could store as much of the ‘submodule’ related code
//    inside that file as you want, and only move things to seperate files
//    inside `./submodule/` as the code grew large and semantically separate)
//  - Since this is JavaScript, there is a good chance that you may want your
//    package to be as useful client-side as it is server-side; to this
//    purpose, the `acquire()` system can be used in a fully filesystem-
//    agnostic manner: any basic acquire (not including Python-style
//    `import()` acquires) can be replaced *inline* with the content of the
//    file that acquire resolves to (possibly wrapped in `(function(){ … })()`
//    to be safe), and a package (or even an application, with all of the
//    packages it acquires) can be served to the client as a *single GZIPped
//    file*, that requires no filesystem traversal or extra HTTP requests.
//  - Compilation is fully object-agnostic (the original reason I wrote this
//    system, as the CommonJS ‘securable modules’ system existing in Node.js
//    at the time handed you an object and forced you to use it); the final
//    return value of your package/file is the return value of the acquire
//    functions. This means that creating and manipulating the object
//    representing your package to the rest of the JavaScript world is fully
//    and completely up to you; you’re free to return an Object, a prototype
//    (as per poopy.js), a Function… even an array or number or other
//    primative (if you really want to). It’s completely up to you.

// === Usage

// The basic acquires will all asynchronously resolve and compile a JavaScript
// or object file, and pass the result to a callback. These are Promises, so
// you can synchronously wait() on them.
// 
// Since the result of compilation is passed directly, you can expect to get
// an object representing the entire package/module.
// 
// `acquire()` is identical to `acquire.package()`.
// 
//     var foo = acquire.absolute('/path/to/foo.js').wait()
//     var foo = acquire.relative('to/foo.js').wait()
//     var foo = acquire.package('to/foo') or acquire('to/foo')

// However, you can also import the module directly into a target.
// 
// This will take the value of the slot 'foo' on the compiled package, and
// apply it to the slot 'foo' on the target.
// 
// Multiple slots may be specified, in which case all specified slots will be
// applied; if no slots are specified, then *all* slots on the target package
// will be applied (thus, fully importing the target module). If no target is
// specified, `GLOBAL` will be substituted.
// 
// `acquire.import().from()` is identical to `acquire.import().from.package()`;
// generally speaking, the methods on the `from` proxy object correspond to
// their relative basic `acquire` methods.
// 
//     acquire.import('aSlot', 'anotherSlot', this).from.relative('to/foo.js')
//     acquire.import(this).from.absolute('/path/to/foo.js')
//     acquire.import('aSlot').from.package('to/foo')
//       or acquire.import('aSlot').from('to/foo')

// === Package structure

// This acquire system is very flexible, but that is also its downfall. It is
// important that we use that flexibility for good, not evil.
// 
// As a package author, this means several things to you: generally, you need
// to put theflexibility in the hands of the user of your package, instead of
// abusing it yourself. For instance:
// 
//  - Write the submodules of your package such that they are independant of
//    eachother as much as possible. This ensures that if a user of your
//    package only wants to `acquire('yourPackage/subModule')`, they are free
//    to do so, as nothing in `lib/yourPackage/submodule/` will depend upon
//    code in `lib/yourPackage/`.
//    
//    This acquire system attempts to generally facilitate this through the
//    submodule named initfile; in fact, there are three different ways that
//    submodules of your package may be utilized separately from your package
//    itself:
//     - `acquire.import('subModule', this).from('myPackage');`
//     - `var subModule = acquire('myPackage/subModule');`
//     - Tearing the `lib/myPackage/submodule/` folder out of your package,
//       and using (or even distributing, depending on your choice of license)
//       it as its own package
//  - Modularize your code iteratively; when the code relevant to the
//    `subModule` section of your package is light, there is no reason not to
//    keep it in `lib/myPackage.js`. However, as your package grows, you may
//    find that you wish to keep it in a separate file; this is a simple
//    matter of moving `lib/myPackage.js` to `lib/myPackage/myPackage.js` (if
//    you wish; I personally prefer to keep all related code inside a single
//    folder, but leaving `myPackage.js` directly inside `lib/` is perfectly
//    valid) and then moving some of the `subModule`-related code *out* of
//    `myPackage.js` into `lib/myPackage/subModule.js`.
//    
//    This applies in the same way to the submodules themselves; you may
//    eventually wish to move `lib/myPackage/subModule.js` into
//    `lib/myPackage/subModule/subModule.js`, and then some of the subModule
//    code into `lib/myPackage/subModule/subSubModule.js`. And so on, and so
//    forth.
//  - Your sourcefiles themselves should generally be wrapped in an anonymous
//    function to give them private anonymous scope; although *this* acquire
//    function will wrap them in such an anonymous function before compiling
//    them, others using your code in other ways may not.
//    
//    As well, although this system leaves the details entirely up to you,
//    you’ll almost certainly want to create and return an object that
//    represents your package to the outside world. It is good practice to
//    utilize a local variable of the same name as your package to hold this
//    object, as that means your slot definitions (and internal dogfooding of
//    your own package’s methods) will have a good chance of directly relating
//    to your documentation, which is beneficial to people trying to learn
//    from your source code.
// 
// All that said, here’s a basic template for a module/submodule within your
// package (this example uses the poopy.js method of object creation; but
// a literal like `{}`, or a constructor invocation such as `new(Object)`, is
// just as valid):
// 
//     /* lib/myPackage/myPackage.js */
//     (function(){
//       var myPackage = {}.beget();
//       myPackage['subModule'] = acquire.relative('subModule.js');
//       
//       // …
//       
//       return myPackage;
//     })();
// 
//     /* lib/myPackage/subModule.js */
//     (function(){
//       var subModule = {}.beget();
//       
//       // …
//       
//       return subModule;
//     })();
(function () {
  
  // DEP: We have to depend upon the existence of `require()` here, since the
  //      current 'posix' module is written for it.
  var posix = require('posix');
  
  // TODO: The `Promise`s utilized throughout this code *really* should be raw
  //       `EventEmitter`s, but I absolutely *have* to support `wait()`
  //       functionality on all acquires.
  //       
  //       The truth is that `Promise` really shouldn’t exist; everything
  //       implemented on `Promise` could be re-implemented on top of
  //       `EventEmitter` directly. However, that will have to be hashed out
  //       with @ryah.
  
  // FIXME: This code uses a metric shitton of nested `Promise`s, that
  //        callback or errback eachother in a chain. Allocating all of these
  //        is almost guaranteed to be a performance concern; consider
  //        refactoring to pass around a single `acquisition` from the very
  //        start.
  
  // TODO: What is `this` throughout the execution of an acquired file?
  //       Perhaps, if it’s valid, we should `apply()` our wrapper to `null`.
  
  // ============
  // = Plumbing =
  // ============
  
  // FIXME: This really should be some sort of tree-like structure; I’d much
  //        prefer these objects to be prototypal descendants of `Error`, and
  //        then have some of them additionally descend from eachother… but
  //        that really requires poopy.js, and that’s not an option inside
  //        this file. So, as it is, you have to individually compare to each
  //        and every element of `acquire.errors`.
  var errors = {
    notAbsolute: new(Error)("Path is not absolute")
,   unreadable: new(Error)("Path can not be opened.")
,   notAFile: new(Error)("Path does not refer to a file.")
,   notADirectory: new(Error)("Path does not refer to a directory.")
,   doesNotExist: new(Error)("Nothing exists at this path.")
  };
  
  var compileModule = function (source, path) {
    // TODO: I am not entirely sure if this is ‘secure,’ nor am I even sure if
    //       I think it *should* be. For instance, I imagine one could do evil
    //       things of some sort with a file like this:
    //       
    //           })
    //           var gaz = 123;
    //           (function(){
    //       
    //       However, I don’t exactly see how that could be a problen… you can
    //       already inject variables into the enclosing scope (up to the
    //       global scope) simply by avoiding the good-practice `var` keyword…
    //       and if you’re acquiring the sourecode of the file, don’t you
    //       already implicitly trust it, to some extent?
    // TODO: Is `process.compile` not an operation that could possibly be
    //       slow? It doesn’t hit the filesystem or any other resource, but…
    //       it seems to me that, for this particular case, the CPU itself
    //       could be considered a ‘slow resource’ for the purposes of
    //       Node.js’s ideological asynchronicity goals. I should ask @ryah
    //       about making `process.compile` async, and possibly (in the
    //       meantime) wrap this call in a `setTimeout()`.
    return process.compile("(function (__filename) {\n" + source + "\n})", path)(path);
  };
  
  // =============
  // = Porcelain =
  // =============
  
  // === Path resolvers
  var resolvePackage = function () {};
  var resolveRelative = function () {};
  var resolveAbsolute = function (path, acquisition) {
    if (typeof acquision === 'undefined') {
      acquisition = new(process.Promise)};
    
    // FIXME: Is this a race condition? Will the function *always* return
    //        *before* this setTimeout runs? If not, we may have the situation
    //        where the errback is not defined before the synchronous error
    //        condition below craps out.
    //        
    //        Alternatively (though this isn’t a general solution to similar
    //        situations), we could `throw` the error instead of errbacking
    //        it. It *is* a synchronous error, after all. It just seems odd,
    //        to me, to make 90% of the errors that might be encountered by
    //        this system handleable by errbacks, and then have one error that
    //        you would have to `catch`.
    setTimeout(function () {
      // TODO: Windows support? What about drive names (C:/) and such?
      if (path[0] !== '/') {
        acquisition.emitError(errors.notAbsolute) }
      else {
        // Probably the most simplistic function in this library, we don’t really
        // have to ‘resolve’ an absolute path. We simply have to check if it
        // exists, and is a file.
        posix.stat(path)
          .addCallback(function (file) {
            if (file.isFile) {
              acquisition.emitSuccess(path) }
            else { acquisition.emitError(acquire.errors.notAFile) } })
          .addErrback(function () {
            acquisition.emitError(acquire.errors.doesNotExist) });
      };
    }, 0);
    
    return acquisition;
  };
  
  // === Basic acquires
  var acquirePackage = function () {};
  var acquireRelative = function () {};
  var acquireAbsolute = function (path) {
    var acquisition = new(process.Promise);
    
    resolveAbsolute(path)
      .addCallback(function (path) {
        posix.cat(path)
          .addCallback(function (source) {
            acquisition.emitSuccess(compileModule(source, path)) })
          .addErrback(function () {
            acquisition.emitError(acquire.errors.unreadable) }) })
      .addErrback(function (error) { acquisition.emitError(error) });
    
    return acquisition;
  };
  
  // === API
  
  // We have to define our `acquire` object (the namespace for the entire API)
  // all the way down here, because it has to be the same function called by
  // `acquire.package()`.
  var acquire = acquirePackage;
  acquire['package'] = acquirePackage;
  acquire['relative'] = acquireRelative;
  acquire['absolute'] = acquireAbsolute;
  
  acquire['resolve'] = resolvePackage;
  acquire.resolve['package'] = resolvePackage;
  acquire.resolve['relative'] = resolveRelative;
  acquire.resolve['absolute'] = resolveAbsolute;
  
  // For the moment, this file has to be dual-compatible with both `acquire()`
  // *and* the old ‘securable modules’ `require()` system (as that is the only
  // easy method for people wishing to get `acquire()` into their code to do
  // so). For that reason, we’re going to ensure `exports` exists, and then
  // attach our `acquire` namespace to that.
  // 
  // In ‘the future’ (/dun dun dun+/), I’m hoping that this code will be
  // merged into Node.js and used to replace the ‘securable modules’
  // system as the primary code-acquisition system, and `acquire` will simply
  // be available. Until then, to make upgrading (if that happens) easier, I
  // suggest something like `process.mixin(require('poopy.js/lib/acquire'));`,
  // or, if you don’t want to screw with the `GLOBAL` namespace,
  // `var acquire = require('poopy.js/lib/acquire')['acquire'];`. It’s hacky,
  // I know, but necessary, if I want the `acquire` namespace object itself to
  // be a function… and for ease of use, I do.
  if (typeof exports === 'undefined') {
    process.stdio.write("okay! exports doesn’t exist! creating it." + '\n');
    exports = {};
  };
  
  exports['acquire'] = acquire;
  return exports;
})();
