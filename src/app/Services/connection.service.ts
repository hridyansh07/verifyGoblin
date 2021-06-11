import {Injectable} from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import {environment} from "../../environments/environment";
import Web3 from "web3";
import {AccountModel} from "../Models/accountModel";
import supplyChainArtifact from "../../../../../App/build/contracts/SupplyChain.json";
import { RawItem } from '../Models/rawItemModel';
import { FinishedItem } from '../Models/finishedItemModel';

declare var window : any; 

@Injectable({providedIn : "root"})
export class ConnectionService {
    account : any;
    accounts : any;
    web3 : any;
    status : string;
    enable : any;
    error : string;
    balance : any;
    networkId : any;
    AccountData : BehaviorSubject<AccountModel> = new BehaviorSubject(new AccountModel(0,0)); 
    contract : any;
    deployedNetwork :any ;
    private _rawItemsUpc :Array<number> = []; 
    private _finishedItemUpc : Array<number> = [];
    private _rawItems : Array<RawItem> = [new RawItem(0,0)];
    private _finishedItems : Array<FinishedItem> = [new FinishedItem(0,0)];
    private _bookedRawItems : Array<number> = [];
    rawItems  : BehaviorSubject<RawItem>= new BehaviorSubject(new RawItem(0,0));
    bookedRawItems : BehaviorSubject<number> = new BehaviorSubject(0);
    finsihedItems : BehaviorSubject<FinishedItem> = new BehaviorSubject(new FinishedItem(0,0));
    events = ["ItemCreated" , "ItemCertified" , "ItemProduced" , "ItemPackaged" , "ItemForSale" , "ItemPurchased"];

    async walletDetect() {
        try     
        {
            this.attempConnection();
        }
        finally{
        let networkType = 'ropsten';
        this.networkId = await this.getAccountId();
        console.log(this.networkId);
        if (this.networkId != 3) throw Error('Login using Ropsten Network');
        this.accounts = await this.getAccounts()
        this.account = this.accounts[0];
        await this.getBalance();
        console.log(this.account);
        this.updateData(this.account , this.balance);
        this.contract = await this.loadContract();
        console.log(this.contract);
        this.getEvents();
        if(this.account)
        {
            return true;

        }
        else{
            return false;
        }
    }   
    }

    async loadContract()
    {
        this.deployedNetwork = supplyChainArtifact.networks[this.networkId];
        console.log(this.deployedNetwork);
        return await new this.web3.eth.Contract(supplyChainArtifact.abi ,this.deployedNetwork.address);

    }

    updateData(address , balance){
        this.AccountData.next(new AccountModel(address,balance));
    }



    async enableMetaMask() : Promise<any>{
        let enable = false;
        await new Promise((resolve , reject) => {
            enable = window.ethereum.enable();
        })
    }

    attempConnection()  
    {
        this.web3 = new Web3(window.ethereum);
        this.enable = this.enableMetaMask();
        console.log(this.web3);
        console.log(this.enable);
    
    }
    
    getEvents()
    {
    this.contract.events.allEvents({
            fromBlock : 0,
            toBlock: 'latest',
        }, (err , event) => {
            console.log(event.event);
            this.processEvents(event);
        }
        );
    }

processEvents(event : any)
{
    if(event != null )
    {
        if (event.event.includes("RawItem"))
        {
            var upc = event.returnValues.rawUpc
            var found : boolean = false ;
            length = this._rawItemsUpc.length
            console.log(length) 
            for (var i=0 ; i<=length ; i++)
            {
                console.log("here");
                console.log(i);
                if(this._rawItems[i].Upc === upc)
                {
                    found = true; 
                    if(this._rawItems[i].State == 4)
                    {
                        console.log("Already Processed")
                        this.rawItems.next(this._rawItems[i]);
                    }
                    else
                    {
                    this._rawItems[i].State = this._rawItems[i].State + 1    
                    this.rawItems.next(this._rawItems[i]);
                    }
                }
            }
            if(!found)
            {
                try{
                console.log("here");
                let item = new RawItem(upc , environment.rawItemState.Planted);
                console.log(item);
                this._rawItemsUpc.push(item.Upc);
                console.log(this._rawItemsUpc);
                this.rawItems.next(item);
                this._rawItems.push(item);
                }
                catch(err)
                {
                    console.log("Error Here "+err);
                }
            }
        }
        if(event.event.includes("ItemCreated"))
        {
            let upc = event.returnValues.finishedUpc;
            console.log(upc);   
            this._bookedRawItems.push(upc);
            this.bookedRawItems.next(upc);
            let item = new FinishedItem(upc , environment.finishiedItemState.Booked);
            console.log(item);
            this._finishedItems.push(item);
            this._finishedItemUpc.push(item.Upc);
        }
        if(event.event.match(/^(ItemCertified|ItemProduced|ItemPackaged|ItemForSale|ItemPurchased)$/))
        {
            console.log(event);
            console.log("finished Item");
            var found : boolean = false;
            let upc = event.returnValues.finishedUpc;
            console.log(upc);
            for(var i=0 ; i < this._finishedItems.length ; i++)
            {
                if(this._finishedItems[i].Upc === upc)
                {
                    found = true;
                    console.log(found);
                    if(this._finishedItems[i].State == 6)
                    {
                        console.log("Already for Sale");
                        this.finsihedItems.next(this._finishedItems[i]);
                    }
                    else
                    {
                        this._finishedItems[i].State = this._finishedItems[i].State  +  1;
                        this.finsihedItems.next(this._finishedItems[i]);
                    }
                }
            }
            if(!found) 
            {
                console.log("Creating New Finished Item");
                // let item = new FinishedItem(upc , environment.finishiedItemState.Produced);
                // this._finishedItems.push(item);
                // this._finishedItemUpc.push(item.Upc);
                // this.finsihedItems.next(item);
            }
        }
    }
}


