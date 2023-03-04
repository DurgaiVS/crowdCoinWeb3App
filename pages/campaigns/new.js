import Layout from "../../Components/Layout.js";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { useState } from "react";
import factory from "../../Ethereum/factory.js";
import web3 from "../../Ethereum/provider.js";
import { Link, Router } from '../../routes.cjs'
//todo Link is used to render <a> on components and navigate within the site
//todo Router is used to programatically allow people to navitate within the site


// import jsonData from "../../Components/ContractsInfo.json";

const NewCampaign = () => {

    const [ minCon, setMinCon ] = useState('');
    const [ premCon, setPremCon ] = useState('');
    const [ campDes, setCampDes ] = useState('');
    const [ campName, setCampName ] = useState('');
    const [ manName, setManName ] = useState('');
    const [ errMsg, setErrMsg ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(manName, campDes, campName, parseFloat(minCon), parseFloat(premCon)).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
            // setLoading(false);
        } catch (e) {
            // setLoading(false);
            setErrMsg(e.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h3>Create Campaign</h3>
            <Form onSubmit={(e) => onSubmit(e)} error={!!errMsg}>
                <Form.Field>
                    <label>Manager Name</label>
                    <Input value={manName} onChange={(e) => {
                        setManName(e.target.value)
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Campaign Name</label>
                    <Input value={campName} onChange={(e) => {
                        setCampName(e.target.value)
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Campaign Description</label>
                    <Input value={campDes} onChange={(e) => {
                        setCampDes(e.target.value)
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input label='in wei' placeholder='value in numbers' type="number" labelPosition="left" value={minCon} onChange={(e) => {
                        setMinCon(e.target.value)
                    }} />
                </Form.Field>
                <Form.Field>
                    <label>Premium Contribution</label>
                    <Input label='in wei' placeholder='value in numbers' type="number" labelPosition="left" value={premCon} onChange={(e) => {
                        setPremCon(e.target.value)
                    }} />
                </Form.Field>
                <Button type='submit' loading={loading} primary>Create</Button>
                <Message error header="Something went wrong" content={errMsg} />   
            </Form>
        </Layout>
    )
}

export default NewCampaign;