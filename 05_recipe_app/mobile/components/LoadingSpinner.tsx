import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/constants/Colors";

interface LoadingSpinnerProps {
    message?: string;
}

/**
 * A simple loading spinner with an optional message.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.message}>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },
});

export default LoadingSpinner;
