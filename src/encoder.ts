import Web3 from 'web3';

export default async function encodeQuestId(questId: string | undefined) {
  const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
  console.log(
    'encodedQuestId: ',
    web3.eth.abi.encodeParameter('string', questId),
  );
  return web3.eth.abi.encodeParameter('string', questId);
}
