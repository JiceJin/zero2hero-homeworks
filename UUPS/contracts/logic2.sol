// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract logic2 is Initializable{
    address public __logic;
    uint256 public __a;
    uint256 A;
    address admin;

    event changeLogic(address indexed old_, address indexed new_);
    event showA(uint256 A_);

    function initialize() public initializer{
        __a = 1;
    }

    function returnA(uint256 a) external returns(uint256){
        emit showA(a);
        return A;
    }
    
    function upgrade(address to) external {
        require(msg.sender == admin,"NOT admin");
        emit changeLogic(__logic, to);
        __logic = to;
    }
}