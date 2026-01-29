import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSignout } from "@/hook/useSignOut";
import { Feather } from "@expo/vector-icons";

const SignOutButton = () => {
  const { handleSignOut } = useSignout();
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Feather name="log-out" size={24} color={"#E0245E"} />
    </TouchableOpacity>
  );
};

export default SignOutButton;
