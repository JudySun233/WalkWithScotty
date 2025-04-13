import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native'; // Changed to react-native
import {
    Menu,
    Search,
    ChevronLeft,
    ChevronRight,
    Home,
    Settings,
    User,
    LogOut,
    LogIn,
    Plus,
    Check,
    X,
    AlertTriangle,
    Loader2
} from 'lucide-react-native'; // Changed to lucide-react-native
import { NavigationContainer, useRoute, useNavigation } from '@react-navigation/native'; // Changed to react-navigation/native
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Changed to react-navigation/native-stack
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// ===============================
// Constants and Configurations
// ===============================

const { width, height } = Dimensions.get('window');
const SPACING = 20;
const ITEM_SIZE = width * 0.6;
const BACKDROP_HEIGHT = height * 0.7;
const FONT_SIZE_BASE = 16; // Base font size.  Adjust this and other sizes will scale.

// Theme colors (Consider defining these in a separate file if needed)
const COLORS = {
    primary: '#6200EE', // Material Purple 500
    primaryDark: '#3700B3', // Material Purple 700
    secondary: '#03DAC5', // Material Teal A400
    secondaryDark: '#018786', // Material Teal A700
    background: '#F5F5F5', // Material Grey 100
    surface: '#FFFFFF',    // White
    text: '#212121',       // Material Grey 900 (almost black)
    textSecondary: '#757575', // Material Grey 600
    accent: '#FF4081',    // Material Pink A400
    error: '#B00020',    // Material Red 700
    success: '#4CAF50', // Material Green 500
    warning: '#F57C00', // Material Orange 800
    card: '#FFFFFF',     // White
    border: '#E0E0E0',   // Material Grey 300
    paper: '#FFFFFF',
    disabled: 'rgba(0, 0, 0, 0.12)', // For disabled elements
    onPrimary: '#FFFFFF', // Text color on primary
    onSecondary: '#000000', // Text color on secondary
    onBackground: '#000000',
    onSurface: '#000000',
    onAccent: '#FFFFFF',
};

// ===============================
// Helper Functions
// ===============================

const getFontSize = (size: number) => {
    // Simple scaling, you could use more sophisticated methods
    return size * (width / 375); // Assume 375 is a typical screen width
};

// ===============================
// Shared Components
// ===============================

const StyledText = ({ children, style, ...props }: { children: React.ReactNode, style?: any, [key: string]: any }) => (
    <Text style={[styles.text, style]} {...props}>
        {children}
    </Text>
);

const StyledButton = ({ children, onPress, style, textStyle, ...props }: { children: React.ReactNode, onPress: () => void, style?: any, textStyle?: any, [key: string]: any }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...props}>
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
);

const StyledInput = ({ ...props }: any) => (
    <TextInput style={styles.input} {...props} />
);

const ErrorMessage = ({ message }: { message: string }) => (
    <StyledText style={styles.errorText}>{message}</StyledText>
);

// ===============================
// Navigation Components
// ===============================

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MenuIcon = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity style={styles.menuIcon} onPress={onPress}>
        <Menu size={24} color={COLORS.text} />
    </TouchableOpacity>
);

const BackButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
        <ChevronLeft size={24} color={COLORS.text} />
    </TouchableOpacity>
);

// ===============================
// Screens
// ===============================

const HomeScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
            <StyledText style={styles.title}>Home Screen</StyledText>
            <StyledButton onPress={() => navigation.navigate('Details')} style={{ marginTop: 20 }}>
                Go to Details
            </StyledButton>
        </View>
    );
};

const DetailsScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute();
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <StyledText style={styles.title}>Details Screen</StyledText>
            <StyledText>Count: {count}</StyledText>
            <StyledButton onPress={() => setCount(count + 1)}>Increment</StyledButton>
            {route.params && (
                <StyledText style={{ marginTop: 20 }}>
                    Parameter: {route.params.itemId}
                </StyledText>
            )}
        </View>
    );
};

const SettingsScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
            <StyledText style={styles.title}>Settings Screen</StyledText>
            <StyledButton onPress={() => navigation.navigate('Profile')}>Go to Profile</StyledButton>
        </View>
    );
};

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <BackButton onPress={() => navigation.goBack()} />
            <StyledText style={styles.title}>Profile Screen</StyledText>
        </View>
    );
};

const SearchScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        // Simulate an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Short delay
        if (searchTerm.trim() !== '') {
            setResults([
                `Result 1 for ${searchTerm}`,
                `Result 2 for ${searchTerm}`,
                `Result 3 for ${searchTerm}`,
            ]);
        } else {
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <StyledText style={styles.title}>Search</StyledText>
            <View style={styles.searchContainer}>
                <StyledInput
                    placeholder="Search..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.searchInput}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <StyledButton
                    onPress={handleSearch}
                    style={styles.searchButton}
                    textStyle={{ color: COLORS.onPrimary }}
                    disabled={loading}
                >
                    {loading ? <Loader2 size={20} color={COLORS.onPrimary} /> : <Search size={20} />}
                </StyledButton>
            </View>
            {loading && <StyledText>Loading...</StyledText>}
            <AnimatePresence>
                {results.map((result, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={styles.searchResult}
                    >
                        <StyledText>{result}</StyledText>
                    </motion.div>
                ))}
            </AnimatePresence>
        </View>
    );
};

const CustomDrawerContent = (props: any) => {
    const navigation = useNavigation();
    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: COLORS.surface }}>
            <View style={styles.drawerHeader}>
                <StyledText style={styles.drawerTitle}>App Navigation</StyledText>
            </View>
            <DrawerItem
                label="Home"
                onPress={() => navigation.navigate('Home')}
                icon={() => <Home size={24} color={COLORS.text} />}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Settings"
                onPress={() => navigation.navigate('Settings')}
                icon={() => <Settings size={24} color={COLORS.text} />}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Search"
                onPress={() => navigation.navigate('Search')}
                icon={() => <Search size={24} color={COLORS.text} />}
                labelStyle={styles.drawerLabel}
            />
            {/* Add more DrawerItems as needed */}
            <View style={styles.drawerFooter}>
                <DrawerItem
                    label="Logout"
                    onPress={() => {
                        // Handle logout logic here (e.g., clear session, navigate to login)
                        navigation.navigate('Login'); // Example: Navigate to a Login screen
                    }}
                    icon={() => <LogOut size={24} color={COLORS.text} />}
                    labelStyle={[styles.drawerLabel, { color: COLORS.error }]}
                />
            </View>
        </DrawerContentScrollView>
    );
};

// ===============================
// Main App Component
// ===============================

const App = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: false, // Hide default header
                }}
            >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
                <Drawer.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

// ===============================
// Styles
// ===============================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING,
    },
    title: {
        fontSize: getFontSize(24),
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING,
    },
    text: {
        fontSize: getFontSize(FONT_SIZE_BASE),
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING / 2,
        paddingHorizontal: SPACING,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2, // Android shadow
        shadowColor: 'rgba(0, 0, 0, 0.2)', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: getFontSize(FONT_SIZE_BASE),
        color: COLORS.onPrimary,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: SPACING / 2,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: SPACING,
        fontSize: getFontSize(FONT_SIZE_BASE),
        backgroundColor: COLORS.surface,
        color: COLORS.text,
    },
    errorText: {
        color: COLORS.error,
        fontSize: getFontSize(FONT_SIZE_BASE),
        marginBottom: SPACING,
    },
    menuIcon: {
        position: 'absolute',
        top: SPACING * 1.5,
        left: SPACING,
        zIndex: 10,
    },
    backButton: {
        position: 'absolute',
        top: SPACING * 1.5,
        left: SPACING,
        zIndex: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: SPACING,
    },
    searchInput: {
        flex: 1,
        marginRight: SPACING / 2,
    },
    searchButton: {
        paddingHorizontal: SPACING / 2,
        paddingVertical: SPACING / 2,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
    },
    searchResult: {
        padding: SPACING / 2,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        marginBottom: SPACING / 2,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    drawerHeader: {
        padding: SPACING * 2,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryDark,
    },
    drawerTitle: {
        fontSize: getFontSize(20),
        fontWeight: 'bold',
        color: COLORS.onPrimary,
    },
    drawerLabel: {
        fontSize: getFontSize(FONT_SIZE_BASE),
        color: COLORS.text,
    },
    drawerFooter: {
        marginTop: 'auto', // Push to the bottom
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    }
});

export default App;
