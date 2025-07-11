// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BlockchainChat
 * @dev A decentralized chat contract with token-gated rooms and message storage
 */
contract BlockchainChat is Ownable, ReentrancyGuard {
    
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
        string roomId;
        bool isDeleted;
    }
    
    struct ChatRoom {
        string name;
        string description;
        address requiredToken;
        uint256 minTokenAmount;
        bool isTokenGated;
        bool isActive;
        address creator;
        uint256 createdAt;
    }
    
    // Storage
    mapping(string => ChatRoom) public chatRooms;
    mapping(string => Message[]) public roomMessages;
    mapping(address => bool) public moderators;
    mapping(address => uint256) public userMessageCount;
    mapping(address => uint256) public lastMessageTime;
    
    string[] public roomIds;
    uint256 public messageCount;
    uint256 public constant RATE_LIMIT = 1; // 1 second between messages
    uint256 public constant MAX_MESSAGE_LENGTH = 1000;
    
    // Events
    event MessageSent(
        address indexed sender,
        string indexed roomId,
        string content,
        uint256 timestamp,
        uint256 messageIndex
    );
    
    event RoomCreated(
        string indexed roomId,
        string name,
        address indexed creator,
        bool isTokenGated,
        address requiredToken,
        uint256 minTokenAmount
    );
    
    event RoomUpdated(string indexed roomId, bool isActive);
    event ModeratorAdded(address indexed moderator);
    event ModeratorRemoved(address indexed moderator);
    event MessageDeleted(string indexed roomId, uint256 messageIndex);
    
    // Modifiers
    modifier onlyModerator() {
        require(moderators[msg.sender] || msg.sender == owner(), "Not a moderator");
        _;
    }
    
    modifier rateLimited() {
        require(
            block.timestamp >= lastMessageTime[msg.sender] + RATE_LIMIT,
            "Rate limit exceeded"
        );
        _;
        lastMessageTime[msg.sender] = block.timestamp;
    }
    
    modifier validMessage(string memory content) {
        require(bytes(content).length > 0, "Message cannot be empty");
        require(bytes(content).length <= MAX_MESSAGE_LENGTH, "Message too long");
        _;
    }
    
    modifier roomExists(string memory roomId) {
        require(bytes(chatRooms[roomId].name).length > 0, "Room does not exist");
        require(chatRooms[roomId].isActive, "Room is not active");
        _;
    }
    
    modifier hasRoomAccess(string memory roomId) {
        ChatRoom memory room = chatRooms[roomId];
        if (room.isTokenGated) {
            require(
                IERC20(room.requiredToken).balanceOf(msg.sender) >= room.minTokenAmount,
                "Insufficient token balance"
            );
        }
        _;
    }
    
    constructor() {
        moderators[msg.sender] = true;
        
        // Create default public room
        createRoom(
            "general",
            "General Discussion",
            "Open chat for everyone",
            false,
            address(0),
            0
        );
    }
    
    /**
     * @dev Create a new chat room
     */
    function createRoom(
        string memory roomId,
        string memory name,
        string memory description,
        bool isTokenGated,
        address requiredToken,
        uint256 minTokenAmount
    ) public {
        require(bytes(roomId).length > 0, "Room ID cannot be empty");
        require(bytes(name).length > 0, "Room name cannot be empty");
        require(bytes(chatRooms[roomId].name).length == 0, "Room already exists");
        
        if (isTokenGated) {
            require(requiredToken != address(0), "Token address required");
            require(minTokenAmount > 0, "Minimum token amount required");
        }
        
        chatRooms[roomId] = ChatRoom({
            name: name,
            description: description,
            requiredToken: requiredToken,
            minTokenAmount: minTokenAmount,
            isTokenGated: isTokenGated,
            isActive: true,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        roomIds.push(roomId);
        
        emit RoomCreated(
            roomId,
            name,
            msg.sender,
            isTokenGated,
            requiredToken,
            minTokenAmount
        );
    }
    
    /**
     * @dev Send a message to a chat room
     */
    function sendMessage(
        string memory roomId,
        string memory content
    ) 
        external 
        rateLimited 
        validMessage(content) 
        roomExists(roomId) 
        hasRoomAccess(roomId) 
    {
        Message memory newMessage = Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp,
            roomId: roomId,
            isDeleted: false
        });
        
        roomMessages[roomId].push(newMessage);
        userMessageCount[msg.sender]++;
        messageCount++;
        
        emit MessageSent(
            msg.sender,
            roomId,
            content,
            block.timestamp,
            roomMessages[roomId].length - 1
        );
    }
    
    /**
     * @dev Get messages from a room (with pagination)
     */
    function getRoomMessages(
        string memory roomId,
        uint256 offset,
        uint256 limit
    ) external view returns (Message[] memory) {
        require(limit <= 100, "Limit too high");
        
        Message[] storage messages = roomMessages[roomId];
        uint256 total = messages.length;
        
        if (offset >= total) {
            return new Message[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        Message[] memory result = new Message[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = messages[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get room information
     */
    function getRoom(string memory roomId) external view returns (ChatRoom memory) {
        return chatRooms[roomId];
    }
    
    /**
     * @dev Get all room IDs
     */
    function getAllRoomIds() external view returns (string[] memory) {
        return roomIds;
    }
    
    /**
     * @dev Check if user can access a room
     */
    function canAccessRoom(string memory roomId, address user) external view returns (bool) {
        ChatRoom memory room = chatRooms[roomId];
        
        if (!room.isActive) return false;
        if (!room.isTokenGated) return true;
        
        return IERC20(room.requiredToken).balanceOf(user) >= room.minTokenAmount;
    }
    
    /**
     * @dev Delete a message (moderators only)
     */
    function deleteMessage(
        string memory roomId,
        uint256 messageIndex
    ) external onlyModerator roomExists(roomId) {
        require(messageIndex < roomMessages[roomId].length, "Message does not exist");
        
        roomMessages[roomId][messageIndex].isDeleted = true;
        
        emit MessageDeleted(roomId, messageIndex);
    }
    
    /**
     * @dev Update room status (moderators only)
     */
    function updateRoomStatus(
        string memory roomId,
        bool isActive
    ) external onlyModerator roomExists(roomId) {
        chatRooms[roomId].isActive = isActive;
        
        emit RoomUpdated(roomId, isActive);
    }
    
    /**
     * @dev Add a moderator (owner only)
     */
    function addModerator(address moderator) external onlyOwner {
        require(moderator != address(0), "Invalid address");
        moderators[moderator] = true;
        
        emit ModeratorAdded(moderator);
    }
    
    /**
     * @dev Remove a moderator (owner only)
     */
    function removeModerator(address moderator) external onlyOwner {
        moderators[moderator] = false;
        
        emit ModeratorRemoved(moderator);
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 totalMessages,
        uint256 lastMessage
    ) {
        return (userMessageCount[user], lastMessageTime[user]);
    }
    
    /**
     * @dev Get room message count
     */
    function getRoomMessageCount(string memory roomId) external view returns (uint256) {
        return roomMessages[roomId].length;
    }
    
    /**
     * @dev Emergency pause (owner only)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
        // This could disable message sending across all rooms
    }
}