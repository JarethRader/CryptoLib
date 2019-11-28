pragma solidity  ^0.5.11;

/// @title CryptoLib
/// @author Jareth Rader
/// @dev Handles Library Transfers

contract LibraryAccessControl{
    // This facet controls access control for CryptoBooks.
    //
    //     - The CEO: The CEO can reassign other roles and change the addresses of our dependent smart
    //         contracts. It is also the only role that can unpause the smart contract. It is initially
    //         set to the address that created the smart contract in the Library constructor.
    //
    //     - The CFO: The CFO handles the creating of new books, also is the owner of new books or any
    //			books that aren't checked out.
    //
    //     - The COO: The COO handles transfering of books
    //
    // It should be noted that these roles are distinct without overlap in their access abilities, the
    // abilities listed for each role above are exhaustive. In particular, while the CEO can assign any
    // address to any role, the CEO address itself doesn't have the ability to act in those roles. This
    // restriction is intentional so that we aren't tempted to use the CEO address frequently out of
    // convenience. The less we use an address, the less likely it is that we somehow compromise the
    // account.

    /// @dev Emited when contract is upgraded
    event ContractUpgrade(address newContract);

    // The addresses of the accounts (or contracts) that can execute actions within each roles.
    address public ceoAddress;
    address public cfoAddress;
    address public cooAddress;

    // @dev Keeps track whether the contract is paused. When that is true, most actions are blocked
    bool public paused = false;

    constructor() public {
    	// the creator of the contract is the initial CEO, CFO, and COO, They can also reassign roles to other addresses
        ceoAddress = msg.sender;
        cooAddress = msg.sender;
        cfoAddress = msg.sender;
    }

    /// @dev Access modifier for CEO-only functionality
    modifier onlyCEO() {
        require(msg.sender == ceoAddress, "Sender is not authorized");
        _;
    }

    /// @dev Access modifier for CFO-only functionality
    modifier onlyCFO() {
        require(msg.sender == cfoAddress, "Sender is not authorized");
        _;
    }

    /// @dev Access modifier for COO-only functionality
    modifier onlyCOO() {
        require(msg.sender == cooAddress, "Sender is not authorized");
        _;
    }

    modifier onlyCLevel() {
        require(
            msg.sender == cooAddress ||
            msg.sender == ceoAddress ||
            msg.sender == cfoAddress,
            "Sender is no C  Level"
        );
        _;
    }

    /// @dev Assigns a new address to act as the CEO. Only available to the current CEO.
    /// @param _newCEO The address of the new CEO
    function setCEO(address _newCEO) external onlyCEO {
        require(_newCEO != address(0), "Address is already CEO");

        ceoAddress = _newCEO;
    }

    /// @dev Assigns a new address to act as the CFO. Only available to the current CEO.
    /// @param _newCFO The address of the new CFO
    function setCFO(address _newCFO) external onlyCEO {
        require(_newCFO != address(0), "Address is already CFO");

        cfoAddress = _newCFO;
    }

    /// @dev Assigns a new address to act as the COO. Only available to the current CEO.
    /// @param _newCOO The address of the new COO
    function setCOO(address _newCOO) external onlyCEO {
        require(_newCOO != address(0), "Address is already COO");

        cooAddress = _newCOO;
    }

    /*** Pausable functionality adapted from OpenZeppelin ***/

    /// @dev Modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused {
        require(paused == false, "Contract is paused");
        _;
    }

    /// @dev Modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused == true, "Contract is not paused");
        _;
    }

    /// @dev Called by any "C-level" role to pause the contract. Used only when
    ///  a bug or exploit is detected and we need to limit damage.
    function pause() external onlyCLevel whenNotPaused {
        paused = true;
    }

    /// @dev Unpauses the smart contract. Can only be called by the CEO, since
    ///  one reason we may pause the contract is when CFO or COO accounts are
    ///  compromised.
    /// @notice This is public rather than external so it can be called by
    ///  derived contracts.
    function unpause() public onlyCEO whenPaused {
        // can't unpause if contract was upgraded
        paused = false;
    }

    function isPaused() external view returns(bool) {
    	return paused;
    }
}

