const { BigNumber } = require('@ethersproject/bignumber');
const { Wallet, Utils, Provider } = require('./lib');

async function demo() {
  // Generate a mnemonic string 
  const mnemonic = Utils.generateMnemonic(16);
  // Init provider
  const provider = new Provider('192.168.0.1:2110');
  // Init wallet
  const wallet = Wallet.fromMnemonic(mnemonic);
  // Connect wallet to provider
  wallet.connect(provider);
  console.log(await wallet.sendTransaction({
    to: '5b5b1cccc77cc7511b691c5874d030732a4066ce',
    amount: BigNumber.from(1000),
  }));
}

demo();