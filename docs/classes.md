## Basics of Cuttlefish Classes

Learning new syntax is best done through example. So I'll be introducing concepts through commented code, as well as additional notes. 

Class syntax in Cuttlefish is rather limited. It will be expanded in the future.

```
class Cat with (color, age):
	this.color = color
	this.age = age
	this.happiness = 1
	this.pet = with () do:
		this.happiness += 1

Roy = Cat $ ("white", 5)		# Classes are inialized with $ and a tuple containing arguments
Roy.pet ()
log <- Roy.happiness
```

`this.` statements are required when working inside the class.

`=:` can be used to typecheck an object.

```
Roy =: Cat 		# true
Roy =: Object	# true
Roy =: Number 	# false
```
In the future, `interface`, `extends`, and `implements` will be added.