import { ThemedText } from "@/components/themed-text";
import { toast } from "@/components/ToastProvider";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, List, Surface, Switch } from "react-native-paper";

/**
 * Settings Screen
 *
 * Allows users to configure app settings and preferences
 */
export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  // State for various settings
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case "notifications":
        setNotificationsEnabled(value);
        toast.info("Notifications", `Notifications ${value ? "enabled" : "disabled"}`);
        break;
      case "location":
        setLocationEnabled(value);
        toast.info(
          "Location Services",
          `Location services ${value ? "enabled" : "disabled"}`
        );
        break;
      case "darkMode":
        setDarkMode(value);
        toast.info("Theme", `Dark mode ${value ? "enabled" : "disabled"}`);
        break;
    }
  };

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </View>

        <List.Section>
          <List.Subheader>App Preferences</List.Subheader>

          <List.Item
            title="Dark Mode"
            description="Enable dark theme for the app"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={(value) =>
                  handleSettingChange("darkMode", value)
                }
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Notifications</List.Subheader>

          <List.Item
            title="Push Notifications"
            description="Receive updates about WiFi connections and security alerts"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) =>
                  handleSettingChange("notifications", value)
                }
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Privacy</List.Subheader>

          <List.Item
            title="Location Services"
            description="Allow app to access your location"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={locationEnabled}
                onValueChange={(value) =>
                  handleSettingChange("location", value)
                }
              />
            )}
          />

          <Divider />

          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield" />}
            onPress={() => router.push("/privacy")}
          />

          <List.Item
            title="Terms of Service"
            description="View our terms of service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => router.push("/terms")}
          />

          <List.Item
            title="Clear App Data"
            description="Delete all locally stored data"
            left={(props) => (
              <List.Icon {...props} icon="delete" color={theme.colors.error} />
            )}
            onPress={() =>
              toast.info("Coming Soon", "This feature is not available in the MVP")
            }
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>

          <List.Item
            title="App Version"
            description="1.0.0 (MVP)"
            left={(props) => <List.Icon {...props} icon="information" />}
          />

          <List.Item
            title="Send Feedback"
            description="Help us improve the app"
            left={(props) => <List.Icon {...props} icon="message" />}
            onPress={() => router.push("/(drawer)/support")}
          />
        </List.Section>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
