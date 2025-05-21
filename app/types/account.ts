export type AccountType = 'checking' | 'savings' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumber: string;
  lastFourDigits: string;
  availableCredit?: number; // Only for credit cards
  interestRate?: number; // For savings accounts
  minimumPayment?: number; // For credit cards
  dueDate?: string; // For credit cards
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category?: string;
}

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Everyday Checking',
    type: 'checking',
    balance: 5234.56,
    accountNumber: '1234567890',
    lastFourDigits: '7890',
  },
  {
    id: '2',
    name: 'Secondary Checking',
    type: 'checking',
    balance: 1234.56,
    accountNumber: '0987654321',
    lastFourDigits: '4321',
  },
  {
    id: '3',
    name: 'High-Yield Savings',
    type: 'savings',
    balance: 15000.00,
    accountNumber: '1122334455',
    lastFourDigits: '4455',
    interestRate: 4.5,
  },
  {
    id: '4',
    name: 'Platinum Credit Card',
    type: 'credit',
    balance: -2345.67,
    accountNumber: '5544332211',
    lastFourDigits: '2211',
    availableCredit: 7654.33,
    minimumPayment: 50.00,
    dueDate: '2024-04-15',
  },
];

const BUSINESSES = {
  'Groceries': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Target', 'Walmart'],
  'Dining': ['Starbucks', 'Chipotle', 'Panera Bread', 'Shake Shack', 'Sweetgreen'],
  'Shopping': ['Amazon', 'Best Buy', 'Nike', 'Apple Store', 'Zara'],
  'Entertainment': ['Netflix', 'Spotify', 'AMC Theaters', 'Disney+', 'HBO Max'],
  'Transportation': ['Uber', 'Lyft', 'Shell', 'Exxon', 'BP'],
  'Utilities': ['AT&T', 'Verizon', 'Comcast', 'PG&E', 'Water Company'],
  'Health': ['CVS Pharmacy', 'Walgreens', 'Kaiser Permanente', '24 Hour Fitness', 'SoulCycle'],
  'Travel': ['Airbnb', 'Expedia', 'Delta Airlines', 'Marriott', 'Hilton'],
  'Education': ['Udemy', 'Coursera', 'Barnes & Noble', 'Chegg', 'Pearson'],
  'Other': ['PayPal', 'Venmo', 'Square', 'Stripe', 'Western Union']
};

const generateMockTransactions = () => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate 100 transactions
  for (let i = 0; i < 100; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const type = Math.random() < 0.7 ? 'withdrawal' : (Math.random() < 0.5 ? 'deposit' : 'transfer');
    let description = '';
    let category: string | undefined;
    let amount = 0;
    
    if (type === 'withdrawal') {
      // For withdrawals, generate realistic purchase descriptions
      const categories = Object.keys(BUSINESSES);
      category = categories[Math.floor(Math.random() * categories.length)];
      const businesses = BUSINESSES[category as keyof typeof BUSINESSES];
      const business = businesses[Math.floor(Math.random() * businesses.length)];
      
      // Generate realistic amounts based on category
      switch (category) {
        case 'Groceries':
          amount = -(Math.random() * 150 + 20);
          break;
        case 'Dining':
          amount = -(Math.random() * 50 + 10);
          break;
        case 'Shopping':
          amount = -(Math.random() * 200 + 30);
          break;
        case 'Entertainment':
          amount = -(Math.random() * 30 + 5);
          break;
        case 'Transportation':
          amount = -(Math.random() * 40 + 15);
          break;
        case 'Utilities':
          amount = -(Math.random() * 100 + 50);
          break;
        case 'Health':
          amount = -(Math.random() * 80 + 20);
          break;
        case 'Travel':
          amount = -(Math.random() * 300 + 100);
          break;
        case 'Education':
          amount = -(Math.random() * 60 + 20);
          break;
        default:
          amount = -(Math.random() * 100 + 10);
      }
      
      description = business;
    } else if (type === 'deposit') {
      // For deposits, generate realistic income descriptions
      const depositTypes = [
        'Salary Deposit',
        'Direct Deposit',
        'Interest Payment',
        'Refund',
        'Transfer Received'
      ];
      description = depositTypes[Math.floor(Math.random() * depositTypes.length)];
      amount = Math.random() * 2000 + 500;
    } else {
      // For transfers, generate realistic transfer descriptions
      description = 'Transfer to Savings';
      amount = -(Math.random() * 500 + 100);
    }
    
    transactions.push({
      id: `transaction-${i}`,
      accountId: mockAccounts[Math.floor(Math.random() * mockAccounts.length)].id,
      description,
      amount: Number(amount.toFixed(2)),
      date: date.toISOString(),
      type,
      category
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockTransactions = generateMockTransactions();

// Get the 5 most recent transactions
export const getRecentTransactions = () => mockTransactions.slice(0, 5); 