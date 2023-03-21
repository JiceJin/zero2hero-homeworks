# 流动性挖矿合约<br>

## 0x3d48903c1ABACf7082Dee225328B247873A8b747 :write (verified)(BSCtestnet)<br>

## 主要代码:<br>
```
contract LiquidityMining is ReentrancyGuard{
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    /* =========STATE========= */

    // 质押奖励的发放速率
    uint256 public rewardRate = 1;

    // 每次有用户操作时，更新为当前时间
    uint256 public lastUpdateTime;

    // 我们前面说到的每单位数量获得奖励的累加值，这里是乘上奖励发放速率后的值
    uint256 public rewardPerTokenStored;

    // 在单个用户维度上，为每个用户记录每次操作的累加值，同样也是乘上奖励发放速率后的值
    mapping(address => uint256) public userRewardPerTokenPaid;

    // 用户到当前时刻可领取的奖励数量
    mapping(address => uint256) public rewards;

    // 池子中质押总量
    uint256 private _totalSupply;

    // 用户的余额
    mapping(address => uint256) private _balances;

    //质押代币(JIC)
    IERC20 stakingToken;//0x07f470F7793FeFb0F0602bAfC783023c81F5aE44(Jcoin)

    //奖励代币(JIC)
    IERC20 rewardToken;//0x07f470F7793FeFb0F0602bAfC783023c81F5aE44(Jcoin)

    constructor (address Token){
        stakingToken = IERC20(Token);
        rewardToken = IERC20(Token);
    }


    /* ==========FUNCTION========== */

    // 计算当前时刻的累加值
    function rewardPerToken() public view returns (uint256) {
        // 如果池子里的数量为0，说明上一个区间内没有必要发放奖励，因此累加值不变
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        // 计算累加值，上一个累加值加上最近一个区间的单位数量可获得的奖励数量
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate)
                    .mul(1e18).div(_totalSupply)
            );
    }

    // 获取当前有效时间，如果活动结束了，就用结束时间，否则就用当前时间
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp;
    }

    // 计算用户可以领取的奖励数量
    // 质押数量 * （当前累加值 - 用户上次操作时的累加值）+ 上次更新的奖励数量
    function earned(address account) public view returns (uint256) {
        return
            _balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18).add(rewards[account]);
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function collect(uint256 amount) external nonReentrant updateReward(msg.sender) checkRewards(msg.sender,amount){
        require(amount > 0, "Cannot collect 0");
        rewards[msg.sender] -= amount;
        rewardToken.safeTransfer(msg.sender, amount);
        emit CollectRewards(msg.sender,amount);
    }

    /* ==========MODIFIER========== */

    modifier updateReward(address account) {
        // 更新累加值
        rewardPerTokenStored = rewardPerToken();
        // 更新最新有效时间戳
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            // 更新奖励数量
            rewards[account] = earned(account);
            // 更新用户的累加值
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    modifier checkRewards(address account,uint256 amount) {
        uint256 reward = rewards[account];
        require(reward >= amount,"Cannot collect so much");
        _;
    }

    /* ========== EVENTS ========== */

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event CollectRewards(address indexed user, uint256 amount);
}
```