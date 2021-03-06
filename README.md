# Cuttlefish

Cuttlefish is an interpreted language which combines our favorite parts of JavaScript and Python with functional programming (inspiration from Haskell and J) sprinkled throughout. Cuttlefish's compiler is currently a prototype - see **Roadmap** below for more information.

From the start, @emixampons and I always had ideas we wanted to see in programming languages floating around. Seeing as there was a Replit programming language jam, it was the perfect opportunity to finally get started. We joined forces, and Cuttlefish was born.

## Features
- Expressive data types:
	- Number, Boolean, String
	- List, Tuple
	- Contexts / Monads
		- Map - elegant data manipulation 
		- Maybe - error handling
- Functions
	- Lambda and normal functions
	- Pipelines for chaining
- Functional programming
- Imperative programming
- Classes
- External Node.js import support

These features are still in development:
- Static typing
- Helpful compiler errors
- Error handling
- Native module system
- see **Roadmap** **To-do list** below for a comprehensive list

# Using Cuttlefish
Check out our [main repl here](https://repl.it/@TeamCuttlefish/Cuttlefish#main.cf). Cuttlefish programs go in `./main.cf`, which is preloaded with `./examples/tic-tac-toe.cf`. More example programs are under `./examples`. 

**The Replit version of Cuttlefish is *SLOW*.** It recompiles the Typescript every time it is run, and I couldn't fix that. **Use the precompiled version of Cuttlefish on [Github](https://github.com/Kauhentus/Cuttlefish) for *FASTER* runtime**. 
**Note**: For the github repository, `npm run compileP` is the command to run `./main.cf`.

Programs in `./examples`:
- `discord-bot.cf`:   A simple discord bot. It shows how external node libraries (ie `Discord.js`) are used, but you'll need to supply your own bot token in the code
	
- `tic-tac-toe.cf`: A simple two player tic-tac-toe game. Input looks like `x y`  (ie `0 1`, mark cell in row `0` and column `1`). The program shows all the different features of Cuttlefish being used in a complex program

**Note:** Error handling is not fully implemented, so reach out if you have any questions about the syntax or if you're stuck on a bug.

# Basics
Most of Cuttlefish's syntax is similar to Python and Haskell. It currently transpiles to Nodejs JavaScript.

Cuttlefish can be used imperatively and functionally. Here a functional example. You can check the [documentation](https://github.com/Kauhentus/Cuttlefish/tree/master/docs) for specifics on syntax. There is an imperative program in the `examples` folder too.

```
# Functional 99 bottles of beer program:
# Num -> String
show = with x do:
    if x == 0:
        return "no more bottles"
    elif x == 1:
        return "1 bottle"
    else:
        return (x.toString ()) + " bottles"

# Num -> ()
line = with x do:
    if x == 0:
        log "No more bottles of beer on the wall, no more bottles of beer."
        log "Go to the store and buy some more, 99 bottles of beer on the wall."
    else:
        unit = show x
        newUnit = show x - 1
        log <- unit + " of beer on the wall, " + unit + " of beer."
        log <- "Take one down and pass it around, " + newUnit + "of beer on the wall.\n"

line <$> [99,98..0]'1	# Functional magic, the power of Cuttlefish lies in this one line!
```

# Design
Unique main features of Cuttlefish include the `Pipeline` and `Map`.   Check the docs for info about other not-so-unique features, like currying, `Maybe`, `<$>`, etc. 

Cuttlefish was designed to be high level and expressive - a perfect example is the `Map` context / monad. Pipelines support this goal too.

### Maps
A map is a special context that "wraps" around values, typically `Lists`, in Cuttlefish. The context includes an associated number called "rank". Maps are like a kind of monad. Let's see a few examples.
```
# Creating a map
a = [1, 2, 3, 4]		# List: [1, 2, 3, 4] 
b = [1, 2, 3, 4]'1		# Map<1>: (List: [1, 2, 3, 4])

c = [[1,2],[3,4]]'2		# Map<2>: (List: [List: [1, 2], List: [3, 4]])
```
Now what do we do with maps? They allow us to apply operations to the List at different "ranks".  Again, let's see a few examples.

```
# Using maps
[1, 2, 3, 4]'1 + 1 		# Map<1>: (List: [2, 3, 4, 5])
[[1,2],[3,4]]'2 + 1		# Map<2>: (List: [List: [2, 3], List: [4, 5]])

[[1,2],[3,4]]'1 + 1		# Error - cannot do [1, 2] + 1, List + Num

([[1,2],[3,4]]'0) [1]	# List: [1, 2]
([[1,2],[3,4]]'1) [1]	# List: [2, 4]
```

Maps essentially allow us to map a function or operator onto the different dimensions, or "ranks", of a List. Rank `0` corresponds to the value in the Map itself. Rank `1` corresponds to the first dimension in the array (`[x]`), rank `2` corresponds to the second dimension (`[x][y]`), etc.  

All basic operators are overloaded to work with Maps. Other functions may need the `<$>`, `<*>` or `>>=` . 

### Pipelines

Pipelines allow us to easily construct function chains.
```
example = {
	x => x ** 2
	x => 1 / x
}
log <- 8 ~ example
log <- [2,4,8]'1 ~ example		# Call pipieline with ~
```
Pipelines work with maps too.  Pipelines allow for clean function chaining - highly useful in certain algorithms and projects.

# Roadmap
Cuttlefish development will continue regardless of the Jam. Both @emixampons and I are planning on using the language for our projects in the future. The current prototype is very much a prototype - we have yet to implement much of the language's backend (ie. proper type-checking, mangling, proper scoping, proper error handling / tracing, etc).  However, the prototype is still completely functional as-is. 

### To-do list
- **Design**:
	- Switch Cuttlefish from an interpreted language to a compiled language
	- Add Python as a transpiling target for ML (via PyTorch) support
	- Enhance the integrity of FP in Cuttlefish (ie. `do` aren't correctly FP)
	- Add more contexts / monads (ie. `IO`, `State`)
	- Add a REPL
	- Add an extensive macro system
- **Back-end**:
	- Add proper variable scoping
	- Implement proper typing and type-checking
	- Add proper error handling / tracing
	- Implement proper variable mangling
	- Implement native Cuttlefish types rather than relying on target transpiling language's primitive types
	- Fix native module system (`import`, `export`)


### Credits
- @Kauhentus, @emixampons

[Replit](https://repl.it/@TeamCuttlefish/Cuttlefish#main.cf)
[Github](https://github.com/Kauhentus/Cuttlefish)
[Documentation](https://github.com/Kauhentus/Cuttlefish/tree/master/docs)
