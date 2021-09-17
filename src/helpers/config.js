const fs = require('fs');

const defaultFieldValue = "DEFAULT_FIELD_VALUE";
const envFields = new Set([
    "TOKEN",
    "STORAGE",
    "CATEGORIES"
]);

module.exports = (envPath, jsonPath) => {
    if (!envPath){
        throw new Error(".env path not setted");
    }
    if (!jsonPath){
        throw new Error("JSON storage not setted");
    }

    if (!fs.existsSync(envPath)){
        fs.writeFileSync(envPath, "");
    }
    const fileContent = fs
        .readFileSync(envPath, "utf8")
        .split('\n')
        .reduce((acc, v) => {
            const [name, value] = v.split("=");
            if (!name){
                return acc;
            }
            acc[name] = value;
            return acc;
        }, {});
    
    const incorrectFields = [];
    for(const envField of envFields){
        if (!fileContent.hasOwnProperty(envField)){
            fileContent[envField] = defaultFieldValue;
        }
        const v = fileContent[envField];
        if (!v || v === defaultFieldValue){
            incorrectFields.push(envField);
        }
    }

    if (incorrectFields.length > 0){
        let finalContent = "";
        for(const key of Object.keys(fileContent)){
            const str = `${key}=${fileContent[key]}\n`;
            finalContent += str;
        }
        fs.writeFileSync(envPath, finalContent, "utf-8");
        throw new Error(`Fields ${incorrectFields.join(', ')} in ${envPath} is empty or setted by default value`);
    }

    if (!fs.existsSync(jsonPath)){
        fs.writeFileSync(jsonPath, "");
    }
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    if (!jsonContent){
        throw Error(`Incorrect JSON content in ${jsonPath}`);
    }
}