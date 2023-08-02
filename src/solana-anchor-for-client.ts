import SolanaAnchorJs from "@coral-xyz/anchor";
import { IPhantomWindow, solanaCommitmentEnum, solanaDomainEnum } from "./common/solana.enum";
import TestProgram from "./idl/test.program";

/**
 * window.phantom.solana
 */
const window: IPhantomWindow = {
    phantom: {
        solana: {
            isPhantom: true,
        }
    }
};

const main = async function () {

    // [mk] 1 
    const solanaWeb3JsConnection = new SolanaAnchorJs.web3.Connection(solanaDomainEnum.devNet);

    // [mk] 2
    const solanaWeb3JsConnectionBlockHash = await solanaWeb3JsConnection.getLatestBlockhash(solanaCommitmentEnum.confirmed);

    // [mk] 3
    const solanaAnchorJsProvider = new SolanaAnchorJs.AnchorProvider(
        solanaWeb3JsConnection,
        new SolanaAnchorJs.Wallet(SolanaAnchorJs.web3.Keypair.generate()),// [todo]
        SolanaAnchorJs.AnchorProvider.defaultOptions()
    );

    // [mk] 4
    const solanaAnchorJsProgram = new SolanaAnchorJs.Program(
        TestProgram as SolanaAnchorJs.Idl,
        new SolanaAnchorJs.web3.PublicKey("your contract program hash address"),
        solanaAnchorJsProvider
    );

    // [mk] 5
    const solanaWeb3TransactionSignature = await solanaAnchorJsProgram.methods
        .sayHello()
        .accounts(
            {
                counter: new SolanaAnchorJs.web3.PublicKey("your params hash public key")
            }
        )
        .rpc();

    // [mk] 6
    const sonalaWeb3JsTransactionSignatureResult: SolanaAnchorJs.web3.RpcResponseAndContext<SolanaAnchorJs.web3.SignatureResult> = await solanaWeb3JsConnection.confirmTransaction(
        {
            blockhash: solanaWeb3JsConnectionBlockHash.blockhash,
            lastValidBlockHeight: solanaWeb3JsConnectionBlockHash.lastValidBlockHeight,
            signature: solanaWeb3TransactionSignature
        }
    );

};

main();