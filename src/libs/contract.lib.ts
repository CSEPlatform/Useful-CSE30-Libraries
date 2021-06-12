
import { BigNumber } from '@ethersproject/bignumber';
import { IContract, IContractInfo, ITransaction, ITransferPayload } from '../interfaces';
import Provider from './provider.lib';

class Contract implements IContract {
  private _provider: Provider | undefined;
  private _address: string;
  
  constructor(address: string, provider: Provider | undefined = undefined) {
    this._address = address;
    this._provider = provider;
  }

  balanceOf(address: string): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  transfer(payload: ITransferPayload): Promise<ITransaction> {
    throw new Error('Method not implemented.');
  }

  info(): Promise<IContractInfo> {
    throw new Error('Method not implemented.');
  }

  on(eventType: 'transaction', callback: (transaction: ITransaction) => void): void {
    throw new Error('Method not implemented.');
  }

}

export default Contract;