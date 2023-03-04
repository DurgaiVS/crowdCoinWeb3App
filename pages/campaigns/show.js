import Layout from "../../Components/Layout.js";
import Campaign from "../../Ethereum/campaign.js";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../Ethereum/provider.js";
import Contribution from "../../Components/ContributeForm.js";
import { Link } from "../../routes.cjs";

const DynamicPage = (props) => {

    const { address } = props;

    
    const cardRender = () => {
        const {
            minContribution,
            premContribution,
            balance,
            reqCount,
            contributors,
            managerAddr,
            campaignName,
            campaignDesc,
            managerName,
            premContributors
        } = props;

        const items = [
            {
                header: campaignName,
                meta: "Campaign Details",
                description: campaignDesc
            }, {
                header: managerName,
                meta: 'Manager Details',
                description: managerAddr,
                style: {overflowWrap: 'break-word'}
            }, {
                header: minContribution,
                meta: "Minimum Contribution (in wei)",
                description: "Minimum requirement to become a contributor"
            }, {
                header: premContribution,
                meta: "Premium Contribution (in wei)",
                description: "Minimum requirement to become a premium contributor"
            }, {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Campaign Balance",
                description: "Amount of ethers currently available in the contract"
            }, {
                header: reqCount,
                meta: "Request Count",
                description: "Total request made by manager"
            }, {
                header: contributors,
                meta: "Contributors",
                description: "Number of people contributed to this campaign"
            }, {
                header: premContributors,
                meta: "Premium contributors",
                description: "Number of premium contributors for this campaign"
            }
        ];
        return (<Card.Group items={items} />)
    };

    return (<Layout>
        <h3>Campaign Details</h3>
        <Grid>
            <Grid.Row columns={2}>
                <Grid.Column width={11}>
                    {cardRender()}
                </Grid.Column>
                <Grid.Column width={5}>
                    <Contribution address={address}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                <Link route={`/campaigns/${address}/requests`}><a>
                <Button primary >View Requests</Button>
                </a></Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Layout>
    )
}

DynamicPage.getInitialProps = async (props) => {
    const campaign = Campaign(props.query.address.replace(",", ""));

    const summary = await campaign.methods.getSummary().call();

    return {
        address: props.query.address,
        minContribution: summary[0],
        premContribution: summary[1],
        balance: summary[2],
        reqCount: summary[3],
        contributors: summary[4],
        managerAddr: summary[5].toString(),
        campaignName: summary[6],
        campaignDesc: summary[7],
        managerName: summary[8],
        premContributors: summary[9]
    }
}

export default DynamicPage;