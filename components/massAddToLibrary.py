import csv
import json
import numpy as np
from web3 import Web3

private_key = "f39b0592c61fbe6a5c9b2822b05e37c214da5d23fcc599c214c7f20be51e809f"
infura_url = "https://rinkeby.infura.io/v3/aef01b012e024dc5a94f3096aa2be24f" 

web3 = Web3(Web3.HTTPProvider(infura_url))

libraryAddress = "0xac7D84341C1DebEB09C9848A9EE0279a85A80D07"
libraryABI = json.loads('[{"constant":true,"inputs":[{"internalType":"bytes4","name":"_interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cfoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bookIdToOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newCEO","type":"address"}],"name":"setCEO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newCOO","type":"address"}],"name":"setCOO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newCFO","type":"address"}],"name":"setCFO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"secs","type":"uint256"}],"name":"setSecondsPerBlock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"contractUpdate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_v2Address","type":"address"}],"name":"setNewAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"secondsPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"result","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bookIdToApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cooAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_title","type":"bytes"},{"internalType":"bytes","name":"_author","type":"bytes"},{"internalType":"bytes","name":"_hash","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"bookId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"getBook","outputs":[{"internalType":"bytes","name":"title","type":"bytes"},{"internalType":"bytes","name":"author","type":"bytes"},{"internalType":"bytes","name":"hash","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"bookId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"approved","type":"address"},{"indexed":false,"internalType":"uint256","name":"bookId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes","name":"_title","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"_author","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"_hash","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"_bookId","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newContract","type":"address"}],"name":"ContractUpgrade","type":"event"}]')
libraryContract = web3.eth.contract(address=libraryAddress, abi=libraryABI)

title = 'Thus Spake Zarathustra'
author = 'Freidrich Nietzsche'
IPFSHash = 'QmeADf5mr37ibFq4nkFj2i13dQagod4tVKExvevTaEry8w'
  
bytesTitle = [ord(c) for c in title]
bytesAuthor = [ord(c) for c in author]
bytesHash = [ord(c) for c in IPFSHash]


nonce = web3.eth.getTransactionCount("0xac7D84341C1DebEB09C9848A9EE0279a85A80D07")

tx = libraryContract.functions.mint(bytes(bytesTitle), bytes(bytesAuthor), bytes(bytesHash)).buildTransaction({ 'nonce': nonce, 'to': libraryAddress, 'gas': 2000000, 'gasPrice': web3.toWei('50', 'gwei') })

signed_tx = web3.eth.account.signTransaction(tx, private_key)

tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)

# with open('./resources/Cryptolib_list.csv') as csv_file:
#     csv_reader = csv.reader(csv_file, delimiter=",")
#     line_count = 0
#     for row in csv_reader:
#         print(row[0])
#     print(w3.eth.blockNumber)