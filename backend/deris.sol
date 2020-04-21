pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract Deris{
    enum Status {INACTIVE, RIDER, DRIVER}
    
    struct coordinates{
        int256 lat;
        int256 long;
    }
    
    struct user{
        bool isUser;
        uint number;
        Status state;
        address currPairing;
        coordinates pickup;
        coordinates dropoff;
        uint arrivalTime;
        bool driverArrived;
        bool inProgress;
        uint escrow;
        uint paid;
    }
    
    
    mapping (address => user) public users;
    
    address [] public userList;
    
    event RiderDetails(uint riderNumber, coordinates pick, coordinates drop, uint escrow);
    event RiderPicked(uint riderNumber, uint arrivalTime);
    event cashMoney(uint driverNumber, uint bills);
    event imHere(uint riderNumber, int256[] location);
    event undone(uint usrNumber, uint cancelFee);
    
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
                pickup: coordinates({lat: 0, long: 0}),
                dropoff: coordinates({lat: 0, long: 0}),
                arrivalTime: 0,
                driverArrived: true,
                inProgress: false,
                escrow: 0,
                paid: 0
            });
        }else{
            users[msg.sender].state = Status.DRIVER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = coordinates({lat: 0, long: 0});
            users[msg.sender].dropoff = coordinates({lat: 0, long: 0});
            users[msg.sender].escrow = 0;
            users[msg.sender].arrivalTime = 0;
            users[msg.sender].driverArrived = true;
            users[msg.sender].inProgress = false;
            users[msg.sender].paid = 0;
        }
    }
    
    function rideRequest(int256[] memory pick, int256[] memory drop, uint tripCost) public {
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.RIDER,
                currPairing: address(0),
                pickup: coordinates({lat: pick[0], long: pick[1]}),
                dropoff: coordinates({lat: drop[0], long: drop[1]}),
                arrivalTime: 0,
                driverArrived: false,
                inProgress: false,
                escrow: tripCost,
                paid: 0
            });
        }else{
            users[msg.sender].state = Status.RIDER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = coordinates({lat: pick[0], long: pick[1]});
            users[msg.sender].dropoff = coordinates({lat: drop[0], long: drop[1]});
            users[msg.sender].escrow = tripCost;
            users[msg.sender].arrivalTime = 0;
            users[msg.sender].driverArrived = false;
            users[msg.sender].inProgress = false;
            users[msg.sender].paid = 0;
        }
    }
    
    function getNumber() view public returns(int){
        if (users[msg.sender].isUser==true){
            return int(users[msg.sender].number);
        }
        else{
            return -1;
        }
    }
    
    function getWaitingRiders() public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        for (uint i=0; i<userList.length; i++) {
            if (users[userList[i]].currPairing == address(0) && users[userList[i]].state == Status.RIDER){
                emit RiderDetails(users[userList[i]].number, users[userList[i]].pickup, users[userList[i]].dropoff, users[userList[i]].escrow);
            }
        }
    }
    

    function pickRider(uint riderNumber, uint arrivalTime) public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        require(users[msg.sender].currPairing == address(0), "driver currently paired");
        require(userList[riderNumber] != msg.sender, "Cannot pick yourself");
        
        require(users[userList[riderNumber]].currPairing == address(0), "rider already paired");
        require(users[userList[riderNumber]].state == Status.RIDER, "user being picked has to be a rider");
        //pairing driver and rider
        users[userList[riderNumber]].currPairing = msg.sender;
        users[msg.sender].currPairing = userList[riderNumber];
        
        users[msg.sender].arrivalTime = arrivalTime;
        users[userList[riderNumber]].arrivalTime = arrivalTime;
        users[msg.sender].driverArrived = false;
        users[users[msg.sender].currPairing].driverArrived = false;
        
        emit RiderPicked(riderNumber, arrivalTime);
    }
    
    function informRider(int256[] memory loc) public{
        require(users[msg.sender].isUser==true, "Need to be a user to inform rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to inform rider");
        require(users[msg.sender].currPairing != address(0), "Driver needs to have an assigned rider to inform");
        int dist = (loc[0] - users[users[msg.sender].currPairing].pickup.lat) * (loc[0] - users[users[msg.sender].currPairing].pickup.lat) 
                  + (loc[1] - users[users[msg.sender].currPairing].pickup.long) * (loc[1] - users[users[msg.sender].currPairing].pickup.long);
        require(dist<=13623770, "You are more that 0.2 miles away from the rider");
        users[msg.sender].driverArrived = true;
        users[users[msg.sender].currPairing].driverArrived = true;
        
        emit imHere(users[users[msg.sender].currPairing].number, loc);
        //[40005140, -105256061], [40005157, -105252370], 10
        // 40.005140,-105.256061
        // 40.005157,-105.252370
    }
    
    function payDriver() public payable{
        require(users[msg.sender].isUser == true, "Need to be a user to pay");
        require(users[msg.sender].state == Status.RIDER, "User needs to be in rider mode to pay driver");
        require(users[msg.sender].currPairing != address(0), "Rider needs to have an assigned driver to pay");
        require(users[msg.sender].paid + msg.value <= users[msg.sender].escrow, "Overdraft from initial escrow");
        //pay driver for the currently complete distance
        users[msg.sender].inProgress = true;
        users[users[msg.sender].currPairing].inProgress = true;
        
        payable(users[msg.sender].currPairing).transfer(msg.value);
        users[msg.sender].paid = users[msg.sender].paid + msg.value;
        emit cashMoney(users[users[msg.sender].currPairing].number, msg.value);
        if (users[msg.sender].paid == users[msg.sender].escrow){
            emit undone(users[msg.sender].number, 0);
            emit undone(users[users[msg.sender].currPairing].number, 0);
            reset(msg.sender);
            reset(users[msg.sender].currPairing);
        }
    }
    
    function reset(address usrAddr) private{
        users[usrAddr].state = Status.INACTIVE;
        users[usrAddr].currPairing = address(0);
        users[usrAddr].pickup = coordinates({lat: 0, long: 0});
        users[usrAddr].dropoff = coordinates({lat: 0, long: 0});
        users[usrAddr].arrivalTime = 0;
        users[usrAddr].driverArrived = false;
        users[usrAddr].inProgress = false;
        users[usrAddr].escrow = 0;
        users[usrAddr].paid = 0;
    }
    
    function userReset() public payable{
        //885999999991808
        require(users[msg.sender].isUser == true, "Need to be a user to complete ride");
        require(users[msg.sender].state != Status.INACTIVE, "Need to be an active user to complete ride");
        if(users[msg.sender].inProgress == true){
            payable(msg.sender).transfer(msg.value);
            reset(msg.sender);
        }
        else{
            if(users[msg.sender].state == Status.RIDER){
                if(users[msg.sender].driverArrived==false && now>users[msg.sender].arrivalTime){
                    payable(msg.sender).transfer(msg.value);
                    emit undone(users[msg.sender].number, 0);
                    reset(msg.sender);
                }else{
                    payable(users[msg.sender].currPairing).transfer(msg.value);
                    emit undone(users[msg.sender].number, msg.value);
                    reset(msg.sender);
                }
            }else{
                if(users[msg.sender].driverArrived==true && now>users[msg.sender].arrivalTime){
                    payable(msg.sender).transfer(msg.value);
                    emit undone(users[msg.sender].number, 0);
                    reset(msg.sender);
                }else{
                    payable(users[msg.sender].currPairing).transfer(msg.value);
                    emit undone(users[msg.sender].number, msg.value);
                    reset(msg.sender);
                }
                
            }
        }
    }
    
}