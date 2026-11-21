import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

function ProductCard({ item, onEdit }) {
  return (
    <View style={styles.card}>
      {/* Top Row: Category Badge + Edit Button */}
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {item.category}
          </Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Feather name="edit-2" size={12} color="#555" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Product Name & Brand/Size */}
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {item.brand || 'Generic'}  •  {item.unit_size || '1 pc'}
      </Text>

      {/* Divider & Price */}
      <View style={styles.divider} />
      <Text style={styles.priceLabel}>Price</Text>
      <Text style={styles.price}>₱{Number(item.price).toFixed(2)}</Text>
    </View>
  );
}

export default React.memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  badge: {
    backgroundColor: '#F1F2F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexShrink: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57606F',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F2F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  editText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#57606F',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E272E',
    marginBottom: 4,
    minHeight: 38,
  },
  meta: {
    fontSize: 12,
    color: '#747D8C',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: '#747D8C',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
});
