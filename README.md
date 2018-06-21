# topijs

It is a Javascript framework for building Single Page Application. 

Framework contains a set of components for helping in building this kind of application. These components are:
- Router,
- Events managing,
- View Layer, 
- Request manager
- Controller,
- Action,
- Config,
- Components.

These components are working together.

# Motivation

Maybe, You were asking yourself, why someone decided to build other framework for Single Page Application, because there is a lot of available alternatives.

There are three reasons.
First that each framework requires a certain approach from the programmer to the creation process. It is often the case that the problem we want to solve is simpler than the solution. For example, we want to build simple form without two way data binding, but we need to care about that, because framework requires it from us.

Second reason is, that there is a lot libraries, these libraries do great work, but a lot of them, are not compatile with frameworks, so programmers needs to create some bridget, to work with these libraries. Topijs does not require to create some strage thnigs to use libraries.

The third reason was to create it, create your own tool, check your ideas, gain new experiences.

# Start

The framework is at the **development stage**. If you like my ideas - I will gladly accept your help.

For now, I created simple skeleton. So first, clone repositiory https://github.com/ttmdear/topijs.skeleton.

```git clone https://github.com/ttmdear/topijs.skeleton```

Then go to folder with skeleton.

```cd topijs.skeleton```

Then run ```npm install```, after that, you can run ```npm run server```. If everythnigs goes well, you can open http://localhost:9000 to see single page at Topijs.

The main file is ```src/main.js``` at this file, everyting is configured and run.

```javascript
import App from "Topi/App";
import jQuery from "jquery";
import Router from "Topi/Router";
import element from "Topi/Utils/element";
import Api from 'Topi/Api/Api';

// Standard actions
import ActionsIndex from "Actions/Index";
import ActionTodoList from "Actions/Todo/Index.js";
import TopiActionsNotFound from "Topi/Actions/NotFound";
import TopiActionsError from "Topi/Actions/Error";

// Controllers
import ControllerMain from "Controllers/Main.js";

import bootstrap from "bootstrap/dist/css/bootstrap.css";

// styles
require("styles/app.scss");

// element
jQuery(document).ready(function(){
    let app = window.app = new App(jQuery("body"), {
        components : {
            components : {
                "@api" : () => {
                    return new Api("http://api.local/api");
                }
            }
        },
        router : {
            routes : [{
                type : Router.ROUTE_TYPE_INDEX,
                action : "/index",
                controllerClass : ControllerMain,
                actionClass : ActionsIndex,
            },{
                type : Router.ROUTE_TYPE_NOT_FOUND,
                action : "/notFound",
                controllerClass : ControllerMain,
                actionClass : TopiActionsNotFound,
            },{
                type : Router.ROUTE_TYPE_ERROR,
                action : "/error",
                controllerClass : ControllerMain,
                actionClass : TopiActionsError,
            },{
                action : "/todo/list",
                controllerClass : ControllerMain,
                actionClass : ActionTodoList,
            }]
        }
    });

    app.run();
});

```
The most important part is ```App``` class. It is just Topi App. Next, ```jQuery``` is incluede - this library is used to operate on DOM. Then we include ```Router```. Router is resposibled for run actions for defined URN. Below, there is defined components and routes. Each of route has `Action` and `Controller`. If actions have same controllers, then controller is not change during routing bettween actions. Controller is responsible for prepering all page, each action is called, when URN changed.

At this example, there is `ActionTodoList` call, when browser go to `/todo/list` URN.

Now let's see, how `ControllerMain` works.

