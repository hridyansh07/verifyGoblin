import { Injectable } from "@angular/core";
import Web3 from "web3";
import goblinTownArtifact from "../../assets/artifacts/goblinTown.json";

declare var window : any;

@Injectable({providedIn : "root"})
export class ConnectionService 
{

    web3 : any;
    enable : any;
    goblinContractAddress : any = "0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e";
    networkId : any;
    contract : any;
    accounts: any;
    account: any;



    async walletDetect() {
        try     
        {
            this.attemptConnection();
        }
        finally{
        let networkType = '';
        this.networkId = await this.getAccountId();
        console.log(this.networkId);
        if (this.networkId != 1) throw Error('Login using Ethereum Network');
        this.contract = await this.loadContract();
        this.accounts = await this.getAccounts()
        this.account = this.accounts[0];
        await this.getBalance();
        // console.log(this.account);
        // this.updateData(this.account , this.balance);
        console.log(this.contract);
        // this.getEvents();
        if(this.account)
            return true;
        else
            return false;
    }   
    }

    attemptConnection()
    {
        this.web3 = new Web3(window.ethereum);
        this.enable = this.enableMetaMask();
        console.log(this.web3);
        console.log(this.enable); 
    }

    async enableMetaMask() : Promise<any>{
        let enable = false;
        await new Promise((resolve , reject) => {
            enable = window.ethereum.enable();
        })
    }

    async loadContract()
    {
        return await new this.web3.eth.Contract(goblinTownArtifact, this.goblinContractAddress);
    }

    async getAccountId()
    {
        return await this.web3.eth.net.getId();
    }

    async getAccounts()
    {
        let accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
        return accounts;
    }

    async getBalance()
    {
        try{
            let res = await this.contract.methods.balanceOf(this.account).call({from : this.account});
            console.log(res);
        }
        catch(err)
        {
            console.log(err);
        }
    }


}