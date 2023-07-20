import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IBundler, Bundler } from '@biconomy/bundler';
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { ChainId } from "@biconomy/core-types";
import { providers, Wallet, ethers } from "ethers";
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;


const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

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
`;

const Disconnect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(226, 8, 128);
`;

const ConnectButton = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: wallet,
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: new Bundler({
      bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/abc",
      chainId: ChainId.POLYGON_MUMBAI,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    }),
  };

  useEffect(() => {
    const connectToBiconomy = async () => {
      try {
        const biconomyAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
        const biconomySmartAccount = await biconomyAccount.init();
        setAccount(biconomySmartAccount.owner);
        setChainId(80001); // ChainId for Polygon Mumbai
        setConnected(true);
        localStorage.setItem("isWalletConnected", "true");
      } catch (ex) {
        console.error(ex);
      }
    };

    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        connectToBiconomy();
      }
    };

    connectWalletOnPageLoad();
  }, []);

  const disconnect = () => {
    setConnected(false);
    localStorage.setItem("isWalletConnected", "false");
  };

  return (
    <ConnectWrapper>
      {connected ? (
        <>
          <p>Connected with <span className="account">{account}</span></p>
          {chainId && <p className="network">POLYGON_MUMBAI</p>}
          <Disconnect onClick={disconnect}>Disconnect Biconomy Smart Account</Disconnect>
        </>
      ) : (
        <Connect onClick={() => setConnected(true)}>Connect to Biconomy Smart Account</Connect>
      )}
    </ConnectWrapper>
  );
};
export { ConnectButton };
