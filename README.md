# boilerplate-maker

This program can be used to design you own boilerplates and start your projects quickly.

Firstly, you will have to create a .mkbp file containing your template which will generate your project.
The mkbp file should follow the given syntax

```txt
# template-name

# path/to/file.js
const hi = "hello"
const path = require("path")

# path/to/file2.ext
# path/to/another/file3.ext
```

For a real example mkbp file please check express.mkbp.


If you are using the node version of the boilerplater-maker please execute the code with the following parameters

```node
node boilerplate.js -o ./express-app/ -t express -f express.mkbp
```

The executable package should be available soon!

To use the executable, add the directory (which contains the exectable) to your system PATH variables
Then, you should be able to execute the boilerplate command from anywhere on your system (after reopening your terminal/cmd)
