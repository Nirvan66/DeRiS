pragma solidity >=0.4.22 <0.7.0;
contract Deris{
    struct rider{
        uint escrow;
        bytes32[] pickup;
        bytes32[] dropoff;
        uint index;
    }
    
    struct driver{
        uint[] pickup;
        uint radius;
    }
    
    // mapping (address => address) public  pairing;
    mapping (address => driver) drivers;
    mapping (address => rider) riders;
    
    address [] waitingRiders;
    
    constructor() public {
        
    }
    
    function clockIn(uint [] memory loc, uint rad) public{
        drivers[msg.sender] = driver({
            pickup: loc,
            radius: rad
        });
    }
    
    function getDriverLocation() public view returns (uint [] memory){
        return drivers[msg.sender].pickup;
    }
    
    function getRiders() public view returns(address [] memory){
        return waitingRiders;
    }
    
    function clockOut() public{
        delete drivers[msg.sender];
    }
    
    function pickRider(address riderAddr) public{
        delete waitingRiders[riders[riderAddr].index];
    }
}