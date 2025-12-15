import { ThemedText } from "@/components/themed-text";
import { toast } from "@/components/ToastProvider";

import React from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, List, Surface } from "react-native-paper";

/**
 * Information Screen
 *
 * Provides general information about the app, company, and legal details
 */
export default function InformationScreen() {

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      toast.error("Link Error", "Could not open link");
    });
  };

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Information</ThemedText>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About WiWebb</ThemedText>
          <ThemedText style={styles.paragraph}>
            WiWebb is a WiFi management portal designed to provide seamless, secure,
            and reliable wireless connectivity. Our mission is to simplify WiFi
            management and provide users with fast, protected internet access.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Founded in 2025, we&apos;re committed to innovation, security, and user
            experience. Our platform helps users manage and monitor their WiFi
            connections with ease and confidence.
          </ThemedText>
        </View>

        <Divider style={styles.divider} />

        {/* App Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Information</ThemedText>

          <List.Item
            title="Version"
            description="1.0.0 (MVP)"
            left={(props) => <List.Icon {...props} icon="information" />}
          />

          <List.Item
            title="Last Updated"
            description="November 2, 2025"
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />

          <List.Item
            title="Platform"
            description="React Native / Expo"
            left={(props) => <List.Icon {...props} icon="cellphone" />}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Legal Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal Information</ThemedText>

          <List.Item
            title="Terms of Service"
            description="View our terms and conditions"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => handleLinkPress("https://example.com/terms")}
          />

          <List.Item
            title="Privacy Policy"
            description="Learn how we handle your data"
            left={(props) => <List.Icon {...props} icon="shield" />}
            onPress={() => handleLinkPress("https://example.com/privacy")}
          />

          <List.Item
            title="Licenses"
            description="Third-party software licenses"
            left={(props) => <List.Icon {...props} icon="license" />}
            onPress={() => handleLinkPress("https://example.com/licenses")}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Contact Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>

          <List.Item
            title="Website"
            description="www.wiwebb.com"
            left={(props) => <List.Icon {...props} icon="web" />}
            onPress={() => handleLinkPress("https://www.wiwebb.com")}
          />

          <List.Item
            title="Email"
            description="info@wiwebb.com"
            left={(props) => <List.Icon {...props} icon="email" />}
            onPress={() => handleLinkPress("mailto:info@wiwebb.com")}
          />

          <List.Item
            title="Phone"
            description="+1 (555) 234-5678"
            left={(props) => <List.Icon {...props} icon="phone" />}
            onPress={() => handleLinkPress("tel:+15552345678")}
          />

          <List.Item
            title="Address"
            description="456 WiFi Avenue, Austin, TX 78701"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            onPress={() =>
              handleLinkPress(
                "https://maps.google.com/?q=456+WiFi+Avenue,+Austin,+TX+78701"
              )
            }
          />
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Follow Us</ThemedText>

          <View style={styles.socialButtons}>
            <Button
              mode="outlined"
              icon="twitter"
              onPress={() => handleLinkPress("https://twitter.com/wiwebb")}
              style={styles.socialButton}
            >
              Twitter
            </Button>

            <Button
              mode="outlined"
              icon="facebook"
              onPress={() => handleLinkPress("https://facebook.com/wiwebb")}
              style={styles.socialButton}
            >
              Facebook
            </Button>

            <Button
              mode="outlined"
              icon="instagram"
              onPress={() => handleLinkPress("https://instagram.com/wiwebb")}
              style={styles.socialButton}
            >
              Instagram
            </Button>
          </View>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  socialButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  socialButton: {
    marginRight: 8,
    marginBottom: 8,
  },
});
