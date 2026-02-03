import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/Colors";

interface SafeScreenProps {
    children: React.ReactNode;
    style?: any;
}

/**
 * A wrapper component that handles safe area insets and background color.
 */
const SafeScreen: React.FC<SafeScreenProps> = ({ children, style }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});

export default SafeScreen;
