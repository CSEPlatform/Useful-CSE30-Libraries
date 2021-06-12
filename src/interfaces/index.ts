import { BigNumber } from "@ethersproject/bignumber";
import { Wallet } from "@ethersproject/wallet";

export interface IGenereteReponse {
  address: string,
  privateKey: string,
  publicKey: string,
};

export interface ITransaction {
  from: string;
  to: string;
  hash: string;
  tokenAddress?: string;
  amount: string;
  fee: string;
  decimals: Number;
  timestamp: Number;
  blockHash: Number;
  status: Number; // 0 -> Failed, 1: Pending, 2: Success
};

export interface IPayloadSendTransaction {
  to: string;
  value: number;
}

export interface IReponseSendTransaction {
  hash: string;
}

export interface ISignedTransaction {
  signature: string;
  rawData: {
    id: string;
    from: string;
    to: string;
    tokenAddress?: string;
    amount: string;
  };
}

export interface ISignTransactionPayload {
  from?: string;
  to: string;
  tokenAddress?: string;
  amount: BigNumber;
}

export abstract class IUtil {
};

export interface IWallet {
  connect(provider: IProvider): void;
  getPrivateKey(): string;
  getPublicKey(): string;
  getAddress(): string;
  hash(payload: (string | BigNumber)[]): Buffer;
  signTransaction(payload: ISignTransactionPayload): ISignedTransaction;
  sendTransaction(payload: ISignTransactionPayload): Promise<IReponseSendTransaction>;
};

export interface IProvider {
  getTransaction(txId: string): ITransaction;
  sendTransaction(hasString: ISignedTransaction): Promise<IReponseSendTransaction>;
  getBalance(txId: string): ITransaction;
  on(eventType: 'transaction', callback: (transaction: ITransaction) => void): void;
};

export interface IContract {
  balanceOf(address: string): Promise<BigNumber>;
  transfer(payload: ITransferPayload): Promise<ITransaction>;
  info(): Promise<IContractInfo>;
};

export interface IContractInfo {
  address: string;
  decimal: string;
  name: string;
  symbol: string;
  owner: string;
  totalSupply: string;
};

export interface ITransferPayload {
  to: string;
  amount: BigNumber;
}

export type INetwork = 'mainnet' | 'testnet';