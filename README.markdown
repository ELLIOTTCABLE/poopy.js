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

Style
-----
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

    var Widget = new Function();
    Widget.prepare = function() {
      // …
    };
    
    Widget.prepare();

Pretty standard, no? Let’s do the same thing, but with poopy.js:

    var widget = {};
    widget['prepare'] = function() {
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

    var Widget = new Function();
    Widget.prototype.toString = function() {
      // …
    };
    
    a_widget = new Widget();
    a_widget.toString();

Pretty ugly, right? We have to differentiate between the `Widget` object, and
the methods intended for descendants (well, really, the children; there’s no
easy way to create descendants of the descendants you create with `new
Widget()`, so you’re effectively limited to one level of depth).

This becomes much more sensible with `poopy.js`:

    var widget = {};
    widget['toString'] = function() {
      // …
    };
    
    a_widget = widget.beget();
    a_widget.toString();

### Namespaced objects
Finally, it’s worth noting that namespaced objects will also be inherited.

Normal JS:

    var Widget = new Function();
    Widget.Snorklebob = new Function();
    Widget.Snorklebob.prototype.toString = function() {
      // …
    };
    
    a_snorklebob = new Widget.Snorklebob();
    a_widget.toString();

POOPy JS:

    var widget = {};
    widget['snorklebob'] = {};
    widget.snorklebob['toString'] = function() {
      // …
    };
      
    a_snorklebob = widget.snorklebob.beget();
    a_snorklebob.toString();

Attributions
------------
The primary code for this system is the `Object.beget()` method; this method’s
original form was published in Douglas Crockford’s “JavaScript: The Good
Parts.” Credit for this original form obviously goes to him.
