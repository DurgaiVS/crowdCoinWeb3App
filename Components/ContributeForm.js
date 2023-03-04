import { Form, Input, Button, Message } from "semantic-ui-react";
import { useState } from "react";
import web3 from "../Ethereum/provider.js";
import Campaign from "../Ethereum/campaign.js";
import { Router } from "../routes.cjs";
const Contribution = (address) => {
    const [value, setVal] = useState("");
    const [load, setLoad] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const submitting = async (e) => {
        e.preventDefault();
        setLoad(true);

        try {
            const accounts = await web3.eth.getAccounts();

            const campaign = Campaign(address.address);

            await campaign.methods.contribution().send({
                from: accounts[0],
                value: value,
            });

            Router.replaceRoute(`/campaigns/${address.address}`);
        } catch (err) {
            setErrMsg(err.message);
        }

        setLoad(false);
    };

    return (
        <Form
            onSubmit={(e) => {
                submitting(e);
            }}
            error={!!errMsg}
        >
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={value}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    type="number"
                    label="in wei"
                    labelPosition="right"
                />
            </Form.Field>
            <Button type="submit" loading={load} primary>
                Contribute
            </Button>
            <Message error header="Something went wrong" content={errMsg} />
        </Form>
    );
};

export default Contribution;
