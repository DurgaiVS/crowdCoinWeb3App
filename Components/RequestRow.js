import { Table, Button } from 'semantic-ui-react'
import web3 from '../Ethereum/provider.js';
import Campaign from '../Ethereum/campaign.js';
import { useEffect, useState } from 'react';

const RowInfo = (props) => {

    const { Row, Cell } = Table;
    const [ load, setLoad ] = useState(false);
    const [ loadF, setLoadF ] = useState(false);
    const [ clr, setClr ] = useState('blue');

    useEffect(() => {
        props.request.yesVotes < ( props.approversCount / 2) ? setClr('red') : setClr('blue') 
    }, []);  

    const finalising = async (id) => {
        setLoadF(true);
        try {
            const campaign = Campaign(props.addr);
            const accounts = await web3.eth.getAccounts();
    
            await campaign.methods.finaliseRequest(id).send({
                from: accounts[0]
            });

            window.location.reload();
            
        } catch (e) {
            console.log(e)
        }
        setLoadF(false);
    }

    const approving = async (id) => {

        setLoad(true);
        try {
            const campaign = Campaign(props.addr);
            const accounts = await web3.eth.getAccounts();
    
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            });

            window.location.reload();
        } catch (e) {
            console.log(e)
        }
        setLoad(false);
        
    }

    return (
        <Row disabled={props.request.completed}>
            <Cell>{1 + props.id}</Cell>
            <Cell>{props.request.description}</Cell>
            <Cell>{web3.utils.fromWei(props.request.value, 'ether')}</Cell>
            <Cell style={{overflowWrap: 'break-word'}}>{props.request.recipient}</Cell>
            <Cell>{`${props.request.yesVotes}/${props.approversCount}`}</Cell>
            <Cell>
                {
                    props.request.completed ? null : (
                        <Button loading={load} basic color='green' onClick={() => {approving(props.id)}}>Approve</Button>
                    )
                }
            </Cell>
            <Cell>
                {
                    props.request.completed ? null : (
                        <Button loading={loadF} basic color={clr} onClick={() => {finalising(props.id)}}>Finalise</Button>
                    )
                }
            </Cell>
        </Row>
    )
}

export default RowInfo;