pragma solidity ^0.5.3;

import "./VotingProxy.sol";

contract VotingProxyFactory {
    event ProxyDeploy(address proxy, address indexed cold, address indexed hot);

    uint256 constant internal SALT = 0;

    function myProxy() public returns (address addr) {
        return newProxy(msg.sender, msg.sender);
    }
    
    function newProxy(address cold, address hot) public returns (address addr) {
        bytes memory code = proxyInitCode(cold, hot);
        address futureAddr = proxyAddressForCode(code);

        bool alreadyDeployed;
        assembly { alreadyDeployed := extcodesize(futureAddr) }
        require(!alreadyDeployed, "FACTORY_PROXY_LIVE");

        uint256 salt = SALT;
        assembly {
            addr := create2(
                0, // send 0 ETH
                add(code, 0x20), // code initial position
                mload(code), // code length,
                salt
            )
        }

        require(addr == futureAddr, "FACTORY_CREATE_FAILED"); // ethereum is broken type error
        emit ProxyDeploy(addr, cold, hot);
    }
    
    function proxyAddress(address cold, address hot) public view returns (address addr) {
        return proxyAddressForCode(proxyInitCode(cold, hot));
    }

    function proxyAddressForCode(bytes memory initcode) internal view returns (address addr) {
        bytes32 h = keccak256(abi.encodePacked(uint8(0xff), address(this), SALT, keccak256(initcode)));
        assembly { addr := h }
    }

    function proxyInitCode(address cold, address hot) public view returns (bytes memory) {
        bytes memory args = new bytes(64);
        assembly {
            mstore(add(args, 0x20), cold)
            mstore(add(args, 0x40), hot)
        }
        
        return votingProxyInitcode(args);
    }
    
    function votingProxyInitcode(bytes memory args) public view returns (bytes memory) {
        bytes memory code = type(VotingProxy).creationCode;
        uint256 codeLength = code.length;
        uint256 argsLength = args.length;
        bytes memory initCode = new bytes(argsLength + codeLength);
        
        uint256 codePtr;
        uint256 argsPtr;
        uint256 initCodePtr;
        
        assembly {
            codePtr := add(code, 0x20)
            argsPtr := add(args, 0x20)
            initCodePtr := add(initCode, 0x20)
        }
        
        memcpy(initCodePtr, codePtr, codeLength);
        memcpy(initCodePtr + codeLength, argsPtr, argsLength);
        
        return initCode;
    }
    
    // From: https://github.com/Arachnid/solidity-stringutils/blob/master/src/strings.sol
    function memcpy(uint256 dest, uint256 src, uint256 len) private pure {
        // Copy word-length chunks while possible
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        // Copy remaining bytes
        uint mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }
    
    /*
    // More optimized but way hackier version
    function proxyInitCode(address owner) public view returns (bytes memory) {
        bytes memory code = type(VotingProxy).creationCode;
        
        uint256 codePointer;
        uint256 oldFreePointer;
        uint256 codeLength = code.length;

        assembly {
            codePointer := add(code, 0x20)
            oldFreePointer := mload(0x40)
            mstore(0x40, add(oldFreePointer, 0x20)) // bump the free memory pointer by 32
            mstore(add(codePointer, codeLength), owner) // append init param at the end
            mstore(code, add(mload(code), 0x20)) // set new length
        }
        
        require((codePointer + codeLength) / 32 == oldFreePointer / 32 - 1, "yo wat");
        
        return code;
    }
    */
}