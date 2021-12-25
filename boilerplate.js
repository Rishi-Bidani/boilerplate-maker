const fs = require("fs");
const path = require("path");
const readline = require('readline');


async function writeFile(filePath, data) {
    // Check if exists
    const isExists = async (path) => {
        try { await fs.promises.access(path); return true; }
        catch { return false; }
    };

    try {
        const dirname = path.dirname(filePath);
        const exist = await isExists(dirname);
        if (!exist) {
            await fs.promises.mkdir(dirname, { recursive: true });
        }

        await fs.promises.writeFile(filePath, data, 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}


function getArgs() {
    const args = {};
    const arrOfArgs = process.argv.slice(2);

    for (let i = 0; i < arrOfArgs.length; i++) {

        if (arrOfArgs[i].startsWith("-") && !arrOfArgs[i + 1].startsWith("-")) {
            args[arrOfArgs[i]] = arrOfArgs[i + 1];

        } else if (arrOfArgs[i].startsWith("-") && arrOfArgs[i + 1].startsWith("-")) {
            args[arrOfArgs[i]] = true;
        }
    }
    return args;
}
const args = getArgs();

const file = args["-f"];
const boilerplateType = args["-t"];
const outputDir = args["-o"];

// Check if argument is supplied
if (!file) {
    throw new Error("Please provide a file");
} else if (!boilerplateType) {
    throw new Error("Please provide a boilerplate type");
} else if (!outputDir) {
    throw new Error("Please provide an output directory");
}

// const readFile = fs.readFileSync(file, "utf-8").toString().split(/[\r\n]+/);

// async function processLines() {
//     const fileStream = fs.createReadStream(file);
//     const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//     });
//     let index = 0;
//     let currFile;
//     for await (const line of rl) {
//         console.log(await currFile, line)

//         if (index === 0) {
//             if (boilerplateType !== line.split("# ")[1]) {
//                 throw new Error("The boilerplate type does not match the file");
//             }
//         } else {
//             currFile = await processLine(line, outputDir, currFile) || currFile;
//         }
//         index++;
//     }
// }


// async function processLine(line, outputDir, currFile) {
//     try {
//         await fs.promises.mkdir(outputDir, { recursive: true });
//         if (line.startsWith("# ")) {
//             const filename = line.split("# ")[1];
//             const filepath = path.resolve(outputDir, filename);
//             console.log("Creating file: " + filepath);
//             await writeFile(filepath, "");
//             return filepath;
//         } else {
//             // console.log(await currFile, line)
//             await fs.promises.appendFile(await currFile, line + "\n");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

class Boilerplate {
    constructor(file, output, type) {
        this.output = output;
        this.type = type;
        this.currFile;
        this.fileStream = fs.createReadStream(file);
    }

    async processLines() {
        const rl = readline.createInterface({
            input: this.fileStream,
            crlfDelay: Infinity
        });
        let index = 0;
        for await (const line of rl) {
            console.log(this.currFile, line)

            if (index === 0) {
                if (boilerplateType !== line.split("# ")[1])
                    throw new Error("The boilerplate type does not match the file");
            } else {
                this.currFile = await this.processLine(line) || this.currFile;
            }
            index++;
        }
    }

    async processLine(line) {
        try {
            await fs.promises.mkdir(this.output, { recursive: true });
            if (line.startsWith("# ")) {
                const filename = line.split("# ")[1];
                this.currFile = path.resolve(this.output, filename);
                console.log("Creating file: " + this.currFile);
                await writeFile(this.currFile, "");
            } else {
                // console.log(await currFile, line)
                await fs.promises.appendFile(this.currFile, line + "\n");
            }
        } catch (error) {
            console.log(error);
        }
    }
}

new Boilerplate(file, outputDir, boilerplateType).processLines();