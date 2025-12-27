// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YieldReportNFT is ERC721 {
    uint256 public tokenCounter;

    struct Report {
        string cid;        // IPFS CID
        uint256 price;     // price in wei
        address farmer;    // original creator
        bool forSale;
    }

    mapping(uint256 => Report) public reports;

    constructor() ERC721("YieldReport", "YRN") {
        tokenCounter = 0;
    }

    // Farmer mints NFT with CID and price
    function mintReport(string memory _cid, uint256 _price) external {
        require(_price > 0, "Price must be > 0");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);

        reports[tokenId] = Report({
            cid: _cid,
            price: _price,
            farmer: msg.sender,
            forSale: true
        });

        tokenCounter++;
    }

    // Businessman buys NFT
    function buyReport(uint256 tokenId) external payable {
        Report memory report = reports[tokenId];

        require(report.forSale, "Not for sale");
        require(msg.value == report.price, "Incorrect ETH amount");

        address seller = ownerOf(tokenId);

        // transfer ETH to farmer/seller
        payable(seller).transfer(msg.value);

        // transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // mark not for sale
        reports[tokenId].forSale = false;
    }

    // Read CID
    function getCID(uint256 tokenId) external view returns (string memory) {
        return reports[tokenId].cid;
    }
}
