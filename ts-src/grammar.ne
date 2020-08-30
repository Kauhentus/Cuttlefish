@{%
    const lexer = require('../lexer.js').default; // .default because JS and TS imports weird

    const view = n => console.log(JSON.stringify(n, null, 4))
    const wrapVariable = name => ({
        label: 'atom',
        type: 'variable',
        value: name
    });

    const dict = {
        '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide', '%': 'modulo', '**': 'exponentiate',
        '||': 'or', '&&': 'and', '^^': 'xor',
        '>': 'greater_than', '<': 'less_than', '>=': 'greater_than_or_equal_to', '<=': 'less_than_or_equal_to',
        '==': 'equals', '!=': 'not_equals',
    }
%}

@lexer lexer

program -> closure {% id %}

_ -> %ws:*

__ -> %ws:* (%eol:+ | %dedent)

closure -> statement:* {%
    data => ({
        label: 'closure',
        statements: data[0]
    })
%}

statement -> 
    expression __ {%
        data => ({
            label: 'statement',
            type: 'expression',
            value: data[0]
        })
    %}
    | ASSIGNMENT __ {% id %}
    | IMPORT __ {% id %}
    | EXPORT __ {% id %}
    | WHILE_BLOCK __ {% id %}
    | RETURN __ {% id %}
    | CLASS_BLOCK __ {% id %}

IMPORT -> 
    "import" _ IMPORT_STATEMENT {% 
        data => ({
            label: 'statement',
            type: "import_statements",
            modules: [data[2]]
        })
    %}
    | "import" (_ IMPORT_STATEMENT _ ","):+ _ IMPORT_STATEMENT {% 
        data => ({
            label: 'statement',
            type: "import_statements",
            modules: [
                ...data[1].map(statement => statement[1]),
                data[3]
            ]
        })
    %}
    | "import" _ "external" _ IMPORT_STATEMENT {% 
        data => ({
            label: 'statement',
            type: "import_external_statements",
            modules: [data[4]]
        })
    %}
    | "import" _ "external" (_ IMPORT_STATEMENT _ ","):+ _ IMPORT_STATEMENT {% 
        data => ({
            label: 'statement',
            type: "import_external_statements",
            modules: [
                ...data[3].map(statement => statement[1]),
                data[5]
            ]
        })
    %}

IMPORT_STATEMENT -> 
    variable {% 
        data => ({
            label: "module",
            module: data[0],
            nickname: undefined,
            submodule: undefined
        })
    %}
    | variable _ "from" _ expression {%
        data => ({
            label: "module",
            module: data[4],
            nickname: undefined,
            submodule: data[0]
        })
    %}
    | expression _ "as" _ variable {%
        data => ({
            label: "module",
            module: data[0],
            nickname: data[4],
            submodule: undefined
        })
    %}
    | variable _ "from" _ expression _ "as" _ variable {%
        data => ({
            label: "module",
            module: data[4],
            nickname: data[8],
            submodule: data[0]
        })
    %}

EXPORT -> 
    "export" _ expression _ "as" _ variable {% 
        data => ({
            label: 'export',
            module: data[2],
            name: data[6],
            isDefault: false
        })
    %}
    | "export" _ "default" _ expression {% 
        data => ({
            label: 'export',
            module: data[4],
            name: 'default',
            isDefault: true
        })
    %}

ASSIGNMENT -> 
    expression _ "=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment',
            variable: data[0],
            value: data[4]
        })
    %} 
    | expression _ "+=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment_add',
            variable: data[0],
            value: data[4]
        })
    %} 
    | expression _ "-=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment_subtract',
            variable: data[0],
            value: data[4]
        })
    %} 
    | expression _ "*=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment_multiply',
            variable: data[0],
            value: data[4]
        })
    %} 
    | expression _ "/=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment_divide',
            variable: data[0],
            value: data[4]
        })
    %} 
    | expression _ "%=" _ expression {%
        data => ({
            label: 'statement',
            type: 'assignment_modulo',
            variable: data[0],
            value: data[4]
        })
    %} 