    async getBalance()
    {
        let balance; 
        console.log(this.accounts[0]);
        await this.web3.eth.getBalance(this.accounts[0]).then((bal) => {
            console.log(bal);
            balance = this.web3.utils.fromWei(bal, 'ether');    
        })
        this.balance = balance;
        
    }

    private async  getAccountId()
    {
        let networkId = await this.web3.eth.net.getId();
        return networkId;
    }

    private async getAccounts() 
    {
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
        return accounts;
    }

    async addFarmer(address)
    {
        try{
    
        this.contract.methods.addFarmer(address).send({from : this.account});
        }
        catch(err){
            console.log(err);
        }
        // console.log(address);
    }

    async addConsumer(address)
    {
        try{
    
        this.contract.methods.addConsumer(address).send({from : this.account});
        }
        catch(err){
            console.log(err);
        }
        // console.log(address);
    }
    async addDistributor(address)
    {
        try{
    
        this.contract.methods.addDistributor(address).send({from : this.account});
        }
        catch(err){
            console.log(err);
        }
        // console.log(address);
    }
    async addAuditor(address)
    {
        try{
    
        this.contract.methods.addAuditor(address).send({from : this.account});
        }
        catch(err){
            console.log(err);
        }
        // console.log(address);
    }
    async addProducer(address)
    {
        try{
    
        this.contract.methods.addProducer(address).send({from : this.account});
        }
        catch(err){
            console.log(err);
        }
        // console.log(address);
    }



    async renounce()
    {
        try {
            let response = await this.contract.methods.removeFarmert().send({from : this.account});
            console.log(response);
        }
        catch(err)
        {
            console.log(err);
        }
    }


    async plantRawItem(Upc : number, farmName, farmInfo ,Latitude : string  , Longitude : string)
    {
        try{
        console.log(Upc);
        console.log(this.account);
        // var BN =  this.web3.utils.BN;
        // let upc  = new BN(Upc);
        let account = this.account;
        var response = await this.contract.methods.plantRawItem(
            // this.web3.utils.toBN(Upc), 
            Upc,
            account , 
            farmName, 
            farmInfo , 
            Latitude ,
            Longitude ).
            send({from : this.account});
        }
        catch(err)
        {
            console.log(err);
            console.log(response);
        }
    }

    async harvestRawItem(Upc : number , notes : string)
    {
        let response = await this.contract.methods.harvestRawItem(Upc , notes).send({from : this.account});
        console.log(response);
    }


    async processRawItem (Upc : number)
    {
        let response = await this.contract.methods.proccessRawItem(Upc).send({from : this.account});
        console.log(response);
    }

    async createFinishedProduct(Upc : number , productId : number)
    {
        try{
            let response = await this.contract.methods.createFinishedProduct(Upc, productId).send({from : this.account});
            }
        catch(error)
        {
            console.log(this.error);        
        }
    }

    async produceFinishedProduct(productUpc : number, productNotes : string , productPrice : number )
    {

        let balance = this.web3.utils.toWei(productPrice , 'ether');
        try{
        let response = this.contract.methods.produceFinishedProduct(productUpc , productNotes ,balance ).send({from : this.account});
        console.log(response);
        }
        catch(error){
            console.log(error);
        }
    }

    async auditRawItem(Upc : number , notes : string)
    {
        let response = await this.contract.methods.auditRawItem(Upc, notes).send({from : this.account});
        console.log(response);
    }

    async auditFinishedItem(Upc : number , notes : string)
    {
    try{
        let response = this.contract.methods.certifyFinishedProduct(Upc ,notes).send({from : this.account});
            console.log(response);
        }
    catch(error)
        {
            console.log(error);
        }
    }

    async packageFinishedProdcut(Upc : number)
    {
        try{
            let response = this.contract.methods.packageFinishedProdcut(Upc).send({from : this.account});
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async setItemForSale(Upc : number)
    {
        try
        {
            let response = this.contract.methods.forSaleFinishedProduct(Upc).send({from : this.account});
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async buyItemForSale(Upc : number  )
    {
        let price  : number = 0.002;
        const priceInWei  = this.web3.utils.toWei(String(price) , 'ether');
        console.log( priceInWei);
        try{
            let response = this.contract.methods.buyFinishedProduct(Upc).send({from : this.account , value : priceInWei});
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async tryGetData()
    {
        let rawItemUpc = 0;
        try{
        const data  = this.contract.methods.fetchRawItemBufferData(rawItemUpc).send({from : this.account});
        console.log(data);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}