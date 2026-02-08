# Personal Finance Control

A modern web application for personal finance management built with React and TypeScript, featuring authentication and cloud sync via Supabase.

## 🚀 Features

### Authentication
- 🔐 Email/password authentication
- 🐙 GitHub OAuth login
- ☁️ Cloud sync with automatic backup
- 📱 Access your data from any device
- 🔄 Local-first with smart sync (works offline)

### Dashboard
- 📊 Financial summary with informative cards
- 💰 Current balance, monthly income and expenses
- 📈 Interactive charts for expense analysis
- 🎯 Comprehensive financial overview
- 📊 Pie chart showing expenses by category
- 📈 Bar chart comparing income vs expenses over 6 months
- 📉 Balance evolution chart over 12 months

### Transaction Management
- ➕ Add new income and expenses
- ✏️ Edit existing transactions
- 🗑️ Delete transactions
- 🔍 Search by description
- 🎯 Filter by category, type and date range
- 📅 Sort by date
- ☁️ Automatic cloud sync

### Recurring Transactions
- 🔄 Set up automatic recurring transactions
- 💳 Perfect for subscriptions (Netflix, Spotify, etc.)
- 📅 Monthly, weekly, or yearly frequencies
- ⏸️ Pause/resume recurring transactions
- 🎯 Automatic generation on scheduled dates

### Customizable Categories
- 🏷️ Pre-defined categories (Food, Transport, Entertainment, etc.)
- ➕ Create custom categories
- 🎨 Choose custom colors and icons
- ✏️ Edit and delete categories

### Interface and Experience
- 🌙 Dark/light theme
- 📱 Responsive design
- 🎨 Modern interface with Tailwind CSS
- 🔄 Intuitive sidebar navigation
- 💾 Local storage persistence with cloud backup

## 🛠️ Technologies Used

- **React 19** - Main library
- **TypeScript** - Static typing
- **React Router** - Page navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **Recharts** - Interactive charts
- **Supabase** - Authentication and cloud database
- **Context API** - Global state management
- **localStorage** - Local data persistence

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Dashboard/       # Dashboard components
│   ├── Forms/           # Forms
│   ├── Layout/          # Layout components
│   ├── Transactions/    # Transaction components
│   ├── Categories/      # Category components
│   └── ProtectedRoute.tsx # Auth wrapper
├── contexts/            # React contexts
│   ├── AuthContext      # Authentication state
│   ├── FinanceContext   # Global finance state
│   └── ThemeContext     # Theme management
├── pages/               # Application pages
│   ├── Login            # Login page
│   ├── Signup           # Registration page
│   ├── Dashboard        # Home page
│   ├── AddTransaction   # Add transaction
│   ├── Transactions     # Transaction listing
│   ├── RecurringTransactions # Recurring transactions
│   └── Categories       # Manage categories
├── types/               # TypeScript definitions
├── utils/               # Utilities and helpers
│   ├── supabaseClient.ts # Supabase client
│   ├── syncManager.ts    # Cloud sync logic
│   └── formatters.ts     # Formatters
└── App.tsx              # Main component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free tier works!)

### Supabase Setup

1. **Create a Supabase project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Wait for your project to be ready

2. **Get your credentials**
   - Go to Project Settings → API
   - Copy your project URL and anon key

3. **Set up the database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the SQL from `supabase-schema.sql`
   - This will create tables with Row Level Security (RLS)

4. **Configure authentication**
   - Go to Authentication → Providers
   - Enable Email provider (enabled by default)
   - For GitHub OAuth:
     - Enable GitHub provider
     - Create a GitHub OAuth app at https://github.com/settings/developers
     - Callback URL: `https://[your-project-ref].supabase.co/auth/v1/callback`
     - Add your Client ID and Secret in Supabase

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-control
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your Supabase credentials:
```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

5. Start the development server:
```bash
npm start
```

6. Open `http://localhost:3000` in your browser

### Production Build
```bash
npm run build
```

## 💡 How to Use

### 1. Create an Account
- Click "Sign up" on the login page
- Use email/password or continue with GitHub
- Verify your email if required

### 2. Dashboard
- View your financial summary on the home page
- Track balance, income and monthly expenses
- Analyze expense distribution by category with interactive charts
- Monitor balance evolution over time

### 3. Adding Transactions
- Click "New Transaction" in the sidebar
- Fill in description, amount, category and date
- Select whether it's income or expense
- Click "Add"
- Data automatically syncs to the cloud

### 4. Managing Transactions
- Access "Transactions" in the menu
- Use filters to find specific transactions
- Edit or delete transactions as needed

### 5. Recurring Transactions
- Access "Recurring" in the menu
- Set up automatic subscriptions and monthly expenses
- Configure frequency (monthly, weekly, yearly)
- Pause/resume or edit recurring transactions

### 6. Categories
- Access "Categories" in the menu
- View existing categories
- Create new categories with custom colors and icons
- Edit or remove categories as needed

### 7. Sync Status
- Check the header for sync status
- Green checkmark = synced
- Blue spinner = syncing
- Red icon = sync error
- Click the refresh button to manually sync

### 8. Theme
- Use the sun/moon button in the header to toggle between light and dark themes

### 9. Sign Out
- Click your email in the sidebar
- Click "Sign Out"

## 🎨 Design Features

- **Responsive**: Works perfectly on desktop, tablet and mobile
- **Dark Theme**: Adaptable interface for different preferences
- **Custom Colors**: Consistent color system
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Semantic structure and adequate contrast
- **Cloud Sync**: Automatic backup with local-first approach

## 📊 Data Structure

### Transaction
```typescript
interface Transaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}
```

### Recurring Transaction
```typescript
interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  type: 'income' | 'expense';
  frequency: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}
```

## 🔧 Customization

The project was developed with a focus on ease of customization:

- **Colors**: Modify the `tailwind.config.js` file to change the color palette
- **Categories**: Add new default categories in `FinanceContext.tsx`
- **Themes**: Customize themes in `ThemeContext.tsx`
- **Components**: All components are modular and reusable

## 📈 Future Improvements

- [ ] Banking API integration
- [ ] Advanced reports
- [ ] Data export (PDF, Excel)
- [ ] Goals and budgets
- [ ] Notifications and reminders
- [ ] Cloud synchronization
- [ ] Mobile app with React Native

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.
