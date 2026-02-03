import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * Screen for verifying the user's email address with a code.
 */
export default function VerifyEmailScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handles the email verification step.
     */
    const onVerifyPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.replace("/(tabs)");
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            Alert.alert("Error", err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Ionicons name="mail-open" size={64} color={COLORS.primary} />
                    <Text style={styles.title}>Verify Email</Text>
                    <Text style={styles.subtitle}>Enter the code sent to your email.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        value={code}
                        placeholder="Verification Code..."
                        placeholderTextColor={COLORS.textLight}
                        onChangeText={(code) => setCode(code)}
                        style={styles.input}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={onVerifyPress}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ... same styles as sign-in/up for consistency ...
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: COLORS.background,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: "SpaceMono",
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "SpaceMono",
        color: COLORS.textLight,
        marginTop: 5,
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    input: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text,
        textAlign: "center",
        fontSize: 20,
        letterSpacing: 5,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "bold",
    },
});
