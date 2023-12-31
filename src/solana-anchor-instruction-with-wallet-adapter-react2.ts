import * as SolanaAnchorJs from "@coral-xyz/anchor";
import TestProgramIDL from "./idl/test.program";
import {
    useAnchorWallet as useSolanaWalletAdapterAnchorWallet,
    useConnection as useSolanaWalletAdapterConnection,
} from "@solana/wallet-adapter-react";
import { solanaCommitmentEnum } from "./common/solana.enum";

const main = async function () {

    // [mk] 1 using solana wallet adapter anchor wallet and connection
    const solanaWalletAdapterAnchorWallet = useSolanaWalletAdapterAnchorWallet();
    const { connection: viewSolanaWalletAdapterConnection } = useSolanaWalletAdapterConnection();

    // [mk] 2
    const solanaAnchorJsAnchorProvider = new SolanaAnchorJs.AnchorProvider(
        viewSolanaWalletAdapterConnection,
        solanaWalletAdapterAnchorWallet,
        SolanaAnchorJs.AnchorProvider.defaultOptions()
    );
    SolanaAnchorJs.setProvider(solanaAnchorJsAnchorProvider);

    // [mk] 3
    const solanaAnchorJsProgram = new SolanaAnchorJs.Program(
        TestProgramIDL as SolanaAnchorJs.Idl,
        new SolanaAnchorJs.web3.PublicKey("your program public key base58"),
        solanaAnchorJsAnchorProvider
    );

    // [mk] 4
    const solanaWeb3TransactionInstruction = await solanaAnchorJsProgram.methods
        .sayHello(
            Buffer.from([]), // bytes
            "", // string
            1, // u8
            new SolanaAnchorJs.BN(1000), // u64
            true // boolean
        )
        .accounts(
            {
                counter: new SolanaAnchorJs.web3.PublicKey("your params public key base58")
            }
        )
        .instruction();

    // [mk] 5
    const solanaWeb3Transaction = new SolanaAnchorJs.web3.Transaction().add(solanaWeb3TransactionInstruction);
    const signedSolanaWeb3Transaction = await solanaWalletAdapterAnchorWallet.signTransaction(solanaWeb3Transaction);
    const solanaWeb3TransactionSignature = await solanaAnchorJsAnchorProvider.connection.sendRawTransaction(signedSolanaWeb3Transaction.serialize());

    // [mk] 6
    const solanaWeb3JsConnectionBlockHash = await viewSolanaWalletAdapterConnection.getLatestBlockhash(solanaCommitmentEnum.confirmed);

    // [mk] 7
    const sonalaWeb3JsConfirmTransactionSignatureResult = await viewSolanaWalletAdapterConnection.confirmTransaction(
        {
            blockhash: solanaWeb3JsConnectionBlockHash.blockhash,
            lastValidBlockHeight: solanaWeb3JsConnectionBlockHash.lastValidBlockHeight,
            signature: solanaWeb3TransactionSignature
        }
    );

};

main();