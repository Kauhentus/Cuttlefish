"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transpiler = void 0;
var functionNames = [
    ''
];
var Transpiler = /** @class */ (function () {
    function Transpiler() {
    }
    Transpiler.prototype.transpile = function (AST, language) {
        if (language == 'javascript') {
            return transpileJavascript(AST);
        }
        return "Hello, world!";
    };
    return Transpiler;
}());
exports.Transpiler = Transpiler;
var transpileJavascript = function (AST) {
    return tpU(AST);
};
var tpU = function (AST) {
    var label = AST.label;
    if (label == 'closure') {
        return ("{\n" + AST.statements.map(function (val) { return tpU(val); }).join(';\n') + "\n}");
    }
    else if (label == 'statement') {
        if (AST.type == 'assignment') {
            var variable_name = tpU(AST.variable);
            if (variable_name.split('.')[0] == '(this')
                return tpU(AST.variable) + " = copy(" + tpU(AST.value) + ")";
            return "let " + tpU(AST.variable) + " = copy(" + tpU(AST.value) + ")";
        }
        else if (AST.type == 'expression') {
            return tpU(AST.value);
        }
        else if (AST.type == 'while_block') {
            return "while (" + tpU(AST.conditional) + ") " + tpU(AST.statements);
        }
        else if (AST.type == 'for_block') {
            return "for (" + tpU(AST.iteratee) + " of " + tpU(AST.iterator) + ") " + tpU(AST.statements);
        }
        else if (AST.type == "if_block") {
            if (AST.has_middle_conditionals && AST.has_last_statement) {
                return ("if (" + tpU(AST.first_conditional) + ") " + tpU(AST.first_statement) + "\n" + AST.middle_conditionals.map(function (cond, i) { return "else if (" + tpU(cond) + ") " + tpU(AST.middle_statements[i]); }).join('\n') + "\nelse " + tpU(AST.last_statement));
            }
            else if (AST.has_middle_conditionals && !AST.has_last_statement) {
                return ("if (" + tpU(AST.first_conditional) + ") " + tpU(AST.first_statement) + "\n" + AST.middle_conditionals.map(function (cond, i) { return "else if (" + tpU(cond) + ") " + tpU(AST.middle_statements[i]); }).join('\n'));
            }
            else if (!AST.has_middle_conditionals && AST.has_last_statement) {
                return ("if (" + tpU(AST.first_conditional) + ") " + tpU(AST.first_statement) + "\nelse " + tpU(AST.last_statement));
            }
            else {
                return "if (" + tpU(AST.first_conditional) + ") " + tpU(AST.first_statement);
            }
        }
        else if (AST.type == 'return') {
            return "return " + tpU(AST.value);
        }
        else if (AST.type == 'import_external_statements') {
            var line = "" + AST.modules.map(function (module) {
                if (module.nickname && module.submodule) {
                    return "const " + tpU(module.nickname) + " = require(" + tpU(module.module) + ")." + tpU(module.submodule);
                }
                else if (module.nickname && !module.submodule) {
                    return "const " + tpU(module.nickname) + " = require(" + tpU(module.module) + ")";
                }
                else if (!module.nickname && module.submodule) {
                    return "const " + tpU(module.submodule) + " = require(" + tpU(module.module) + ")." + tpU(module.submodule);
                }
                else {
                    return "const " + tpU(module.module) + " = require(" + tpU(module.module).slice(1, -1) + ")";
                }
            }).join('\n');
            return line;
        }
        else if (AST.type == 'class') {
            var input_args = AST.arguments;
            var input_args_string = void 0;
            if (input_args.type == 'tuple')
                input_args_string = "" + AST.arguments.values.map(function (val) { return tpU(val); });
            else
                input_args_string = tpU(AST.arguments);
            return ("class " + tpU(AST.name) + "{\nconstructor(" + input_args_string + ")" + tpU(AST.statements) + "\n}");
        }
    }
    else if (label == 'function_call') {
        if (AST.function.value == 'member_access_dot') {
            return "(" + tpU(AST.arguments[0]) + "." + tpU(AST.arguments[1]) + ")";
        }
        // return `function_call(${tpU(AST.function)}, [${AST.arguments.map((val : any) => tpU(val))}])`
        return "(" + tpU(AST.function) + "(...[" + AST.arguments.map(function (val) { return tpU(val); }) + "]))";
    }
    else if (label == 'function_creation_lambda') {
        if (AST.arguments.type == 'tuple') {
            return "curry((" + AST.arguments.values.map(function (val) { return tpU(val); }) + ") => " + tpU(AST.value) + ")";
        }
        else if (AST.arguments.type == 'variable') {
            return "(" + tpU(AST.arguments) + " => " + tpU(AST.value) + ")";
        }
    }
    else if (label == 'function_creation_block') {
        if (AST.arguments.type == 'tuple') {
            //return `curry((${AST.arguments.values.map((val : any) => tpU(val))}) => ${tpU(AST.statements)})`
            return "curry(function(" + AST.arguments.values.map(function (val) { return tpU(val); }) + ")" + tpU(AST.statements) + ")";
        }
        else if (AST.arguments.type == 'variable') {
            //return `(${tpU(AST.arguments)} => ${tpU(AST.statements)})`
            return "function(" + tpU(AST.arguments) + ")" + tpU(AST.statements);
        }
    }
    else if (label == 'atom') {
        if (AST.type == 'number') {
            return AST.value.toString();
        }
        else if (AST.type == 'variable') {
            return AST.value;
        }
        else if (AST.type == 'string') {
            return AST.value;
        }
        else if (AST.type == 'boolean') {
            return AST.value ? 'true' : 'false';
        }
        else if (AST.type == 'array') {
            //return `[${AST.values.map((val : any) => tpU(val))}]`
            return "(new Proxy(new List([" + AST.values.map(function (val) { return tpU(val); }) + "]), handler_List))";
        }
        else if (AST.type == 'tuple') {
            return "(new Proxy(new Tuple([" + AST.values.map(function (val) { return tpU(val); }) + "]), handler_List))";
        }
    }
    return 'undefined';
};
