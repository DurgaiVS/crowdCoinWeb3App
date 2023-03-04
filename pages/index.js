import factory from '../Ethereum/factory.js';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../Components/Layout.js';
import { Link } from '../routes.cjs';
import { useEffect } from 'react';

const HomePage = ({ contractAddr, manNames }) => {

    const item = contractAddr.map((item, index) => {

        return {
            header: manNames[index],
            meta: item,
            description: (
                <Link route={`/campaigns/${item}`}>
                    <a>View Campaign</a>
                </Link>  
            ),
            fluid: true
        }
    });

    return (
        <Layout>
        <h3>Open Campaigns</h3>
        <Link route='/campaigns/new'><a>
        <Button floated='right' content="Create Campaign" icon="add" labelPosition='left' primary />
        </a></Link>
        <Card.Group items={item} />
        </Layout>
    )
};
    
    //getInitialProps is used to render on the server side, 
    //and generate data before sending to the client.
    
    HomePage.getInitialProps = async () => {
        const contractAddr = await factory.methods.getCampaignAddr().call();

        const manNames = await Promise.all(
            Array(contractAddr.length).fill().map(async (element, index) => {
                return factory.methods.campaignName(contractAddr[index]).call();
            })
        );

        return { contractAddr, manNames }
    }
    
export default HomePage;