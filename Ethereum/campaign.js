import web3 from './provider.js';
import abiData from './build/Campaign.json';

const campaign = (address) => {
    return new web3.eth.Contract(abiData.abi, address); 
}




export default campaign;