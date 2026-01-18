import { Account, Expense, Refill } from '../types';

export function generateMockData() {
  const accounts: Account[] = [
    {
      id: '1',
      type: 'cash',
      name: 'Cash Account',
      balance: 25000,
    },
    {
      id: '2',
      type: 'bank',
      name: 'Bank Account',
      balance: 75000,
    },
  ];

  const refills: Refill[] = [
    {
      id: '1',
      date: '2025-01-05',
      accountId: '2',
      amount: 50000,
      method: 'Bank Transfer',
      notes: 'Monthly budget allocation',
    },
    {
      id: '2',
      date: '2025-01-15',
      accountId: '1',
      amount: 25000,
      method: 'Cash Deposit',
      notes: 'Parent fees collection',
    },
    {
      id: '3',
      date: '2025-02-01',
      accountId: '2',
      amount: 60000,
      method: 'Bank Transfer',
      notes: 'February budget',
    },
  ];

  const expenses: Expense[] = [
    {
      id: '1',
      date: '2025-01-10',
      description: 'Supermarket Purchase',
      category: 'Food',
      supplier: 'Local Market',
      paymentSource: 'both',
      debitDetails: { cashAmount: 290, bankAmount: 3710 },
      total: 4000,
      items: [
        { id: '1', name: 'Rice', quantity: 50, unit: 'kg', unitPrice: 80, total: 4000 },
      ],
      invoiceFile: 'invoice_001.pdf',
      remarks: 'Monthly food stock',
    },
    {
      id: '2',
      date: '2025-01-12',
      description: 'Art Supplies Purchase',
      category: 'Supplies',
      supplier: 'Education Store',
      paymentSource: 'cash',
      debitDetails: { cashAmount: 3000, bankAmount: 0 },
      total: 3000,
      items: [
        { id: '1', name: 'Crayons Set', quantity: 20, unit: 'boxes', unitPrice: 150, total: 3000 },
      ],
      invoiceFile: 'invoice_002.pdf',
      remarks: 'Art supplies for kids',
    },
    {
      id: '3',
      date: '2025-01-15',
      description: 'Educational Toys',
      category: 'Toys',
      supplier: 'Toy Warehouse',
      paymentSource: 'bank',
      debitDetails: { cashAmount: 0, bankAmount: 4000 },
      total: 4000,
      items: [
        { id: '1', name: 'Building Blocks', quantity: 5, unit: 'sets', unitPrice: 800, total: 4000 },
      ],
      invoiceFile: 'invoice_003.pdf',
      remarks: 'Educational toys',
    },
    {
      id: '4',
      date: '2025-01-18',
      description: 'Mixed Supplies & Food',
      category: 'Food & Supplies',
      supplier: 'Supermarket',
      paymentSource: 'both',
      debitDetails: { cashAmount: 1770, bankAmount: 2730 },
      total: 4500,
      items: [
        { id: '1', name: 'Milk Powder', quantity: 10, unit: 'kg', unitPrice: 450, total: 4500 },
      ],
      remarks: 'Dairy and supplies mix',
    },
    {
      id: '5',
      date: '2025-01-20',
      description: 'Bulk Cleaning Purchase',
      category: 'Supplies',
      supplier: 'Cleaning Co.',
      paymentSource: 'cash',
      debitDetails: { cashAmount: 2500, bankAmount: 0 },
      total: 2500,
      items: [
        { id: '1', name: 'Cleaning Supplies', quantity: 1, unit: 'lot', unitPrice: 2500, total: 2500 },
      ],
      invoiceFile: 'invoice_004.pdf',
      remarks: 'Monthly cleaning materials',
    },
    {
      id: '6',
      date: '2025-01-25',
      description: 'Fresh Produce',
      category: 'Food',
      supplier: 'Local Market',
      paymentSource: 'both',
      debitDetails: { cashAmount: 900, bankAmount: 900 },
      total: 1800,
      items: [
        { id: '1', name: 'Fresh Vegetables', quantity: 30, unit: 'kg', unitPrice: 60, total: 1800 },
      ],
      invoiceFile: 'invoice_005.pdf',
      remarks: 'Weekly vegetable supply',
    },
    {
      id: '7',
      date: '2025-02-02',
      description: 'Hygiene & Office Supplies',
      category: 'Supplies',
      supplier: 'Office Mart',
      paymentSource: 'bank',
      debitDetails: { cashAmount: 0, bankAmount: 1080 },
      total: 1080,
      items: [
        { id: '1', name: 'Paper Towels', quantity: 24, unit: 'rolls', unitPrice: 45, total: 1080 },
      ],
      invoiceFile: 'invoice_006.pdf',
      remarks: 'Hygiene supplies',
    },
    {
      id: '8',
      date: '2025-02-05',
      description: 'Baking Ingredients',
      category: 'Food',
      supplier: 'Local Market',
      paymentSource: 'bank',
      debitDetails: { cashAmount: 0, bankAmount: 1750 },
      total: 1750,
      items: [
        { id: '1', name: 'Flour', quantity: 25, unit: 'kg', unitPrice: 70, total: 1750 },
      ],
      remarks: 'Baking and cooking',
    },
  ];

  return {
    accounts,
    refills,
    expenses,
  };
}
