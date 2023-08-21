import SolanaWeb3Js from "@solana/web3.js";
import * as SolanaAnchorJs from "@coral-xyz/anchor";

export const solanaDomainEnum = {
    prodNet: SolanaWeb3Js.clusterApiUrl("mainnet-beta"),
    testNet: SolanaWeb3Js.clusterApiUrl("testnet"),

    devNet: SolanaWeb3Js.clusterApiUrl("devnet"),
};

export const solanaAPIDomainEnum = {
    apiTestNet: "https://api.testnet.solana.com",
};

export enum solanaCommitmentEnum {
    /**
     * 查询最近已被连接节点达到1次确认的区块
     */
    processed = "processed",
    /**
     * 查询集群最近已达到1次确认的区块
     */
    confirmed = "confirmed",
    /**
     * 查询集群最近已确认的区块
     */
    finalized = "finalized",
    recent = "recent",
    single = "single",
    singleGossip = "singleGossip",
    root = "root",
    max = "max",
}

export interface ISolanaWindow {
    solana: {
        isPhantom: Boolean,
        connect(): Promise<{ publicKey: String; }>;
        signTransaction(transaction: SolanaAnchorJs.web3.Transaction): Promise<SolanaAnchorJs.web3.Transaction>;
    };
};