import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

/**
 * Simple profile screen to handle user logout and display basic info.
 */
export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={100} color={COLORS.primary} />
                </View>
                <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
                <Text style={styles.userId}>ID: {user?.id}</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={[styles.menuText, { color: "#FF3B30" }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: "center",
        padding: 40,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    email: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.text,
    },
    userId: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 5,
    },
    menu: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        gap: 15,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    menuText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
