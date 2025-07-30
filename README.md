# Personal Finance Control

A modern web application for personal finance management built with React and TypeScript.

## 🚀 Features

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
- 💾 Local storage persistence

## 🛠️ Technologies Used

- **React 18+** - Main library
- **TypeScript** - Static typing
- **React Router** - Page navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **Recharts** - Interactive charts
- **Context API** - Global state management
- **localStorage** - Data persistence

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Dashboard/       # Dashboard components
│   ├── Forms/           # Forms
│   ├── Layout/          # Layout components
│   ├── Transactions/    # Transaction components
│   └── Categories/      # Category components
├── contexts/            # React contexts
│   ├── FinanceContext   # Global finance state
│   └── ThemeContext     # Theme management
├── pages/               # Application pages
│   ├── Dashboard        # Home page
│   ├── AddTransaction   # Add transaction
│   ├── Transactions     # Transaction listing
│   ├── RecurringTransactions # Recurring transactions
│   └── Categories       # Manage categories
├── types/               # TypeScript definitions
├── utils/               # Utilities and helpers
└── App.tsx              # Main component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

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

3. Start the development server:
```bash
npm start
```

4. Open `http://localhost:3000` in your browser

### Production Build
```bash
npm run build
```

## 💡 How to Use

### 1. Dashboard
- View your financial summary on the home page
- Track balance, income and monthly expenses
- Analyze expense distribution by category with interactive charts
- Monitor balance evolution over time

### 2. Adding Transactions
- Click "New Transaction" in the sidebar
- Fill in description, amount, category and date
- Select whether it's income or expense
- Click "Add"

### 3. Managing Transactions
- Access "Transactions" in the menu
- Use filters to find specific transactions
- Edit or delete transactions as needed

### 4. Recurring Transactions
- Access "Recurring" in the menu
- Set up automatic subscriptions and monthly expenses
- Configure frequency (monthly, weekly, yearly)
- Pause/resume or edit recurring transactions

### 5. Categories
- Access "Categories" in the menu
- View existing categories
- Create new categories with custom colors and icons
- Edit or remove categories as needed

### 6. Theme
- Use the sun/moon button in the header to toggle between light and dark themes

## 🎨 Design Features

- **Responsive**: Works perfectly on desktop, tablet and mobile
- **Dark Theme**: Adaptable interface for different preferences
- **Custom Colors**: Consistent color system
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Semantic structure and adequate contrast

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
