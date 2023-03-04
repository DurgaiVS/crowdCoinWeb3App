import Layout from "../../../Components/Layout.js";
import { Form, Button, Message, Input } from "semantic-ui-react";
import { useState } from "react";
import Campaign from "../../../Ethereum/campaign.js";
import web3 from "../../../Ethereum/provider.js";
import { Router } from "../../../routes.cjs";

const NewRequest = (props) => {
    const [desc, setDesc] = useState("");
    const [value, setValue] = useState("");
    const [toAddr, setToAddr] = useState("");
    const [load, setLoad] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const onSubmitting = async (e) => {
        e.preventDefault();
        setLoad(true);

        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(props.address);
            const manager = await campaign.methods.manager().call();

            if (accounts[0].toLowerCase() !== manager.toLowerCase())
                throw new Error(
                    "Sorry!! Only the manager of this campaign can create a request"
                );

            await campaign.methods
                .createRequest(desc, parseFloat(value), toAddr)
                .send({
                    from: accounts[0],
                });
        } catch (e) {
            setErrMsg(e.message);
        }
        setLoad(false);
        Router.pushRoute(`/campaigns/${props.address}/requests`);
    };

    return (
        <Layout>
            <h3>Create a new Request</h3>
            <Form
                onSubmit={(e) => {
                    onSubmitting(e);
                }}
                error={!!errMsg}
            >
                <Form.Field>
                    <label>Request Description</label>
                    <Input
                        value={desc}
                        onChange={(e) => {
                            setDesc(e.target.value);
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Request Amount</label>
                    <Input
                        label="in wei"
                        labelPosition="right"
                        type="number"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient Address</label>
                    <Input
                        value={toAddr}
                        onChange={(e) => {
                            setToAddr(e.target.value);
                        }}
                    />
                </Form.Field>
                <Button primary type="submit" loading={load}>
                    Post
                </Button>
                <Message error header="Something went wrong" content={errMsg} />
            </Form>
        </Layout>
    );
};

NewRequest.getInitialProps = (props) => {
    return {
        address: props.query.address.replace(",", ""),
    };
};

export default NewRequest;
