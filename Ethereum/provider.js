import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    //if the file is running on the browser and the user is having metamask installed.

    web3 = new Web3(window.ethereum);
    window.ethereum.sendAsync(
        { method: "eth_requestAccounts" },
        function (error, result) {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
                // Use the first returned account as the default account
                web3.eth.defaultAccount = result.result[0];
            }
        }
    );
} else {
    //if the file is running on the server or the user doesn't have metamask installed.
    const provider = new Web3.providers.HttpProvider(
        "https://goerli.infura.io/v3/e619f7213f9343b89a185035d721adf4"
    );
    web3 = new Web3(provider);
}

export default web3;
