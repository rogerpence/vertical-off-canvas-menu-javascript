## Declarative DOM element event handlers 

There are several great JavaScript libraries (React and Vue.js, for example) that take a lot of the pain out of wiring up DOM element event handlers (and a lot more than that!). However, for many simple projects those libraries are just too heavy. This article provides a simple, declarative way to assign multiple DOM element event handlers using custom HTML attributes with plain vanilla JavaScript. 

#### Assigning event names and handlers

Consider the following anchor tag which needs two event handlers, one for its `click` event and another for its `focus` event. 

    <a role="search" 
        data-events="click, focus" 
        data-handlers="toggleSearchPanel, buttonFocused" 
        class="search icon action-button " 
        href="#"><svg>...</svg>
    </a>

Events are assigned with a comma-separated list in the `data-events` attribute. You can assign one or event names as needed. 

Event handlers are assigned with a comma-separated list the `data-handlers` attribute. The event handlers positions correspond to the event names. That is, the first handler is assigned to the first event and so on. 

#### Creating event handlers

The event handlers must be contained in a JavaScript object named `autoboundEventHandlers`, as shown below:

    const autoboundEventHandlers = {
        toggleSearchPanel: function(e) {
            // Do something important here.
        },
        buttonFocused: function(e) {
            // Do something important here.
        }
    }

These handlers receive the corresponding event from the event's target element. Each handler's context is set to the event target element as well (that is, `this` within an event handler references its target element). 

#### Binding the event handlers

After the page is loaded, call `assignAutoboundEventHandlers()` 

    assignAutoboundEventHandlers() 

to bind the handlers to the corresponding events. JavaScript exceptions are thrown if the assigned handlers don't exist in the `autoBoundHandlers` object. 

That's all it takes. The autobound handlers will now react to the assigned events. 

#### assignAutoboundEventHandlers function full source

    assignAutoboundEventHandlers = function() {
        convertToArray = function (str, delimiter = ',') {
            if (str === null) {
                throw `convertToArray() failed with null 'str' argument`;
            }
            return str.split(delimiter).map(arg => arg.trim());
        }

        const actionElements = Array.from(document.querySelectorAll('*[data-events]'));

        actionElements.forEach(element => {
            confirmFunctionsExist = function(functions) {
                functions.map(fn => {
                    if (autoboundEventHandlers[fn] === null ||
                        typeof autoboundEventHandlers[fn] !== 'function') {
                        throw `This autobound handler was not found: ${fn}`;
                    }
                })
            }
            assignElementEventHandlers = function(events) {
                events.map((event, index) => {
                    element.addEventListener(event, (e) => {
                        const handlerName = functions[index];
                        autoboundEventHandlers[handlerName].call(element, e);
                    });
                })
            }        

            const events = convertToArray(element.getAttribute('data-events'));
            const functions = convertToArray(element.getAttribute('data-handlers'));

            confirmFunctionsExist(functions);
            assignElementEventHandlers(events);
        })
    }    

#### How assignAutoboundEventHandlers works    

assignAutoboundEventHandlers has just a few main areas: 

* The `convertToArray()` function converts a comma-delimited string to an array. The delimiter is an optional second argument.

* `actionElements` is an array of HTML elements that have a `data-events` attribute.

* A `forEach` iterates over each element to assign event the event handlers. Inside that loop: 

    * `confirmFunctionsExist()` confirms that each function listed in the `data-handlers` attribute is a function in the `autoEventHandlers` object. An exception is thrown for the first one that doesn't exist. 

    * `assignElementEventHandlers()` iterates over each event name specified in the `data-events` attribute and assigns the specified event handler to the specified event. 

    * In `assignElementEventHandlers()` the following line calls the event handler in the `autoboundEventHandlers` object.
    
            autoboundEventHandlers[handlerName].call(element, e);

        JavaScript's `call` is used so that the target element is passed as the context of the event handler.         

#### Interesting Javascript things at work

* In the `convertToArray()` function this line:

        str.split(delimiter).map(arg => arg.trim());

    splits the string on commas and then uses JavaScript's [array map method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to trim each element in the resulting array. A [Javascript arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) passes each array element (called `arg` in this case) into the arrow function to trim the value. Because this is a one-line arrow function (it has no braces) it implicitly returns the entire array (with each element trimmed);

    Arrow functions can be challenging at first but they are worth it. A long time ago I was told by a mentor to think of `=>` as the "goes into" operator. Reading arrow functions as arguments that go into what's on the other side of the `=>` helps quite a bit. 

* Another use of `map` in the `assignElementEventHandlers()` function

    In this case, the arrow function receives each value in the `events` array and the current index. Again, think of this as `event` and `index` going into the function).

        events.map((event, index) => {
            ...
        });

    The index of the current `events` element locates the corresponding function name in the `functions` array.

*  JavaScript template literals

    A message is created for the exceptions thrown with string interpolation using [JavaScript's template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). For example: 

        const greeting = 'Hello';
        console.log(`${greeting}, world`);

    emits

        'Hello, world'

    to the console. With template literals, the string is specified with backticks (\`) not single or double quotation marks and this syntax, `${x}` substitutes a variable value in the resulting string.

* `const` and `let`

    While Javascript's `var` key word may still have merit in some situations, in most cases you should use either [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) or [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) instead. `const` declare a variable for which its value won't change and `let` declares a block-scoped varible for which the value can change.

* Indirectly referencing a member of the `autoboundEventHandlers` object

    Uusually you use the object.member syntax to reference a member of a JavaScript object. For example, this syntax calls the `buttonFocus()` method in the `autoeventHandlers` object:

        autoboundEventHandlers.buttonFocus(); 

    However, you can also reference object members indirectly like this: 

        const fn = 'buttonFocus';
        autoboundEventHandlers[fn]();

    The code above calls the `buttonFocus` method with the function name provided dynamically. An earlier version of this code called the event handlers that way. 
    
    However, it seemed useful to also set the `this` context inside an event hander to the current target element (the element that raised the event). JavaScript's call and apply enable explicitly providing the context for the function being called: 

        autoboundEventHandlers[handlerName].call(element, e);        

    When called like this, you'll notice that `element` isn't in the handler function's argument list. `call` knows it provides context to the function and the argument list starts with the subsequent argument (if provided).