let { networkConfig } = require('../helper-hardhat-config')
const sqlite3 = require('sqlite3');
let filepath = '/Users/gimnayeon/Library/Application Support/Google/Chrome/Default/History'
const db = new sqlite3.Database(filepath);

let history;

async function db_get(query) {
  try {
      db.get(query, async function (err, data) {
          if(err) {
              console.log(err);
          }
          history = await data;
      });
      db.close();
      return history;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

async function main({
  getNamedAccounts, deployments, getChainId
}) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();
    history = await db_get("select url, title, datetime(last_visit_time / 1000000 -(5*60*60)+ (strftime('%s', '1601-01-01')), 'unixepoch')as 'date' from urls where last_visit_time/1000000+strftime('%s', '1601-01-01') order by Date DESC limit 1");
    log("----------------------------------------------------");
    const HistoryNFT = await deploy('HistoryNFT', {
        from: deployer,
        log: true
    });
    log(`You have deployed an NFT contract to ${HistoryNFT.address}`);
    const historyNFTContract = await ethers.getContractFactory("HistoryNFT");
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const historyNFT = new ethers.Contract(HistoryNFT.address, historyNFTContract.interface, signer);
    const networkName = networkConfig[chainId]['name'];

    log(`Verify with:\n npx hardhat verify --network ${networkName} ${historyNFT.address}`);
    log("Let's create an NFT now!");
    log(`We will use the last one of ${filepath} as our History, and this will turn into a tokenURI. `);
    tx = await historyNFT.create(JSON.stringify(history));
    await tx.wait(1);
    log(`You've made your first NFT!`);
    log(`You can view the tokenURI here ${await historyNFT.tokenURI(0)}`);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();