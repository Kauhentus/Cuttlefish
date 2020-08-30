"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
    function id(x) { return x[0]; }
    var lexer = require('../lexer.js').default; // .default because JS and TS imports weird
    var view = function (n) { return console.log(JSON.stringify(n, null, 4)); };
    var wrapVariable = function (name) { return ({
        label: 'atom',
        type: 'variable',
        value: name
    }); };
    var dict = {
        '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide', '%': 'modulo', '**': 'exponentiate',
        '||': 'or', '&&': 'and', '^^': 'xor',
        '>': 'greater_than', '<': 'less_than', '>=': 'greater_than_or_equal_to', '<=': 'less_than_or_equal_to',
        '==': 'equals', '!=': 'not_equals',
    };
    var grammar = {
        Lexer: lexer,
        ParserRules: [
            { "name": "program", "symbols": ["closure"], "postprocess": id },
            { "name": "_$ebnf$1", "symbols": [] },
            { "name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "_", "symbols": ["_$ebnf$1"] },
            { "name": "__$ebnf$1", "symbols": [] },
            { "name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "__$subexpression$1$ebnf$1", "symbols": [(lexer.has("eol") ? { type: "eol" } : eol)] },
            { "name": "__$subexpression$1$ebnf$1", "symbols": ["__$subexpression$1$ebnf$1", (lexer.has("eol") ? { type: "eol" } : eol)], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "__$subexpression$1", "symbols": ["__$subexpression$1$ebnf$1"] },
            { "name": "__$subexpression$1", "symbols": [(lexer.has("dedent") ? { type: "dedent" } : dedent)] },
            { "name": "__", "symbols": ["__$ebnf$1", "__$subexpression$1"] },
            { "name": "closure$ebnf$1", "symbols": [] },
            { "name": "closure$ebnf$1", "symbols": ["closure$ebnf$1", "statement"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "closure", "symbols": ["closure$ebnf$1"], "postprocess": function (data) { return ({
                    label: 'closure',
                    statements: data[0]
                }); }
            },
            { "name": "statement", "symbols": ["expression", "__"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'expression',
                    value: data[0]
                }); }
            },
            { "name": "statement", "symbols": ["ASSIGNMENT", "__"], "postprocess": id },
            { "name": "statement", "symbols": ["IMPORT", "__"], "postprocess": id },
            { "name": "statement", "symbols": ["EXPORT", "__"], "postprocess": id },
            { "name": "statement", "symbols": ["WHILE_BLOCK", "__"], "postprocess": id },
            { "name": "statement", "symbols": ["RETURN", "__"], "postprocess": id },
            { "name": "statement", "symbols": ["CLASS_BLOCK", "__"], "postprocess": id },
            { "name": "IMPORT", "symbols": [{ "literal": "import" }, "_", "IMPORT_STATEMENT"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: "import_statements",
                    modules: [data[2]]
                }); }
            },
            { "name": "IMPORT$ebnf$1$subexpression$1", "symbols": ["_", "IMPORT_STATEMENT", "_", { "literal": "," }] },
            { "name": "IMPORT$ebnf$1", "symbols": ["IMPORT$ebnf$1$subexpression$1"] },
            { "name": "IMPORT$ebnf$1$subexpression$2", "symbols": ["_", "IMPORT_STATEMENT", "_", { "literal": "," }] },
            { "name": "IMPORT$ebnf$1", "symbols": ["IMPORT$ebnf$1", "IMPORT$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "IMPORT", "symbols": [{ "literal": "import" }, "IMPORT$ebnf$1", "_", "IMPORT_STATEMENT"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: "import_statements",
                    modules: __spreadArrays(data[1].map(function (statement) { return statement[1]; }), [
                        data[3]
                    ])
                }); }
            },
            { "name": "IMPORT", "symbols": [{ "literal": "import" }, "_", { "literal": "external" }, "_", "IMPORT_STATEMENT"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: "import_external_statements",
                    modules: [data[4]]
                }); }
            },
            { "name": "IMPORT$ebnf$2$subexpression$1", "symbols": ["_", "IMPORT_STATEMENT", "_", { "literal": "," }] },
            { "name": "IMPORT$ebnf$2", "symbols": ["IMPORT$ebnf$2$subexpression$1"] },
            { "name": "IMPORT$ebnf$2$subexpression$2", "symbols": ["_", "IMPORT_STATEMENT", "_", { "literal": "," }] },
            { "name": "IMPORT$ebnf$2", "symbols": ["IMPORT$ebnf$2", "IMPORT$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "IMPORT", "symbols": [{ "literal": "import" }, "_", { "literal": "external" }, "IMPORT$ebnf$2", "_", "IMPORT_STATEMENT"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: "import_external_statements",
                    modules: __spreadArrays(data[3].map(function (statement) { return statement[1]; }), [
                        data[5]
                    ])
                }); }
            },
            { "name": "IMPORT_STATEMENT", "symbols": ["variable"], "postprocess": function (data) { return ({
                    label: "module",
                    module: data[0],
                    nickname: undefined,
                    submodule: undefined
                }); }
            },
            { "name": "IMPORT_STATEMENT", "symbols": ["variable", "_", { "literal": "from" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: "module",
                    module: data[4],
                    nickname: undefined,
                    submodule: data[0]
                }); }
            },
            { "name": "IMPORT_STATEMENT", "symbols": ["expression", "_", { "literal": "as" }, "_", "variable"], "postprocess": function (data) { return ({
                    label: "module",
                    module: data[0],
                    nickname: data[4],
                    submodule: undefined
                }); }
            },
            { "name": "IMPORT_STATEMENT", "symbols": ["variable", "_", { "literal": "from" }, "_", "expression", "_", { "literal": "as" }, "_", "variable"], "postprocess": function (data) { return ({
                    label: "module",
                    module: data[4],
                    nickname: data[8],
                    submodule: data[0]
                }); }
            },
            { "name": "EXPORT", "symbols": [{ "literal": "export" }, "_", "expression", "_", { "literal": "as" }, "_", "variable"], "postprocess": function (data) { return ({
                    label: 'export',
                    module: data[2],
                    name: data[6],
                    isDefault: false
                }); }
            },
            { "name": "EXPORT", "symbols": [{ "literal": "export" }, "_", { "literal": "default" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'export',
                    module: data[4],
                    name: 'default',
                    isDefault: true
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "+=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment_add',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "-=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment_subtract',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "*=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment_multiply',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "/=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment_divide',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "ASSIGNMENT", "symbols": ["expression", "_", { "literal": "%=" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'assignment_modulo',
                    variable: data[0],
                    value: data[4]
                }); }
            },
            { "name": "RETURN", "symbols": [{ "literal": "return" }, "_", "expression"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'return',
                    value: data[2]
                }); }
            },
            { "name": "CLASS_BLOCK", "symbols": [{ "literal": "class" }, "_", "expression", "_", { "literal": "with" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'class',
                    name: data[2],
                    arguments: data[6],
                    statements: data[12]
                }); }
            },
            { "name": "expression", "symbols": ["LAMBDA"], "postprocess": id },
            { "name": "expression", "symbols": ["DO_BLOCK"], "postprocess": id },
            { "name": "WHILE_BLOCK", "symbols": [{ "literal": "while" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'while_block',
                    conditional: data[2],
                    statements: data[8]
                }); }
            },
            { "name": "WHILE_BLOCK", "symbols": ["FOR_BLOCK"], "postprocess": id },
            { "name": "FOR_BLOCK", "symbols": [{ "literal": "for" }, "_", "expression", "_", { "literal": "in" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'for_block',
                    iteratee: data[2],
                    iterator: data[6],
                    statements: data[12]
                }); }
            },
            { "name": "FOR_BLOCK", "symbols": ["IF_BLOCK"], "postprocess": id },
            { "name": "IF_BLOCK", "symbols": [{ "literal": "if" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'if_block',
                    first_conditional: data[2],
                    first_statement: data[8],
                    has_middle_conditionals: false,
                    middle_conditionals: undefined,
                    middle_statements: undefined,
                    has_last_statement: false,
                    last_statement: undefined,
                }); }
            },
            { "name": "IF_BLOCK", "symbols": [{ "literal": "if" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent), { "literal": "else" }, "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'if_block',
                    first_conditional: data[2],
                    first_statement: data[8],
                    has_middle_conditionals: false,
                    middle_conditionals: undefined,
                    middle_statements: undefined,
                    has_last_statement: true,
                    last_statement: data[16],
                }); }
            },
            { "name": "IF_BLOCK$ebnf$1", "symbols": [] },
            { "name": "IF_BLOCK$ebnf$1$subexpression$1", "symbols": [{ "literal": "elif" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent)] },
            { "name": "IF_BLOCK$ebnf$1", "symbols": ["IF_BLOCK$ebnf$1", "IF_BLOCK$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "IF_BLOCK", "symbols": [{ "literal": "if" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent), "IF_BLOCK$ebnf$1", { "literal": "elif" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'if_block',
                    first_conditional: data[2],
                    first_statement: data[8],
                    has_middle_conditionals: true,
                    middle_conditionals: __spreadArrays(data[10].map(function (value) { return value[2]; }), [
                        data[13]
                    ]),
                    middle_statements: __spreadArrays(data[10].map(function (value) { return value[8]; }), [
                        data[19]
                    ]),
                    has_last_statement: false,
                    last_statement: undefined,
                }); }
            },
            { "name": "IF_BLOCK$ebnf$2$subexpression$1", "symbols": [{ "literal": "elif" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent)] },
            { "name": "IF_BLOCK$ebnf$2", "symbols": ["IF_BLOCK$ebnf$2$subexpression$1"] },
            { "name": "IF_BLOCK$ebnf$2$subexpression$2", "symbols": [{ "literal": "elif" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent)] },
            { "name": "IF_BLOCK$ebnf$2", "symbols": ["IF_BLOCK$ebnf$2", "IF_BLOCK$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "IF_BLOCK", "symbols": [{ "literal": "if" }, "_", "expression", "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure", (lexer.has("dedent") ? { type: "dedent" } : dedent), "IF_BLOCK$ebnf$2", { "literal": "else" }, "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'statement',
                    type: 'if_block',
                    first_conditional: data[2],
                    first_statement: data[8],
                    has_middle_conditionals: true,
                    middle_conditionals: data[10].map(function (value) { return value[2]; }),
                    middle_statements: data[10].map(function (value) { return value[8]; }),
                    has_last_statement: true,
                    last_statement: data[17],
                }); }
            },
            { "name": "DO_BLOCK", "symbols": [{ "literal": "with" }, "_", "expression", "_", { "literal": "do" }, "_", { "literal": ":" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "closure"], "postprocess": function (data) { return ({
                    label: 'function_creation_block',
                    arguments: data[2],
                    statements: data[10]
                }); }
            },
            { "name": "DO_BLOCK", "symbols": ["PIPELINE_BLOCK"], "postprocess": id },
            { "name": "PIPELINE_BLOCK$ebnf$1", "symbols": [] },
            { "name": "PIPELINE_BLOCK$ebnf$1", "symbols": ["PIPELINE_BLOCK$ebnf$1", "statement"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "PIPELINE_BLOCK", "symbols": [{ "literal": "{" }, "_", (lexer.has("eol") ? { type: "eol" } : eol), (lexer.has("indent") ? { type: "indent" } : indent), "PIPELINE_BLOCK$ebnf$1", (lexer.has("dedent") ? { type: "dedent" } : dedent), "_", { "literal": "}" }], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('pipeline_creation'),
                    arguments: data[4] // not wrapped in [] because already wrapped by `statement:*`
                }); }
            },
            { "name": "LAMBDA", "symbols": ["LAMBDA", "_", { "literal": "=>" }, "_", "RH_FUNC_CALL"], "postprocess": function (data) { return ({
                    label: 'function_creation_lambda',
                    arguments: data[0],
                    value: data[4]
                }); }
            },
            { "name": "LAMBDA", "symbols": ["RH_FUNC_CALL"], "postprocess": id },
            { "name": "RH_FUNC_CALL", "symbols": ["RH_FUNC_CALL", "_", { "literal": "<-" }, "_", "PIPELINE_CALL"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: data[0],
                    arguments: [data[4]],
                }); }
            },
            { "name": "RH_FUNC_CALL", "symbols": ["PIPELINE_CALL"], "postprocess": id },
            { "name": "PIPELINE_CALL", "symbols": ["PIPELINE_CALL", "_", { "literal": "~" }, "_", "FUNCTION_CALL"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('pipeline_call'),
                    arguments: [data[4], data[0]],
                }); }
            },
            { "name": "PIPELINE_CALL", "symbols": ["PIPELINE_CALL", "_", { "literal": "$" }, "_", "FUNCTION_CALL"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('class_initialization'),
                    arguments: [data[0], data[4]],
                }); }
            },
            { "name": "PIPELINE_CALL", "symbols": ["FUNCTION_CALL"], "postprocess": id },
            { "name": "FUNCTION_CALL$ebnf$1$subexpression$1", "symbols": ["_", "TERNARY"] },
            { "name": "FUNCTION_CALL$ebnf$1", "symbols": ["FUNCTION_CALL$ebnf$1$subexpression$1"] },
            { "name": "FUNCTION_CALL$ebnf$1$subexpression$2", "symbols": ["_", "TERNARY"] },
            { "name": "FUNCTION_CALL$ebnf$1", "symbols": ["FUNCTION_CALL$ebnf$1", "FUNCTION_CALL$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "FUNCTION_CALL", "symbols": ["TERNARY", "FUNCTION_CALL$ebnf$1"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: data[0],
                    arguments: data[1].map(function (values) { return values[1]; })
                }); }
            },
            { "name": "FUNCTION_CALL", "symbols": ["TERNARY"], "postprocess": id },
            { "name": "TERNARY", "symbols": ["LIFTING_FUNCS", "_", { "literal": "?" }, "_", "LIFTING_FUNCS", "_", { "literal": ":" }, "_", "TERNARY"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('ternary'),
                    arguments: [data[0], data[4], data[8]]
                }); }
            },
            { "name": "TERNARY", "symbols": ["LIFTING_FUNCS"], "postprocess": id },
            { "name": "LIFTING_FUNCS", "symbols": ["LIFTING_FUNCS", "_", { "literal": "<$>" }, "_", "FILTER"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('fmap'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LIFTING_FUNCS", "symbols": ["LIFTING_FUNCS", "_", { "literal": "<*>" }, "_", "FILTER"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('amap'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LIFTING_FUNCS", "symbols": ["LIFTING_FUNCS", "_", { "literal": ">>=" }, "_", "FILTER"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('infix'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LIFTING_FUNCS", "symbols": ["FILTER"], "postprocess": id },
            { "name": "FILTER", "symbols": ["FILTER", "_", (lexer.has("double_escape") ? { type: "double_escape" } : double_escape), "_", "LOGIC"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('filter'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "FILTER", "symbols": ["FILTER", "_", (lexer.has("reduce_right") ? { type: "reduce_right" } : reduce_right), "_", "LOGIC"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('foldr'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "FILTER", "symbols": ["FILTER", "_", (lexer.has("reduce_left") ? { type: "reduce_left" } : reduce_left), "_", "LOGIC"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('foldl'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "FILTER", "symbols": ["FILTER", "_", (lexer.has("any") ? { type: "any" } : any), "_", "LOGIC"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('any'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "FILTER", "symbols": ["FILTER", "_", (lexer.has("all") ? { type: "all" } : all), "_", "LOGIC"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('all'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "FILTER", "symbols": ["LOGIC"], "postprocess": id },
            { "name": "LOGIC", "symbols": ["LOGIC", "_", { "literal": "&&" }, "_", "COMPARE"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('and'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LOGIC", "symbols": ["LOGIC", "_", { "literal": "||" }, "_", "COMPARE"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('or'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LOGIC", "symbols": ["LOGIC", "_", { "literal": "^^" }, "_", "COMPARE"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('xor'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LOGIC", "symbols": ["COMPARE"], "postprocess": id },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": ">" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('greater_than'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": "<" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('less_than'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": "<=" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('less_than_or_equal_to'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": ">=" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('greater_than_or_equal_to'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": "==" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('equals'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": "!=" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('not_equals'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["COMPARE", "_", { "literal": "=:" }, "_", "AS"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('is_instanceof'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "COMPARE", "symbols": ["AS"], "postprocess": id },
            { "name": "AS", "symbols": ["AS", "_", { "literal": "+" }, "_", "MDM"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('add'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "AS", "symbols": ["AS", "_", { "literal": "-" }, "_", "MDM"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('subtract'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "AS", "symbols": ["MDM"], "postprocess": id },
            { "name": "MDM", "symbols": ["MDM", "_", { "literal": "*" }, "_", "EXP"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('multiply'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "MDM", "symbols": ["MDM", "_", { "literal": "/" }, "_", "EXP"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('divide'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "MDM", "symbols": ["MDM", "_", { "literal": "%" }, "_", "EXP"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('modulo'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "MDM", "symbols": ["EXP"], "postprocess": id },
            { "name": "EXP", "symbols": ["EXP", "_", { "literal": "**" }, "_", "MEMA_B"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('exponentiate'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "EXP", "symbols": ["MEMA_B"], "postprocess": id },
            { "name": "MEMA_B", "symbols": ["MEMA_B", "_", { "literal": "[" }, "_", "expression", "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('member_access_bracket'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "MEMA_B", "symbols": ["LIFT_MAP"], "postprocess": id },
            { "name": "LIFT_MAP", "symbols": ["LIFT_MAP", "_", { "literal": "'" }, "_", "MEMA_D"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('lift_map'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "LIFT_MAP", "symbols": ["MEMA_D"], "postprocess": id },
            { "name": "MEMA_D", "symbols": ["MEMA_D", "_", { "literal": "." }, "_", "variable"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('member_access_dot'),
                    arguments: [data[0], data[4]]
                }); }
            },
            { "name": "MEMA_D", "symbols": ["UNARY"], "postprocess": id },
            { "name": "UNARY", "symbols": [{ "literal": "!" }, "_", "P"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('not'),
                    arguments: [data[2]]
                }); }
            },
            { "name": "UNARY", "symbols": [{ "literal": "@" }, "_", "P"], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('lower_map'),
                    arguments: [data[2]],
                }); }
            },
            { "name": "UNARY", "symbols": [{ "literal": "(" }, "_", { "literal": "-" }, "_", "P", "_", { "literal": ")" }], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('negation'),
                    arguments: [data[4]],
                }); }
            },
            { "name": "UNARY", "symbols": ["P"], "postprocess": id },
            { "name": "P$subexpression$1", "symbols": [(lexer.has("long_operation") ? { type: "long_operation" } : long_operation)] },
            { "name": "P$subexpression$1", "symbols": [(lexer.has("operation") ? { type: "operation" } : operation)] },
            { "name": "P$subexpression$1", "symbols": [(lexer.has("double_escape") ? { type: "double_escape" } : double_escape)] },
            { "name": "P", "symbols": [{ "literal": "(" }, "_", "expression", "_", "P$subexpression$1", "_", { "literal": ")" }], "postprocess": function (data) {
                    var symbol = data[4][0].value;
                    return {
                        label: 'function_call',
                        function: wrapVariable(dict[symbol]),
                        arguments: [data[2]]
                    };
                }
            },
            { "name": "P", "symbols": [{ "literal": "(" }, "_", "expression", "_", { "literal": ")" }], "postprocess": function (data) { return data[2]; } },
            { "name": "P", "symbols": ["Molecule"], "postprocess": id },
            { "name": "Molecule", "symbols": ["array"], "postprocess": id },
            { "name": "Molecule", "symbols": ["tuple"], "postprocess": id },
            { "name": "Molecule", "symbols": ["Atom"], "postprocess": id },
            { "name": "Atom", "symbols": ["number"], "postprocess": id },
            { "name": "Atom", "symbols": ["variable"], "postprocess": id },
            { "name": "Atom", "symbols": ["string"], "postprocess": id },
            { "name": "Atom", "symbols": ["boolean"], "postprocess": id },
            { "name": "array", "symbols": [{ "literal": "[" }, "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'array',
                    values: []
                }); }
            },
            { "name": "array", "symbols": [{ "literal": "[" }, "_", "expression", "_", { "literal": "," }, "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'array',
                    values: [data[2]]
                }); }
            },
            { "name": "array$ebnf$1$subexpression$1", "symbols": ["_", "expression", "_", { "literal": "," }] },
            { "name": "array$ebnf$1", "symbols": ["array$ebnf$1$subexpression$1"] },
            { "name": "array$ebnf$1$subexpression$2", "symbols": ["_", "expression", "_", { "literal": "," }] },
            { "name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "array", "symbols": [{ "literal": "[" }, "array$ebnf$1", "_", "expression", "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'array',
                    values: __spreadArrays(data[1].map(function (values) { return values[1]; }), [
                        data[3]
                    ])
                }); }
            },
            { "name": "array", "symbols": [{ "literal": "[" }, "_", "expression", "_", { "literal": ".." }, "_", "expression", "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('range'),
                    arguments: [data[2], data[6]]
                }); }
            },
            { "name": "array", "symbols": [{ "literal": "[" }, "_", "expression", "_", { "literal": "," }, "_", "expression", "_", { "literal": ".." }, "_", "expression", "_", { "literal": "]" }], "postprocess": function (data) { return ({
                    label: 'function_call',
                    function: wrapVariable('range'),
                    arguments: [data[2], data[10], data[6]]
                }); }
            },
            { "name": "tuple", "symbols": [{ "literal": "(" }, "_", { "literal": ")" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'tuple',
                    values: []
                }); }
            },
            { "name": "tuple", "symbols": [{ "literal": "(" }, "_", "expression", "_", { "literal": "," }, "_", { "literal": ")" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'tuple',
                    values: [data[2]]
                }); }
            },
            { "name": "tuple$ebnf$1$subexpression$1", "symbols": ["_", "expression", "_", { "literal": "," }] },
            { "name": "tuple$ebnf$1", "symbols": ["tuple$ebnf$1$subexpression$1"] },
            { "name": "tuple$ebnf$1$subexpression$2", "symbols": ["_", "expression", "_", { "literal": "," }] },
            { "name": "tuple$ebnf$1", "symbols": ["tuple$ebnf$1", "tuple$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) { return d[0].concat([d[1]]); } },
            { "name": "tuple", "symbols": [{ "literal": "(" }, "tuple$ebnf$1", "_", "expression", "_", { "literal": ")" }], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'tuple',
                    values: __spreadArrays(data[1].map(function (values) { return values[1]; }), [
                        data[3]
                    ])
                }); }
            },
            { "name": "number", "symbols": [(lexer.has("number") ? { type: "number" } : number)], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'number',
                    value: data[0].value
                }); }
            },
            { "name": "variable", "symbols": [(lexer.has("word") ? { type: "word" } : word)], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'variable',
                    value: data[0].value
                }); }
            },
            { "name": "string", "symbols": [(lexer.has("string") ? { type: "string" } : string)], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'string',
                    value: data[0].value
                }); }
            },
            { "name": "boolean", "symbols": [(lexer.has("boolean") ? { type: "boolean" } : boolean)], "postprocess": function (data) { return ({
                    label: 'atom',
                    type: 'boolean',
                    value: data[0].value == 'true' ? true : false
                }); }
            }
        ],
        ParserStart: "program"
    };
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = grammar;
    }
    else {
        window.grammar = grammar;
    }
})();
