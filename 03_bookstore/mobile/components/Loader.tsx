import React from "react";
import { ActivityIndicator, View } from "react-native";
import COLORS from "../constants/colors";

interface LoaderProps {
  size?: "small" | "large" | number;
}

const Loader: React.FC<LoaderProps> = ({ size = "large" }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size={size} color={COLORS.primary} />
    </View>
  );
};

export default Loader;
