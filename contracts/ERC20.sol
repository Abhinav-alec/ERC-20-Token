// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OnePiece is ERC20, Ownable {
   constructor(address initialOwner) Ownable(initialOwner) ERC20("OnePiece", "OP") {
   //must deploy the contract using initialOwner....
     
        uint256 totalSupply = 100000*(10**uint256(decimals()));
        _mint(initialOwner, totalSupply);
    }

    function mint(address account, uint256 amount) public onlyOwner returns (bool) {
        require(account != address(this) && amount!=uint256(0), "ERC20: Function mint invalid inputs");
        _mint(account, amount);
        return true;
    }

    function burn(address account, uint256 amount) public onlyOwner returns(bool){
        require(account != address(this) && amount!=uint256(0), "ERC20: Function burn invalid inputs");
        _burn(account, amount);
        return true;
    }

    function withdraw(uint256 amount) public onlyOwner returns(bool){
        require(amount<=address(this).balance , "ICO: Function withdraw invalid inputs");
        payable(_msgSender()).transfer(amount);
        return true;
    }

    function buy()public payable returns(bool){
        require(msg.sender.balance>=msg.value && msg.value != 0 ether,"ICO : Function buy invalid input");
        uint256 amount = msg.value*1000;
        _transfer(owner(),_msgSender(),amount);
        
        return true;
    }
}
