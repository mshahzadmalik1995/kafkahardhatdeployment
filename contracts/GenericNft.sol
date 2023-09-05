// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract GenericNft is ERC721 {
    string internal TOKEN_URI;
    uint256 private s_tokenCounter;

    event NftMinted(address minter);

    constructor(
        string memory tokenURI,string memory tokenName, string memory tokenDescription
    ) ERC721(tokenName, tokenDescription) {
        s_tokenCounter = 0;
        TOKEN_URI = tokenURI;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
        emit NftMinted(msg.sender);
    }
    

     function transferNFT(address _from, address _to, uint256 _tokenId) external {
        //require(nftContract.ownerOf(_tokenId) == _from, "Sender does not own the NFT");
        transferFrom(_from, _to, _tokenId);
    }


    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
