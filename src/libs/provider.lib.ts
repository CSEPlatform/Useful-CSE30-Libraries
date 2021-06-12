
import { IProvider, IReponseSendTransaction, ISignedTransaction, ITransaction } from '../interfaces';

class Provider implements IProvider {
  _providerUri: String;
  constructor(providerUri: String) {
    this._providerUri = providerUri;
  }

  async sendTransaction(signature: ISignedTransaction): Promise<IReponseSendTransaction> {
    throw new Error('Method not implemented.');
  }

  getTransaction(txId: String): ITransaction {
    throw new Error('Method not implemented.');
  }

  getBalance(txId: String): ITransaction {
    throw new Error('Method not implemented.');
  }

  on(eventType: 'transaction', callback: (transaction: ITransaction) => void): void {
    throw new Error('Method not implemented.');
  }

}

export default Provider;