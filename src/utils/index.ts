import { entropyToMnemonic } from '@ethersproject/hdnode';
import { wordlists } from '@ethersproject/wordlists';
import BN from 'bn.js';
import randomBytes from 'randombytes';

class Util {
  static zeros(bytes: any): Buffer {
    return Buffer.allocUnsafe(bytes).fill(0);
  }

  static intToHex(integer: number): String {
    if (integer < 0) {
      throw new Error('Invalid integer as argument, must be unsigned!');
    }
    const hex = integer.toString(16);
    return hex.length % 2 ? `0${hex}` : hex;
  }

  static intToBuffer(integer: any): Buffer {
    const hex = this.intToHex(integer);
    return Buffer.from(hex, 'hex');
  }

  static toBuffer(input: any = ''): Buffer {
    if (Buffer.isBuffer(input)) {
      return input;
    }

    if (typeof input === 'string') {
      return Buffer.from(input);
    }
    if (typeof input === 'bigint' || typeof input === 'number') {
      return this.intToBuffer(input);
    }
    if (BN.isBN(input)) {
      return Buffer.from(input.toArray());
    }
    throw new Error('invalid type');
  }

  static setLength(msg: any, length: any, right: any): Buffer {
    const buf = this.zeros(length);
    if (right) {
      if (msg.length < length) {
        msg.copy(buf);
        return buf;
      } else {
        return msg.slice(0, length);
      }
    } else {
      if (msg.length < length) {
        msg.copy(buf, length - msg.length);
        return buf;
      } else {
        return msg.slice(-length);
      }
    }
  }

  static setLengthLeft(msg: any, length: any): Buffer {
    return this.setLength(msg, length, false);
  }

  static setLengthRight(msg: any, length: any): Buffer {
    return this.setLength(msg, length, true);
  }

  static combineToBytes(inputs: any = []): Buffer {
    const output = [];
    for (let i = 0; i < inputs.length; i++) {
      output.push(this.toBuffer(inputs[i]));
    }
    return Buffer.concat(output);
  }

  static isValidSigRecovery(recovery: 0 | 1): boolean {
    return recovery === 0 || recovery === 1;
  }

  static sigToString(ret: any): string {
    if (!this.isValidSigRecovery(ret.v)) {
      throw new Error('Invalid signature v value');
    }

    // (and the RPC eth_sign method) uses the 65 byte format used by Bitcoin
    return Buffer.concat([this.setLengthLeft(ret.r, 32), this.setLengthLeft(ret.s, 32), this.toBuffer(ret.v)]).toString('hex');
  }

  static generateMnemonic(amount: number) {
    let bytes = randomBytes(amount);
    return entropyToMnemonic(bytes, wordlists.en);
  }
}

export default Util;
