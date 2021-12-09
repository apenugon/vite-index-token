// @ts-ignore
import { WS_RPC } from '@vite/vitejs-ws';
// @ts-ignore
import { HTTP_RPC } from '@vite/vitejs-http';
import { wallet, accountBlock, ViteAPI, constant } from '@vite/vitejs';

const { getWallet } = wallet;
const { Vite_TokenId } = constant;

const mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
    process.exit(1)
}
const mywallet = getWallet(mnemonic);
const { privateKey, address } = mywallet.deriveAddress(0);

const { createAccountBlock, utils } = accountBlock;
/*
const myAccountBlock = createAccountBlock('issueToken', {
    address: address,
    tokenName: 'Mybasictesttoken',
    isReIssuable: true,
    maxSupply: '10000000000000000000000000',
    isOwnerBurnOnly: true,
    totalSupply: '100000000000000000000000',
    decimals: 2,
    tokenSymbol: 'TestTT'
});

const myAccountBlock = createAccountBlock('issueToken', {
    address: address,
    tokenName: 'TT',
    isReIssuable: true,
    maxSupply: '100000000000000000000000',
    isOwnerBurnOnly: true,
    totalSupply: '100000000000000000000000',
    decimals: 5,
    tokenSymbol: 'TestT'
});*/



const myAccountBlock = createAccountBlock('stakeForQuota', {
    address,
    beneficiaryAddress: address,    // Quota recipient
    amount: '134000000000000000000' // The minimum staking amount is 134 VITE
});

console.log(myAccountBlock)

async function mintToken() {
    const wsrpc = new WS_RPC('ws://localhost:23457');
    console.log(wsrpc)
    const provider = new ViteAPI(wsrpc, () => { console.log("connect") });
    console.log("Provider created", provider);
    myAccountBlock.setProvider(provider).setPrivateKey(privateKey);
    await myAccountBlock.autoSetPreviousAccountBlock();
    console.log("Here");
    const result = await myAccountBlock.sign().send();
    console.log('send success', result);
    return 0;
}

mintToken().catch((alert) => { console.log(alert); }).then(() => { console.log("Done") });
