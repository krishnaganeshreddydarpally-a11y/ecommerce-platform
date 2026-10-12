import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { UserModel, CategoryModel, ProductModel, OrderModel } from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

// Ensure local data directory exists for fallback or local mode
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('ℹ️ No MONGODB_URI found. Running in local JSON-backed storage mode.');
    return false;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return true;
  } catch (err) {
    console.warn(`⚠️ MongoDB Atlas connection notice: ${err.message}`);
    console.log('ℹ️ Running with persistent local fallback to ensure 100% server uptime.');
    isMongoConnected = false;
    return false;
  }
};

export const isUsingAtlas = () => isMongoConnected;

class Collection {
  constructor(name, model) {
    this.name = name;
    this.model = model;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.init();
  }

  init() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  read() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return content ? JSON.parse(content) : [];
    } catch (err) {
      console.error(`Error reading ${this.name}:`, err);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`Error writing ${this.name}:`, err);
      return false;
    }
  }

  find(filterFn) {
    const items = this.read();
    if (!filterFn) return items;
    return items.filter(filterFn);
  }

  findOne(filterFn) {
    const items = this.read();
    return items.find(filterFn) || null;
  }

  findById(id) {
    const items = this.read();
    return items.find((item) => String(item.id) === String(id)) || null;
  }

  create(itemData) {
    const items = this.read();
    const newItem = {
      id: itemData.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...itemData,
      createdAt: itemData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.write(items);

    if (isMongoConnected && this.model) {
      this.model.create(newItem).catch((err) => console.error(`Mongo Atlas sync create error (${this.name}):`, err.message));
    }

    return newItem;
  }

  updateById(id, updateData) {
    const items = this.read();
    const index = items.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updateData,
      id: items[index].id, // protect id
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    this.write(items);

    if (isMongoConnected && this.model) {
      this.model.findOneAndUpdate({ id }, { $set: updateData }).catch((err) =>
        console.error(`Mongo Atlas sync update error (${this.name}):`, err.message)
      );
    }

    return updatedItem;
  }

  deleteById(id) {
    const items = this.read();
    const index = items.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return false;
    items.splice(index, 1);
    this.write(items);

    if (isMongoConnected && this.model) {
      this.model.deleteOne({ id }).catch((err) => console.error(`Mongo Atlas sync delete error (${this.name}):`, err.message));
    }

    return true;
  }

  count(filterFn) {
    return this.find(filterFn).length;
  }
}

export const Users = new Collection('users', UserModel);
export const Products = new Collection('products', ProductModel);
export const Categories = new Collection('categories', CategoryModel);
export const Orders = new Collection('orders', OrderModel);
