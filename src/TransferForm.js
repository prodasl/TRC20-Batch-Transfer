import React from "react";
import TronWeb from 'tronweb';
import BigNumber from 'bignumber.js';

const selfAccount = process.env.REACT_APP_WALLET_ADDRESS;
const privateKey = process.env.REACT_APP_WALLET_PK;

// const selfAccount = "TG4XvewdaRTHkg5tUwK9WYuh6bdkMEBKn5";
// const privateKey = "30b5692ab36ff7e743a1499cd7f4f8f69a9a0a157bca28c4f3753d669c990f4b";


const testNode = 'https://nile.trongrid.io';
const tronWeb = new TronWeb(testNode, testNode, testNode, privateKey)
// const mainNode = 'https://api.trongrid.io';
// const tronWeb = new TronWeb(mainNode, mainNode, mainNode, privateKey)

const ContractAddress = "TLsYXxdCA6VTiCCkMXKKHyw3FdNeZciQDZ";//Nile testnet

//If work on mainNode, your need apply API KEY from https://www.trongrid.io/
// tronWeb.setHeader({"TRON-PRO-API-KEY": '8644309f-5951-4f97-ac4b-9c514f7f14d2'});


class TransferForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            instance: null,
            canTransfer: false,
            currectState: "",
            showState: false,
            lock: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getContract();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }


    
    handleSubmit(event) {
        if (!this.state.canTransfer) {
            alert("The TRC20 token failed to load, you cannot use it.");
            return;
        }
        this.setState({ loading: true }, () => {
            this.transfer().then(result => this.setState({ loading: false }));
            event.preventDefault();
        });
    }


    async transfer() {
        this.setState({ lock: true });
        if (this.state.value === "") {
            this.setState({ currectState: "Data can't be empty." });
            return;
        }

        let datas = this.state.value.split(/\r\n|\n|\r/);
        for (let index = 0; index < datas.length; index++) {
            let data = datas[index].split(/,/);
            if (data.length !== 2) {
                alert("There is a problem with the data structure in " + (index + 1) + " line, please check.");
                console.log("There is a problem with the data structure in " + (index + 1) + " line, please check.");
                this.setState({ lock: false });
                return;
            }

            if (!tronWeb.isAddress(data[0])) {
                alert("Problem at line " + (index + 1) + ", account " + data[0] + " invalid or does not exist, please check.");
                console.log("Problem at line " + (index + 1) + ", account " + data[0] + " invalid or does not exist, please check.");
                this.setState({ lock: false });
                return;
            }

            if (isNaN(data[1])) {
                alert("Problem in line " + (index + 1) + ", amount "+ data[1] +" invalid, please check.");
                console.log("Problem in line " + (index + 1) + ", amount "+ data[1] +"invalid, please check.");
                this.setState({ lock: false });
                return;
            }
        }
        
        console.log("Data check success, now starting transfer.");
        try {
            for (let index = 0; index < datas.length; index++) {
                let data = datas[index].split(/,/);
                let amonut = new BigNumber(data[1]);
                let transferCount = new BigNumber(1000000).multipliedBy(amonut).toFixed();
                await this.delay(1);
                //const resp = await this.state.instance.methods.transfer(data[0], data[1]).send({ shouldPollResponse: true });
                const resp = await this.state.instance.methods.transfer(data[0], transferCount).send();
                if (resp === true) {
                    console.log("The " + data[1] + "transfer to " + data[0] + " was successful.");
                } else {
                    console.log("The " + data[1] + "transfer to " + data[0] + " has been broadcast.");
                }
            }
        } catch (error) {
            this.setState({ currectState: "Contract excute fail:" + error });
            console.log(error);
            this.setState({ value: "" });
            console.log("Data cleared.");
            this.setState({ lock: false });
        }

        this.setState({ value: "" });
        console.log("Data cleared.");
        alert("TRANSACTIONS SENT SUCESSFULLY");
        this.setState({ lock: false });
    }

    async getContract() {
        let instance = await tronWeb.contract().at(ContractAddress);
        if (instance === undefined || instance === null) {
            this.setState({ currectState: "Failed to load contract, please check contract address。" });
            this.setState({ canTransfer: false });
            return;
        }
        const allowance = await instance.methods.balanceOf(selfAccount).call();
        console.log("Your have token quantity =", allowance.toString());
        this.setState({ showState: true });
        this.setState({ instance: instance });
        this.setState({ canTransfer: true });
        this.setState({ currectState: "The contract was loaded successfully, now you can start transfer." });
    }

    delay(n) {
        return new Promise(function (resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    render() {
        const { data, loading } = this.state;

        return (
            <div>
                <h3>USDT Contract Address:  {ContractAddress}</h3>
                {
                    this.state.showState ? <span>{this.state.currectState}</span> : null
                }
                
                <form onSubmit={this.handleSubmit}>
                    <textarea style={{ height: "10rem", width: "60rem", resize: "none" }} placeholder="Please fill in the account(w) and amount(s) you want to transfer from. Example:TUj9UeqH4Cj3tqumA84kehaCEjr4yEMJEZ,2000" value={this.state.value} onChange={this.handleChange} disabled={this.state.lock} /><br />
                    {loading ? <h3>Processing....</h3> : <input type="submit" value="Send" />}   
                </form>
            </div>
        );
    }
}

export default TransferForm;
