const fs = require('fs');

const STORAGE_KEY_CLIENTS = 'invoice_gen_clients';

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = value; },
  removeItem: (key) => { delete mockStorage[key]; }
};

const loadClients = () => {
  try {
    const serializedData = global.localStorage.getItem(STORAGE_KEY_CLIENTS);
    if (serializedData) {
      const parsed = JSON.parse(serializedData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    // console.error('Failed to load clients from local storage', error);
  }
  return [];
};

const saveClients = (clients) => {
  try {
    global.localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    return { success: true, status: 'success' };
  } catch (error) {
    // console.error('Failed to save clients to local storage', error);
    return { success: false, status: 'error_clients' };
  }
};

const clearAllStorage = () => {
  global.localStorage.removeItem('invoice_gen_data');
  global.localStorage.removeItem('invoice_gen_profile');
  global.localStorage.removeItem(STORAGE_KEY_CLIENTS);
};

function testStorage() {
  console.log('Testing missing storage...');
  const empty = loadClients();
  if (!Array.isArray(empty) || empty.length !== 0) throw new Error('Missing storage should return empty array');

  console.log('Testing malformed storage...');
  global.localStorage.setItem(STORAGE_KEY_CLIENTS, '{ bad json');
  const malformed = loadClients();
  if (!Array.isArray(malformed) || malformed.length !== 0) throw new Error('Malformed storage should return empty array');

  console.log('Testing valid save/load...');
  const testClients = [{ id: '1', name: 'Test', lastUsed: 123 }];
  saveClients(testClients);
  const loaded = loadClients();
  if (loaded[0].name !== 'Test') throw new Error('Save/load mismatch');

  console.log('Testing clearAllStorage...');
  clearAllStorage();
  if (global.localStorage.getItem(STORAGE_KEY_CLIENTS) !== null) throw new Error('clearAllStorage did not wipe clients');

  console.log('Testing QuotaExceeded...');
  const realSetItem = global.localStorage.setItem;
  global.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  const res = saveClients(testClients);
  if (res.success !== false || res.status !== 'error_clients') throw new Error('Quota fail not handled correctly');
  global.localStorage.setItem = realSetItem;
  
  console.log('Storage tests passed.');
}

function testNormalization() {
  console.log('Testing Normalization logic...');
  const normalizeString = (str) => (str || '').trim();
  const normalizeCompare = (str) => normalizeString(str).toLowerCase();

  const clients = [
    { id: '1', name: 'John Doe ', email: ' JOHN@example.com ', phone: ' 123 ' },
    { id: '2', name: 'Jane Doe', email: '', phone: '456' },
    { id: '3', name: 'Jane Doe', email: '', phone: '999' }
  ];

  const findDuplicate = (details, excludeId) => {
    const email = normalizeCompare(details.email);
    const name = normalizeCompare(details.name);
    const phone = normalizeCompare(details.phone);

    return clients.find(c => {
      if (excludeId && c.id === excludeId) return false;
      const cEmail = normalizeCompare(c.email);
      if (email && cEmail && email === cEmail) return true;
      if (!email && !cEmail) {
        const cName = normalizeCompare(c.name);
        const cPhone = normalizeCompare(c.phone);
        if (name === cName && phone === cPhone) return true;
      }
      return false;
    });
  };

  if (!findDuplicate({ email: 'john@example.com' })) throw new Error('Failed to find case-insensitive email');
  if (!findDuplicate({ email: 'john@example.com  ' })) throw new Error('Failed to find whitespace email');
  if (!findDuplicate({ name: 'Jane Doe', phone: '456', email: '' })) throw new Error('Failed to find fallback name+phone');
  if (findDuplicate({ name: 'Jane Doe', phone: '000', email: '' })) throw new Error('Matched wrong fallback');
  if (findDuplicate({ email: 'john@example.com' }, '1')) throw new Error('Failed to exclude ID');

  console.log('Normalization tests passed.');
}

try {
  testStorage();
  testNormalization();
  console.log('ALL TESTS PASSED ✅');
} catch (e) {
  console.error(e);
  process.exit(1);
}
