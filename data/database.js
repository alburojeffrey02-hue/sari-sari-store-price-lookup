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
      for (const item of initialProducts) {
        await db.runAsync(
          'INSERT INTO products (name, brand, unit_size, price, category) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.brand, item.unit_size, item.price, item.category]
        );
      }
    });
  }
}
