"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var ramda = require('ramda');
var closure = function (statements) { return statements.forEach(function (value) {
    if (typeof variable === 'function')
        return value();
    else
        return value;
}); };
var curry = ramda.curry;
var mapWrapper = function (func) { return curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return func(x, b); });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return func(a, x); });
    }
    else {
        return func(a, b);
    }
}); };
var ternary = function (a, b, c) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x ? b : c; });
    }
    else {
        return a ? b : c;
    }
};
// LOGICAL FUNCTIONS
var and = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x && b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a && x; });
    }
    else {
        return a && b;
    }
}), or = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x || b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a || x; });
    }
    else {
        return a || b;
    }
}), xor = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return (x || b) && !(x && b); });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return (x || a) && !(x && a); });
    }
    else {
        return (a || b) && !(a && b);
    }
}), not = function (a) {
    if (a instanceof Map) {
        return a.apply(function (x) { return !x; });
    }
    else {
        return !a;
    }
};
// COMPARISON FUNCTIONS
var greater_than = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x > b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a > x; });
    }
    else {
        return a > b;
    }
}), less_than = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x < b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a < x; });
    }
    else {
        return a < b;
    }
}), less_than_or_equal_to = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x <= b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a <= x; });
    }
    else {
        return a <= b;
    }
}), greater_than_or_equal_to = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x >= b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a >= x; });
    }
    else {
        return a >= b;
    }
}), equals = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x === b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a === x; });
    }
    else {
        return a === b;
    }
}), not_equals = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x !== b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a !== x; });
    }
    else {
        return a !== b;
    }
});
// BASIC MATHEMATICAL FUNCTION
var add = mapWrapper(function (a, b) { return a + b; }), subtract = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x - b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a - x; });
    }
    else {
        return a - b;
    }
}), multiply = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x * b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a * x; });
    }
    else {
        return a * b;
    }
}), divide = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x / b; });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return a / x; });
    }
    else {
        return a / b;
    }
}), modulo = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return x % b; });
    }
    else {
        return a % b;
    }
}), exponentiate = curry(function (a, b) {
    if (a instanceof Map) {
        return a.apply(function (x) { return Math.pow(x, b); });
    }
    else if (b instanceof Map) {
        return b.apply(function (x) { return Math.pow(a, x); });
    }
    else {
        return Math.pow(a, b);
    }
}), negation = function (a) {
    if (a instanceof Map) {
        return a.apply(function (x) { return -x; });
    }
    else {
        return -a;
    }
};
var member_access_bracket = function (parent, child) {
    if (parent instanceof Map) {
        //return parent.value[child];
        if (parent.rank == 0)
            return parent.value[child];
        else {
            //console.log(parent, child)
            var newMap = copy(parent);
            // newMap.rank -= 1;
            return newMap.apply(function (x) { return member_access_bracket(x, child); }).value;
        }
    }
    else {
        return parent[child];
    }
};
var member_access_dot = function (parent, child) { return parent[child]; };
var expression = function (x) { return x; };
var isClass = function (func) { return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func)); };
var isFunction = function (functionToCheck) { return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'; };
var function_call = function (func, args) { return curry(func).apply(void 0, args); };
var copy = function (value) {
    if (value instanceof Map) {
        return new Map(copy(value.value), value.rank);
    }
    else if (value instanceof List) {
        return new Proxy(new List(copy(value.values)), handler_List);
    }
    else if (value instanceof Tuple) {
        return new Proxy(new Tuple(copy(value.values)), handler_Tuple);
    }
    else if (value instanceof Maybe) {
        return new Maybe(value.isJust, copy(value.value));
    }
    else if (Array.isArray(value)) {
        return __spreadArrays(value).map(function (val) { return copy(val); });
    }
    else {
        return value;
    }
};
var Pipeline = /** @class */ (function () {
    function Pipeline(functions) {
        this.functions = functions;
    }
    Pipeline.prototype.pass = function (value) {
        var value_to_pipe = value;
        for (var _i = 0, _a = this.functions; _i < _a.length; _i++) {
            var func = _a[_i];
            value_to_pipe = function_call(func, [value_to_pipe]);
        }
        return value_to_pipe;
    };
    return Pipeline;
}());
var pipeline_creation = function () {
    var functions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        functions[_i] = arguments[_i];
    }
    return new Pipeline(functions);
};
var pipeline_call = mapWrapper(function (pipeline, value) { return pipeline.pass(value); });
var handler_List = {
    get: function (obj, prop) {
        if (!isNaN(prop))
            return obj.values[prop];
        else
            return prop in obj ?
                obj[prop] : undefined;
    }
};
var List = /** @class */ (function () {
    function List(values) {
        this.values = values;
    }
    List.prototype.map = function (func) {
        return new Proxy(new List(this.values.map(function (x) { return func(x); })), handler_List);
    };
    List.prototype.filter = function (func) {
        return new Proxy(new List(this.values.filter(function (x) { return func(x); })), handler_List);
    };
    List.prototype.set = function (location, value) {
        var recursiveCall = function (array, location, value) {
            if (!Array.isArray(location)) {
                array.values[location] = value;
            }
            else if (location.length == 1) {
                array.values[location[0]] = value;
            }
            else {
                recursiveCall(array.values[location.shift()], location, value);
            }
        };
        var newMap = copy(this);
        recursiveCall(newMap, location.values, value);
        return newMap;
    };
    return List;
}());
var handler_Tuple = {
    get: function (obj, prop) {
        if (!isNaN(prop))
            return obj.values[prop];
        else
            return prop in obj ?
                obj[prop] : undefined;
    }
};
var Tuple = /** @class */ (function () {
    function Tuple(values) {
        this.values = values;
    }
    Tuple.prototype.map = function (func) {
        return new Proxy(new Tuple(this.values.map(function (x) { return func(x); })), handler_Tuple);
    };
    Tuple.prototype.filter = function (func) {
        return new Proxy(new Tuple(this.values.filter(function (x) { return func(x); })), handler_Tuple);
    };
    return Tuple;
}());
var Map = /** @class */ (function () {
    function Map(value, rank) {
        this.value = value;
        this.rank = rank;
    }
    Map.prototype.apply = function (func) {
        var recursiveApply = function (array, func, currDepth, reqDepth) {
            var newDepth = currDepth + 1;
            if (newDepth == reqDepth)
                return array.map(function (val) { return func(val); });
            else
                return array.map(function (val) { return recursiveApply(val, func, newDepth, reqDepth); });
        };
        var newValues;
        if (this.rank > 0)
            newValues = recursiveApply(copy(this.value), func, 0, this.rank);
        else
            newValues = func(copy(this.value));
        return new Map(newValues, this.rank);
    };
    Map.prototype.filter = function (func) {
        console.log(this, func);
        var recursiveFilter = function (array, func, currDepth, reqDepth) {
            var newDepth = currDepth + 1;
            console.log(array, newDepth, reqDepth);
            if (newDepth == reqDepth)
                return array.filter(function (val) { return func(val); });
            else
                return array.map(function (val) { return recursiveFilter(val, func, newDepth, reqDepth); });
        };
        var newValues = copy(this.value);
        if (this.rank > 0)
            newValues = recursiveFilter(copy(this.value), func, 0, this.rank);
        return new Map(newValues, this.rank);
    };
    return Map;
}());
var lift_map = function (value, rank) {
    if (value instanceof Map) {
        return new Map(value.value, rank);
    }
    else {
        return new Map(value, rank);
    }
};
var lower_map = function (map) { return map.value; };
var filter = function (map, func) { return map.filter(func); };
var reduce = function (map, func) { return map.reduce(func); };
var Maybe = /** @class */ (function () {
    function Maybe(isJust, value) {
        if (value === void 0) { value = undefined; }
        this.isJust = isJust;
        this.value = value;
    }
    return Maybe;
}());
var fmap = function (func, map) {
    if (map instanceof Map) {
        return map.apply(func);
    }
    else if (map instanceof Maybe) {
        if (map.isJust) {
            return Just(func(map.value));
        }
        else {
            return Nothing();
        }
    }
};
var infix = function (map, func) {
    if (map instanceof Map) {
        return func(copy(map.value));
        // return map.apply(func)
    }
    else if (map instanceof Maybe) {
        if (map.isJust) {
            return func(map.value);
        }
        else {
            return Nothing();
        }
    }
};
var Just = function (value) { return new Maybe(true, value); };
var Nothing = function () { return new Maybe(false); };
var log = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return console.log.apply(console, log_helper.apply(void 0, args));
};
var log_helper = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.map(function (value) {
        if (value instanceof List) {
            return "List: [" + value.values.map(function (val) { return log_helper(val); }).join(', ') + "]";
        }
        else if (value instanceof Tuple) {
            return "Tuple: [" + value.values.map(function (val) { return log_helper(val); }).join(', ') + "]";
        }
        else if (value instanceof Maybe) {
            return "Maybe: (" + (value.isJust ? 'Just' : 'Nothing') + " " + (value.isJust ? log_helper(value.value) : '') + ")";
        }
        else if (value instanceof Map) {
            return "Map<" + value.rank + ">: (" + log_helper(value.value) + ")";
        }
        else {
            return value;
        }
    });
};
var range = function (fst, lst, snd) {
    var array = [];
    var step = fst < lst ?
        (snd ? snd - fst : 1) :
        (snd ? snd - fst : -1);
    if (fst < lst) {
        for (var i = fst; i <= lst; i += step)
            array.push(i);
    }
    else {
        for (var i = fst; i >= lst; i += step)
            array.push(i);
    }
    return new Proxy(new List(array), handler_List);
};
var class_initialization = function (a, b) {
    if (b instanceof Tuple) {
        return new (a.bind.apply(a, __spreadArrays([void 0], b.values)))();
    }
    else {
        return new a(b);
    }
};
