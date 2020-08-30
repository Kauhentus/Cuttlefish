const ramda = require('ramda');
const { isPrimitive } = require('util');

const closure = statements => statements.forEach(value => {
    if (typeof variable === 'function') return value();
    else return value
});

/* *****************************************

Transpiling Helper Functions

***************************************** */

const curry = ramda.curry;

// A -> bool
const isSimpleAtom = obj => (obj instanceof Number) || (obj instanceof String) || (obj instanceof Boolean)

// A -> A
const copy = obj => {
    if(isSimpleAtom(obj)){
        return obj;
    }

    else if(obj instanceof CList)  {
        return List(...copy(obj.internal_array))
    }

    else if(obj instanceof CMaybe){
        if(obj instanceof CMaybeJust) {
            return Just(copy(obj.value));
        } else {
            return Nothing();
        }
    } else if(obj instanceof CMap){
        return new CMap(copy(obj.value), obj.rank)
    }

    else {
        return obj;
    }
}

// (any) -> ()
const log = (...objs) => console.log(...objs.map(obj => log_gen(obj)));
// any -> Str
const log_gen = obj => {
    if(isSimpleAtom(obj)) {
        return `${obj}`;
    }

    else if(obj instanceof CList) {
        return `List: [${obj.internal_array.map(value => log_gen(value)).join(', ')}]`;
    }

    else if(obj instanceof CMaybe){
        if(obj instanceof CMaybeJust) {
            return `Just ${log_gen(obj.value)}`
        } else {
            return `Nothing`;
        }
    } else if(obj instanceof CMap){
        return `Map<${obj.rank}>: (${log_gen(obj.value)})`;
    }
    
    else {
        return obj;
    }
}

/* *****************************************

OPERATORS

***************************************** */

// Prim -> Prim -> (A -> A -> A) -> Prim
const wrapFuncBi = func => curry((a, b) => {
    if(a instanceof CMap){
        return a.apply(x => func(x, b))
    } else if(b instanceof CMap){
        return b.apply(x => func(a, x))
    }
    else return func(a, b)
});
// Prim -> (A -> A) -> Prim
const wrapFuncUn = func => a => {
    if(a instanceof CMap){
        return a.apply(x => func(x))
    }

    else return func(a)
};

// Prim = Num | Str | Bool
// Prim -> A -> A -> A
const ternary = curry((a, b, c) => {
    if(a instanceof CMap){
        return a.apply(x => x ? b : c)
    }

    else return a ? b : c;
})

// Prim -> Prim -> Prim
// Prim -> Prim
const and = wrapFuncBi((a, b) => a && b);
const or = wrapFuncBi((a, b) => a || b);
const xor = wrapFuncBi((a, b) => (a || b) && !(a && b));
const not = wrapFuncUn(a => !a)

const greater_than = wrapFuncBi((a, b) => a > b);
const less_than = wrapFuncBi((a, b) => a < b);
const less_than_or_equal_to = wrapFuncBi((a, b) => a <= b);
const greater_than_or_equal_to = wrapFuncBi((a, b) => a >= b);
const equals = wrapFuncBi((a, b) => a === b);
const not_equals = wrapFuncBi((a, b) => a !== b);

const add = wrapFuncBi((a, b) => a + b);
const subtract = wrapFuncBi((a, b) => a - b);
const multiply = wrapFuncBi((a, b) => a * b);
const divide = wrapFuncBi((a, b) => a / b);
const modulo = wrapFuncBi((a, b) => a % b);
const exponentiate = wrapFuncBi((a, b) => a ** b);
const negation = wrapFuncUn(a => -a);

// Num -> Num -> Num? -> CList Num 
const range = (fst, lst, snd) => {
    let array = [];
    let step = fst < lst ?
        (snd ? snd - fst : 1) :
        (snd ? snd - fst: -1);

    if(fst < lst) {
        for(let i = fst; i <= lst; i += step) array.push(i);
    } else {
        for(let i = fst; i >= lst; i += step) array.push(i);
    }
    return List(...array);
}

/* *****************************************

Function Shenanigans

***************************************** */

