export interface Viewer {
    name: string,
    object: object

    render(): void
}

export class Viewer {
    constructor(rootName : string, object : object) {
        this.name = rootName;
        this.object = object;
    }

    render() {
        console.log(this.name);

        const stack = (object : any, depth : number, pipeStack = [] as string[]) => {
            const values : string[] = Object.keys(object);

            for (let i = 0; i < values.length; i++) {
                const currentValue : any = object[values[i]];
                const last : boolean = i == values.length - 1;

                const isNode : boolean = Array.isArray(currentValue) || typeof (currentValue) == 'object';
                const isLeafFunction : boolean = !!(currentValue && currentValue.constructor && currentValue.call && currentValue.apply)

                console.log(
                    pipeStack.join('') +
                    (last ? '└─' : '├─') +
                    values[i] + ': ' + (isNode ? '' : (isLeafFunction ? `[Function: ${currentValue.name}]` : currentValue)));

                if (isNode) stack(currentValue, depth + 1, [...pipeStack, last ? '    ' : '|   ']);
            }
        }

        stack(this.object, 0);
    }
}