import fs from "fs-extra";
import solc from "solc";

fs.removeSync("./build");

const solFile = fs.readFileSync("./contract/Campaign.sol", "utf-8");

const input = {
    language: "Solidity",
    sources: {
        "Campaign.sol": {
            content: solFile,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Campaign.sol"
];

fs.ensureDirSync("./build");

for (let contract in output) {
    fs.outputJSONSync(
        `./build/${contract.replace(":", "")}.json`,
        output[contract]
    );
}

// export default output;