// CList A -> (Num | Str) -> A
const member_access_bracket = (obj, index) => {
    if(obj instanceof CMap){
        return lower_map(obj.apply(x => x[index]));
    }

    else return obj[index]
};

// A -> (any) -> A
const class_initialization = (constructor, input) => {
    if(input instanceof CTuple){
        return new constructor(...input.internal_array)
    } else {
        return new constructor(input)
    }
}

const is_instanceof = wrapFuncBi((obj, class_type) => {
    if(obj !== Object(obj)){
        return obj.constructor === class_type;
    }
    return obj instanceof class_type
});

class Pipeline {
    constructor(functions){
        this.functions = functions;
    }

    pass(value){
        let value_to_pipe = value;
        for(let func of this.functions){
            value_to_pipe = func(value_to_pipe)
        }
        return value_to_pipe;
    }
}
// (A -> A)[] -> Pipeline A
const pipeline_creation = (...functions) => new Pipeline(functions);
// Pipeline A -> A -> A
const pipeline_call = wrapFuncBi((pipeline, value) => pipeline.pass(value));

/* *****************************************

Contexts

***************************************** */

// (A -> A) -> M A -> M A
const fmap = (func, monad) => {
    if(monad instanceof CMaybe){
        if(monad instanceof CMaybeNothing){
            return Nothing();
        } else {
            return Just(func(copy(monad.value)));
        }
    } else if(monad instanceof CMap){
        return monad.apply(func)
    }
};
// M (A -> A) -> M A -> M A
const amap = (monad_func, monad) => {
    if(monad instanceof CMaybe){
        if(
            monad instanceof CMaybeNothing ||
            monad_func instanceof CMaybeNothing
        ) {
            return Nothing();
        } else {
            return Just(monad_func.value(copy(monad.value)))
        }
    } else if(monad instanceof CMap){
        return monad.apply(copy(monad_func.value))
    }
};
// M A -> (A -> M A) -> M A
const infix = (monad, func) => {
    if(monad instanceof CMaybe){
        if(monad instanceof CMaybeNothing){
            return Nothing();
        } else {
            return func(copy(monad.value));
        }
    } else if(monad instanceof CMap){
        return func(copy(monad.value))
    }
};

class CMaybe {};
class CMaybeJust extends CMaybe {
    constructor(value){
        super();
        this.value = value;
    }
}
class CMaybeNothing extends CMaybe {
    constructor(){
        super();
    }
};
// A -> CMaybe A
const Just = obj => new CMaybeJust(obj);
const Nothing = () => new CMaybeNothing();
const Try = func => {
    let value;

    try {
        value = Just(func());
    } catch (e) {
        value = Nothing();
    }

    return value;
}

const recursive_helper = internal_func => (array, curDepth, finDepth) => {
    if(curDepth === finDepth){
        return internal_func(array);
    } else {
        return array.map(x => recursive_helper(internal_func)(x, curDepth + 1, finDepth));
    }
}
class CMap {
    constructor(value, rank){
        this.value = value;
        this.rank = rank;
    }

    apply(func){
        if(this.rank == 0) return new CMap(func(copy(this.value)), this.rank);
        
        const recursive_apply = (array, curDepth, finDepth) => {
            const newDepth = curDepth + 1;

            if(newDepth === finDepth){
                return array.map(x => func(x));
            } else {
                return array.map(x => recursive_apply(x, newDepth, finDepth));
            }
        }

        const new_internal_array = recursive_apply(copy(this.value), 0, this.rank);
        return new CMap(new_internal_array, this.rank);
    }

    filter(func){        
        const filter_recurser = recursive_helper(array => array.filter(x => func(x)));
        const new_internal_array = filter_recurser(copy(this.value), 0, this.rank);
        return new CMap(new_internal_array, this.rank);
    }

    foldl(func){
        const foldl_recurser = recursive_helper(array => array.foldl(func));
        const new_internal_array = foldl_recurser(copy(this.value), 0, this.rank);
        if(this.rank == 0) return new_internal_array;
        else return new CMap(new_internal_array, this.rank - 1);
    }

