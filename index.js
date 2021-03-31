/*
    Krist Module for interacting with the Krist API at http://krist.ceriat.net/
    Fisher Medders 2021 -- fishermedders.com
    Code is licensed under the 'WTFPL', otherwise known as the 'Do What the Fuck You Want to Public License'
    I think you get the gist on that one.
*/

const fetch = require('node-fetch');
var events = require('events');
var eventEmitter = new events.EventEmitter();

/*
    Address Methods
*/

/*
    Address makes an address object from an address string.
    Param 1: String: address
*/
class Address {
    constructor(address) {
        this.address = address;
        this.getAddress = function() { return this.address }
        this.getBalance = function(callback) {
            exports.getBalance(this.address, balance => { callback(balance); });
        },
        this.getTotalIn = function(callback) {
            exports.getTotalIn(this.address, totalIn => { callback(totalIn); });
        },
        this.getTotalOut = function(callback) {
            exports.getTotalOut(this.address, totalOut => { callback(totalOut); });
        },
        this.getFirstSeen = function(callback) {
            exports.getFirstSeen(this.address, firstSeen => { callback(firstSeen); });
        }
    }
}

/**
 * Address Methods.
 * @exports kristjs/Address
 */
const AddressMethods = {
    /**
     * Returns Krist Address JSON Object from Address String.
     *
     * @param {string} Address - The Krist Address
     * @return {Object} A JSON Object of the Krist Address
     */
    getAddress(address) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/addresses/' + address)
                .then(res => res.json())
                .then(addressObject => { resolve(addressObject) });
        })
    },
    /**
     * Returns Krist Address Balance from Address String.
     *
     * @param {string} Address - The Krist Address
     * @return {number} Balance of the specified Krist Address
     */
    getBalance(address) {
        return this.getAddress(address).then(address => { return address.address.balance })
    },
    /**
     * Returns Krist Address Total amount in from Address String.
     *
     * @param {string} Address - The Krist Address
     * @return {number} Total amount in of the specified Krist Address
     */
    getTotalIn(address) {
        return this.getAddress(address).then(address => { return address.address.totalin })
    },
    /**
     * Returns Krist Address Total amount out from Address String.
     *
     * @param {string} Address - The Krist Address
     * @return {number} Total amount out of the specified Krist Address
     */
    getTotalOut(address) {
        return this.getAddress(address).then(address => { return address.address.totalout })
    },
    /**
     * Returns Krist Address Firstseen Date and Time from Address String.
     *
     * @param {string} Address - The Krist Address
     * @return {string} ISO-8601 date timestamp of the first time the specified Krist Address was seen
     */
    getFirstSeen(address) {
        return this.getAddress(address).then(address => { return address.address.firstseen })
    },
    /**
     * Returns a list of addresses based on optional parameters.
     *
     * @param {number} [limit=50] The limit of data receiving
     * @param {number} [offset=0] The amount to offset the query by
     * @return {Object[]} List of addresses and associated information
     */
    getAllAddresses(limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/addresses?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(addresses => { resolve(addresses) });
        })
    },
    getRichestAddresses(limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/addresses/rich?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(addresses => { resolve(addresses) });
        })
    },
    getRecentTransactions(address, limit = 50, offset = 0, excludeMined = false) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/addresses/' + address + '/transactions?' + new URLSearchParams({
                limit: limit,
                offset: offset,
                ...(excludeMined == true && {excludeMined: excludeMined})
            }))
                .then(res => res.json())
                .then(transactions => { resolve(transactions) });
        })
    },
    getAddressNames(address, limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/addresses/' + address + '/names?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(names => { resolve(names) });
        })
    }
}

const BlockMethods = {
    getAllBlocks(limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(blocks => { resolve(blocks) });
        })
    },
    getBlocksLowestHash(limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/lowest?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(blocks => { resolve(blocks) });
        })
    },
    getLatestBlocks(limit = 50, offset = 0) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/latest?' + new URLSearchParams({
                limit: limit,
                offset: offset
            }))
                .then(res => res.json())
                .then(blocks => { resolve(blocks) });
        })
    },
    getBlock(height) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/' + height)
                .then(res => res.json())
                .then(block => { resolve(block) });
        })
    },
    getLastBlock() {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/last')
                .then(res => res.json())
                .then(block => { resolve(block) });
        })
    },
    submitBlock(address, nonce) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/submit')
                .then(res => res.json())
                .then(serverResult => { resolve(serverResult) });
        })
    },
    getBaseReward() {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/basevalue')
                .then(res => res.json())
                .then(baseReward => { resolve(baseReward.base_value) });
        })
    },
    getBlockReward() {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/value')
                .then(res => res.json())
                .then(blockReward => { resolve(blockReward.value) });
        })
    },
    getRewards() {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/blocks/value')
                .then(res => res.json())
                .then(rewards => { resolve(rewards) });
        })
    }
}

const TransactionMethods = {
    listTransactions(limit = 50, offset = 0, excludeMined = false) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/transactions?' + new URLSearchParams({
                limit: limit,
                offset: offset,
                ...(excludeMined == true && {excludeMined: excludeMined})
            }))
                .then(res => res.json())
                .then(transactions => { resolve(transactions) });
        })
    },
    listLatestTransactions(limit = 50, offset = 0, excludeMined = false) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/transactions/latest?' + new URLSearchParams({
                limit: limit,
                offset: offset,
                ...(excludeMined == true && {excludeMined: excludeMined})
            }))
                .then(res => res.json())
                .then(latestTransactions => { resolve(latestTransactions) });
        })
    },
    getTransaction(id) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/transactions/' + id)
                .then(res => res.json())
                .then(transaction => { resolve(transaction) });
        })
    },
    makeTransaction(privatekey, to, amount, metadata) {
        return new Promise((resolve, reject) => {
            fetch('https://krist.ceriat.net/transactions/', {method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }, body: JSON.stringify({
                privatekey: privatekey,
                to: to,
                amount: amount,
                metadata: metadata
            })})
                .then(res => res.json())
                .then(transaction => { resolve(transaction) });
        })
    },
}

module.exports.Address = AddressMethods;
module.exports.Block = BlockMethods;
module.exports.Transaction = TransactionMethods;
module.exports.Address.Address = Address;