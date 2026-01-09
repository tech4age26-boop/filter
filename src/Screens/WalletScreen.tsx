
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useTheme } from '../Theme/GlobalTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface Transaction {
    id: string;
    type: 'deposit' | 'payment';
    amount: string;
    date: string;
    description: string;
}

interface Invoice {
    id: string;
    provider: string;
    amount: string;
    status: 'pending' | 'paid';
    date: string;
    service: string;
    history: string[];
}

export function WalletScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const [balance, setBalance] = useState(0);
    const [addMoneyModal, setAddMoneyModal] = useState(false);
    const [cardNo, setCardNo] = useState('');
    const [amount, setAmount] = useState('');

    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', type: 'payment', amount: '45.00', date: '2024-01-08', description: 'Oil Change Service' },
        { id: '2', type: 'deposit', amount: '100.00', date: '2024-01-05', description: 'Wallet Topup' },
    ]);

    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: 'INV-001',
            provider: 'Apex Workshop',
            amount: '120.00',
            status: 'pending',
            date: '2024-01-09',
            service: 'Brake Repair',
            history: ['Order created on 2024-01-09', 'Estimated cost provided: SAR 120']
        },
        {
            id: 'INV-002',
            provider: 'Quick Fix Garage',
            amount: '50.00',
            status: 'pending',
            date: '2024-01-09',
            service: 'Tire Inspection',
            history: ['Technician arrived at 10:00 AM', 'Inspection completed']
        },
    ]);

    const handleAddMoney = () => {
        if (!cardNo || !amount) {
            Alert.alert(t('common.error'), t('auth.error_fill_fields'));
            return;
        }

        const addedAmount = parseFloat(amount);
        if (isNaN(addedAmount)) {
            Alert.alert(t('common.error'), 'Invalid amount');
            return;
        }

        setBalance(prev => prev + addedAmount);
        setTransactions(prev => [
            {
                id: Math.random().toString(),
                type: 'deposit',
                amount: amount,
                date: new Date().toISOString().split('T')[0],
                description: 'Wallet Topup via Card'
            },
            ...prev
        ]);

        setAddMoneyModal(false);
        setCardNo('');
        setAmount('');
        Alert.alert(t('common.success'), `SAR ${amount} ${t('wallet.success_add')}`);
    };

    const showInvoiceDetails = (invoice: Invoice) => {
        Alert.alert(
            `Invoice Details: ${invoice.id}`,
            `Service: ${invoice.service}\nProvider: ${invoice.provider}\nAmount: SAR ${invoice.amount}\n\nHistory:\n- ${invoice.history.join('\n- ')}`,
            [{ text: t('common.cancel') }, { text: 'Pay Now', onPress: () => handlePayInvoice(invoice) }]
        );
    };

    const handlePayInvoice = (invoice: Invoice) => {
        const invAmount = parseFloat(invoice.amount);
        if (balance < invAmount) {
            Alert.alert(t('wallet.insufficient'), 'Please add money to your wallet first.');
            return;
        }

        setBalance(prev => prev - invAmount);
        setTransactions(prev => [
            {
                id: Math.random().toString(),
                type: 'payment',
                amount: invoice.amount,
                date: new Date().toISOString().split('T')[0],
                description: `Payment for ${invoice.id}`
            },
            ...prev
        ]);
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        Alert.alert(t('common.success'), t('wallet.success_pay'));
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Custom Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('wallet.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Balance Card */}
                <View style={[styles.balanceCard, { backgroundColor: '#F4C430' }]}>
                    <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
                    <Text style={styles.balanceAmount}>SAR {balance.toFixed(2)}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setAddMoneyModal(true)}>
                        <MaterialCommunityIcons name="plus-circle" size={24} color="#1C1C1E" />
                        <Text style={styles.addButtonText}>{t('wallet.add_money')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Accept Invoices Section */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('wallet.accept_invoices')}</Text>
                {invoices.length > 0 ? (
                    invoices.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.itemCard, { backgroundColor: theme.cardBackground }]}
                            onPress={() => showInvoiceDetails(item)}>
                            <View style={styles.itemIcon}>
                                <MaterialCommunityIcons name="file-document-outline" size={24} color="#F4C430" />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={[styles.itemName, { color: theme.text }]}>{item.provider}</Text>
                                <Text style={[styles.itemSub, { color: theme.subText }]}>{item.service}</Text>
                            </View>
                            <Text style={[styles.itemAmount, { color: '#E74C3C' }]}>SAR {item.amount}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ color: theme.subText, textAlign: 'center', marginVertical: 10 }}>{t('wallet.no_invoices')}</Text>
                )}

                {/* Transaction History Section */}
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('wallet.history')}</Text>
                {transactions.length > 0 ? (
                    transactions.map(item => (
                        <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.cardBackground }]}>
                            <View style={[styles.itemIcon, { backgroundColor: item.type === 'deposit' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)' }]}>
                                <MaterialCommunityIcons
                                    name={item.type === 'deposit' ? 'arrow-down' : 'arrow-up'}
                                    size={20}
                                    color={item.type === 'deposit' ? '#2ECC71' : '#E74C3C'}
                                />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={[styles.itemName, { color: theme.text }]}>{item.description}</Text>
                                <Text style={[styles.itemSub, { color: theme.subText }]}>{item.date}</Text>
                            </View>
                            <Text style={[styles.itemAmount, { color: item.type === 'deposit' ? '#2ECC71' : theme.text }]}>
                                {item.type === 'deposit' ? '+' : '-'}SAR {item.amount}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: theme.subText, textAlign: 'center', marginVertical: 10 }}>{t('wallet.no_transactions')}</Text>
                )}
            </ScrollView>

            {/* Add Money Modal */}
            <Modal
                transparent
                visible={addMoneyModal}
                animationType="slide"
                onRequestClose={() => setAddMoneyModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{t('wallet.top_up')}</Text>

                        <TextInput
                            placeholder={t('wallet.fake_card')}
                            placeholderTextColor={theme.subText}
                            style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text }]}
                            keyboardType="numeric"
                            value={cardNo}
                            onChangeText={setCardNo}
                        />

                        <TextInput
                            placeholder={t('wallet.amount')}
                            placeholderTextColor={theme.subText}
                            style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text }]}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.background }]}
                                onPress={() => setAddMoneyModal(false)}>
                                <Text style={{ color: theme.text }}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: '#F4C430' }]}
                                onPress={handleAddMoney}>
                                <Text style={{ color: '#1C1C1E', fontWeight: 'bold' }}>{t('wallet.add_cash')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    balanceCard: {
        padding: 24,
        borderRadius: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#1C1C1E',
        opacity: 0.8,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    addButtonText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    itemIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(244, 196, 48, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    itemSub: {
        fontSize: 12,
        marginTop: 2,
    },
    itemAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        borderRadius: 24,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
});
