import ramda from 'ramda';

const functionNames = [
    ''
]

export interface Transpiler {
    transpile(AST : any, language : string): string
}

export class Transpiler {
    constructor(){

    }

    transpile(AST : any, language : string) : string {
        if(language == 'javascript') {
            return transpileJavascript(AST);
        }
        return "Hello, world!"
    }
}

const transpileJavascript = (AST : any) : string => {
    return tpU(AST)
}

const tpU = (AST : any) : string => {
    const label : string = AST.label;

    if(label == 'closure'){
        return (
`{
${AST.statements.map((val : any) => tpU(val)).join(';\n')}
}`);
    } else if(label == 'statement'){
        if(AST.type == 'assignment'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = copy(${tpU(AST.value)})`;
            return `let ${tpU(AST.variable)} = copy(${tpU(AST.value)})`;
        }
        else if(AST.type == 'assignment_add'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = add(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
            return `${tpU(AST.variable)} = add(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
        }  
        else if(AST.type == 'assignment_subtract'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = subtract(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
            return `let ${tpU(AST.variable)} = subtract(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
        }  
        else if(AST.type == 'assignment_multiply'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = multiply(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
            return `let ${tpU(AST.variable)} = multiply(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
        }  
        else if(AST.type == 'assignment_divide'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = divide(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
            return `let ${tpU(AST.variable)} = divide(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
        }  
        else if(AST.type == 'assignment_modulo'){
            let variable_name = tpU(AST.variable);
            if(variable_name.split('.')[0] == '(this') return `${tpU(AST.variable)} = modulo(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
            return `let ${tpU(AST.variable)} = modulo(${tpU(AST.variable)},copy(${tpU(AST.value)}))`;
        }  
        
        else if(AST.type == 'expression'){
            return tpU(AST.value);
        }

        else if(AST.type == 'while_block'){
            return `while (${tpU(AST.conditional)}) ${tpU(AST.statements)}`;
        }
    
        else if(AST.type == 'for_block'){
            return `for (let ${tpU(AST.iteratee)} of ${tpU(AST.iterator)}) ${tpU(AST.statements)}`;
        }

        else if(AST.type == "if_block"){
            if(AST.has_middle_conditionals && AST.has_last_statement){
                return (
`if (${tpU(AST.first_conditional)}) ${tpU(AST.first_statement)}
${AST.middle_conditionals.map((cond : any, i : number) => `else if (${tpU(cond)}) ${tpU(AST.middle_statements[i])}`).join('\n')}
else ${tpU(AST.last_statement)}`)
            }

            else if(AST.has_middle_conditionals && !AST.has_last_statement){
                return (
`if (${tpU(AST.first_conditional)}) ${tpU(AST.first_statement)}
${AST.middle_conditionals.map((cond : any, i : number) => `else if (${tpU(cond)}) ${tpU(AST.middle_statements[i])}`).join('\n')}`)
            }

            else if(!AST.has_middle_conditionals && AST.has_last_statement){
                return (
`if (${tpU(AST.first_conditional)}) ${tpU(AST.first_statement)}
else ${tpU(AST.last_statement)}`)
            }

            else {
                return `if (${tpU(AST.first_conditional)}) ${tpU(AST.first_statement)}`
            }
        }

        else if(AST.type == 'return'){
            return `return ${tpU(AST.value)}`
        }

        else if(AST.type == 'import_external_statements'){
            const line = `${AST.modules.map((module : any) => {
                if(module.nickname && module.submodule){
                    return `const ${tpU(module.nickname)} = require(${tpU(module.module)}).${tpU(module.submodule)}`;
                }

                else if(module.nickname && !module.submodule) {
                    return `const ${tpU(module.nickname)} = require(${tpU(module.module)})`;
                }

                else if(!module.nickname && module.submodule) {
                    return `const ${tpU(module.submodule)} = require(${tpU(module.module)}).${tpU(module.submodule)}`;
                }

                else {
                    return `const ${tpU(module.module)} = require(${tpU(module.module).slice(1,-1)})`
                }
            }).join('\n')}`

            return line;
        }

        else if(AST.type == 'class'){
            let input_args = AST.arguments;
            let input_args_string;
            if(input_args.type == 'tuple') input_args_string = `${AST.arguments.values.map((val : any) => tpU(val))}`
            else input_args_string = tpU(AST.arguments);

            return (
`class ${tpU(AST.name)}{
constructor(${input_args_string})${tpU(AST.statements)}
}`);
        }
    } 
    
    else if (label == 'function_call') {
        if(AST.function.value == 'member_access_dot'){
            return `(${tpU(AST.arguments[0])}.${tpU(AST.arguments[1])})`
        } else if(
            AST.arguments.length == 1 &&
            AST.arguments[0].type == 'tuple' &&
            AST.arguments[0].values.length == 0
        ) {
            return `(${tpU(AST.function)}())`
        }

       return `(${tpU(AST.function)}(...[${AST.arguments.map((val : any) => tpU(val))}]))`
    } 

    else if (label == 'function_creation_lambda'){
        if(AST.arguments.type == 'tuple'){
            return `curry((${AST.arguments.values.map((val : any) => tpU(val))}) => ${tpU(AST.value)})`
        } else if (AST.arguments.type == 'variable'){
            return `(${tpU(AST.arguments)} => ${tpU(AST.value)})`
        }  
    } 

    else if(label == 'function_creation_block'){
        if(AST.arguments.type == 'tuple'){
            //return `curry((${AST.arguments.values.map((val : any) => tpU(val))}) => ${tpU(AST.statements)})`
            return `curry(function(${AST.arguments.values.map((val : any) => tpU(val))})${tpU(AST.statements)})`
        } else if (AST.arguments.type == 'variable'){
            //return `(${tpU(AST.arguments)} => ${tpU(AST.statements)})`
            return `function(${tpU(AST.arguments)})${tpU(AST.statements)}`
        }  
    }
    
    else if(label == 'atom'){
        if(AST.type == 'number'){
            return `${AST.value}`;
        } 
        
        else if(AST.type == 'variable'){
            return AST.value;
        } 
        
        else if(AST.type == 'string'){
            return `${AST.value}`;
        } 

        else if(AST.type == 'boolean'){
            return `${AST.value}`;
        }
        
        else if(AST.type == 'array'){
            //return `[${AST.values.map((val : any) => tpU(val))}]`
            return `(List(...[${AST.values.map((val : any) => tpU(val))}]))`
        }

        else if(AST.type == 'tuple'){
            return `(Tuple(...[${AST.values.map((val : any) => tpU(val))}]))`
        }
    }
    
    return 'undefined';
}