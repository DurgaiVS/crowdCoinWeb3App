import web3 from "./provider.js";
import abiData from "./build/WalletFactory.json";
import jsonData from "./Data.json";
import walletABI from "./build/Wallet.json";

const Campaign = async () => {
    const factory = new web3.eth.Contract(abiData.abi, jsonData.walletCampAddr);

    let wallet = await factory.methods.getCampaignAddr().call();

    // console.log(wallet);

    if (wallet != "0x0000000000000000000000000000000000000000") {
        console.log("Wallet found");
        return new web3.eth.Contract(walletABI.abi, wallet);
    } else {
        wallet = await factory.methods.createWallet().send({
            from: web3.eth.defaultAccount,
        });
        return new web3.eth.Contract(walletABI.abi, wallet);
    }
};

export default Campaign;
