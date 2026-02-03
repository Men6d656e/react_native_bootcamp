import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { COLORS } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

/**
 * Screen for user sign-in.
 */
export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    /**
     * Handles the sign-in process.
     */
    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
            router.replace("/(tabs)");
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
                    <Ionicons name="restaurant" size={64} color={COLORS.primary} />
                    <Text style={styles.title}>Recipe App</Text>
                    <Text style={styles.subtitle}>Welcome back! Please sign in.</Text>
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
                        onPress={onSignInPress}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/(auth)/sign-up" style={styles.link}>
                            <Text style={styles.linkText}>Sign Up</Text>
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
