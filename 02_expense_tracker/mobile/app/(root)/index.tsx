import { styles } from "@/assets/styles/home.styles";
import BalanceCard from "@/components/BalanceCard";
import NoTransactionFound from "@/components/NoTransactionFound";
import PageLoader from "@/components/PageLoader";
import { SignOutButton } from "@/components/SignOutButton";
import TransactionItem from "@/components/TransactionItem";
import { useTransactions } from "@/hooks/useTransacions";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    deleteTransaction,
    isLoading,
    loadData,
    summary,
    error,
  } = useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id, loadData]);

  if (isLoading && !refreshing) return <PageLoader />;

  if (error && transactions.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", padding: 20 },
        ]}
      >
        <Ionicons name="cloud-offline-outline" size={64} color="#ccc" />
        <Text style={{ fontSize: 18, marginVertical: 10 }}>
          Oops! Something went wrong
        </Text>
        <Text style={{ color: "gray", textAlign: "center", marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.tryagainButton, { width: 150 }]}
          onPress={() => loadData()}
        >
          <Text style={styles.addButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancle", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color={"#FFF"} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* Balance cart */}
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
