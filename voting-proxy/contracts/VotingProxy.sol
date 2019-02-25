pragma solidity ^0.5.3;

interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);
}

interface Voting {
    function vote(uint256 _voteId, bool _supports, bool _executesIfDecided) external;
}

contract VotingProxy {
    address public cold;
    address public hot;
    
    ERC20 constant internal ANT = ERC20(0xbeef);
    
    modifier isKey {
        require(msg.sender == hot || msg.sender == cold);
        _;
    }
    
    constructor(address _cold, address _hot) public {
        cold = _cold;
        hot = _hot;
    }
    
    function withdraw(uint256 _amount) external isKey {
        ANT.transfer(cold, _amount);
    }
    
    function setHot(address _hot) external isKey {
        hot = _hot;
    }
    
    function proxyVote(address[] calldata _votingAddrs, uint256[] calldata _voteIds, bool[] calldata _votes) external isKey {
        // don't check array integrity, rely on an out of bounds crash if badly formatted
        uint256 length = _votingAddrs.length;
        for (uint256 i = 0; i < length; i++) {
            Voting(_votingAddrs[i]).vote(_voteIds[i], _votes[i], true);
        }
    }
}