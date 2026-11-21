import initialProducts from './initialProducts.json';

export const CATEGORIES = [
  'Food',
  'Snacks',
  'Beverages',
  'Canned Goods',
  'Condiments & Cooking',
  'Personal Care',
  'Household',
  'Liquor',
];

export async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      unit_size TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync('SELECT COUNT(*) as count FROM products');
  if (row && row.count === 0) {
    await db.withTransactionAsync(async () => {
      const statement = await db.prepareAsync(
        'INSERT INTO products (name, brand, unit_size, price, category) VALUES ($name, $brand, $unit_size, $price, $category)'
      );
      try {
        for (const item of initialProducts) {
          await statement.executeAsync({
            $name: item.name,
            $brand: item.brand,
            $unit_size: item.unit_size,
            $price: item.price,
            $category: item.category,
          });
        }
      } finally {
        await statement.finalizeAsync();
      }
    });
  }
}