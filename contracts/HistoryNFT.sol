// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";

contract HistoryNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    event CreatedHistoryNFT(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("History NFT", "historyNFT")
    {
        tokenCounter = 0;
    }

    function create(string memory history) public {
        _safeMint(msg.sender, tokenCounter);
        string memory historyURI = historyToJsonURI(history);
        _setTokenURI(tokenCounter, formatTokenURI(historyURI));
        tokenCounter = tokenCounter + 1;
        emit CreatedHistoryNFT(tokenCounter, history);
    }

    function historyToJsonURI(string memory history) public pure returns (string memory) {
        string memory baseURL = "data:json/json+xml;base64,";
        string memory historyBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(history))));
        return string(abi.encodePacked(baseURL,historyBase64Encoded));
    }

    function formatTokenURI(string memory JsonURI) public pure returns (string memory) {
        return string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "History NFT", // You can add whatever name here
                                '", "description":"An NFT based on Google Chrome History!", "attributes":"", "history":"',JsonURI,'"}'
                            )
                        )
                    )
                )
            );
    }

    function getTotalNFTsMintedSoFar() public view returns (uint256) {
        return tokenCounter;
    }
}
