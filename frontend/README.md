# Frontend DP3A Pelaporan

## Struktur Folder

Struktur folder frontend telah diperbarui untuk mengikuti standar industri dan best practices:

```
frontend/
├── public/                 # Static files
│   └── vite.svg
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/        # Common components
│   │   ├── auth/          # Authentication components
│   │   ├── laporan/       # Laporan components
│   │   ├── admin/         # Admin components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── ui/            # UI components (Button, Input, Select)
│   │   ├── Footer.jsx
│   │   ├── FloatingButton.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Sidebar.jsx
│   ├── config/             # Configuration files
│   │   ├── api.js         # API endpoints and configuration
│   │   └── index.js       # Export configuration
│   ├── constants/          # Constants and enums
│   │   ├── status.js      # Status constants
│   │   ├── routes.js      # Route constants
│   │   └── index.js       # Export constants
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.js      # API hooks with loading states
│   │   └── useComplaintForm.js
│   ├── layouts/            # Layout components
│   │   └── AdminLayout.jsx
│   ├── pages/              # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── CheckStatus.jsx
│   │   ├── FormLapor.jsx
│   │   ├── Formulir.jsx
│   │   ├── landingpage.jsx
│   │   └── Login.jsx
│   ├── services/           # API services
│   │   ├── auth/          # Authentication service
│   │   ├── laporan/       # Laporan service
│   │   ├── admin/         # Admin service
│   │   ├── dashboard/     # Dashboard service
│   │   ├── apiService.js  # Base API service
│   │   └── index.js       # Export services
│   ├── test/               # Test setup
│   │   └── setup.js       # Test configuration
│   ├── utils/              # Utility functions
│   │   ├── formatters.js  # Data formatting utilities
│   │   ├── validators.js  # Form validation utilities
│   │   ├── geometry.js    # Geometry utilities
│   │   ├── pdfGenerator.js # PDF generation utilities
│   │   └── index.js       # Export utilities
│   ├── assets/             # Static assets
│   │   └── react.svg
│   ├── img/                # Images
│   │   ├── dp3a.png
│   │   └── ...
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/                  # Documentation
├── .env.example           # Environment variables template
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
└── vitest.config.js        # Vitest configuration
```

## Fitur Baru yang Ditambahkan

### 1. **Centralized API Services**
- **apiService.js**: Base API service dengan error handling, authentication, dan file upload
- **authService.js**: Service khusus untuk authentication
- **laporanService.js**: Service untuk laporan operations
- **adminService.js**: Service untuk admin operations
- **dashboardService.js**: Service untuk dashboard operations

### 2. **Configuration Management**
- **config/api.js**: Centralized API endpoints dan configuration
- Environment variables support dengan .env.example

### 3. **State Management dengan Context**
- **AuthContext.jsx**: Authentication context dengan reducer pattern
- Global state untuk user authentication dan authorization

### 4. **Custom Hooks**
- **useApi.js**: Hook untuk API calls dengan loading dan error states
- **usePagination()**: Hook untuk pagination dengan API integration
- **useForm()**: Hook untuk form handling dengan validation

### 5. **Reusable UI Components**
- **Button.jsx**: Custom button component dengan berbagai variants
- **Input.jsx**: Custom input component dengan error handling
- **Select.jsx**: Custom select component dengan error handling

### 6. **Constants Management**
- **constants/status.js**: Status constants dan color mapping
- **constants/routes.js**: Route constants dan navigation items
- Centralized constants untuk maintainability

### 7. **Utility Functions**
- **utils/formatters.js**: Date, number, string, dan file formatting utilities
- **utils/validators.js**: Form validation utilities
- Reusable utility functions untuk common operations

### 8. **Testing Setup**
- **vitest.config.js**: Vitest configuration dengan jsdom
- **test/setup.js**: Test setup dengan mocks
- Testing scripts di package.json

## Environment Variables

Tambahkan environment variables berikut ke `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Other configuration
VITE_APP_NAME=DP3A Pelaporan
VITE_APP_VERSION=1.0.0
```

## Penggunaan API Services

### Contoh penggunaan authService:

```jsx
import { authService } from './services';

// Login
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// Check authentication
const isAuthenticated = authService.isAuthenticated();
```

### Contoh penggunaan laporanService:

```jsx
import { laporanService } from './services';

// Submit laporan
const submitLaporan = async (data, files) => {
  try {
    const response = await laporanService.submitLaporan(data, files);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Penggunaan Custom Hooks

### Contoh penggunaan useApi:

```jsx
import { useApi } from './hooks/useApi';
import { laporanService } from './services';

const LaporanList = () => {
  const { data, loading, error, execute } = useApi(
    () => laporanService.getAllLaporan(),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(laporan => (
        <div key={laporan.id}>{laporan.kode_laporan}</div>
      ))}
    </div>
  );
};
```

### Contoh penggunaan useForm:

```jsx
import { useForm } from './hooks/useApi';
import { validateRequired, validateEmail } from './utils/validators';

const LoginForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    {
      email: [validateRequired, validateEmail],
      password: [validateRequired],
    }
  );

  const onSubmit = async (formData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={(e) => e.preventDefault(); handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

## Testing

Menjalankan tests:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests dengan UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Best Practices yang Diimplementasikan

1. **Separation of Concerns**: Services, components, dan utilities terpisah
2. **Modular Architecture**: Fitur dikelompokkan berdasarkan domain
3. **Error Handling**: Centralized error handling di API services
4. **State Management**: Context API untuk global state
5. **Custom Hooks**: Reusable logic dengan custom hooks
6. **Component Reusability**: UI components yang reusable
7. **Configuration Management**: Environment-based configuration
8. **Testing**: Comprehensive testing setup dengan Vitest
9. **Code Organization**: File dan folder structure yang terorganisir
10. **Type Safety**: Validation dan error handling yang robust

## Migration dari Struktur Lama

Jika migrasi dari struktur lama:

1. Update import paths di semua file
2. Ganti fetch calls dengan API services
3. Tambahkan environment variables yang diperlukan
4. Install dependencies baru (clsx, yup, vitest, dll)
5. Update components untuk menggunakan UI components
6. Implementasi Context untuk state management

## Contributing

Ikuti struktur folder ini saat menambahkan fitur baru:

1. Buat service di `src/services/[feature]/`
2. Buat components di `src/components/[feature]/`
3. Tambahkan constants di `src/constants/`
4. Buat custom hooks di `src/hooks/`
5. Tambahkan utilities di `src/utils/`
6. Buat tests untuk components dan services
7. Update dokumentasi yang relevan
