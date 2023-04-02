# 掌握的知识
- constant变量的插槽特殊，如果proxy中有constant变量，logic的插槽会有混乱（暂时不知道constant变量为什么造成这样的后果）
- 掌握插槽的重要性
- initialize合约proxy和logic都要继承
- 将事件、函数的实现都放在logic中

## 合约部署<br>

## bsctestnet:<br>
logic1: 0xf1dA3CEDeD19e6EaA08b44fbD1EF84aEef87cb13<br>
logic2: 0x9Bc9D6a75a35F6158B9Eff630b8F0095bE6670c5<br>
proxy: 0x14a61206Da8db96fe1C4A09E59FfF6E2474343Fb<br>

## logic1.sol: <br>
```
    import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

    contract logic1 is Initializable{
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
            // require(msg.sender == admin,"NOT admin");
            emit changeLogic(__logic, to);
            __logic = to;
        }
    }
```

## logic2.sol: <br>
```
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
```

## proxy.sol: <br>
```
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
```