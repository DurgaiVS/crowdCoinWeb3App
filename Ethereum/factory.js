import web3 from './provider.js';
import abiData from './build/CampaignFactory.json';
import jsonData from './Data.json';


const factory = new web3.eth.Contract(abiData.abi, jsonData.deployedAddr);


export default factory;