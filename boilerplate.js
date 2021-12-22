const fs = require("fs");
const path = require("path")

async function isExists(path) {
    try {
        await fs.promises.access(path);
        return true;
    } catch {
        return false;
    }
};

async function writeFile(filePath, data) {
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

const readFile = fs.readFileSync(file, "utf-8").toString().split(/[\r\n]+/);

if (boilerplateType === readFile[0].split("# ")[1]) {

    createFilesAndWrite(outputDir, readFile);

} else {
    console.log("Wrong boilerplate type");
}

async function createFilesAndWrite(outputPath, readFile) {
    try {
        await fs.promises.mkdir(outputPath, { recursive: true });
        let currFile;
        for (let i = 1; i < readFile.length; i++) {
            if (readFile[i].startsWith("# ")) {
                const filename = readFile[i].split("# ")[1];
                const filepath = path.resolve(outputPath, filename);
                console.log("Creating file: " + filepath);
                await writeFile(filepath, "");
                currFile = filepath;
            } else {
                await fs.promises.appendFile(currFile, readFile[i] + "\n",);
            }
        }
    } catch (error) {
        throw new Error(error);
    }
}