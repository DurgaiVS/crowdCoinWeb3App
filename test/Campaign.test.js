import ganache from 'ganache-cli';
import Web3 from 'web3';
import assert from 'assert';
// import solcObj from '../Ethereum/compile.js';
import { describe } from 'mocha';
import fs from 'fs';


const compiledFactory = JSON.parse(fs.readFileSync('C:\\Users\\durga\\VScode\\Blockchain\\Campaign\\Ethereum\\build\\CampaignFactory.json', 'utf-8')); 
const compiledCampaign = JSON.parse(fs.readFileSync('C:\\Users\\durga\\VScode\\Blockchain\\Campaign\\Ethereum\\build\\Campaign.json', 'utf-8'));


const web3 = new Web3(ganache.provider());

let accounts;
let campaign;
let factory;
let campaignAddr;
// const ipArg = ['Durgai', 'Movie making', 'making a movie with Crowdfunding money', 1, 10];
const min = 1, prem = 10, name = 'Durgai', campDes = "Chumma", campName = "Test";


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[4], gas: '2400000' });

    await factory.methods
      .createCampaign(name, campDes, campName, min, prem)
      .send({ from: accounts[0], gas: '2400000' });
    //we can also put the numbers into the string, it will not show error

    [ campaignAddr ] = await factory.methods.getCampaignAddr().call();

    campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddr);
});

describe('Campaign Working', () => {
    it('Factory Contract Deployed', () => {
        assert.ok(factory.options.address);
    });

    it("Factory's Campaign Name" , async () => {
        const check = await factory.methods.campaignName(campaignAddr).call();
        assert.equal(check, campName)
    })

    it('Campaign Contract Deployed', () => {
        assert.ok(campaign.options.address);
    });

    it('Manager Account', async () => {
        const manAddr = await campaign.methods.manager().call();
        assert.equal(manAddr, accounts[0]);
    });

    it('Minimum Value', async () => {
        const minVal = await campaign.methods.minContribution().call();
        assert.equal(minVal, min);
    });

    it('Premium Value', async () => {
        const preVal = await campaign.methods.premiumContribution().call();
        assert.equal(preVal, prem);
    });

    it('Manager Name', async () => {
        const manName = await campaign.methods.managerName().call();
        assert.equal(manName, name);
    });

    it('Campaign Description', async () => {
        const campDES = await campaign.methods.campaignDesc().call();
        assert.equal(campDES, campDes);
    });

    it('Campaign Name', async () => {
        const campNAME = await campaign.methods.campaignName().call();
        assert.equal(campNAME, campName);
    });



    it('Approvers Count', async () => {
        await campaign.methods.contribution().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether'),
            gas: '2400000'
        });
        
        const approvers = await campaign.methods.approversCount().call();
        assert.equal(approvers, 1);
    });
    
    it('Create Request by non-manager', async () => {
        try {
            await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
                from: accounts[1],
                gas: '2400000'
            });
            
            assert(false);
        } catch (e) {
            assert(true);
        }
    });

    it('Create Request by manager', async () => {
        await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
            from: accounts[0],
            gas: '2400000'
        });
        
        const req = await campaign.methods.requests(0).call();
        assert.equal(req.recipient, accounts[5])
    });
    
    it('Approve Request by non-contributor', async () => {
        try {
            await campaign.methods.contribution().send({
                from: accounts[1],
                value: web3.utils.toWei('2', 'ether'),
                gas: '2400000'
            });
            
            await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
                from: accounts[0],
                gas: '2400000'
            });
            
            await campaign.methods.approveRequest(0).send({
                from: accounts[2],
                gas: '2400000'
            });

            assert(false);
        } catch (e) {
            assert(true);
        }
        
    });
    
    it('Approve Request by contributor', async () => {
        await campaign.methods.contribution().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether'),
            gas: '2400000'
        });
        
        await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
            from: accounts[0],
            gas: '2400000'
        });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '2400000'
        });
        
        const req = await campaign.methods.requests(0).call();
        assert.equal(req.yesVotes, '1');

    });

    it('Finalising request by non-manager', async () => {
        try {
            await campaign.methods.contribution().send({
                from: accounts[1],
                value: web3.utils.toWei('2', 'ether'),
                gas: '2400000'
            });
            
            await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
                from: accounts[0],
                gas: '2400000'
            });
            
            await campaign.methods.approveRequest(0).send({
                from: accounts[1],
                gas: '2400000'
            });
            
            await campaign.methods.finaliseRequest(0).send({
                from: accounts[1],
                gas: '2400000'
            });
            
            assert(false);
            
        } catch (e) {
            assert(true);
        }
    });

    it('Finalize Request without criteria met', async () => {
        try {
            await campaign.methods.contribution().send({
                from: accounts[1],
                value: web3.utils.toWei('2', 'ether'),
                gas: '2400000'
            });
            
            await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
                from: accounts[0],
                gas: '2400000'
            });
            
            await campaign.methods.finaliseRequest(0).send({
                from: accounts[0],
                gas: '2400000'
            });

            assert(false);
        } catch (e) {
            assert(true);
        }
    });

    it('Finalise Request with criteria met', async () => {
        await campaign.methods.contribution().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether'),
            gas: '2400000'
        });
        
        await campaign.methods.createRequest('chumma', 1, accounts[5]).send({
            from: accounts[0],
            gas: '2400000'
        });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '2400000'
        });
        
        let initialBalance = await web3.eth.getBalance(accounts[5]); 
        // initialBalance = web3.utils.fromWei(initialBalance, 'ether');
        // initialBalance = parseFloat(initialBalance);

        await campaign.methods.finaliseRequest(0).send({
            from: accounts[0],
            gas: '2400000'
        });

        let finalBalance = await web3.eth.getBalance(accounts[5]);
        // finalBalance = web3.utils.fromWei(finalBalance, 'ether');
        // finalBalance = parseFloat(finalBalance);

        assert(finalBalance > initialBalance);

        // const req = await campaign.methods.requests(0).call();
        // assert(req.completed);
    });

});

