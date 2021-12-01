import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import etherscanLogo from '../assets/etherscan-logo-circle.png'
import historyIcon from '../assets/historyIcon.png'
import historyViewIcon from '../assets/search.png'
import historyNft from '../utils/HistoryNFT.json'
import '../App.css';

const CONTRACT_ADDRESS = "0x0CBB1a6A579CC61995E1aFa10b08C2Ade2B1414F";
const ETHERSCAN_LINK = `https://kovan.etherscan.io/address/${CONTRACT_ADDRESS}`;

const MainPage = () => {
  let totalMinted
  const [currentAccount, setCurrentAccount] = useState("")
  const [miningAnimation, setMiningAnimation] = useState(false)
  const [mintTotal, setMintTotal] = useState(totalMinted)
  const [currentNetwork, setCurrentNetwork] = useState("")

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])

      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, historyNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        })
        console.log("Setup event listener!")
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner()
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, historyNft.abi, signer)

          // console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.create('{"url":"https://heowc.tistory.com/82","title":"Node.js - 로컬 모듈 접근에 대한 다양한 개선 방법","date":"2021-11-30 11:48:09"}')

          // console.log("Mining... please wait")
          setMiningAnimation(true);
          await nftTxn.wait()
          console.log(nftTxn)
          console.log(`Mined, tee transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
          setMiningAnimation(false)
        } else {
          console.log("Ethereum object doesn't exist")
        }
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    getTotalNFTsMintedSoFar()
  }, [])

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connected to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button mint-button">
      Mint NFT
    </button>
  )

  const renderNetworkPrompt = () => (
    alert("Hello there, This app is built on the rinkeby testnet and it looks like you are on a different ethereum network. Please switch to the Rinkeby testnet to continue")
  )

  const getTotalNFTsMintedSoFar = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, historyNft.abi, signer);
    
    let count = await connectedContract.getTotalNFTsMintedSoFar();
    setMintTotal(count._hex.substring(3))
    console.log(count._hex.substring(3))
  }

  return (
    <div>
      {
        miningAnimation ? (
          <Modal />
        ) : null
      }
      <div className="container">
      {currentAccount === "" ? renderNotConnectedContainer() : renderConnectedContainer()}
      <p className="header gradient-text">History NFT Minting DApp</p>
      <div className="cards-container">
        <Link to="/minting" className="card-container" onClick={connectWallet}>
          <img src={historyIcon} alt="historyIcon" className="history-img" />
          <p className="sub-text">
            Make your hitory unique!
          </p>
        </Link>
        <Link to="/myNft" className="card-container" onClick={connectWallet}>
          <img src={historyViewIcon} alt="historyViewIcon" className="history-view-img" />
          <p className="sub-text">
            List of your hitory NFTs
          </p>
        </Link>
      </div>
        <div className="footer-container">
          <p className="sub-text">
            
          </p>
          <a
            className="etherscan-button"
            href={ETHERSCAN_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img src={etherscanLogo} alt="etherscan-logo" className="etherscan-logo" />View Collection on Etherscan</a>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