//
//
//
contract LibraryBase is LibraryAccessControl {
    /*** EVENTS ***/

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a book
    ///  ownership is assigned, including creation.
    event Transfer(address from, address to, uint256 bookId);

    /// @dev Mint event. Emitted everytime a new book is created.
    event Mint(bytes _title, bytes _author, bytes _hash, uint256 _bookId);

    /*** DATA TYPES ***/

    struct Book {
        //The title of the book
        bytes title;

        //The author of the book
        bytes author;

        //The IPFS hash of the book. THis is used to access the
        //book on the IPFS
        bytes hash;
    }

    /*** CONSTANTS ***/

    // An approximation of currently how many seconds are in between blocks.
  uint256 public secondsPerBlock = 15;

    /*** STORAGE ***/

    /// @dev An array containing the book struct for all books in existence. The ID
    ///  of each book is actually an index into this array.
  Book[] books;

    /// @dev A mapping from book IDs to the address that owns them. All books have
    /// some valid owner. Upon creation it is the contract owner
  mapping (uint256 => address) public bookIdToOwner;
    // @dev A mapping from owner address to count of books that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    // also limits the number of books an address can hold
  mapping (address => uint256) ownershipBookCount;
    /// @dev A mapping from bookIDs to an address that has been approved to call
    ///  transferFrom(). Each book can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
  mapping (uint256 => address) public bookIdToApproved;

    // @dev Assigns ownership of a specific book to an address.
  function _transfer(address _from, address _to, uint256 _bookId) internal {
    ownershipBookCount[_to]++;
    bookIdToOwner[_bookId] = _to;

    if (_from != address(0)) {
      ownershipBookCount[_from]--;
      delete bookIdToApproved[_bookId];
    }

    emit Transfer(_from, _to, _bookId);
  }

  // @dev An internal method that creates a new book and stores it. This
  // method doesn't do any checking, so it should only be called when the
  // input data is kknow to be valid.
  function _mint(bytes memory _title, bytes memory _author, bytes memory _hash) internal returns (uint256 bookId) {
    Book memory book = Book({
      title: _title,
      author: _author,
      hash: _hash

    });
    bookId = books.push(book) - 1;

    emit Mint(_title, _author, _hash, bookId);

    _transfer(address(0x0), msg.sender, bookId);
  }

  // Any C-level can fix how many seconds per blocks are currently observed.
    function setSecondsPerBlock(uint256 secs) external onlyCLevel {
        require(secs < 1 minutes, "Must be less than 60 seconds");
        secondsPerBlock = secs;
    }
}

/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _bookId) external view returns (address owner);
    function approve(address _to, uint256 _bookId) external;
    function transfer(address _to, uint256 _bookId) external;
    function transferFrom(address _from, address _to, uint256 _bookId) external;

    // Events
    event Transfer(address from, address to, uint256 bookId);
    event Approval(address owner, address approved, uint256 bookId);

    // Optional
    // function name() public view returns (string name);
    // function symbol() public view returns (string symbol);
    // function tokensOfOwner(address _owner) external view returns (uint256[] bookIds);
    // function tokenMetadata(uint256 _bookId, string _preferredTransport) public view returns (string infoUrl);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}

