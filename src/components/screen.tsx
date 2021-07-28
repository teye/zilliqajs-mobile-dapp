import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import { getAddressFromPrivateKey, Zilliqa } from '@zilliqa-js/zilliqa';
import { bytes, BN, Long, units } from "@zilliqa-js/util";
import { Transaction } from "@zilliqa-js/account";

interface Props {
}

const styles = StyleSheet.create({
    text: {
      fontFamily: 'sans-serif',
      fontSize: 14,
      color: '#fafafa',
    },
});

const Screen: React.FC<Props> = () => {
    // create a zilliqa instance
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const privateKey ='3375F915F3F9AE35E6B301B7670F53AD1A5BE15D8221EC7FD5E503F21D3450C8'; // demo wallet privatekey
    const zilAddress = getAddressFromPrivateKey(privateKey).toLowerCase();

    const [userBal, setUserBal] = useState('');  // in Qa
    const [pending, setPending] = useState(false);
    const [txnId, setTxnId] = useState('');

    // fetch wallet balance on initial load
    useEffect(() => {
        async function fetchData() {
            const balanceResp = await zilliqa.blockchain.getBalance(zilAddress);

            if (balanceResp.error !== undefined) {
                // error fetching wallet balance
                console.error(balanceResp.error.message);
                setUserBal('0');
            }
            setUserBal(balanceResp.result.balance);
        }
        fetchData();
    }, []);

    const onSendPayment = async () => {
        setPending(true);

        // add private key as default wallet
        zilliqa.wallet.addByPrivateKey(privateKey);

        try {
            // craft the transaction obj
            const gasPrice = units.toQa('2000', units.Units.Li);
            const tx = await zilliqa.blockchain.createTransactionWithoutConfirm(
                zilliqa.transactions.new(
                    {
                        version: bytes.pack(333, 1),
                        toAddr: '0xA54E49719267E8312510D7b78598ceF16ff127CE',
                        amount: new BN("1000000000000"),
                        gasPrice: gasPrice,
                        gasLimit: Long.fromNumber(50),
                    },
                    false,
                ),
            );

            // wait for the transaction to get confirm
            console.log(`The transaction id is:`, tx.id);
            const confirmedTxn: Transaction = await tx.confirm(tx.id!);

            console.log(`The transaction status is:`);
            console.log(confirmedTxn.getReceipt());

            setTxnId(tx.id!);
        } catch (err) {
            console.error(err);
        } finally {
            setPending(false);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: "#18191a",
            }}>
            <Text style={styles.text}>This is a sample mobile dapp coded with React-Native to demonstrate how to interact with ZilliqaJS SDK.{'\n\n'}This app would retrieve the wallet balance and also send a payment transaction.</Text>
            <Text>{'\n'}</Text>
            <Text style={styles.text}>Wallet: {zilAddress}{'\n'}</Text>
            <Text style={styles.text}>Balance: {units.fromQa(new BN(userBal), units.Units.Zil)} ZIL {'\n'}</Text>

            {
                txnId ?
                <Text 
                    style={styles.text}
                    onPress={() => Linking.openURL('https://viewblock.io/zilliqa/tx/0x' + txnId + '?network=testnet')}
                >
                    Success!{'\n'}
                    Transaction ID: {txnId} {'\n'}
                </Text> :
                null
            }

            {
                pending ?
                <Text style={styles.text}>Sending Payment...</Text> :
                <Button
                    title="Send Payment"
                    onPress={() => onSendPayment()}
                    color="#4CAF50"
                />
            }
        </View>
    );
}

export default Screen;