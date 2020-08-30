## Basics of Cuttlefish Contexts

Contexts are pretty much like Haskell monads. In Cuttlefish, they act as wrappers around a value. Currently, there are two contexts: `Map` and `Maybe` (technically `CMap` and `CMaybe`).

Let us talk about the operators `<$>`, `<*>`, and `>>=`. They allow us to use different types of functions with monads. These operators are overloaded, so they have different behaviors with each type of monad.

Monads are heavily rooted in typing, so the syntax for that currently is `M A`.
- `M` represents the type of context / monad 
- `A` represents the type that is wrapped inside the context / monad

`A` is just A.
 `M A` is A wrapped in monad M.

## `Maybe `

So how do we work these values? It is easiest to start with the `Maybe` monad. It exists in two states, `Just` and `Nothing` (technically `CJust` and `CNothing`). 
```
Just 3			# Just 3
Nothing ()		# Nothing
```
What if we have a function that doubles a number?
```
double = x => x * 2
```
It has type `Num -> Num`, we input a number, and a number is outputted. However, we cannot use this with our numbers wrapped in a `Maybe` monad.
```
double (Just 3)		# Error, cannot input Maybe into Num -> Num
```
Enter the operators `<$>`, `<*>`, and `>>=`. Each of them takes in a function and a monad and does something. They are functions that take in functions as arguments - higher-order functions - and does things with the input functions. 

## <$>
```
double <$> (Just 3)		# Just 6
```
So what happened? 
1) `<$>` took the value out of `Just 3`, leaving us with `3`
2) `<$>` next put the `3` into `double`, giving us `6`
3) Finally, `<$>` put the `6` back into a `Maybe`, giving us `Just 6`

Here's an explanation of the `<$>` function's type
`<$>` has type `(A -> A) -> M A -> M A`
1) First argument: a normal function (`A -> A`), so think of our `double` function (`Num -> Num`). 
2) Second argument:  a monad (`M A`), so think of our `Just 3` 
3) Output: a monad (`M A`), and for our `double` function, it would be `Just 6`

**Think about it this way:**
`<$>` allows us to use normal functions on values that are wrapped in a monad or context.

**But what's the point of using `Maybe` when we could just use normal numbers?**

Error handling. 
```
double <$> (Just 3)			# Just 6
double <$> (Nothing ())		# Nothing
```
If you input a `Nothing`, `<$>` makes it so the output is nothing.
It's quite elegant, and you can check out Haskell for more detailed explanations and examples on the uses of the `Maybe` monad.

**Similar things happen with `<*>` and `>>=`**
## >>=
```
square = x => Just (x * x)
(Just 3) >>= square 			# Just 9
(Nothing ()) >>= square			# Nothing
```
`>>=` differs from `<$>` in the function it takes in as the first argument.

`<$>` takes in a normal function `A -> A`.
`>>=` takes in a function that outputs a monad `A -> M A`. 

See the function `square`? It outputs a monad, not a normal value. Thus, we need to use `>>=` instead of `<$>`. Furthermore, `>>=` takes in the monad first and the function second.
`>>=` has type `M A -> (A -> M A) -> M A`` 
## <*>
```
square = x => Just (x * x)
(Just square) <*> (Just 3) 				# Just 9
(Just square) <*> (Nothing ())			# Nothing
```
`<*>` differs from `<$>` in the function it takes in as the first argument.

`<$>` takes in a normal function `A -> A`.
`<*>` takes in a monad that is wrapped around a function `M (A -> A)`. Remember, functions are first-class objects and thus can be wrapped in a monad / context.

`>>=` has type `M A -> M (A -> A) -> M A`` 

## `Map`

### Maps are the bread and butter of Cuttlefish if you learn how to use them properly. They allow for the most flexible list manipulation in the language.
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

## <$>
```
double = x => x * 2
double <$> [1, 2, 3, 4]'1			# Map<1>: (List: [2, 4, 6, 8])
double <$> [[1, 2], [3, 4]]'2		# Map<2>: (List: [List: [2, 4], List: [6, 8]])
```
`<$>` allows us to apply normal functions to Maps according to the rank of the map.

## >>=
```
triplet_range = x => [x..(x + 2)]'0
5'1 >>= triplet_range  			# Map<1>: (List: [5, 6, 7])
```
`>>=` allows us to apply a function `A -> M A` to a Map `M A`. Rank is currently ignored.

## <*>
```
double = x => Just(x * 2)
(Just double) <*> [1, 2, 3, 4]'1			# Map<1>: (List: [2, 4, 6, 8])
(Just double) <*> [[1, 2], [3, 4]]'2		# Map<2>: (List: [List: [2, 4], List: [6, 8]])
```
`<*>` allows us to apply a function `M (A -> A)` to Maps according to the rank of the map.

---

There are several operators designed specifically to be used with Maps.
- `\\` is the filter operator
```
[1, 2, 3, 4]'0 \\ (x => x % 2 == 0)					# Map<0>: (List: [2, 4])
[[1, 2, 3], [4, 5, 6]]'1 \\ (x => x % 2 == 0)		# Map<1>: (List: [List: [2], List: [4, 6]])
```
The following 3 operators lower the rank of the map by 1. If the rank of the map is 0, the value will be unwrapped instead.
- `\>` is the foldr operator	(`\<` is foldl)
```
[1, 2, 3]'0 \> ((a, b) => a / b)					# 1.5
[[1, 2, 3], [4, 5, 6]]'1 \< ((a, b) => a / b)		# Map<0>: (List: [0.16666666666666666, 0.13333333333333333])
# Notice how \> and \< can give different results for [1, 2, 3] and a / b
```
- `\&` is the all operator
```
[1, 2, 3, 4]'0 \& (x => x % 2 == 0)					# false
[[1, 2, 3], [4, 6, 8]]'1 \& (x => x % 2 == 0)		# Map<0>: (List: [false, true])
```

- `\|` is the any operator
```
[1, 2, 3, 4]'0 \& (x => x % 2 == 0)					# true
log [[1, 3, 5], [4, 5, 6]]'1 \| (x => x % 2 == 0)		# Map<0>: (List: [false, true])
```
### @
Finally, values can be lowered from a monad / context with `@`.
```
log @(Just 3)			# 3
log @([1, 2, 3]'5)		# [1, 2, 3]
```

---
New monads / contexts `IO` and `State` will be developed.