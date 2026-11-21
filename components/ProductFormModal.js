import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORIES } from '../data/database';

export default function ProductFormModal({
  visible,
  product, // null when adding, object when editing
  onClose,
  onSave,
  onDelete,
}) {
  const isEditing = Boolean(product);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [unitSize, setUnitSize] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Food');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand || '');
      setUnitSize(product.unit_size || '');
      setPrice(String(product.price));
      setCategory(product.category || 'Food');
    } else {
      setName('');
      setBrand('');
      setUnitSize('');
      setPrice('');
      setCategory('Food');
    }
    setShowCategoryPicker(false);
  }, [product, visible]);

  const handleSavePress = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a product name.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price in Pesos.');
      return;
    }

    onSave({
      id: product?.id,
      name: name.trim(),
      brand: brand.trim() || 'Generic',
      unit_size: unitSize.trim() || '1 piece',
      price: parsedPrice,
      category,
    });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(product.id),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Product' : 'Add a New Product'}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.formBody}>
            {/* PRODUCT NAME */}
            <Text style={styles.label}>PRODUCT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Lucky Me! Pancit Canton"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            {/* BRAND & UNIT/SIZE ROW */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>BRAND</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Lucky Me!"
                  placeholderTextColor="#999"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>UNIT / SIZE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1 Pack, 3 pieces"
                  placeholderTextColor="#999"
                  value={unitSize}
                  onChangeText={setUnitSize}
                />
              </View>
            </View>

            {/* PRICE & CATEGORY ROW */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>PRICE</Text>
                <View style={styles.priceInputWrap}>
                  <Text style={styles.pesoSign}>₱</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
              </View>

              <View style={styles.halfCol}>
                <Text style={styles.label}>CATEGORY</Text>
                <TouchableOpacity
                  style={styles.dropdownBtn}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>
                    {category}
                  </Text>
                  <Feather name="chevron-down" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Options List */}
            {showCategoryPicker && (
              <View style={styles.categoryList}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      category === cat && styles.categoryOptionSelected,
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer Action Bar */}
          <View style={styles.footer}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeletePress}
              >
                <Feather name="trash-2" size={16} color="#FFF" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePress}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '88%',
  },
  header: {
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  formBody: {
    padding: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  pesoSign: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 18,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  categoryList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  categoryOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#0084FF',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E6EA',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11D1D',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
  },
  cancelText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 10,
  },
  saveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});