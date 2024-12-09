import "./App.css";
import { useMemo, useState } from "react";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { sendClientTransactions } from "@honeycomb-protocol/edge-client/client/walletHelpers";
import { client } from "./constants";
// import {
  // clusterApiUrl,
//   Connection,
//   LAMPORTS_PER_SOL,
//   PublicKey,
// } from "@solana/web3.js";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const network = "https://edge.test.honeycombprotocol.com";

function WalletComponent() {
  const wallet = useWallet();
  const [message, setMessage] = useState("Hello Solana");

  const handleSendTransaction = async () => {
    try {
      const {
        createCreateProjectTransaction: { tx: txResponse },
      } = await client.createCreateProjectTransaction({
        name: "My Project",
        authority: wallet.publicKey.toBase58(),
      });

      const response = await sendClientTransactions(client, wallet, txResponse);

      console.log(response);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  // const handleAirdrop = async () => {
  //   try {
  //     const connection = new Connection("https://edge.test.honeycombprotocol.com", "confirmed");
  //     const publicKey = new PublicKey(wallet.publicKey.toBase58());

  //     const signature = await connection.requestAirdrop(
  //       publicKey,
  //       2 * LAMPORTS_PER_SOL // Amount of SOL to airdrop
  //     );

  //     console.log("Transaction signature:", response);

  //     // await connection.confirmTransaction(signature);
  //     setMessage(`Airdrop successful ${2} SOL! Tx Signature: ${signature}`);
  //   } catch (error) {
  //     setMessage(`Airdrop failed: ${error.message}`);
  //   }
  // };

  return (
    <>
      <h1>{message}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <WalletMultiButton style={{ width: "100%" }} />
        <WalletDisconnectButton />
        <button onClick={handleSendTransaction}>Send transaction</button>
        {/* <button onClick={handleAirdrop}>Airdrop</button> */}
      </div>
    </>
  );
}

function App() {
  const endpoint = useMemo(() => network, [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletComponent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