contract LibraryOwnership is LibraryBase, ERC721 {
  /*** CONSTANTS ***/

  string public constant name = "CryptoLibrary";
  string public constant symbol = "CL";

  bytes4 constant InterfaceID_ERC165 =
    bytes4(keccak256('supportsInterface(bytes4)'));

  bytes4 constant InterfaceID_ERC721 =
    bytes4(keccak256('name()')) ^
    bytes4(keccak256('symbol()')) ^
    bytes4(keccak256('totalSupply()')) ^
    bytes4(keccak256('balanceOf(address)')) ^
    bytes4(keccak256('ownerOf(uint256)')) ^
    bytes4(keccak256('approve(address,uint256)')) ^
    bytes4(keccak256('transfer(address,uint256)')) ^
    bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    bytes4(keccak256('tokensOfOwner(address)'));

  /*** INTERNAL FUNCTIONS ***/

  function _owns(address _claimant, uint256 _bookId) internal view returns (bool) {
    return bookIdToOwner[_bookId] == _claimant;
  }

  function _approvedFor(address _claimant, uint256 _bookId) internal view returns (bool) {
    return bookIdToApproved[_bookId] == _claimant;
  }

  function _approve(address _to, uint256 _bookId) internal {
    bookIdToApproved[_bookId] = _to;

    emit Approval(bookIdToOwner[_bookId], bookIdToApproved[_bookId], _bookId);
  }

  /*** ERC721 IMPLEMENTATION ***/

  function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
    return ((_interfaceID == InterfaceID_ERC165) || (_interfaceID == InterfaceID_ERC721));
  }

  function totalSupply() public view returns (uint256) {
    return books.length;
  }

  function balanceOf(address _owner) public view returns (uint256) {
    return ownershipBookCount[_owner];
  }

  function ownerOf(uint256 _bookId) external view returns (address) {
    return bookIdToOwner[_bookId];

  }

  function approve(address _to, uint256 _bookId) external whenNotPaused{
    require(_owns(msg.sender, _bookId), "Sender does not own this book");

    _approve(_to, _bookId);
  }

  function transfer(address _to, uint256 _bookId) external whenNotPaused {
    //require(_to != address(0));
    require(_to != address(this), "Cannot transfer to self");
    require(_owns(msg.sender, _bookId), "Sender does not own this book");
    if(_to != cfoAddress) {
      require(balanceOf(_to) <= 5, "Not enough funds");
    }

    _transfer(msg.sender, _to, _bookId);
  }

  function transferFrom(address _from, address _to, uint256 _bookId) external whenNotPaused {
    //require(_to != address(0));
    require(_to != address(this), "Invalid Address");
    if(msg.sender != cooAddress){
      require(_approvedFor(msg.sender, _bookId), "Book is not approved for this address");
    }
    require(_owns(_from, _bookId), "Owner does not own this book");

    _transfer(_from, _to, _bookId);
  }

  function tokensOfOwner(address _owner) external view returns (uint256[] memory result) {
    uint256 balance = balanceOf(_owner);

    if (balance == 0) {
      return new uint256[](0);
    } else {
      result = new uint256[](balance);
      uint256 maxbookId = totalSupply();
      uint256 idx = 0;

      uint256 bookId;
      for (bookId = 1; bookId <= maxbookId; bookId++) {
        if (bookIdToOwner[bookId] == _owner) {
          result[idx] = bookId;
          idx++;
        }
      }
    }

    return result;
  }

}
contract Library is LibraryOwnership {

    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    /// @notice Creates the main CryptoLibrary smart contract instance.
    constructor() public {
        // Starts paused.
        paused = true;
    }

    /// @dev Used to mark the smart contract as upgraded, in case there is a serious
    ///  breaking bug. This method does nothing but keep track of the new contract and
    ///  emit a message indicating that the new address is set. It's up to clients of this
    ///  contract to update to the new contract address in that case. (This contract will
    ///  be paused indefinitely if such an upgrade takes place.)
    /// @param _v2Address new address
    function setNewAddress(address _v2Address) external onlyCEO whenPaused {
        // See README.md for updgrade plan
        newContractAddress = _v2Address;
        emit ContractUpgrade(_v2Address);
    }

    // @dev Used to create and add a new book to the library
    function mint(bytes calldata _title, bytes calldata _author, bytes calldata _hash) external onlyCOO returns (uint256 bookId) {
        return _mint(_title, _author, _hash);
    }

    function getBook(uint256 _bookId) external view returns (bytes memory title, bytes memory author, bytes memory hash) {
        Book storage book = books[_bookId];
        title = book.title;
        author = book.author;
        hash = book.hash;
    }

    function contractUpdate() external onlyCEO whenPaused {
        require(newContractAddress != address(0), "Updated contract must possess new address");

        // Actually unpause the contract
        paused = false;
    }
}
