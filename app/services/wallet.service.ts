import { apiClient, buildQueryString } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import type {
  WalletBalanceResponse,
  DepositRequest,
  DepositResponse,
  WithdrawRequest,
  WithdrawResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  Transaction,
  TransactionType,
  TransactionStatus,
} from "../lib/types";

// Wallet service class
export class WalletService {
  // Get wallet balance and statistics
  async getBalance(): Promise<WalletBalanceResponse> {
    return apiClient.get<WalletBalanceResponse>(API_ENDPOINTS.WALLET.BALANCE);
  }

  // Deposit funds
  async deposit(depositData: DepositRequest): Promise<DepositResponse> {
    return apiClient.post<DepositResponse>(
      API_ENDPOINTS.WALLET.DEPOSIT,
      depositData
    );
  }

  // Withdraw funds
  async withdraw(withdrawData: WithdrawRequest): Promise<WithdrawResponse> {
    return apiClient.post<WithdrawResponse>(
      API_ENDPOINTS.WALLET.WITHDRAW,
      withdrawData
    );
  }

  // Get transactions with filters and pagination
  async getTransactions(
    params?: GetTransactionsRequest
  ): Promise<GetTransactionsResponse> {
    const queryString = params ? buildQueryString(params) : "";
    return apiClient.get<GetTransactionsResponse>(
      `${API_ENDPOINTS.WALLET.TRANSACTIONS}${queryString}`
    );
  }

