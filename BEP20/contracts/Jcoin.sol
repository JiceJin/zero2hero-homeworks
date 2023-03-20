// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Author: JiceJin

contract Jcoin is ERC20{
    address private _owner;

    constructor(string memory name_, string memory symbol_) ERC20(name_,symbol_){
        _owner = _msgSender();
    }

    modifier onlyOwner virtual{
        require(_msgSender() == _owner,"Jcoin: Only owner can do this");
        _;
    }
    //Return the contract's owner
    function owner() public view virtual returns (address){
        return _owner;
    }
    //Owner mint for an account
    function mint(address account, uint256 amount) public virtual onlyOwner returns (bool){
        _mint(account, amount);
        return true;
    }
    //Burn the account's own token
    function burn(address account, uint256 amount) public virtual returns (bool){
        require(_msgSender() == account,"Jcoin: Only your own token can be burned");
        _burn(account, amount);
        return true;
    }

}
