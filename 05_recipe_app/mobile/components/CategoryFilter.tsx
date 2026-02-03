import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS } from "@/constants/Colors";

interface Category {
    id: string | number;
    name: string;
    image: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (category: string) => void;
}

/**
 * Component for filtering recipes by category using a horizontal scroll list.
 */
const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {categories.map((item) => {
                    const isSelected = selectedCategory === item.name;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => onSelectCategory(item.name)}
                            style={[styles.categoryCard, isSelected && styles.selectedCard]}
                        >
                            <Image source={{ uri: item.image }} style={styles.categoryImage} />
                            <Text style={[styles.categoryText, isSelected && styles.selectedText]}>{item.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryCard: {
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        minWidth: 80,
    },
    selectedCard: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.text,
    },
    selectedText: {
        color: COLORS.white,
    },
});

export default CategoryFilter;
