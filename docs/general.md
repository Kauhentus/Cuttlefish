## Basics of Cuttlefish

Learning new syntax is best done through example. So I'll be introducing concepts through commented code, as well as additional notes. 

```
a = 42
b = "Hello, world!"
c = true

# 3 Basic primitives

d = []
e = [1,]
f = [1,2,3]

# List syntax, Tuple uses () instead of []
```

Variables are immutable and copied in Cuttlefish.
```
a = 42
b = a
a = 10		# Error, cannot reassign to variable

c = [1,2,3]
d = c.set [1,] 4
log <- c	# List: [1, 2, 3]
log <- d	# List: [1, 4, 3]
```

More List information:
```
# Ranges [first, second? .. last]
g = [1..10]			# List: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
h = [10,8..1]		# List: [10, 8, 6, 4, 2]
# Tuples do not have range syntax

# Standard member access
log <- [1,2][1]		# 2
```
---

Function creation and function calling:
```
add2A = (a, b) => a + b		# Lambda notation

add2B = with (a, b) do:		# Do notation
	return a + b

add2A 2 4			# Native functions are all curried
(add2A 1) 5			# All == 6
add2B 2 4
(add2B 1) 5

multBy2 = (2 *)		# Operators can be converted into partial functions, but care about order of operations, they're still left associative
multBy2 4			# 8

log (add2A 2 4)
log <- add2A 2 4		# RH arrow syntax allows us to do rid of ()
log <- (add2B <- 2) 4	# RH arrow is stil left associative, be careful

two = () => 2
log <- two ()		# No arguments is represented with an empty Tuple
```
---
Imperative logic. These can only go in the outer program or in a `do` block.
Assignments (`=`, `+=`, `*=`, etc) are not expressions either . They can only go in outer programs or `do` blocks as well.
```
x = 10					# Standard if-elif-else statement
if x % 2 == 0:			# Feel free to mix and match the elifs and else (all optional)
	log "A"
elif x % 3 == 0:
	log "B"
else:
	log "C"

n = 10
while n > 0:			# Standard while loop
	log n
	n -= 1
	
for i in [1..10]:		# For loop
    log i
```

---

Operator list:
```
1 < 2		# true
1 > 2		# false
1 <= 2		# true
1 >= 2		# false
1 == 2		# false
1 != 2		# true

true || false 	# OR operator, true
true && false	# AND operator, false
true ^^ false	# XOR operator, true
!true			# NOT operator, false

1 + 2		# 3
7 - 5		# 2
2 * (-5)	# 10	
1 / 7		# 0.14285714285714285
10 % 2		# 0
2 ** 3		# 8
(-5)		# -5
```

Note: negative numbers must be wrapped in `()` Why? Consider the example below:
```
a - 3	# Offending expression

# Is this apply(a, -3) or subtract(a, 3)?
# It's ambigious - very bad - so we get rid of that problem
```
---
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

---

Basic typechecking can be done with `=:`
```
2 =: Number
"Hi" =: String
true =: Boolean

# Primitives are checked like this

[1, 2, 3] =: CList
(1, 2, 3) =: CTuple
(Just 3) =: CMaybe
(Just 3) =: CMaybeJust

# Other types have special names and are checked like this
# All the expressions above evaluate to true
```
---
Import and exports currently only work with external modules. Native module support is still in development. 
```
import external "discord.js" as Discord			# External library import

client = Discord.Client $ ()
client.login "<token>"
```
### Finally, be sure to read up on how the Map context / monad works
It's the bread and butter of Cuttlefish if you learn how to use it!