import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Message,
    Header,
    Segment,
    Container,
} from "semantic-ui-react";
import Layout from "../../Components/Layout.js";
// import campaign from "../../Ethereum/campaign.js";
import web3 from "../../Ethereum/provider.js";
import Campaign from "../../Ethereum/walletFactory.js";

const TransferForm = (props) => {
    const transferContract = props;

    console.log(transferContract);

    const [recipientAddress, setRecipientAddress] = useState("");
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [bal, setBal] = useState(null);

    const getBalance = async () => {
        const weiBalance = await web3.eth.getBalance(web3.eth.defaultAccount);
        setBal(weiBalance);
    };

    useEffect(() => {
        getBalance();
    }, [web3.eth.defaultAccount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        // try {
        // Connect to Ethereum network
        // if (window.ethereum) {
        // const provider = window.ethereum;
        // await provider.enable();
        // const web3 = new web3(provider);

        // Set the contract's ABI and address
        // const transferContract = new web3.eth.Contract(abi, contractAddress);

        // Call the transferEther function in the Solidity contract
        const tx = await transferContract.methods
            .transferEther(recipientAddress, value, message)
            .send({ from: web3.eth.defaultAccount });

        console.log("Transaction sent: ", tx);

        setLoading(false);
        //     } else {
        //         setError("MetaMask is not installed or is locked");
        //         setLoading(false);
        //     }
        // } catch (e) {
        //     console.error(e);
        //     setError(e.message);
        //     setLoading(false);
        // }
    };

    return (
        <Layout>
            <Form onSubmit={handleSubmit} error={!!error}>
                <Form.Field>
                    <label>Recipient Address</label>
                    <Input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value (in Ether)</label>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Message</label>
                    <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Form.Field>
                <Message error header="Error" content={error} />
                <Button type="submit" loading={loading}>
                    Send
                </Button>
            </Form>
            <Container textAlign="center">
                <Header as="h2">Wallet Information</Header>
                <Segment>
                    <p>Address: {web3.eth.defaultAccount}</p>
                    <p>Balance: {bal} ETH (in wei)</p>
                </Segment>
            </Container>
        </Layout>
    );
};

TransferForm.getInitialProps = async () => {
    const factory = await Campaign();

    console.log(factory);

    return {
        factory: factory,
    };
};

export default TransferForm;