  // Get all transactions (for dashboard display)
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await this.getTransactions({ limit: 1000 }); // Get all transactions
    return response.transactions;
  }

  // Get transactions by type
  async getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
    const response = await this.getTransactions({ type });
    return response.transactions;
  }

  // Get transactions by status
  async getTransactionsByStatus(
    status: TransactionStatus
  ): Promise<Transaction[]> {
    const response = await this.getTransactions({ status });
    return response.transactions;
  }

  // Get pending transactions
  async getPendingTransactions(): Promise<Transaction[]> {
    return this.getTransactionsByStatus("pending");
  }

  // Get completed transactions
  async getCompletedTransactions(): Promise<Transaction[]> {
    return this.getTransactionsByStatus("completed");
  }

  // Get failed transactions
  async getFailedTransactions(): Promise<Transaction[]> {
    return this.getTransactionsByStatus("failed");
  }

  // Get deposits
  async getDeposits(): Promise<Transaction[]> {
    return this.getTransactionsByType("deposit");
  }

  // Get withdrawals
  async getWithdrawals(): Promise<Transaction[]> {
    return this.getTransactionsByType("withdrawal");
  }

  // Get stakes (prediction stakes)
  async getStakes(): Promise<Transaction[]> {
    return this.getTransactionsByType("stake");
  }

  // Get rewards (prediction winnings)
  async getRewards(): Promise<Transaction[]> {
    return this.getTransactionsByType("reward");
  }

  // Get fees
  async getFees(): Promise<Transaction[]> {
    return this.getTransactionsByType("fee");
  }

  // Get royalties (creator earnings)
  async getRoyalties(): Promise<Transaction[]> {
    return this.getTransactionsByType("royalty");
  }

  // Get pledges (creator pool pledges)
  async getPledges(): Promise<Transaction[]> {
    return this.getTransactionsByType("pledge");
  }

  // Get recent transactions (last 30 days)
  async getRecentTransactions(): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= thirtyDaysAgo
    );
  }

  // Get transaction by ID
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transactions = await this.getAllTransactions();
    const transaction = transactions.find((t) => t.id === transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  // Get transactions by reference (pool ID, prediction ID, etc.)
  async getTransactionsByReference(reference: string): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter(
      (transaction) => transaction.reference === reference
    );
  }

  // Get wallet statistics
  async getWalletStats(): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalStaked: number;
    totalRewards: number;
    totalFees: number;
    totalRoyalties: number;
    netEarnings: number;
  }> {
    const transactions = await this.getAllTransactions();

    const totalDeposits = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter((t) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalStaked = transactions
      .filter((t) => t.type === "stake")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRewards = transactions
      .filter((t) => t.type === "reward" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFees = transactions
      .filter((t) => t.type === "fee")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRoyalties = transactions
      .filter((t) => t.type === "royalty" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const netEarnings = totalRewards + totalRoyalties - totalFees;

    return {
      totalDeposits,
      totalWithdrawals,
      totalStaked,
      totalRewards,
      totalFees,
      totalRoyalties,
      netEarnings,
    };
  }

  // Validate deposit data
  static validateDepositData(data: DepositRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.amount || data.amount < 10) {
      errors.push("Minimum deposit amount is $10");
    }

    if (data.amount && data.amount > 10000) {
      errors.push("Maximum deposit amount is $10,000");
    }

    // if (
    //   !data.paymentMethod ||
    //   !["stripe", "paypal"].includes(data.paymentMethod)
    // ) {
    //   errors.push('Payment method must be either "stripe" or "paypal"');
    // }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Validate withdrawal data
  static validateWithdrawData(data: WithdrawRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.amount || data.amount < 10) {
      errors.push("Minimum withdrawal amount is $10");
    }

    if (data.amount && data.amount > 5000) {
      errors.push("Maximum withdrawal amount is $5,000");
    }

    if (
      !data.paymentMethod ||
      !["stripe", "paypal"].includes(data.paymentMethod)
    ) {
      errors.push('Payment method must be either "stripe" or "paypal"');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Format transaction amount
  static formatAmount(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Format transaction type for display
  static formatTransactionType(type: TransactionType): string {
    const typeLabels = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      stake: "Stake",
      reward: "Reward",
      fee: "Fee",
      royalty: "Royalty",
      pledge: "Pledge",
    };
    return typeLabels[type] || type;
  }

  // Format transaction status for display
  static formatTransactionStatus(status: TransactionStatus): string {
    const statusLabels = {
      pending: "Pending",
      completed: "Completed",
      failed: "Failed",
    };
    return statusLabels[status] || status;
  }

  // Get transaction type color class
  static getTransactionTypeColor(type: TransactionType): string {
    const typeColors = {
      deposit: "text-green-600 bg-green-100",
      withdrawal: "text-red-600 bg-red-100",
      stake: "text-blue-600 bg-blue-100",
      reward: "text-green-600 bg-green-100",
      fee: "text-orange-600 bg-orange-100",
      royalty: "text-purple-600 bg-purple-100",
      pledge: "text-cyan-600 bg-cyan-100",
    };
    return typeColors[type] || "text-gray-600 bg-gray-100";
  }

  // Get transaction status color class
  static getTransactionStatusColor(status: TransactionStatus): string {
    const statusColors = {
      pending: "text-yellow-600 bg-yellow-100",
      completed: "text-green-600 bg-green-100",
      failed: "text-red-600 bg-red-100",
    };
    return statusColors[status] || "text-gray-600 bg-gray-100";
  }

  // Format transaction date
  static formatTransactionDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  // Get transaction age in days
  static getTransactionAgeInDays(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if transaction is recent (within last 24 hours)
  static isRecentTransaction(createdAt: string): boolean {
    return this.getTransactionAgeInDays(createdAt) <= 1;
  }

  // Get transaction summary for display
  static getTransactionSummary(transaction: Transaction): string {
    const type = this.formatTransactionType(transaction.type);
    const amount = this.formatAmount(transaction.amount);
    const status = this.formatTransactionStatus(transaction.status);

    return `${type} ${amount} - ${status}`;
  }

  // Calculate transaction fee (if applicable)
  static calculateTransactionFee(
    amount: number,
    type: TransactionType
  ): number {
    const feeRates = {
      deposit: 0.029 + 0.3, // Stripe fee: 2.9% + $0.30
      withdrawal: 0.029 + 0.3, // Stripe fee: 2.9% + $0.30
      stake: 0, // No fee for stakes
      reward: 0, // No fee for rewards
      fee: 0, // Fee transactions don't have fees
      royalty: 0, // No fee for royalties
      pledge: 0, // No fee for pledges
    };

    const feeRate = feeRates[type] || 0;
    return Number((amount * feeRate).toFixed(2));
  }

  // Get net amount after fees
  static getNetAmount(amount: number, type: TransactionType): number {
    const fee = this.calculateTransactionFee(amount, type);
    return Number((amount - fee).toFixed(2));
  }
}

// Create singleton instance
export const walletService = new WalletService();
