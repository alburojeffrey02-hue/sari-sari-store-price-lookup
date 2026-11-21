# Juditha’s Sari-Sari Store — Price Lookup & Catalog App

An offline-first mobile product catalog and price checker built with **React Native**, **Expo**, and **SQLite** (`expo-sqlite`). Designed for fast, reliable price lookups and inventory management in a sari-sari store without needing an internet connection.

## Features

- **100% Offline Storage:** Uses an on-device SQLite database that works with zero internet connectivity.
- **Pre-Seeded Store Catalog:** Automatically initializes with 204 sari-sari store products across 8 categories (*Food, Snacks, Beverages, Canned Goods, Condiments & Cooking, Personal Care, Household,* and *Liquor*).
- **Instant Search:** Real-time filtering by product name, brand, or category.
- **Full CRUD Management:**
  - **Add Product:** Quickly add new store items with product name, brand, unit/size (including multi-piece bundle pricing like `3 pieces` for `₱5.00`), price in Philippine Pesos (`₱`), and category.
  - **Edit Product:** Update prices or item details from any product card.
  - **Delete Product:** Remove discontinued items with confirmation protection.

## Tech Stack

- **Framework:** React Native / Expo
- **Database:** `expo-sqlite` (Local SQLite with WAL mode)
- **Language:** JavaScript

## Project Structure

```text
├── App.js                         Main catalog screen, search bar, and SQLiteProvider setup
├── components/
│   ├── ProductCard.js             2-column grid product card component
│   └── ProductFormModal.js        Reusable Add / Edit / Delete product modal
└── data/
    ├── database.js                SQLite schema initialization & transaction seeding
    └── initialProducts.json       204 pre-populated store items