    foldr(func){
        const foldr_recurser = recursive_helper(array => array.foldr(func));
        const new_internal_array = foldr_recurser(copy(this.value), 0, this.rank);
        if(this.rank == 0) return new_internal_array;
        else return new CMap(new_internal_array, this.rank - 1);
    }

    any(func){
        const any_recurser = recursive_helper(array => array.any(func));
        const new_internal_array = any_recurser(copy(this.value), 0, this.rank);
        if(this.rank == 0) return new_internal_array;
        else return new CMap(new_internal_array, this.rank - 1);
    }

    all(func){
        const all_recurser = recursive_helper(array => array.all(func));
        const new_internal_array = all_recurser(copy(this.value), 0, this.rank);
        if(this.rank == 0) return new_internal_array;
        else return new CMap(new_internal_array, this.rank - 1);
    }
}

// A -> Num -> Map<Num> A
const lift_map = (fst, snd) => {
    if(!isNaN(snd)) {
        if(fst instanceof CMap) return new CMap(fst.value, snd)
        else return new CMap(fst, snd);
    } else {
        if(smd instanceof CMap) return new CMap(snd.value, fst)
        else return new CMap(snd, fst);
    }
}
// Map A -> A
const lower_map = obj => {
    if(obj instanceof CMap){
        return obj.value;
    } else if(obj instanceof CMaybeJust){
        return obj.value;
    }
    
    return undefined;
}

// Map A -> (A -> Bool) -> Map A
const filter = (map, func) => map.filter(func);
// Map A -> (A -> Bool) -> Map Bool
const any = (map, func) => map.any(func);
const all = (map, func) => map.all(func);

// Map A -> (A -> A -> A) -> A
const foldl = (map, func) => map.foldl(func);
const foldr = (map, func) => map.foldr(func);

/* *****************************************

Basic Types

***************************************** */

const handler_List = {
    get: function(obj, prop) {
        if(typeof prop === 'symbol') {
            return obj.internal_array[prop]
        }
        else if(!isNaN(prop)) return obj.internal_array[prop]
        else return prop in obj ?
            obj[prop] : undefined;
    }
}
class CList {
    constructor(internal_array){
        this.internal_array = internal_array;
    }

    get length(){
        return this.internal_array.length;
    }

    map(func){
        return List(...this.internal_array.map(func));
    }

    filter(func){
        return List(...this.internal_array.filter(func));
    }

    foldl(func){
        return this.internal_array.reduce(func);
    }
    foldr(func){
        return this.internal_array.reduceRight(func);
    }

    any(func){
        return this.internal_array.some(func)
    }

    all(func){
        return this.internal_array.every(func)
    }

    raw(){
        return this.internal_array;
    }

    set(location, value) {
        let recursiveCall = (array, location, value) => {
            if(!Array.isArray(location)){
                array.internal_array[location] = value;
            } else if(location.length == 1) {
                array.internal_array[location[0]] = value;
            } else {
                recursiveCall(array.internal_array[location.shift()], location, value)
            }
        }

        let newMap = copy(this);
        recursiveCall(newMap, location.internal_array, value);

        return newMap;
    }

    fill(value){
        return List(...this.internal_array.fill(copy(value)));
    }

    join(string){
        return this.internal_array.join(string)
    }
}
// (A) -> CList A
const List = (...values) => {
    if(values.length == 1 && Array.isArray(values[0])) return new Proxy(new CList(values[0]), handler_List)
    return new Proxy(new CList(values), handler_List)
}

const handler_Tuple = {
    get: function(obj, prop) {
        if(typeof prop === 'symbol') {
            return obj.internal_array[prop]
        }
        else if(!isNaN(prop)) return obj.internal_array[prop]
        else return prop in obj ?
            obj[prop] : undefined;
    }
}
class CTuple {
    constructor(internal_array){
        this.internal_array = internal_array;
    }

    map(func){
        return Tuple(...this.internal_array.map(func));
    }

    filter(func){
        return Tuple(...this.internal_array.filter(func));
    }

    raw(){
        return this.internal_array;
    }
}
// (A) -> CTuple A
const Tuple = (...values) =>(new Proxy(new CTuple(values), handler_Tuple)) 

