import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Image,
    Switch,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../App';
import { API_BASE_URL } from '../config';

interface Service {
    _id: string;
    name: string;
    price: string;
    duration: string;
    category: 'service' | 'product';
    images?: string[];
    subCategory?: string; // The specific dropdown category
    stock?: string;
    sku?: string;
    status?: 'active' | 'inactive';
    serviceTypes?: string[];
    uom?: string;
    purchasePrice?: string;
}

const SERVICE_CATEGORIES = ['Diagnostics', 'Quick Service', 'Tuning', 'Detailing', 'Oil Change', 'Tires & Alignment', 'Engine', 'Electrical'];
const PRODUCT_CATEGORIES = ['Brake Pads', 'Filters', 'Fluids', 'Tires', 'Accessories', 'Engine Parts', 'Tools'];
const UOM_OPTIONS = ['Piece', 'Kg', 'Liter', 'Box', 'Packet', 'Set', 'Unit', 'Dozen', 'Pair'];
const { width } = Dimensions.get('window');

// --- Reusable Components ---

const FormLabel = ({ text, required, theme }: { text: string, required?: boolean, theme: any }) => (
    <Text style={[styles.label, { color: theme.text }]}>
        {text} {required && <Text style={{ color: '#FF3B30' }}>*</Text>}
    </Text>
);

const FormInput = ({
    label,
    required,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    theme,
    editable = true
}: any) => (
    <View style={{ marginBottom: 16 }}>
        <FormLabel text={label} required={required} theme={theme} />
        <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text, marginBottom: 0, opacity: editable ? 1 : 0.7 }]}
            placeholder={placeholder}
            placeholderTextColor={theme.inputPlaceholder || '#999'}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
        />
    </View>
);

const DetailRow = ({ icon, label, value, theme }: any) => (
    <View style={styles.detailRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            <MaterialCommunityIcons name={icon} size={20} color={theme.subText} style={{ marginRight: 8 }} />
            <Text style={[styles.detailLabel, { color: theme.subText }]}>{label}</Text>
        </View>
        <Text style={[styles.detailValue, { color: theme.text }]}>{value || '-'}</Text>
    </View>
);

const DetailImage = ({ uri, theme }: { uri: string, theme: any }) => {
    const [loading, setLoading] = useState(true);
    return (
        <View style={styles.detailImageContainer}>
            <Image
                source={{ uri }}
                style={styles.detailImage}
                resizeMode="cover"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
            />
            {loading && (
                // <FilterLoader transparent messenger={false} absolute={true} />
                <ActivityIndicator color="#F4C430" size={20} />
            )}
        </View>
    );
};

const FilterLoader = ({ label, transparent, messenger = true, absolute = true }: { label?: string, transparent?: boolean, messenger?: boolean, absolute?: boolean }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <View style={[
            styles.loaderOverlay,
            transparent ? styles.loaderTransparent : { backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)' },
            absolute ? { ...StyleSheet.absoluteFillObject, position: 'absolute' } : { position: 'relative' }
        ]}>
            <View style={[styles.loaderContent, { backgroundColor: theme.cardBackground, shadowColor: isDark ? '#000' : '#999' }]}>
                <View style={styles.logoBadge}>
                    <Text style={styles.logoText}>FILTER</Text>
                </View>
                <ActivityIndicator size="small" color="#F4C430" style={{ marginTop: 15 }} />
                {messenger && label && (
                    <Text style={[styles.loaderLabel, {}]}>{label}</Text>
                )}
            </View>
        </View>
    );
};

