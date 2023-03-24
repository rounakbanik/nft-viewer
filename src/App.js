import { useState } from 'react';
import './App.css';
import axios from 'axios';

// Get Infura API credentials
import { API_KEY, API_SECRET } from './data/constants';

function App() {

  // Variable that stores wallet address from form
  const [walletAddress, setWalletAddress] = useState('');

  // Variable that stores response from the NFT API
  const [nfts, setNfts] = useState([]);

  // Input handler
  const walletHandler = (e) => {
    setWalletAddress(e.target.value);
  }

  // Form handler that issues requests to NFT API
  const formHandler = async (e) => {

    // Prevent page refresh on form submit
    e.preventDefault();

    if (walletAddress.length > 0) {
      // Set chain ID to 1 for Ethereum
      const chainId = "1"

      // Infura NFT API URL
      const baseUrl = "https://nft.api.infura.io"
      const url = `${baseUrl}/networks/${chainId}/accounts/${walletAddress}/assets/nfts`

      // Configure the request
      const config = {
        method: 'get',
        url: url,
        auth: {
          username: API_KEY,
          password: API_SECRET,
        }
      };

      // Issue request to API
      const response = await axios(config);

      // Filter list based on availability of metadata
      let nftList = response['data']['assets'];
      nftList = nftList.filter(x => x['metadata'] !== null)
      nftList = nftList.filter(x => x['metadata']['image'] !== null && x['metadata']['name'] !== null)

      // Set nfts variable to cleaned list
      setNfts(nftList);

    }
  }


  return (
    <div className="App">
      <h1>NFT Viewer</h1>

      {/* Wallet Address Form */}
      <form className='wallet-form' onSubmit={formHandler}>
        <input type='text' value={walletAddress} onChange={walletHandler} required></input>
        <button type='submit'>Submit</button>
      </form>

      {/* NFT Viewer Main Dashboard */}
      <div className='nft-dashboard'>
        {nfts.map(nft => {
          return <div className='nft'>
            <img src={nft['metadata']['image']}
              alt={nft['metadata']['name']}
              key={nft['metadata']['name']}></img>
            <p>{nft['metadata']['name'].slice(0, 35)}</p>
          </div>
        })}
      </div>
    </div >
  );
}

export default App;
