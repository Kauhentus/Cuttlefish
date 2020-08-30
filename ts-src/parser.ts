import nearley from 'nearley';

import { Viewer } from './util/viewer';
import grammar from './util/grammar';

export interface Parser {
    parser: nearley.Parser
    parseTree: any
}

export class Parser {
    constructor(){
        // @ts-ignore
        this.parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        this.parseTree;
    }

    parseProgram(rawProgram : string, view = false){
        this.parser.feed(rawProgram);
        this.parseTree = this.parser.results[0];

        if(view) {
            new Viewer('Program', this.parseTree).render();

            console.log(this.parser.results.map(v => JSON.stringify(v).length));
        }

        return this.parseTree;
    }
}