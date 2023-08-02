import SolanaAnchorJs from "@coral-xyz/anchor";
import { ISolanaWindow, solanaCommitmentEnum, solanaDomainEnum } from "./common/solana.enum";
import TestProgramIdl from "./idl/test.program";

/**
 * window.solana.isPhantom
 */
const window: ISolanaWindow = {
    solana: {
        isPhantom: true,
        connect: () => {
            return Promise.resolve({ publicKey: "user wallet hash public key" });
        },
    }
};

const main = async function () {

    // [mk] 1 phantom connect
    try {
        const phantomConnectRes = await window.solana.connect();
    }
    catch (err) {
        alert("user refuse");
        return;
    }

    // [mk] 2 
    const solanaWeb3JsConnection = new SolanaAnchorJs.web3.Connection(solanaDomainEnum.devNet);

    // [mk] 3
    const solanaWeb3JsConnectionBlockHash = await solanaWeb3JsConnection.getLatestBlockhash(solanaCommitmentEnum.confirmed);

    // [mk] 4
    const solanaAnchorJsAnchorProvider = new SolanaAnchorJs.AnchorProvider(
        solanaWeb3JsConnection,
        (window.solana as unknown) as SolanaAnchorJs.Wallet,// [hack]
        SolanaAnchorJs.AnchorProvider.defaultOptions()
    );
    SolanaAnchorJs.setProvider(solanaAnchorJsAnchorProvider);

    // [mk] 5
    const solanaAnchorJsProgram = new SolanaAnchorJs.Program(
        TestProgramIdl as SolanaAnchorJs.Idl,
        new SolanaAnchorJs.web3.PublicKey("your program hash address"),
    );

    // [mk] 6
    const solanaWeb3TransactionSignature = await solanaAnchorJsProgram.methods
        .sayHello()
        .accounts(
            {
                counter: new SolanaAnchorJs.web3.PublicKey("your params hash public key")
            }
        )
        .rpc();

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