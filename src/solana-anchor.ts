import * as SolanaAnchorJs from "@coral-xyz/anchor";
import IDL from "./idl/test.program";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { ISolanaWindow, solanaCommitmentEnum, solanaDomainEnum } from "./common/solana.enum";

/**
 * window.solana.isPhantom
 */
const window: ISolanaWindow = {
    solana: {
        isPhantom: true,
        connect: () => {
            return Promise.resolve({ publicKey: "user wallet hash58 public key" });
        },
    }
};

const main = async function () {

    // // [mk] 1-1 phantom connect
    // try {
    //     const phantomConnectRes = await window.solana.connect();
    // }
    // catch (err) {
    //     alert("user refuse");
    //     return;
    // }

    // [ext] 1-2 using solana wallet adapter
    const solanaWalletAdapterAnchorWallet = useAnchorWallet();

    // [mk] 2 
    const solanaWeb3JsConnection = new SolanaAnchorJs.web3.Connection(solanaDomainEnum.devNet);

    // [mk] 3
    const solanaAnchorJsAnchorProvider = new SolanaAnchorJs.AnchorProvider(
        solanaWeb3JsConnection,
        solanaWalletAdapterAnchorWallet,  // (window.solana as unknown) as SolanaAnchorJs.Wallet,// [mk] if using ISolanaWindow
        SolanaAnchorJs.AnchorProvider.defaultOptions()
    );
    SolanaAnchorJs.setProvider(solanaAnchorJsAnchorProvider);

    // [mk] 4
    const solanaAnchorJsProgram = new SolanaAnchorJs.Program(
        IDL as SolanaAnchorJs.Idl,
        new SolanaAnchorJs.web3.PublicKey("your program hash58 public key"),
        solanaAnchorJsAnchorProvider
    );

    // [mk] 5
    const solanaWeb3TransactionSignature = await solanaAnchorJsProgram.methods
        .sayHello(Buffer.from([]), "", 1, true) // // bytes , string , u8 bigNumber , bool
        .accounts(
            {
                counter: new SolanaAnchorJs.web3.PublicKey("your params hash58 public key")
            }
        )
        .rpc();

    // [mk] 6
    const solanaWeb3JsConnectionBlockHash = await solanaWeb3JsConnection.getLatestBlockhash(solanaCommitmentEnum.confirmed);

    // [mk] 7
    const sonalaWeb3JsTransactionSignatureResult = await solanaWeb3JsConnection.confirmTransaction(
        {
            blockhash: solanaWeb3JsConnectionBlockHash.blockhash,
            lastValidBlockHeight: solanaWeb3JsConnectionBlockHash.lastValidBlockHeight,
            signature: solanaWeb3TransactionSignature
        }
    );

};

main();