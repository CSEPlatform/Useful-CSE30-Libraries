import randomBytes from 'randombytes';
import { publicKeyCreate, ecdsaSign } from 'secp256k1';
import * as RLP from 'rlp';
import * as ethers from 'ethers';

import Provider from './provider.lib';
import Utils from '../utils';

import {
  INetwork,
  IGenereteReponse,
  IWallet,
  IPayloadSendTransaction,
  IReponseSendTransaction,
  ISignedTransaction,
  ISignTransactionPayload
} from '../interfaces';
import { randomUUID } from 'crypto';

const createKeccakHash = require('keccak');

/**
 * Class @Wallet
 * Provide methods to handle a wallet
 */
class Wallet implements IWallet {
  private _provider: Provider | undefined;
  private _privateKey: Buffer;

  constructor(privateKey: string = '', provider: Provider | undefined = undefined) {
    this._provider = provider;
    this._privateKey = Buffer.from(privateKey, 'hex');
  }

  static publicToAddress(publicKey: Buffer): Buffer {
    const hashS = createKeccakHash('keccak256');
    hashS.update(publicKey);
    const msg = Buffer.from(hashS.digest());
    return msg.slice(-20);
  }

  static privateToPublicKey(privateKey: Buffer): Buffer {
    return Buffer.from(publicKeyCreate(privateKey, false)).slice(1);
  }

  static privateToAddress(privateKey: Buffer): Buffer {
    const publicKey = this.privateToPublicKey(privateKey);
    const address = this.publicToAddress(publicKey);
    return address;
  }

  static generateWallet(): IGenereteReponse {
    const privateKey = randomBytes(32);
    const publicKey = this.privateToPublicKey(privateKey);
    const address = this.publicToAddress(publicKey);
    return {
      address: address.toString('hex'),
      privateKey: privateKey.toString('hex'),
      publicKey: publicKey.toString('hex')
    };
  }

  static fromPrivateKey(privateKey: string): Wallet {
    return new Wallet(privateKey);
  }

  static fromMnemonic(phrase: string): Wallet {
    const mnemonicWallet = ethers.Wallet.fromMnemonic(phrase);
    return new Wallet(mnemonicWallet.privateKey.replace('0x', ''));
  }

  static isMatch(privateKey: string, address: string): boolean {
    const addressFromPriv = Wallet.privateToAddress(Buffer.from(privateKey, 'hex'));
    if (addressFromPriv.toString('hex') === address) {
      return true;
    }
    return false;
  }

  connect(provider: Provider) {
    this._provider = provider;
  }

  getPrivateKey(): string {
    return this._privateKey.toString('hex');
  }

  getPublicKey(): string {
    const publicKey = Wallet.privateToPublicKey(this._privateKey);
    return publicKey.toString('hex');
  }

  getAddress(): string {
    const address = Wallet.privateToAddress(this._privateKey);
    return address.toString('hex');
  }

  hash(payload: (string | ethers.BigNumber)[]): Buffer {
    const bytes = RLP.encode(String(payload));
    return createKeccakHash('keccak256').update(bytes).digest();
  }

  /**
   * Transfer coins or token
   * For send token, please pass the token address you want to transfer
   * @param payload ISignTransactionPayload
   * @returns 
   */
  signTransaction(payload: ISignTransactionPayload): ISignedTransaction {
    const id = randomUUID();
    let payloadAsArr: (string | ethers.BigNumber)[] = [id, this.getAddress(), payload.to, payload.amount];
    if (payload.tokenAddress) {
      payloadAsArr = [id, payload.tokenAddress, this.getAddress(), payload.to, payload.amount];
    }
    const sig = ecdsaSign(this.hash(payloadAsArr), this._privateKey);
    const ret = {
      r: Buffer.from(sig.signature.slice(0, 32)),
      s: Buffer.from(sig.signature.slice(32, 64)),
      v: sig.recid,
    };
    const result = {
      signature: Utils.sigToString(ret), rawData: {
        id,
        from: this.getAddress(),
        to: payload.to,
        amount: payload.amount.toString(),
        ...payload.tokenAddress ? { tokenAddress: payload.tokenAddress } : {}
      }
    };
    return result;
  }

  async sendTransaction(payload: ISignTransactionPayload): Promise<IReponseSendTransaction> {
    const signature = this.signTransaction(payload);
    if (!this._provider) {
      throw new Error('Provider is undefined');
    }
    return this._provider.sendTransaction(signature);
  }

}

export default Wallet;