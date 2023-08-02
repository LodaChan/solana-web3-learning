import SolanaWeb3Js from "@solana/web3.js";

export const solanaDomainEnum = {
    prod: "prod solana memo service address",
    testNet: SolanaWeb3Js.clusterApiUrl("testnet"),
    apiTestNet: "https://api.testnet.solana.com",
    devNet: SolanaWeb3Js.clusterApiUrl("devnet"),
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

export interface IPhantomWindow {
    phantom: {
        solana: {
            isPhantom: boolean;
        };
    },
};