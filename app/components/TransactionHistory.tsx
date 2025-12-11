import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faMoneyBillTransfer,
  faBullseye,
  faHandshake,
  faTrophy,
  faCrown,
  faBuilding,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { walletService } from "../services/wallet.service";
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  GetTransactionsRequest,
} from "../lib/types";
import Loader from "./Loader";

interface TransactionHistoryProps {
  userId?: string;
  poolId?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function TransactionHistory({
  userId,
  poolId,
  limit = 20,
  showFilters = true,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    type?: TransactionType;
    status?: TransactionStatus;
  }>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: GetTransactionsRequest = {
          userId,
          poolId,
          limit,
          ...filters,
        };
        const response = await walletService.getTransactions(params);
        setTransactions(response.transactions);
      } catch (err: any) {
        setError(err.message || "Failed to fetch transactions");
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, poolId, limit, filters.type, filters.status]);

  const getTypeLabel = (type: TransactionType): string => {
    const labels: Record<TransactionType, string> = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      stake: "Stake",
      pledge: "Pledge",
      reward: "Reward",
      winnings: "Winnings",
      royalty: "Royalty",
      platform_fee: "Platform Fee",
      fee: "Fee",
      refund: "Refund",
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return faWallet;
      case "withdrawal":
        return faMoneyBillTransfer;
      case "stake":
      case "pledge":
        return faBullseye;
      case "winnings":
      case "reward":
        return faTrophy;
      case "royalty":
        return faCrown;
      case "platform_fee":
      case "fee":
        return faBuilding;
      default:
        return faWallet;
    }
  };

  const getTypeColor = (type: TransactionType): string => {
    if (["winnings", "royalty", "deposit", "reward"].includes(type))
      return "text-green-600 bg-green-100";
    if (["stake", "pledge", "withdrawal"].includes(type))
      return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  const isPositive = (type: TransactionType): boolean => {
    return ["winnings", "royalty", "deposit", "reward"].includes(type);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={filters.type || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                type: e.target.value as TransactionType | undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="stake">Stake</option>
            <option value="pledge">Pledge</option>
            <option value="winnings">Winnings</option>
            <option value="royalty">Royalty</option>
            <option value="platform_fee">Platform Fee</option>
            <option value="refund">Refund</option>
          </select>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as TransactionStatus | undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      )}

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`p-4 border rounded-lg ${
              transaction.status === "completed"
                ? "border-gray-200 bg-white"
                : transaction.status === "pending"
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div
                  className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}
                >
                  <FontAwesomeIcon
                    icon={getTypeIcon(transaction.type)}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getTypeColor(transaction.type)}`}
                    >
                      {getTypeLabel(transaction.type)}
                    </span>
                    {transaction.pool && (
                      <span className="text-xs text-gray-500 truncate">
                        {transaction.pool.question || "Pool"}
                      </span>
                    )}
                  </div>
                  {transaction.description && (
                    <p className="text-sm text-gray-700 mb-1">
                      {transaction.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      {new Date(transaction.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className={`capitalize ${
                        transaction.status === "completed"
                          ? "text-green-600"
                          : transaction.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <span
                  className={`text-lg font-bold ${
                    isPositive(transaction.type)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {isPositive(transaction.type) ? "+" : "-"}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
