import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock FormData
global.FormData = vi.fn(() => ({
  append: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(),
  has: vi.fn(),
  delete: vi.fn(),
  entries: vi.fn(),
  keys: vi.fn(),
  values: vi.fn(),
}));

// Mock XMLHttpRequest
global.XMLHttpRequest = vi.fn(() => ({
  upload: { addEventListener: vi.fn() },
  addEventListener: vi.fn(),
  open: vi.fn(),
  setRequestHeader: vi.fn(),
  send: vi.fn(),
}));

// Mock Blob
global.Blob = vi.fn((content, options) => ({
  content,
  options,
  size: content ? content.length : 0,
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});