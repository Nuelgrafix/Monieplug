import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

const TransactionHistory: React.FC = () => {
  // transaction data
  const transactions: Transaction[] = [
    { date: '2024-03-15', description: 'Payment from Sarah', amount: 150 },
    { date: '2024-03-14', description: 'Grocery Store', amount: -75.50 },
    { date: '2024-03-16', description: 'Monieplug Store', amount: -75.50 },
    { date: '2024-03-17', description: 'Coffee Shop', amount: -12.75 },
    { date: '2024-03-18', description: 'Salary Deposit', amount: 2500 }
  ];

  const formatAmount = (amount: number): string => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}₦${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAmountColor = (amount: number): string => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className='w-full flex flex-col gap-3 items-start max-w-[514px] mx-auto'>
      <div className='w-full h-[40px] flex justify-between items-center px-3 bg-[#F9F9F9]'>
        <p className='text-xl lg:text-2xl text-[#282828] font-normal'>History</p>
        <ArrowRight className='text-[#101828] w-[24px] h-[24px]'/>
      </div>
      <div className="w-full mt-2 flex flex-col items-center justify-evenly rounded-t-[20px] border border-b-0 border-[#E0E0E0] bg-white shadow-md">
        <div className='grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 w-full'>
          <div>Date</div>
          <div>Description</div>
          <div className="text-right">Amount</div>
        </div>

        {/* Scrollable Transaction List */}
        <div className="h-32 overflow-y-auto w-full">
          {transactions.map((transaction: Transaction, index: number) => (
            <div 
              key={index}
              className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100"
            >
              <div className="text-sm text-gray-600">
                {transaction.date}
              </div>
              <div className="text-sm text-gray-800 font-medium">
                {transaction.description}
              </div>
              <div className='text-sm font-semibold text-right'>
                {formatAmount(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;