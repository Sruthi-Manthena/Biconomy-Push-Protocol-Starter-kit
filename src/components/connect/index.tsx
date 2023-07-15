import { useEffect } from "react"
import styled from "styled-components"
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from "@web3-react/core"
import { BiconomySmartAccount, BiconomySmartAccountConfig } from "@biconomy/account"
import { IBundler, Bundler } from '@biconomy/bundler'
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers } from "ethers";
import { useBiconomy } from "@biconomy/react";




const bundler: IBundler = new Bundler({
  bundlerUrl: '', // you can get this value from biconomy dashboard.     
  chainId: 137, 
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: '' // you can get this value from biconomy dashboard.
})
// Note that paymaster and bundler are optional. You can choose to create new instances of this later and make account API use 
const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
  signer: wallet.getSigner(), // enter your actual instance of the wallet
  chainId: 137,  
  rpcUrl: '',
  // paymaster: paymaster, // check the README.md section of Paymaster package
  // bundler: bundler, // check the README.md section of Bundler package
}

const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig)

async function initializeBiconomySmartAccount() {
  const biconomySmartAccount = await biconomyAccount.init();
}

initializeBiconomySmartAccount();

const transaction = {
to: '0x85B51B068bF0fefFEFD817882a14f6F5BDF7fF2E',
data: '0x',
value: ethers.utils.parseEther('0.1'),
}


async function buildPartialUserOp() {
  const biconomySmartAccount = await biconomyAccount.init();
  const partialUserOp = await biconomySmartAccount.buildUserOp([transaction]);
  // Use the partialUserOp here or perform additional operations
}

buildPartialUserOp();

const biconomy = useBiconomy();
const connector = biconomy.connector;


const ConnectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20;

  & .account {
    font-size: 1.2rem;
    border: 1px solid green;
    border-radius: 3px;
    padding: 4px 7px;
    font-weight: 500;
    font-family: monospace;
  }

  & .network {
    margin: 5px 0;
  }
`;

const StyledButton = styled.button`
  border: 0px;
  outline: 0px;
  padding: 8px 15px;
  margin: 10px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
`;

const Connect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(103, 76, 159);
`

const Disconnect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(226, 8, 128);
`

const ConnectButton = () => {
  //const { active, account, activate, deactivate, chainId } = useWeb3React()
  const { state, dispatch } = useBiconomy();
  const { walletAddress: account, chainId } = state;
  const { activate, deactivate } = dispatch;
  const active = !!account;
  

async function connect() {
  try {
    await activate();
    localStorage.setItem('isWalletConnected', 'true');
  } catch (ex) {
    console.log(ex);
  }
}

async function disconnect() {
  try {
    await deactivate();
    localStorage.setItem('isWalletConnected', 'false');
  } catch (ex) {
    console.log(ex);
  }
}

  return (
    <ConnectWrapper>
      {active ? (
        <>
          <p>Connected with <span className="account">{account}</span></p>
          {chainId ? <p className="network">{chainId}</p> : null}
          <Disconnect onClick={disconnect}>Disconnect Wallet</Disconnect>
        </>
      ) : (
        <Connect onClick={connect}>Connect to Biconomy Wallet</Connect>
      )}
    </ConnectWrapper>
  );
      }

export default ConnectButton;