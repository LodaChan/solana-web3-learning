
import { FC, ReactNode, useCallback, useState, } from "react";
import type { WalletName } from "@solana/wallet-adapter-base";
import type { Wallet } from '@solana/wallet-adapter-react';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';

const Modal: FC<{ children: ReactNode; }> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

function CustomConnectButton() {

    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{ onSelectWallet(walletName: WalletName): void; wallets: Wallet[]; }> | null>(null);

    const { buttonState, onConnect, onDisconnect, onSelectWallet } = useWalletMultiButton({ onSelectWallet: setWalletModalConfig, });

    let viewWalletStatus = "";

    switch (buttonState) {
        case 'connected':
            viewWalletStatus = 'Disconnect';
            break;
        case 'connecting':
            viewWalletStatus = 'Connecting';
            break;
        case 'disconnecting':
            viewWalletStatus = 'Disconnecting';
            break;
        case 'has-wallet':
            viewWalletStatus = 'Connect';
            break;
        case 'no-wallet':
            viewWalletStatus = 'Select Wallet';
            break;
    }

    const clickAction = useCallback(() => {
        switch (buttonState) {
            case 'connected':
                return onDisconnect;
            case 'connecting':
            case 'disconnecting':
                break;
            case 'has-wallet':
                return onConnect;
            case 'no-wallet':
                return onSelectWallet;
                break;
        }
    }, [buttonState, onDisconnect, onConnect, onSelectWallet]);

    return (
        <>
            <button disabled={buttonState === "connecting" || buttonState === "disconnecting"} onClick={clickAction}>
                {viewWalletStatus}
            </button>
            {walletModalConfig ? (
                <Modal>
                    {walletModalConfig.wallets.map(
                        (wallet) => (
                            <button key={wallet.adapter.name}
                                onClick={
                                    () => {
                                        walletModalConfig.onSelectWallet(wallet.adapter.name);
                                        setWalletModalConfig(null);
                                    }
                                }>
                                {wallet.adapter.name}
                            </button>
                        ))}
                </Modal>
            ) : null}
        </>
    );
}