RETURN -> "return" _ expression {%
    data => ({
        label: 'statement',
        type: 'return',
        value: data[2]
    })
%}
CLASS_BLOCK -> "class" _ expression _ "with" _ expression _ ":" _ %eol %indent closure {%
    data => ({
        label: 'statement',
        type: 'class',
        name: data[2],
        arguments: data[6],
        statements: data[12]
    })
%}

expression -> 
    LAMBDA {% id %}
    | DO_BLOCK {% id %}

WHILE_BLOCK -> 
    "while" _ expression _ ":" _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'while_block',
            conditional: data[2],
            statements: data[8]
        })
    %}
    | FOR_BLOCK {% id %}

FOR_BLOCK ->
    "for" _ expression _ "in" _ expression _ ":"  _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'for_block',
            iteratee: data[2],
            iterator: data[6],
            statements: data[12]
        })
    %}
    | IF_BLOCK {% id %}

IF_BLOCK ->
    "if" _ expression _ ":" _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'if_block',
            first_conditional: data[2],
            first_statement: data[8],

            has_middle_conditionals: false,
            middle_conditionals: undefined,
            middle_statements: undefined,

            has_last_statement: false,
            last_statement: undefined,
        })
    %}
    | "if" _ expression _ ":" _ %eol %indent closure %dedent
      "else" _ ":" _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'if_block',
            first_conditional: data[2],
            first_statement: data[8],

            has_middle_conditionals: false,
            middle_conditionals: undefined,
            middle_statements: undefined,

            has_last_statement: true,
            last_statement: data[16],
        })
    %}
    | "if" _ expression _ ":" _ %eol %indent closure %dedent
      ("elif" _ expression _ ":" _ %eol %indent closure %dedent):*
      "elif" _ expression _ ":" _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'if_block',
            first_conditional: data[2],
            first_statement: data[8],

            has_middle_conditionals: true,
            middle_conditionals: [
                ...data[10].map(value => value[2]),
                data[13]
            ],
            middle_statements: [
                ...data[10].map(value => value[8]),
                data[19]
            ],

            has_last_statement: false,
            last_statement: undefined,
        })
    %}
    | "if" _ expression _ ":" _ %eol %indent closure %dedent
      ("elif" _ expression _ ":" _ %eol %indent closure %dedent):+
      "else" _ ":" _ %eol %indent closure {%
        data => ({
            label: 'statement',
            type: 'if_block',
            first_conditional: data[2],
            first_statement: data[8],

            has_middle_conditionals: true,
            middle_conditionals: data[10].map(value => value[2]),
            middle_statements: data[10].map(value => value[8]),

            has_last_statement: true,
            last_statement: data[17],
        })
    %}

DO_BLOCK -> 
    "with" _ expression _ "do" _ ":" _ %eol %indent closure {%
        data => ({
            label: 'function_creation_block',
            arguments: data[2],
            statements: data[10]
        })
    %} 
    | PIPELINE_BLOCK {% id %}

PIPELINE_BLOCK -> "{" _ %eol %indent statement:* %dedent _ "}" {%
    data => ({
        label: 'function_call',
        function: wrapVariable('pipeline_creation'),
        arguments: data[4]  // not wrapped in [] because already wrapped by `statement:*`
    })
%}

LAMBDA ->
    LAMBDA _ "=>" _ RH_FUNC_CALL {%
        data => ({
            label: 'function_creation_lambda',
            arguments: data[0],
            value: data[4]
        })
    %}
    | RH_FUNC_CALL {% id %}

RH_FUNC_CALL -> RH_FUNC_CALL _ "<-" _ PIPELINE_CALL {%
        data => ({
            label: 'function_call',
            function: data[0],
            arguments: [data[4]],
        })
    %}
    | PIPELINE_CALL {% id %}

PIPELINE_CALL -> 
    PIPELINE_CALL _ "~" _ FUNCTION_CALL {%
        data => ({
            label: 'function_call',
            function: wrapVariable('pipeline_call'),
            arguments: [data[4], data[0]],
        })
    %}
    | PIPELINE_CALL _ "$" _ FUNCTION_CALL {%
        data => ({
            label: 'function_call',
            function: wrapVariable('class_initialization'),
            arguments: [data[0], data[4]],
        })
    %}
    | FUNCTION_CALL {% id %}

