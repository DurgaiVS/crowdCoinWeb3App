import Layout from "../../../Components/Layout.js";
import { Button, Table, Grid } from "semantic-ui-react";
import { Link } from "../../../routes.cjs";
import Campaign from "../../../Ethereum/campaign.js";
import RowInfo from "../../../Components/RequestRow.js";
import { useEffect } from "react";

const ReqDetails = (props) => {

    const rowPart = () => {
        return props.request.map((req, index, arr) => {
           return (
               <RowInfo 
                   request = {req}
                   key = {index}
                   id = {arr.length - index - 1}
                   addr = {props.address}
                   approversCount = {props.approversCount}
               /> 
           )
        })
    }

    return (
        <Layout>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column floated="left">
                        <Link route={`/campaigns/${props.address}`} > 
                            <a>
                                <Button basic color="blue">Back</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                    <Grid.Column floated="right">
                        <Link route={`/campaigns/${props.address}/requests/new`}>
                            <a>
                                <Button floated="right" primary>Create Request</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <h3>Requests</h3>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>Recipient</Table.HeaderCell>
                                <Table.HeaderCell>Approval Count</Table.HeaderCell>
                                <Table.HeaderCell>Approve</Table.HeaderCell>
                                <Table.HeaderCell>Finalize</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {rowPart()}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <p>Found {props.reqCount} requests</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Layout>
    )
}

ReqDetails.getInitialProps = async (props) => {

    const campaign = Campaign(props.query.address.replace(",",""));
    const length = await campaign.methods.getRequest().call();

    const Requests = await Promise.all(
        Array(parseInt(length)).fill().map(async (element, index, arr) => {
            return campaign.methods.requests(arr.length - index - 1).call();
        })
    );

    const approversCount = await campaign.methods.approversCount().call()

    return {
        address: props.query.address,
        approversCount: approversCount,
        reqCount: length,
        request: Requests
    }
}

export default ReqDetails;