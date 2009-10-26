`poopy.js`
==========
P.O.O.P., or “Prototype–Object Oriented Programming,” is a style of
programming wherein one focuses on the development of prototype objects, which
will then beget copies of themselves on which the data is intended to be
changed.

Unlike classist systems, ‘POOP–y’ systems differentiate not–at–all between
descendant and ancestor; any object can beget copies of itself. This means
that once one has added functionality as they see fit to an object, they can
immediately make use of that added functionality on any further datasets
(objects).

`poopy.js` provides a few useful methods to facilitate POOPy programming.
Instead of providing a great surfeit of added functionality to JavaScript
itself, `poopy.js` operates as a contract: libraries depending on `poopy.js`
are written in a POOPy style, and are intended to be used with `poopy.js`’s
extensions.

Style & Use
-----------
Let’s look at a simple example, describing how one would use a standard
JavaScript library, and then let’s look at how one would use a POOPy library.

We’ll say our example library is called Widget, and that it provides three
kinds of functionality: a general function which prepares a ‘widget–y’
environment, the ability to create ‘widgets’ (a type of JavaScript object, of
course), and the ability to create ‘snorklebobs’ (again, JavaScript objects).

### Proto methods
Let’s first look at utilizing the general function (in POOPy terms, a ‘proto
method’—one intended to be executed on the prototype, instead of on
descendants), first in standard JavaScript:

    var Widget = new Function;
    Widget.prepare = function () {
      // …
    };
    
    Widget.prepare();

Pretty standard, no? Let’s do the same thing, but with poopy.js:

    var widget = {};
    widget['prepare'] = function () {
      // …
    };
    
    widget.prepare();

Not really that different. Notice that we don’t use JavaScript’s `new`
keyword; there are quite a few niggling details to deal with and, quite
frankly, it’s extremely broken. Instead, we deal exclusively with objects
themselves, asking objects to beget to new objects their data and
functionality. Also notice that we are not inheriting our new objects from
`Function`, instead, we simply create an empty basic object (created, in this
case, with an object literal; `new Object()` is just as valid, but I prefer to
avoid any use of the `new` keyword entirely).

### Begat methods
Let’s move on to creating a descendant, and utilizing one of our object’s
methods intended for use on descendants (a ‘begat method’ in POOPy terms).

In standard JavaScript, you can’t easily create descendants of other arbitrary
objects (even though it is, nominally, a prototypal language); instead, you
only create descendants of special objects (in reality, functions) created
specifically for this particular purpose (notationally, we traditionally
reference these special–purpose objects by names starting with a capital
letter, such as `Object`).

Let’s look at this in practice:

    var Widget = new Function;
    Widget.prototype.toString = function () {
      // …
    };
    
    aWidget = new Widget();
    aWidget.toString();

Pretty ugly, right? We have to differentiate between the `Widget` object, and
the methods intended for descendants (well, really, the children; there’s no
easy way to create descendants of the descendants you create with `new
Widget()`, so you’re effectively limited to one level of depth).

This becomes much more sensible with `poopy.js`:

    var widget = {};
    widget['toString'] = function () {
      // …
    };
    
    aWidget = widget.beget();
    aWidget.toString();

### Namespaced objects
Finally, it’s worth noting that namespaced objects will also be inherited.

Normal JS:

    var Widget = new Function;
    Widget.Snorklebob = new Function;
    Widget.Snorklebob.prototype.toString = function () {
      // …
    };
    
    aaSnorklebobsnorklebob = new Widget.Snorklebob();
    aSnorklebob.toString();

POOPy JS:

    var widget = {};
    widget['snorklebob'] = {};
    widget.snorklebob['toString'] = function () {
      // …
    };
      
    aSnorklebob = widget.snorklebob.beget();
    aSnorklebob.toString();

### Begetters (constructor functions)
When an object begets another object, it invokes the ancestor object’s
`Begetter` function with the `new` keyword. Normally, when none is defined,
this is defined to be a simple noop function; however, you are free to
override this function to preform any preparation you desire on your newly
created descendant.

Let’s take a simple example, that initializes a `Widget` with either a given
value for `foo`, or, alternatively, a randomly generated string.

    var Widget = function (blueprint) {
      this['foo'] = (typeof blueprint !== 'undefined' && blueprint.hasOwnKey('foo')) ?
        blueprint['foo'] : (Math.random() * 1e32).toString(36);
    };
    
    aWidget = new Widget({});
    aWidget['foo']; //=> '1n0w4oy0797owwggosow'

Now in POOPy JS:

    var widget = {};
    widget['Begetter'] = function (blueprint) {
      this['foo'] = (typeof blueprint !== 'undefined' && blueprint.hasOwnKey('foo')) ?
        blueprint['foo'] : (Math.random() * 1e32).toString(36);
    };
    
    aWidget = widget.beget();
    aWidget['foo']; //=> '225wep9t9yrogg0s00o8g'

This method of executing the constructor mitigates many of the problems
inherent to the `new` keyword; it’s also simply a more purist form of
traditional prototypal style than the alternatives.

Attributions
------------
The primary code for this system is the `Object.beget()` method; this method’s
original form was published in Douglas Crockford’s “JavaScript: The Good
Parts”… therefore some credit for the concept is due him.

I would also like to thank Mr. Crockford, in general, for having written that
book; it’s an absolutely wonderful learning tool, and it’s the first computer–
related book that has actually *taught* me something… something I couldn’t
just learn from a bit of Googling. That makes it the first, and last, useful
treatise on programming to have ever passed my purview.
