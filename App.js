import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Feather } from '@expo/vector-icons';
import { initializeDatabase } from './data/database';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';

function StoreCatalogScreen() {
  const db = useSQLiteContext();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      const rows = await db.getAllAsync(
        'SELECT * FROM products ORDER BY name ASC'
      );
      setProducts(rows);
    } else {
      const pattern = `%${trimmed}%`;
      const rows = await db.getAllAsync(
        `SELECT * FROM products 
         WHERE name LIKE ? OR brand LIKE ? OR category LIKE ? 
         ORDER BY name ASC`,
        [pattern, pattern, pattern]
      );
      setProducts(rows);
    }
  }, [db, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item) => {
    setEditingProduct(item);
    setModalVisible(true);
  };

  const handleSaveProduct = async (data) => {
    if (data.id) {
      await db.runAsync(
        'UPDATE products SET name = ?, brand = ?, unit_size = ?, price = ?, category = ? WHERE id = ?',
        [data.name, data.brand, data.unit_size, data.price, data.category, data.id]
      );
    } else {
      await db.runAsync(
        'INSERT INTO products (name, brand, unit_size, price, category) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.brand, data.unit_size, data.price, data.category]
      );
    }
    setModalVisible(false);
    loadProducts();
  };

  const handleDeleteProduct = async (id) => {
    await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    setModalVisible(false);
    loadProducts();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top White Header Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Text style={styles.storeTitle}>Juditha’s Sari-Sari{'\n'}Store</Text>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarLetter}>J</Text>
          </View>
        </View>

        {/* Add Item Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd}>
          <Text style={styles.addBtnText}>Add item</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#747D8C" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search product, brand, or category"
            placeholderTextColor="#747D8C"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color="#A4B0BE" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Catalog Body */}
      <View style={styles.bodySection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Text style={styles.itemCount}>
            Showing {products.length} {products.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <ProductCard item={item} onEdit={handleOpenEdit} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No products found matching "{searchQuery}".
            </Text>
          }
        />
      </View>

      {/* Add / Edit Modal */}
      <ProductFormModal
        visible={modalVisible}
        product={editingProduct}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SQLiteProvider databaseName="judithas_store.db" onInit={initializeDatabase}>
      <StoreCatalogScreen />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  storeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    lineHeight: 34,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F1F4F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0084FF',
  },
  addBtn: {
    backgroundColor: '#0084FF',
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 14,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },
  bodySection: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  itemCount: {
    fontSize: 13,
    color: '#747D8C',
    fontWeight: '500',
  },
  gridContent: {
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#747D8C',
  },
});