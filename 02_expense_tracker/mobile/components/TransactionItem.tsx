import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { Transaction } from "@/hooks/useTransacions";
import { formatDate } from "@/lib/utils";

interface TransactionItemProps {
  item: Transaction;
  onDelete: (id: number) => void;
}

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
} as const;

type CategoryKey = keyof typeof CATEGORY_ICONS;
const TransactionItem: React.FC<TransactionItemProps> = ({
  item,
  onDelete,
}) => {
  const amountFloat =
    typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
  const isIncome = amountFloat > 0;
  const iconName =
    CATEGORY_ICONS[item.category as CategoryKey] || "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent}>
        {/* Left Section: Icon */}
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={iconName}
            size={22}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>

        {/* Middle Section: Info */}
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>

        {/* Right Section: Amount & Date */}
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
            {isIncome ? "+" : "-"}${Math.abs(amountFloat).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.created_at)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;