FUNCTION_CALL -> 
    TERNARY (_ TERNARY):+ {%
        data => ({
            label: 'function_call',
            function: data[0],
            arguments: data[1].map(values => values[1])
        })
    %}
    | TERNARY {% id %}

TERNARY ->
    LIFTING_FUNCS _ "?" _ LIFTING_FUNCS _ ":" _ TERNARY {%
        data => ({
            label: 'function_call',
            function: wrapVariable('ternary'),
            arguments: [data[0], data[4], data[8]]
        })
    %}
    | LIFTING_FUNCS {% id %}

LIFTING_FUNCS ->
    LIFTING_FUNCS _ "<$>" _ FILTER {%
        data => ({
            label: 'function_call',
            function: wrapVariable('fmap'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LIFTING_FUNCS _ "<*>" _ FILTER {%
        data => ({
            label: 'function_call',
            function: wrapVariable('amap'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LIFTING_FUNCS _ ">>=" _ FILTER {%
        data => ({
            label: 'function_call',
            function: wrapVariable('infix'),
            arguments: [data[0], data[4]] 
        })
    %}
    | FILTER {% id %}

FILTER -> 
    FILTER _ %double_escape _ LOGIC {%
        data => ({
            label: 'function_call',
            function: wrapVariable('filter'),
            arguments: [data[0], data[4]] 
        })
    %}
    | FILTER _ %reduce_right _ LOGIC {%
        data => ({
            label: 'function_call',
            function: wrapVariable('foldr'),
            arguments: [data[0], data[4]] 
        })
    %}
    | FILTER _ %reduce_left _ LOGIC {%
        data => ({
            label: 'function_call',
            function: wrapVariable('foldl'),
            arguments: [data[0], data[4]] 
        })
    %}
    | FILTER _ %any _ LOGIC {%
        data => ({
            label: 'function_call',
            function: wrapVariable('any'),
            arguments: [data[0], data[4]] 
        })
    %}
    | FILTER _ %all _ LOGIC {%
        data => ({
            label: 'function_call',
            function: wrapVariable('all'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LOGIC {% id %}

LOGIC -> 
    LOGIC _ "&&" _ COMPARE {%
        data => ({
            label: 'function_call',
            function: wrapVariable('and'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LOGIC _ "||" _ COMPARE {%
        data => ({
            label: 'function_call',
            function: wrapVariable('or'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LOGIC _ "^^" _ COMPARE {%
        data => ({
            label: 'function_call',
            function: wrapVariable('xor'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE {% id %}

COMPARE ->
    COMPARE _ ">" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('greater_than'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ "<" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('less_than'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ "<=" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('less_than_or_equal_to'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ ">=" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('greater_than_or_equal_to'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ "==" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('equals'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ "!=" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('not_equals'),
            arguments: [data[0], data[4]] 
        })
    %}
    | COMPARE _ "=:" _ AS {%
        data => ({
            label: 'function_call',
            function: wrapVariable('is_instanceof'),
            arguments: [data[0], data[4]] 
        })
    %}
    | AS {% id %}

AS -> 
    AS _ "+" _ MDM {%
        data => ({
            label: 'function_call',
            function: wrapVariable('add'),
            arguments: [data[0], data[4]] 
        })
    %}
    | AS _ "-" _ MDM {%
        data => ({
            label: 'function_call',
            function: wrapVariable('subtract'),
            arguments: [data[0], data[4]] 
        })
    %}
    | MDM {% id %}

MDM -> 
    MDM _ "*" _ EXP {%
        data => ({
            label: 'function_call',
            function: wrapVariable('multiply'),
            arguments: [data[0], data[4]] 
        })
    %}
    | MDM _ "/" _ EXP {%
        data => ({
            label: 'function_call',
            function: wrapVariable('divide'),
            arguments: [data[0], data[4]] 
        })
    %}
    | MDM _ "%" _ EXP {%
        data => ({
            label: 'function_call',
            function: wrapVariable('modulo'),
            arguments: [data[0], data[4]] 
        })
    %}
    | EXP {% id %}

EXP ->
    EXP _ "**" _ MEMA_B {%
        data => ({
            label: 'function_call',
            function: wrapVariable('exponentiate'),
            arguments: [data[0], data[4]] 
        })
    %}
    | MEMA_B {% id %}

MEMA_B -> 
    MEMA_B _ "[" _ expression _ "]" {%
        data => ({
            label: 'function_call',
            function: wrapVariable('member_access_bracket'),
            arguments: [data[0], data[4]] 
        })
    %}
    | LIFT_MAP {% id %}

LIFT_MAP -> 
    LIFT_MAP _ "'" _ MEMA_D {%
        data => ({
            label: 'function_call',
            function: wrapVariable('lift_map'),
            arguments: [data[0], data[4]]
        })
    %}
    | MEMA_D {% id %}

MEMA_D -> 
    MEMA_D _ "." _ variable {%
        data => ({
            label: 'function_call',
            function: wrapVariable('member_access_dot'),
            arguments: [data[0], data[4]] 
        })
    %}
    | UNARY {% id %}

UNARY ->
    "!" _ P {%
        data => ({
            label: 'function_call',
            function: wrapVariable('not'),
            arguments: [data[2]] 
        })
    %}
    | "@" _ P {%
        data => ({
            label: 'function_call',
            function: wrapVariable('lower_map'),
            arguments: [data[2]],
        })
    %}
    | "(" _ "-" _ P _ ")" {%
        data => ({
            label: 'function_call',
            function: wrapVariable('negation'),
            arguments: [data[4]],
        })
    %}
    | P {% id %}


P -> 
    "(" _ expression _ (%long_operation | %operation | %double_escape) _ ")" {% 
        data => {
            const symbol = data[4][0].value;
            return {
                label: 'function_call',
                function: wrapVariable(dict[symbol]),
                arguments: [data[2]]
            }
        }
    %}
    | "(" _ expression _ ")" {% data => data[2] %}
    | Molecule {% id %}

Molecule -> 
    array {% id %}
    | tuple {% id %}
    | Atom {% id %}

Atom -> 
    number {% id %}
    | variable {% id %}
    | string {% id %}
    | boolean {% id %}


# Primitives

array -> 
    "[" _ "]" {%
        data => ({
            label: 'atom',
            type: 'array',
            values: []
        })
    %}
    | "[" _ expression _ "," _ "]" {%
        data => ({
            label: 'atom',
            type: 'array',
            values: [data[2]]
        })
    %}
    | "[" (_ expression _ ","):+ _ expression _ "]" {%
        data => ({
            label: 'atom',
            type: 'array',
            values: [
                ...data[1].map(values => values[1]),
                data[3]
            ]
        })
    %}
    | "[" _ expression _ ".." _ expression _ "]" {%
        data => ({
            label: 'function_call',
            function: wrapVariable('range'),
            arguments: [data[2], data[6]]
        })
    %}
    | "[" _ expression _ "," _ expression _ ".." _ expression _ "]" {%
        data => ({
            label: 'function_call',
            function: wrapVariable('range'),
            arguments: [data[2], data[10], data[6]]
        })
    %}

tuple -> 
    "(" _ ")" {%
        data => ({
            label: 'atom',
            type: 'tuple',
            values: []
        })
    %}
    | "(" _ expression _ "," _ ")" {%
        data => ({
            label: 'atom',
            type: 'tuple',
            values: [data[2]]
        })
    %}
    | "(" (_ expression _ ","):+ _ expression _ ")" {%
        data => ({
            label: 'atom',
            type: 'tuple',
            values: [
                ...data[1].map(values => values[1]),
                data[3]
            ]
        })
    %}

number -> %number {%
    data => ({
        label: 'atom',
        type: 'number',
        value: data[0].value
    })
%}

variable -> %word {%
    data => ({
        label: 'atom',
        type: 'variable',
        value: data[0].value
    })
%}

string -> %string {%
    data => ({
        label: 'atom',
        type: 'string',
        value: data[0].value
    })
%}

boolean -> %boolean {%
    data => ({
        label: 'atom',
        type: 'boolean',
        value: data[0].value == 'true' ? true : false
    })
%}