```javascript
import Controller from 'Topi/Controller';
import View from 'Topi/View';
import templateLayout from 'Controllers/Main.layout.html';

/**
 * Example of controller.
 */
const cn = 'Main';
class Main extends Controller {
    constructor(target) {
        super(target);

        const p = this.private(cn, {
            target,
            view : {
                layout : new View(templateLayout),
            },
            action : null,
        });
    }

    element(name) {
        const p = this.private(cn);

        if (name === undefined) {
            return p.view.layout.element('container');
        }else{
            return p.view.layout.element(name);
        }
    }

    async action(action, params = {}) {
        const p = this.private(cn);

        return new Promise((resolve, reject) => {
            if (p.action != null) {
                p.action.end().then(() => {
                    // clean container
                    p.view.layout.element('container').html('');

                    // run new action
                    p.action = new action();
                    p.action.run(params, this).then(() => {
                        resolve();
                    });
                });
            }else{
                // clean container
                p.view.layout.element('container').html('');

                // run new action
                p.action = new action();
                p.action.run(params, this).then(() => {
                    resolve();
                });
            }
        });
    }

    async run() {
        const p = this.private(cn);

        return new Promise((resolve, reject) => {
            p.view.layout
                .target(p.target)
                .render()
            ;

            resolve();
        });
    }

    async end() {
        return Promise.resolve();
    }
}

export default Main;
```
Maybe you saw, strange line `const cn = "Main";`. This variable is used, when we want to get private scope for object. There is few methods of implementing private variable like using undescore before variable/method `_name`, using symbols etc. At Topi metchanism of private variable is implemented at base object `Topi/Object`. This mechanism using `WeakMap` to stores private variable. So if you need get private scope for some object of specific class, you can get this by `this.private(className)` or just defined variable and use it `this.private(cn)`.

Each controller needs to has implemented methods:
- elemen(name),
- action(action, params = {}),
- run(),
- end().

Method `element()` should return reference to DOM object. `action(action, params = {})` is responsible for run action. At skeleton, this method clean container, then run new action. To be able to look different, everything depends on the application. Method `run()` is responsible of run controller at first time. So if we have few type of controllers at application, then `run()` is called after change controller. Method `end()` is called when controller is change to other and we need to clean things of previous controller.

`run()`, `action()`, `end()`, should return `Promise`. This is due to the fact that we do not know what operations the given counter-controller performs, perhaps they are asynchronous.

Now let's see, how does `ActionTodoList` work.

```javascript
import View from "Topi/View";
import Action from 'Topi/Action';
import ComponentList from 'Views/Todo/List'

import templateLayout from 'Actions/Todo/Index.layout.html';

const cn = 'Index';
class Index extends Action {
    async run(params, controller) {
        let p = this.private(cn),
            router = this.component('@router'),
            view = {}
        ;

        return super.run(params, controller).then(() => {
            view.layout = new View(templateLayout);
            view.layout
                .target(controller.element())
                .render()
            ;

        }).then(() => {
            view.list = new ComponentList({
                items : [{
                    id : 1,
                    name : 'Bring the dog out',
                }, {
                    id : 2,
                    name : 'Meet with the girl.',
                }, {
                    id : 3,
                    name : 'Visit parents',
                }]
            });

            view.list
                .target(view.layout.element('list'))
                .render()
            ;
        });
    }
}

export default Index;
```

Action as controller has `run(params, controller)` method. The purpose of that method is create proper content at controller. At this example, we use simple `View` to create layout of action, then we use `ComponentList` to display todo list. Let's see to `ComponentList`.

```javascript
import View from "Topi/View";
import WidgetInput from "Topi/Views/Widgets/Input";

import templateItems from "Views/Todo/List.items.html";
import templateLayout from "Views/Todo/List.layout.html";

let cn = 'List';
class List extends View {
    constructor(params = {}) {
        super(templateLayout)

        const p = this.private(cn);

        p.ids = 1;

        // We set init value of items.
        this.set("-items", params.items == undefined ? [] : params.items);

        // Next we attach to all event to item.
        // You can also attach to specific event. like items:change, items:init
        this.on("items", (event, params) => {
            // if something happend with items, then I reload the view
            this.reload();
        }, this.id());

        // We use Input Widget
        p.input = new WidgetInput();
        p.input
            .target(this.element('taskName'))
            .render()
        ;

        this.element("add").on("click", (event) => {
            const taskName = p.input.get("value");

            if (taskName != null) {
                let items = this.get("items");

                items.push({
                    id : this._generateId(),
                    name : taskName,
                    done : 0,
                });

                this.set("items", items);

                // Clean value of input
                p.input.set("value", null);
            }
        });

        this.element("clean").on("click", (event) => {
            this.set("items", []);
        });

        this.element("items").on("click", "[type='checkbox']", (event) => {
            const target = this.$(event.currentTarget),
                items = this.get("items")
            ;

            items.find(item => item.id == target.data('id')).done = target.is(":checked") ? 1 : 0;

            this.set("items", items);
        });

        this.element("items").on("click", ".remove", (event) => {
            const target = this.$(event.currentTarget);
            let items = this.get("items");

            items = items.filter(item => item.id != target.data('id'));

            this.set("items", items);
        });
    }

    _generateId() {
        const p = this.private(cn);

        p.ids++;

        while(this.get("&items").find(item => item.id == p.ids) != undefined) {
            p.ids++;
        };

        return p.ids;
    }

    render() {
        super.render();

        const p = this.private(cn);

        // Render is called for example after reload. But you can run render()
        // every time you need.
        // Every View has method element(), this method return reference of
        // object defined at html.

        this.element('title').html(`You have ${this.get("&items").length} tasks. ${this.get("&items").filter(item => item.done).length} is done.`);

        // We use template to render items
        this.element('items').html(this.template(templateItems)(this.data()));
    }
}

export default List;
```

