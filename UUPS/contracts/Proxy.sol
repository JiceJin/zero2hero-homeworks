// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./logic1.sol";
import "./logic2.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface Ilogic{
    function initialize() external;
}

contract Proxy is Initializable{
    address public _logic;
    uint256 public a;
    uint256 number = 11;
    address admin;
    uint256 constant B = 113;

    constructor(address logic_){
        _logic = logic_;
        admin = msg.sender;
        (bool success, bytes memory returndata) = _logic.delegatecall(abi.encodeWithSignature("initialize()"));
        require(success,"initialize fail");
    }

    function delecall_upgrade(bytes memory data) external {
        (bool success, bytes memory returndata) = _logic.delegatecall(data);
        require(success,"delegate call fail");

    }

    function delecall_returnA(bytes memory data) external returns(uint256){
        (bool success, bytes memory returndata) = _logic.delegatecall(data);
        require(success,"delegate call fail");
        return abi.decode(returndata,(uint256));
    }
}