// --- Custom Alert Modal ---
const CustomAlert = ({ visible, title, message, buttons, onClose, theme }: any) => (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
        <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <View style={[styles.customAlertContainer, { backgroundColor: theme.cardBackground }]}>
                {title && <Text style={[styles.customAlertTitle, { color: theme.text }]}>{title}</Text>}
                {message && <Text style={[styles.customAlertMessage, { color: theme.subText }]}>{message}</Text>}

                <View style={[styles.customAlertButtonsContainer]}>
                    {buttons.map((btn: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.customAlertButton,
                                // Dynamic background for different styles
                                { backgroundColor: btn.style === 'destructive' ? '#FFE5E5' : (btn.style === 'cancel' ? theme.background : theme.background) },
                                index > 0 && { marginTop: 8 }
                            ]}
                            onPress={() => {
                                if (btn.onPress) btn.onPress();
                                else onClose();
                            }}>
                            <Text style={[
                                styles.customAlertButtonText,
                                { color: btn.style === 'destructive' ? '#FF3B30' : (btn.style === 'cancel' ? theme.subText : '#007AFF'), fontWeight: btn.style === 'cancel' ? '600' : 'bold' }
                            ]}>
                                {btn.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    </Modal>
);

export function ProductsServicesScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();


    // --- State ---
    const [items, setItems] = useState<Service[]>([]);
    const [providerId, setProviderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Service | null>(null);
    const [originalItem, setOriginalItem] = useState<Partial<Service> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'services' | 'products'>('all');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isUomOpen, setIsUomOpen] = useState(false);

    // Custom Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', buttons: [] as any[] });

    const initialFormState: Partial<Service> = {
        name: '',
        price: '',
        duration: '',
        category: 'service',
        subCategory: '',
        images: [],
        stock: '',
        sku: '',
        status: 'active',
        serviceTypes: [],
        uom: '',
        purchasePrice: ''
    };

    const [newItem, setNewItem] = useState<Partial<Service>>(initialFormState);

    const filteredItems = items.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'services') return item.category === 'service';
        if (activeTab === 'products') return item.category === 'product';
        return true;
    });

    useEffect(() => {
        loadProviderData();
    }, []);

    const loadProviderData = async () => {
        try {
            const data = await AsyncStorage.getItem('user_data');
            if (data) {
                const user = JSON.parse(data);
                const id = user.id || user._id;
                setProviderId(id);
                fetchItems(id);
            }
        } catch (error) {
            console.error('Error loading provider data:', error);
        }
    };

    const fetchItems = useCallback(async (pId: string | null = providerId) => {
        const idToUse = pId || providerId;
        if (!idToUse) return;

        setLoading(true);
        try {
            const url = `${API_BASE_URL}/api/products?providerId=${idToUse}`;
            console.log('Fetching items from:', url);
            const response = await fetch(url);

            const contentType = response.headers.get('content-type');
            const responseText = await response.text();

            if (!response.ok) {
                console.error(`Fetch error! Status: ${response.status}. Body: ${responseText.substring(0, 200)}`);
                throw new Error(`Server returned ${response.status}`);
            }

            if (contentType && contentType.includes('application/json')) {
                const data = JSON.parse(responseText);
                if (data.success) {
                    setItems(data.items);
                }
            } else {
                console.error('Expected JSON but received:', contentType, 'Body snippet:', responseText.substring(0, 200));
                throw new Error('Invalid response format (not JSON)');
            }
        } catch (error) {
            console.error('Fetch Items Error Details:', error);
            showAlert('Error', 'Failed to load items. Please try again.', [{ text: 'OK', onPress: closeAlert }]);
        } finally {
            setLoading(false);
        }
    }, [providerId]);

    // --- Actions ---

    const showAlert = (title: string, message: string, buttons: any[]) => {
        setAlertConfig({ title, message, buttons });
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    const switchFormType = (type: 'service' | 'product') => {
        if (newItem.category !== type) {
            setNewItem({
                ...initialFormState,
                category: type,
                subCategory: type === 'product' ? PRODUCT_CATEGORIES[0] : '',
            });
            setIsCategoryOpen(false);
        }
    };

    const handleImagePick = async () => {
        const currentImages = newItem.images || [];
        if (currentImages.length >= 4) {
            showAlert('Limit Reached', 'You can upload a maximum of 4 images.', [{ text: 'OK', onPress: closeAlert }]);
            return;
        }

        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 4 - currentImages.length });

        if (result.assets) {
            const newUris = result.assets.map(a => a.uri).filter(u => u !== undefined) as string[];
            setNewItem({ ...newItem, images: [...currentImages, ...newUris] });
        }
    };

    const removeImage = (index: number) => {
        const currentImages = newItem.images || [];
        setNewItem({ ...newItem, images: currentImages.filter((_, i) => i !== index) });
    };

    const generateSKU = () => {
        const prefix = newItem.category === 'service' ? 'SVC' : 'PRD';
        const random = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
        setNewItem({ ...newItem, sku: `${prefix}-${random}` });
    };

    const validateForm = () => {
        const missingFields: string[] = [];
        const invalidFields: string[] = [];

        if (!newItem.name) missingFields.push('Product Name');

        // Price Validation
        if (!newItem.price) {
            missingFields.push('Price');
        } else if (isNaN(Number(newItem.price)) || Number(newItem.price) < 0) {
            invalidFields.push('Price must be a valid number');
        }

        if (newItem.category === 'product') {
            if (!newItem.subCategory) missingFields.push('Category');
            // Stock Validation
            if (!newItem.stock) {
                missingFields.push('Stock Quantity');
            } else if (isNaN(Number(newItem.stock)) || !Number.isInteger(Number(newItem.stock)) || Number(newItem.stock) < 0) {
                invalidFields.push('Stock Quantity must be a valid integer');
            }
            if (!newItem.uom) missingFields.push('Unit of Measurement (UOM)');
            if (!newItem.sku) missingFields.push('SKU');
        } else {
            if (!newItem.serviceTypes || newItem.serviceTypes.length === 0) missingFields.push('Service Type');
            // Duration Validation
            if (!newItem.duration) {
                missingFields.push('Duration');
            } else if (isNaN(Number(newItem.duration)) || Number(newItem.duration) <= 0) {
                invalidFields.push('Duration must be a valid number (minutes)');
            }
        }

        if (missingFields.length > 0) {
            showAlert('Missing Fields', `Please fill the following required fields:\n\n${missingFields.join('\n')}`, [{ text: 'OK', onPress: closeAlert }]);
            return false;
        }

        if (invalidFields.length > 0) {
            showAlert('Invalid Input', `Please correct the following errors:\n\n${invalidFields.join('\n')}`, [{ text: 'OK', onPress: closeAlert }]);
            return false;
        }

        return true;
    };

    const handleSaveItem = async () => {
        if (!validateForm()) return;

        // Change Detection for Updates
        if (isEditing && originalItem) {
            const hasChanged =
                newItem.name !== originalItem.name ||
                newItem.price !== originalItem.price ||
                newItem.category !== originalItem.category ||
                newItem.status !== originalItem.status ||
                newItem.subCategory !== originalItem.subCategory ||
                newItem.stock !== originalItem.stock ||
                newItem.uom !== originalItem.uom ||
                newItem.purchasePrice !== originalItem.purchasePrice ||
                newItem.duration !== originalItem.duration ||
                JSON.stringify(newItem.serviceTypes) !== JSON.stringify(originalItem.serviceTypes) ||
                JSON.stringify(newItem.images) !== JSON.stringify(originalItem.images);

            if (!hasChanged) {
                console.log('No changes detected, skipping API call');
                setShowAddModal(false);
                setNewItem(initialFormState);
                setIsEditing(false);
                setOriginalItem(null);
                return;
            }
        }

        if (!providerId) {
            showAlert('Error', 'Provider ID not found. Please log in again.', [{ text: 'OK', onPress: closeAlert }]);
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('providerId', providerId);
            formData.append('name', newItem.name || '');
            formData.append('price', newItem.price || '');
            formData.append('category', newItem.category || 'service');
            formData.append('status', newItem.status || 'active');

            if (newItem.category === 'product') {
                formData.append('subCategory', newItem.subCategory || '');
                formData.append('stock', newItem.stock || '0');
                formData.append('sku', newItem.sku || '');
                formData.append('uom', newItem.uom || '');
                formData.append('purchasePrice', newItem.purchasePrice || '0');
            } else {
                formData.append('duration', newItem.duration || '0');
                formData.append('serviceTypes', JSON.stringify(newItem.serviceTypes || []));
            }

            // Handle images
            if (newItem.images && newItem.images.length > 0) {
                const existingImages: string[] = [];
                newItem.images.forEach((uri: string, index: number) => {
                    if (uri.startsWith('file://')) {
                        const filename = uri.split('/').pop();
                        const match = /\.(\w+)$/.exec(filename || '');
                        const type = match ? `image/${match[1]}` : `image`;
                        formData.append('images', {
                            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                            name: filename || `image_${index}.jpg`,
                            type
                        } as any);
                    } else if (uri.startsWith('http')) {
                        existingImages.push(uri);
                    }
                });

                if (isEditing) {
                    formData.append('existingImages', JSON.stringify(existingImages));
                }
            } else if (isEditing) {
                // If all images were removed
                formData.append('existingImages', JSON.stringify([]));
            }

            const url = isEditing ? `${API_BASE_URL}/api/products/${newItem._id}` : `${API_BASE_URL}/api/products`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();

            if (data.success) {
                setShowAddModal(false);
                setNewItem(initialFormState);
                setIsEditing(false);
                setOriginalItem(null);
                fetchItems();
                showAlert('Success', `Item ${isEditing ? 'updated' : 'added'} successfully!`, [{ text: 'OK', onPress: closeAlert }]);
            } else {
                showAlert('Error', data.message || 'Failed to save item', [{ text: 'OK', onPress: closeAlert }]);
            }
        } catch (error) {
            console.error('Save Item Error:', error);
            showAlert('Error', 'An unexpected error occurred. Please try again.', [{ text: 'OK', onPress: closeAlert }]);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditStart = (item: Service) => {
        const sanitizedItem = {
            ...item,
            price: item.price?.toString() || '',
            duration: item.duration?.toString() || '',
            stock: item.stock?.toString() || '',
            serviceTypes: item.serviceTypes || [],
            uom: item.uom || '',
            purchasePrice: item.purchasePrice?.toString() || ''
        };
        setNewItem(sanitizedItem);
        setOriginalItem(sanitizedItem); // Assuming originalItem state is declared elsewhere
        setIsEditing(true);
        setShowAddModal(true);
    };

    const handleDelete = (id: string, fromDetail: boolean = false) => {
        if (fromDetail) setShowDetailModal(false);

        // Slight delay to allow modal transition if any
        setTimeout(() => {
            showAlert('Delete Item', 'Are you sure you want to delete this item?', [
                { text: 'Cancel', style: 'cancel', onPress: () => { if (fromDetail) setShowDetailModal(true); closeAlert(); } },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                                method: 'DELETE',
                            });
                            const data = await response.json();
                            if (data.success) {
                                closeAlert();
                                fetchItems();
                            } else {
                                showAlert('Error', data.message || 'Failed to delete item', [{ text: 'OK', onPress: closeAlert }]);
                            }
                        } catch (error) {
                            console.error('Delete Item Error:', error);
                            showAlert('Error', 'Connection failed. Please check your internet.', [{ text: 'OK', onPress: closeAlert }]);
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]);
        }, 100);
    };

    const openAddModal = () => {
        const defaultCategory = activeTab === 'products' ? 'product' : 'service';
        setNewItem({
            ...initialFormState,
            category: defaultCategory,
            subCategory: defaultCategory === 'product' ? PRODUCT_CATEGORIES[0] : '',
        });
        setIsEditing(false);
        setShowAddModal(true);
    };

    const openDetailModal = (item: Service) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    const toggleServiceType = (type: string) => {
        const currentTypes = newItem.serviceTypes || [];
        if (currentTypes.includes(type)) {
            setNewItem({ ...newItem, serviceTypes: currentTypes.filter(t => t !== type) });
        } else {
            setNewItem({ ...newItem, serviceTypes: [...currentTypes, type] });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header and Tabs */}
            <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.title, { color: theme.text }]}>{t('products.title')}</Text>
                <TouchableOpacity
                    style={[styles.addButton, (isSaving || loading) && { opacity: 0.5 }]}
                    onPress={openAddModal}
                    disabled={isSaving || loading}
                >
                    <MaterialCommunityIcons name="plus" size={20} color="#1C1C1E" />
                </TouchableOpacity>
            </View>

            <View style={[styles.tabContainer, { backgroundColor: theme.cardBackground }]}>
                {[
                    { key: 'all', label: t('common.view_all') },
                    { key: 'services', label: t('products.services') },
                    { key: 'products', label: t('products.parts') }
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.activeTab, (isSaving || loading) && { opacity: 0.7 }]}
                        onPress={() => setActiveTab(tab.key as any)}
                        disabled={isSaving || loading}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText, activeTab !== tab.key && { color: theme.subText }]}>
                            {tab.label} ({tab.key === 'all' ? items.length : items.filter((i: Service) => i.category === (tab.key === 'services' ? 'service' : 'product')).length})
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchItems} tintColor={theme.tint} />
                }>
                {loading && items.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        {/* <FilterLoader transparent messenger={false} absolute={false} /> */}
                        <Text style={{ color: theme.subText, marginTop: 20 }}>Loading items...</Text>
                    </View>
                ) : items.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <MaterialCommunityIcons name="package-variant-closed" size={50} color={theme.border} />
                        <Text style={{ color: theme.subText, marginTop: 10 }}>No items found</Text>
                    </View>
                ) : filteredItems.map((item) => (
                    <TouchableOpacity
                        key={item._id}
                        style={[styles.itemCard, { backgroundColor: theme.cardBackground, opacity: item.status === 'inactive' ? 0.6 : 1 }]}
                        onPress={() => openDetailModal(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.itemHeader}>
                            <View style={styles.itemInfo}>
                                <MaterialCommunityIcons
                                    name={item.category === 'service' ? 'wrench' : 'package-variant'}
                                    size={24}
                                    color="#F4C430"
                                />
                                <View style={styles.itemDetails}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
                                        {item.status === 'inactive' && <Text style={{ fontSize: 10, color: '#FF3B30', fontWeight: 'bold' }}>INACTIVE</Text>}
                                    </View>
                                    <Text style={[styles.itemDuration, { width: "90%", }]}>
                                        {item.category === 'service'
                                            ? `${item.serviceTypes?.slice(0, 2).join(', ') || item.subCategory}`
                                            : item.subCategory
                                        } • {item.category === 'service' ? `${item.duration} min` : `Stock: ${item.stock || '-'} ${item.uom || ''}`}
                                        {item.category === 'service' && (item.serviceTypes?.length || 0) > 2 && ` +${(item.serviceTypes?.length || 0) - 2}`}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.itemPrice, { width: "28%", textAlign: 'right' }]}>{item.price} SAR</Text>
                        </View>
                        <View style={[styles.itemActions, { borderTopColor: theme.border }]}>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: theme.background }, (isSaving || loading) && { opacity: 0.5 }]}
                                onPress={() => handleEditStart(item)}
                                disabled={isSaving || loading}
                            >
                                <MaterialCommunityIcons name="pencil" size={18} color="#007AFF" />
                                <Text style={styles.actionBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: theme.background }, (isSaving || loading) && { opacity: 0.5 }]}
                                onPress={() => handleDelete(item._id)}
                                disabled={isSaving || loading}
                            >
                                <MaterialCommunityIcons name="delete" size={18} color="#FF3B30" />
                                <Text style={[styles.actionBtnText, styles.deleteBtnText]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal statusBarTranslucent visible={showAddModal} transparent={true} animationType="slide" onRequestClose={() => {
                if (!isSaving) {
                    setShowAddModal(false);
                    setOriginalItem(null);
                }
            }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{isEditing ? 'Edit' : 'Add'} {newItem.category === 'service' ? 'Service' : 'Product'}</Text>
                            <TouchableOpacity onPress={() => {
                                setShowAddModal(false);
                                setOriginalItem(null);
                            }} disabled={isSaving}>
                                <MaterialCommunityIcons name="close" size={24} color={isSaving ? theme.border : theme.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            {/* Type Switcher */}
                            {!isEditing && (
                                <View style={styles.categoryContainer}>
                                    {['service', 'product'].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[styles.categoryBtn, { borderColor: theme.border }, newItem.category === type && styles.categoryBtnActive]}
                                            onPress={() => switchFormType(type as any)}>
                                            <MaterialCommunityIcons name={type === 'service' ? "wrench" : "package-variant"} size={20} color={newItem.category === type ? '#F4C430' : theme.subText} />
                                            <Text style={[styles.categoryText, { color: theme.subText }, newItem.category === type && styles.categoryTextActive]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Status */}
                            <View style={[styles.formRow, { justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }]}>
                                <FormLabel text={`Status: ${newItem.status === 'active' ? 'Active' : 'Inactive'}`} theme={theme} />
                                <Switch
                                    value={newItem.status === 'active'}
                                    onValueChange={(val) => setNewItem({ ...newItem, status: val ? 'active' : 'inactive' })}
                                    trackColor={{ false: "#767577", true: "#F4C430" }}
                                    thumbColor={"#FFFFFF"}
                                />
                            </View>

                            {/* Images */}
                            <FormLabel text={`Images (${newItem.images?.length || 0}/4)`} theme={theme} />
                            <View style={styles.imageScroll}>
                                <TouchableOpacity style={[styles.addImageBtn, { borderColor: theme.border }]} onPress={handleImagePick}>
                                    <MaterialCommunityIcons name="camera-plus" size={24} color={theme.subText} />
                                </TouchableOpacity>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {newItem.images?.map((uri, index) => (
                                        <View key={index} style={styles.imageWrapper}>
                                            <Image source={{ uri }} style={styles.uploadedImage} />
                                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                                                <MaterialCommunityIcons name="close" size={12} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            <FormInput
                                label="Product Name"
                                required
                                value={newItem.name}
                                onChangeText={(text: string) => setNewItem({ ...newItem, name: text })}
                                placeholder="Name"
                                theme={theme}
                                editable={!isSaving}
                            />

                            {/* Category - Product Only */}
                            {newItem.category === 'product' && (
                                <View style={{ marginBottom: 16 }}>
                                    <FormLabel text="Category" required theme={theme} />
                                    <TouchableOpacity
                                        style={[styles.dropdownSelector, { backgroundColor: theme.background, borderColor: theme.border }, isSaving && { opacity: 0.5 }]}
                                        onPress={() => !isSaving && setIsCategoryOpen(!isCategoryOpen)}
                                        disabled={isSaving}
                                    >
                                        <Text style={{ color: newItem.subCategory ? theme.text : theme.subText }}>{newItem.subCategory || 'Select Category'}</Text>
                                        <MaterialCommunityIcons name={isCategoryOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
                                    </TouchableOpacity>

                                    {isCategoryOpen && (
                                        <View style={[styles.dropdownList, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                            {PRODUCT_CATEGORIES.map((cat) => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                                                    onPress={() => { setNewItem({ ...newItem, subCategory: cat }); setIsCategoryOpen(false); }}>
                                                    <Text style={{ color: theme.text }}>{cat}</Text>
                                                    {newItem.subCategory === cat && <MaterialCommunityIcons name="check" size={16} color="#F4C430" />}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Service Types - Service Only */}
                            {newItem.category === 'service' && (
                                <View style={{ marginBottom: 16 }}>
                                    <FormLabel text="Service Type (Multi Select)" required theme={theme} />
                                    <View style={styles.chipContainer}>
                                        {SERVICE_CATEGORIES.map((type) => {
                                            const isSelected = newItem.serviceTypes?.includes(type);
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    style={[styles.chip, { backgroundColor: isSelected ? '#1C1C1E' : theme.background, borderColor: theme.border }, isSaving && { opacity: 0.5 }]}
                                                    onPress={() => !isSaving && toggleServiceType(type)}
                                                    disabled={isSaving}
                                                >
                                                    <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : theme.text }]}>{type}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )}

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {newItem.category === 'product' && (
                                    <View style={{ flex: 1 }}>
                                        <FormInput label="Purchase Price" value={newItem.purchasePrice} onChangeText={(text: string) => setNewItem({ ...newItem, purchasePrice: text })} placeholder="0.00" keyboardType="numeric" theme={theme} editable={!isSaving} />
                                    </View>
                                )}
                                <View style={{ flex: 1 }}>
                                    <FormInput label="Sell Price (SAR)" required value={newItem.price} onChangeText={(text: string) => setNewItem({ ...newItem, price: text })} placeholder="0.00" keyboardType="numeric" theme={theme} editable={!isSaving} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {newItem.category === 'product' ? (
                                    <>
                                        <View style={{ flex: 1 }}>
                                            <FormInput label="Stock Qty" required value={newItem.stock} onChangeText={(text: string) => setNewItem({ ...newItem, stock: text })} placeholder="0" keyboardType="numeric" theme={theme} editable={!isSaving} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <FormLabel text="UOM" required theme={theme} />
                                            <TouchableOpacity
                                                style={[styles.dropdownSelector, { backgroundColor: theme.background, borderColor: theme.border, height: 50 }, isSaving && { opacity: 0.5 }]}
                                                onPress={() => !isSaving && setIsUomOpen(!isUomOpen)}
                                                disabled={isSaving}
                                            >
                                                <Text style={{ color: newItem.uom ? theme.text : theme.subText }}>{newItem.uom || 'Select'}</Text>
                                                <MaterialCommunityIcons name={isUomOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.subText} />
                                            </TouchableOpacity>
                                            {isUomOpen && (
                                                <View style={[styles.dropdownList, { backgroundColor: theme.background, borderColor: theme.border, position: 'absolute', top: 75, width: '100%', zIndex: 1000 }]}>
                                                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                                                        {UOM_OPTIONS.map((opt) => (
                                                            <TouchableOpacity
                                                                key={opt}
                                                                style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                                                                onPress={() => { setNewItem({ ...newItem, uom: opt }); setIsUomOpen(false); }}>
                                                                <Text style={{ color: theme.text }}>{opt}</Text>
                                                                {newItem.uom === opt && <MaterialCommunityIcons name="check" size={16} color="#F4C430" />}
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    </>
                                ) : (
                                    <View style={{ flex: 1 }}>
                                        <FormInput label="Duration (min)" required value={newItem.duration} onChangeText={(text: string) => setNewItem({ ...newItem, duration: text })} placeholder="30" keyboardType="numeric" theme={theme} editable={!isSaving} />
                                    </View>
                                )}
                            </View>

                            {newItem.category === 'product' && (
                                <>
                                    <FormLabel text="SKU / Product Code" required theme={theme} />
                                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                                        <TextInput
                                            style={[styles.input, { flex: 1, backgroundColor: theme.background, borderColor: theme.border, color: theme.text, marginBottom: 0, opacity: isSaving ? 0.7 : 1 }]}
                                            placeholder="Enter or Generate"
                                            placeholderTextColor={theme.subText}
                                            value={newItem.sku}
                                            onChangeText={(text) => setNewItem({ ...newItem, sku: text })}
                                            editable={!isSaving}
                                        />
                                        <TouchableOpacity
                                            style={[styles.saveButton, { marginTop: 0, justifyContent: 'center', paddingHorizontal: 15, backgroundColor: '#F4C430' }, isSaving && { opacity: 0.5 }]}
                                            onPress={generateSKU}
                                            disabled={isSaving}
                                        >
                                            <Text style={[styles.saveButtonText, { color: '#1C1C1E', fontSize: 13 }]}>Generate</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            <TouchableOpacity
                                style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
                                onPress={handleSaveItem}
                                disabled={isSaving}>
                                <Text style={styles.saveButtonText}>
                                    {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Item')}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Detail Modal */}
            <Modal statusBarTranslucent visible={showDetailModal} transparent={true} animationType="fade" onRequestClose={() => setShowDetailModal(false)}>
                <View style={styles.modalOverlay}>
                    {selectedItem && (
                        <View style={[styles.detailModalContent, { backgroundColor: theme.cardBackground }]}>
                            {/* Detail Header */}
                            <View style={styles.detailHeader}>
                                <View>
                                    <Text style={[styles.detailTitle, { color: theme.text }]}>{selectedItem.name}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: selectedItem.status === 'active' ? '#E8F5E9' : '#FFEBEE' }]}>
                                        <Text style={[styles.statusText, { color: selectedItem.status === 'active' ? '#2ECC71' : '#FF3B30' }]}>
                                            {selectedItem.status?.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => setShowDetailModal(false)} style={styles.closeBtn}>
                                    <MaterialCommunityIcons name="close" size={24} color={theme.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Images */}
                                {selectedItem.images && selectedItem.images.length > 0 ? (
                                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.detailImageScroll}>
                                        {selectedItem.images.map((uri, i) => (
                                            <DetailImage key={i} uri={uri} theme={theme} />
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <View style={[styles.detailImagePlaceholder, { backgroundColor: theme.background }]}>
                                        <MaterialCommunityIcons name="image-off" size={40} color={theme.subText} />
                                        <Text style={{ color: theme.subText, marginTop: 8 }}>No Images Available</Text>
                                    </View>
                                )}

                                {/* Details Info */}
                                <View style={styles.detailSection}>
                                    <DetailRow icon="tag-outline" label="Category" value={selectedItem.category.toUpperCase()} theme={theme} />

                                    {selectedItem.category === 'product' ? (
                                        <>
                                            <DetailRow icon="shape-outline" label="Type" value={selectedItem.subCategory} theme={theme} />
                                            <DetailRow icon="barcode" label="SKU" value={selectedItem.sku} theme={theme} />
                                            <DetailRow icon="cube-outline" label="Stock" value={`${selectedItem.stock} ${selectedItem.uom || ''}`} theme={theme} />
                                            <DetailRow icon="cash-multiple" label="Purchase Price" value={`${selectedItem.purchasePrice || '0'} SAR`} theme={theme} />
                                        </>
                                    ) : (
                                        <>
                                            <DetailRow icon="format-list-bulleted" label="Services" value={selectedItem.serviceTypes?.join(', ')} theme={theme} />
                                            <DetailRow icon="clock-outline" label="Duration" value={`${selectedItem.duration} min`} theme={theme} />
                                        </>
                                    )}

                                    <DetailRow icon="cash" label="Price" value={`${selectedItem.price} SAR`} theme={theme} />
                                </View>
                            </ScrollView>

                            <View style={[styles.detailActions, { borderTopColor: theme.border }]}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: theme.background }]}
                                    onPress={() => {
                                        setShowDetailModal(false);
                                        handleEditStart(selectedItem);
                                    }}>
                                    <MaterialCommunityIcons name="pencil" size={20} color="#007AFF" />
                                    <Text style={styles.actionBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.deleteBtn, { backgroundColor: theme.background }]}
                                    onPress={() => handleDelete(selectedItem._id, true)}>
                                    <MaterialCommunityIcons name="delete" size={20} color="#FF3B30" />
                                    <Text style={[styles.actionBtnText, styles.deleteBtnText]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Custom Alert Modal */}
            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={closeAlert}
                theme={theme}
            />
            {/* Global Loading Overlay */}
            {isSaving && (
                <Modal transparent visible={true} animationType="fade" statusBarTranslucent>
                    <FilterLoader label="Processing..." />
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E' },
    addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4C430', alignItems: 'center', justifyContent: 'center' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 4, margin: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    tab: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    activeTab: { backgroundColor: '#F4C430' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
    activeTabText: { color: '#1C1C1E' },
    content: { flex: 1, paddingHorizontal: 20 },
    itemCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    itemInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    itemDetails: { marginLeft: 12, flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 4 },
    itemDuration: { fontSize: 13, color: '#8E8E93' },
    itemPrice: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
    itemActions: { flexDirection: 'row', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: '#F0F0F0', gap: 6 },
    actionBtnText: { fontSize: 14, fontWeight: '600', color: '#007AFF' },
    deleteBtn: { backgroundColor: '#FFE5E5' },
    deleteBtnText: { color: '#FF3B30' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
    categoryContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    categoryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 2, borderColor: '#E0E0E0', gap: 8 },
    categoryBtnActive: { borderColor: '#F4C430', backgroundColor: '#FFF9E6' },
    categoryText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
    categoryTextActive: { color: '#1C1C1E' },
    input: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E0E0E0' },
    saveButton: { backgroundColor: '#F4C430', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
    saveButtonText: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    formRow: { flexDirection: 'row' },
    imageScroll: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
    addImageBtn: { width: 80, height: 80, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    imageWrapper: { position: 'relative', marginRight: 12 },
    uploadedImage: { width: 80, height: 80, borderRadius: 12 },
    removeImageBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 4 },
    dropdownList: { borderRadius: 12, borderWidth: 1, marginBottom: 16, maxHeight: 200 },
    dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, marginBottom: 8 },
    chipText: { fontSize: 13, fontWeight: '500' },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    // Detail Modal Styles
    detailModalContent: { backgroundColor: '#FFFFFF', padding: 24, margin: 20, borderRadius: 24, maxHeight: '80%', width: width - 40, alignSelf: 'center', bottom: '10%' },
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, flex: 1, marginRight: 16 },
    closeBtn: { padding: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    detailImageScroll: { marginBottom: 20, height: 200, maxWidth: width - 88 },
    detailImageContainer: { width: width - 88, height: 200, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    detailImage: { width: width - 88, height: 200 },
    detailImagePlaceholder: { height: 150, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    detailSection: { marginBottom: 20 },
    // Loader Styles
    loaderOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    loaderGlass: { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    loaderTransparent: { backgroundColor: 'rgba(0,0,0,0.05)' },
    loaderContent: {
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10
    },
    logoBadge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F4C430',
        letterSpacing: 1.5,
    },
    loaderLabel: {
        marginTop: 12, fontWeight: '600', fontSize: 14, color: '#F4C430',
    },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    detailLabel: { fontSize: 14, fontWeight: '600' },
    detailValue: { fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' },
    detailActions: { flexDirection: 'row', gap: 12, paddingTop: 20, borderTopWidth: 1 },
    // Custom Alert Styles
    customAlertContainer: { width: '85%', borderRadius: 16, padding: 20, alignItems: 'center' },
    customAlertTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    customAlertMessage: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
    customAlertButtonsContainer: { width: '100%' },
    customAlertButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    customAlertButtonText: { fontSize: 16 },
});