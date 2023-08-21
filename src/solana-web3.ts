import SolanaWeb3Js from "@solana/web3.js";
import Base64 from "js-base64";
import { solanaCommitmentEnum, solanaDomainEnum } from "./common/solana.enum";

const main = async function (isDevNetOrTestNet = false) {

    // [mk] 1
    const solanaWeb3JsConnection = new SolanaWeb3Js.Connection(
        solanaDomainEnum.devNet,
        solanaCommitmentEnum.confirmed
    );

    // [mk] 2-1
    const fromWalletSolanaWeb3JsKeypair = SolanaWeb3Js.Keypair.generate();

    // [mk] 2-2
    const toWalletSolanaWeb3JsKeypair = SolanaWeb3Js.Keypair.generate();

    if (isDevNetOrTestNet === true) {

        // [mk] 3 if is devnet or testnet , apply free sol for test or debug
        const solanaWeb3JsAirDropSignature = await solanaWeb3JsConnection.requestAirdrop(
            fromWalletSolanaWeb3JsKeypair.publicKey,
            SolanaWeb3Js.LAMPORTS_PER_SOL
        );

        // [mk] 4
        const solanaWeb3JsConnectionBlockHash = await solanaWeb3JsConnection.getLatestBlockhash();

        await solanaWeb3JsConnection.confirmTransaction(
            {
                blockhash: solanaWeb3JsConnectionBlockHash.blockhash,
                lastValidBlockHeight: solanaWeb3JsConnectionBlockHash.lastValidBlockHeight,
                signature: solanaWeb3JsAirDropSignature,
            }
        );

    }

    // [mk] 5-1
    const dbGasFeeConfig = SolanaWeb3Js.LAMPORTS_PER_SOL;

    const systemProgramSolanaWeb3JsTransactionInstruction = SolanaWeb3Js.SystemProgram.transfer(
        {
            fromPubkey: fromWalletSolanaWeb3JsKeypair.publicKey,
            toPubkey: toWalletSolanaWeb3JsKeypair.publicKey,
            lamports: dbGasFeeConfig,
        }
    );

    // [mk] 5-2
    const memoProgramSolanaWeb3JsTransactionInstruction = new SolanaWeb3Js.TransactionInstruction(
        {
            keys: [
                {
                    pubkey: fromWalletSolanaWeb3JsKeypair.publicKey,
                    isSigner: true,
                    isWritable: true,
                }
            ],
            programId: new SolanaWeb3Js.PublicKey("your memo program public key hash58"),
            data: Buffer.from(Base64.encode(`{"name":"test","age":18}`), "utf-8"),
        }
    );

    // [mk] 6
    const solanaWeb3JsComplexTransaction = new SolanaWeb3Js.Transaction()
        .add(systemProgramSolanaWeb3JsTransactionInstruction)
        .add(memoProgramSolanaWeb3JsTransactionInstruction);

    // [mk] 7
    const solanaWeb3JsTransactionSignature = await SolanaWeb3Js.sendAndConfirmTransaction(
        solanaWeb3JsConnection,
        solanaWeb3JsComplexTransaction,
        [fromWalletSolanaWeb3JsKeypair, toWalletSolanaWeb3JsKeypair],
        {
            skipPreflight: false, // if skip memo program pre check
            commitment: solanaCommitmentEnum.confirmed,
        },
    );

};

main();