Each component should extends from `View`. View has some methods which help us to build view. Each view should implements `render()` method. The purpose of that method is creating of html. At `constructor` we inject html template of view. This is base html.

```html
<div class="row">
    <div class="col" name="title"></div>
</div>

<div class="row" style="margin-bottom : 10px">
    <div class="col-9" name="taskName"></div>
    <div class="col-3 text-right">
        <button class="btn btn-primary btn-sm" name="add">Add task</button>
        <button class="btn btn-danger btn-sm" name="clean">Clean list</button>
    </div>
</div>

<div class="row">
    <div class="col" name="items"></div>
</div>
```

This html does not change at rerender. This should be more static skeleton of view. At html we can use `name` atttribute to save references to this elements. 

Then at `constructor` we set items list. Each object at Topi extends from `Topi/Object`. This class implements common mechanisms, such as data or event management. So we can use method `set(name, value, params = {})` to set data, and `get(name, params = {})` to get data. We can also use `emit(name, params = {}, emitparams = {})` to emit event, and `on(name, callback, group)` to attach to event. Object data management and combined with events. If any of the data changes, the corresponding event is emitted. At `this.set("-items", params.items == undefined ? [] : params.items);` we set values of items. `-` at begining means that event is not emit `silienty mode`.

```javascript
this.on("items", (event, params) => {
    // if something happend with items, then I reload the view
    this.reload();
}, this.id());
```

Then listen on any event related to items. If something changes in the elements list, it transfers the entire element of the view. At this point, I could call `render ()` however the `reload () method` refreshes the view more effectively. The third parameter is the name of the group to which the event will be assigned. Grouping allows you to manage events in a more manageable way, eg to delete events from a specific group. `this.id()` return unique id of object.

```javascript
p.input = new WidgetInput();
p.input
    .target(this.element('taskName'))
    .render()
;
```
Then I use `WidgetInput` to display input at view. Widget is like View. You can use standard input and put him at html, or use some of widget.

At next few line, I attach to events. `Topi` use `jQuery` as base library to operate on DOM. `this.element()` return `jQuery` reference. Each change of items couse rerender view.

Now, let's look at `render()` method. Here I used two way of creating html. Frist I update static element of view, like `title`. Then I rerender all list of tasks using template.

```html
<table class="table text-center">
    <tr>
        <th>
            #
        </th>
        <th>
            Task
        </th>
        <th>
            Done
        </th>
        <th></th>
    </tr>
{{~ it.items :item :index}}
    <tr>
        <td>
            {{= index+1}}
        </td>
        <td>
            {{= item.name}}
        </td>
        <td>
            <input type="checkbox" data-id="{{= item.id}}" {{? item.done}}checked{{?}}>
        </td>
        <td>
            <button class="btn btn-danger btn-sm remove" data-id="{{= item.id}}">Remove</button>
        </td>
    </tr>
{{~}}
</table>
```

Topis using dot.js library as template engine. Please look at http://olado.github.io/doT/index.html. 