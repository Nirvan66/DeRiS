pragma solidity >=0.4.22 <0.7.0;
contract Deris{
    enum Status {INACTIVE, RIDER, DRIVER}
    struct user{
        bool isUser;
        uint number;
        Status state;
        address currPairing;
        string pickup;
        string dropoff;
        uint escrow;
        uint paid;
    }
    
    mapping (address => user) public users;
    
    address [] public userList;
    
    event RiderDetails(uint riderNumber, string pick, string drop);
    constructor() public {
        
    }
    
    function driveRequest() public{
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.DRIVER,
                currPairing: address(0),
                pickup: '',
                dropoff: '',
                escrow: 0,
                paid: 0
            });
        }else{
            users[msg.sender].state = Status.DRIVER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = '';
            users[msg.sender].dropoff = '';
            users[msg.sender].escrow = 0;
            users[msg.sender].paid = 0;
        }
    }
    
    function rideRequest(string memory pick, string memory drop, uint tripCost) public {
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.RIDER,
                currPairing: address(0),
                pickup: pick,
                dropoff: drop,
                escrow: tripCost,
                paid: 0
            });
        }else{
            users[msg.sender].state = Status.RIDER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = pick;
            users[msg.sender].dropoff = drop;
            users[msg.sender].escrow = tripCost;
            users[msg.sender].paid = 0;
        }
    }
    
    function getWaitingRiders() public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        for (uint i=0; i<userList.length; i++) {
            if (users[userList[i]].currPairing == address(0) && users[userList[i]].state == Status.RIDER){
                emit RiderDetails(users[userList[i]].number, users[userList[i]].pickup, users[userList[i]].dropoff);
            }
        }
    }
    
    function pickRider(uint riderNumber) public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        require(users[userList[riderNumber]].currPairing == address(0), "user currently paired");
        //pairing driver and rider
        users[userList[riderNumber]].currPairing = msg.sender;
        users[msg.sender].currPairing = userList[riderNumber];
    }
    
    function payDriver() public payable{
        require(users[msg.sender].isUser == true, "Need to be a user to pay");
        require(users[msg.sender].state == Status.RIDER, "User needs to be in rider mode to pay driver");
        require(users[msg.sender].currPairing != address(0), "Rider needs to have an assigned driver to pay");
        require(users[msg.sender].paid + msg.value <= users[msg.sender].escrow, "Overdraft from initial escrow");
        //pay driver for the currently complete distance
        payable(users[msg.sender].currPairing).transfer(msg.value);
        users[msg.sender].paid = users[msg.sender].paid + msg.value;
    }
    
    function rideComplete() public {
        require(users[msg.sender].isUser == true, "Need to be a user to complete ride");
        require(users[msg.sender].state == Status.RIDER, "User needs to be in rider mode to complete ride");
        require(users[msg.sender].currPairing != address(0), "Rider needs to have an assigned driver to complete ride");
        
        users[msg.sender].state = Status.INACTIVE;
        users[msg.sender].currPairing = address(0);
        users[msg.sender].pickup = '';
        users[msg.sender].dropoff = '';
        users[msg.sender].escrow = 0;
        users[msg.sender].paid = 0;
    }
    
    function driveComplete() public {
        require(users[msg.sender].isUser == true, "Need to be a user to complete ride");
        require(users[msg.sender].state == Status.DRIVER, "User needs to be in drive mode to complete drive");
        require(users[msg.sender].currPairing != address(0), "Driver needs to have an assigned rider to complete ride");
        
        users[msg.sender].state = Status.INACTIVE;
        users[msg.sender].currPairing = address(0);
        users[msg.sender].pickup = '';
        users[msg.sender].dropoff = '';
        users[msg.sender].escrow = 0;
        users[msg.sender].paid = 0;
    }
}