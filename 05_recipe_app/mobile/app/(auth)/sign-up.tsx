import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { COLORS } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * Screen for user sign-up.
 */
export default function SignUpScreen() {
    const { isLoaded, signUp } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handles the initial sign-up step.
     */
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // Send the email verification code
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // Move to the verification screen
            router.push("/(auth)/verify-email");
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
                    <Ionicons name="person-add" size={64} color={COLORS.primary} />
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us and find amazing recipes!</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email..."
                        placeholderTextColor={COLORS.textLight}
                        onChangeText={(email) => setEmailAddress(email)}
                        style={styles.input}
                    />

                    <TextInput
                        value={password}
                        placeholder="Password..."
                        placeholderTextColor={COLORS.textLight}
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={onSignUpPress}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Starting..." : "Sign Up"}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/(auth)/sign-in" style={styles.link}>
                            <Text style={styles.linkText}>Sign In</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    footerText: {
        color: COLORS.text,
    },
    link: {},
    linkText: {
        color: COLORS.primary,
        fontWeight: "bold",
    },
});
