import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import fs from "fs";

let solcObj = fs.readFileSync("./build/CampaignFactory.json", "utf-8");
let walletObj = fs.readFileSync("./build/WalletFactory.json", "utf-8");

solcObj = JSON.parse(solcObj);
walletObj = JSON.parse(walletObj);

const provider = new HDWalletProvider(
    "picnic lens patrol mistake able escape abstract airport skin accuse cry hockey",
    "https://goerli.infura.io/v3/e619f7213f9343b89a185035d721adf4"
);

const web3 = new Web3(provider);

const f = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        const campaign = await new web3.eth.Contract(solcObj.abi)
            .deploy({ data: solcObj.evm.bytecode.object })
            .send({ from: accounts[0], gas: "2500000" });

        const walletCampaign = await new web3.eth.Contract(walletObj.abi)
            .deploy({ data: walletObj.evm.bytecode.object })
            .send({ from: accounts[0], gas: "2500000" });

        fs.writeFile(
            "./Data.json",
            JSON.stringify({
                deployedAddr: campaign.options.address,
                walletCampAddr: walletCampaign.options.address,
            }),
            (e) => console.log(e)
        );
    } catch (e) {
        console.log(e);
    }
    provider.engine.stop();
};
f();
