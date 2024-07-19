// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CirclePunkMinter is ERC721, Ownable {
	using Counters for Counters.Counter;
	using Strings for uint256; // Import the Strings library and attach it to uint256

	Counters.Counter private _tokenIdCounter;

	string public baseURI;

	constructor() ERC721("CirclePunks", "CPC") {
		baseURI = "https://raw.githubusercontent.com/AlvaroLuken/cryptopunks/main/CryptoPunksCollection/";
	}

	function _baseURI() internal view virtual override returns (string memory) {
		return baseURI;
	}

	function setBaseURI(string memory newBaseURI) public onlyOwner {
		baseURI = newBaseURI;
	}

	function mint(address to) public {
		// Get current token ID
		uint256 tokenId = _tokenIdCounter.current();
		// Mint the NFT
		_safeMint(to, tokenId);
		// Increment the counter for next mint
		_tokenIdCounter.increment();
	}

	function transferNft(address from, address to, uint256 tokenId) external {
		_transfer(from, to, tokenId);
	}

	function tokenURI(
		uint256 tokenId
	) public view virtual override returns (string memory) {
		require(
			_exists(tokenId),
			"ERC721Metadata: URI query for nonexistent token"
		);

		string memory base = _baseURI();
		return
			bytes(base).length > 0
				? string(abi.encodePacked(base, tokenId.toString(), ".png"))
				: "";
	}
}
