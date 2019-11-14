/*const Library = artifacts.require("Library");
const truffleAssert = require('truffle-assertions');

contract("Library", accounts => {
	var tokenInstance

	it("creates a new contract with the appropriate owner", async() => {
		tokenInstance = await Library.deployed();
		await assert.equal(await tokenInstance.ceoAddress(), accounts[0]);
		await assert.equal(await tokenInstance.cfoAddress(), accounts[0]);
		await assert.equal(await tokenInstance.cooAddress(), accounts[0]);
	});	

	it("checks contract pausability", async() => {
		tokenInstance = await Library.deployed();
		await assert.equal(await tokenInstance.isPaused(), true);
		await tokenInstance.unpause();
		await assert.equal(await tokenInstance.isPaused(), false);
		await tokenInstance.pause();
		await assert.equal(await tokenInstance.isPaused(), true);
	});

	it("creates a new book owned by the contract owner", async() => {
		tokenInstance = await Library.deployed();
		let book = await tokenInstance.mint("Title", "Author", "Hash");
	 	await assert.equal(await tokenInstance.ownerOf(0), accounts[0]);
	 	await assert.deepEqual(book, ["Title", "Author", "Hash"]);
	 	let bookPK = await tokenInstance.getBookKey(0);
	 	//console.log(bookPK.toNumber());
	});

	it("handles book transfering", async() => {
		tokenInstance = await Library.deployed();
		await assert.equal(await tokenInstance.isPaused(), true);
		await tokenInstance.unpause();
		await assert.deepEqual(await tokenInstance.getBook(0), ["Title", "Author", "Hash"]);
		let toAccount = accounts[1];
		let fromAccount = accounts[0];
		await tokenInstance.transfer(toAccount, 0);
		await assert.equal(await tokenInstance.ownerOf(0), toAccount);
		await tokenInstance.transferFrom(toAccount, fromAccount, 0);
	});

	it("handles delegated transfers", async() => {
		tokenInstance = await Library.deployed();
		if(await tokenInstance.isPaused()) {
			await tokenInstance.unpause();
		}

		let fromAccount = accounts[0];
		let toAccount = accounts[1];
		let senderAccount = accounts[2];
		
		for(var k=1; k<=4; k++){
			await assert.deepEqual(await tokenInstance.getBook(k), ["Title"+k, "Author"+k, "Hash"+k]);
		}

		for(var i=0; i<=4; i++){
			await tokenInstance.transfer(senderAccount, i);
			await assert.equal(await tokenInstance.ownerOf(i), senderAccount);
		}

		let senderAccBookCount = await tokenInstance.balanceOf(senderAccount);
		await assert.equal(senderAccBookCount, 5);

		try {
			await tokenInstance.transfer(senderAccount, i);
		} catch(error) {
			assert(err.message.indexOf('revert') >= 0, 'an account cannot hold more than 5 books at a time');
		}


		await tokenInstance.approve(senderAccount, 0, {from: senderAccount});
		await tokenInstance.transferFrom(senderAccount, toAccount, 0, {from: senderAccount});
		await assert.equal(await tokenInstance.ownerOf(0), toAccount);
		
		try {
			await tokenInstance.transferFrom(senderAccount, toAccount, 1, {from: senderAccount});
		} catch(err) {
			assert(err.message.indexOf('revert') >= 0, 'cannot transfer a book you do not currently own');
		}
		let howMany = await tokenInstance.balanceOf(toAccount);
		await assert.equal(howMany, 1);
	});
});*/