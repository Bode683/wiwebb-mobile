import { ThemedText } from "@/components/themed-text";
import { toast } from "@/components/ToastProvider";

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, List, Surface } from "react-native-paper";

/**
 * Safety Screen
 *
 * Provides security information, features, and WiFi protection guidelines
 */
export default function SafetyScreen() {

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Safety Center</ThemedText>
        </View>

        {/* Security Card */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <ThemedText style={styles.emergencyTitle}>
              Network Security
            </ThemedText>
            <ThemedText style={styles.emergencyText}>
              Your WiFi connections are protected with advanced security protocols. Always verify network authenticity before connecting.
            </ThemedText>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              buttonColor="#0a7ea4"
              textColor="#FFFFFF"
              onPress={() => toast.info("Security Status", "Security features enabled")}
            >
              Security Status
            </Button>
          </Card.Actions>
        </Card>

        {/* Safety Features */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Security Features</ThemedText>

          <List.Item
            title="Encryption Protection"
            description="All your WiFi connections use end-to-end encryption"
            left={(props) => <List.Icon {...props} icon="lock" />}
            onPress={() => toast.info("Encryption", "Encryption is enabled on all connections")}
            style={styles.listItem}
          />

          <List.Item
            title="Network Verification"
            description="Verify network authenticity to avoid connecting to unsafe networks"
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            onPress={() => toast.info("Network Security", "Always check network security settings")}
            style={styles.listItem}
          />

          <List.Item
            title="Data Protection"
            description="Manage what data is shared and visible on public networks"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            onPress={() =>
              toast.info("Data Protection", "Data protection settings available in preferences")
            }
            style={styles.listItem}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Security Tips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Security Tips</ThemedText>

          <Card style={styles.tipCard}>
            <Card.Content>
              <ThemedText style={styles.tipTitle}>Use Trusted Networks</ThemedText>
              <ThemedText style={styles.tipText}>
                Connect only to networks you recognize and trust. Avoid public networks without VPN protection.
              </ThemedText>
            </Card.Content>
          </Card>

          <Card style={styles.tipCard}>
            <Card.Content>
              <ThemedText style={styles.tipTitle}>
                Update Passwords Regularly
              </ThemedText>
              <ThemedText style={styles.tipText}>
                Change your WiFi passwords periodically and use strong, unique passwords to prevent unauthorized access.
              </ThemedText>
            </Card.Content>
          </Card>

          <Card style={styles.tipCard}>
            <Card.Content>
              <ThemedText style={styles.tipTitle}>Disable Auto-Connect</ThemedText>
              <ThemedText style={styles.tipText}>
                Turn off automatic connection to previously saved networks to avoid connecting to spoofed or unsafe networks.
              </ThemedText>
            </Card.Content>
          </Card>

          <Card style={styles.tipCard}>
            <Card.Content>
              <ThemedText style={styles.tipTitle}>
                Recognize Phishing Attempts
              </ThemedText>
              <ThemedText style={styles.tipText}>
                Be cautious of suspicious WiFi network names or unexpected connection requests. Verify network sources before connecting.
              </ThemedText>
            </Card.Content>
          </Card>
        </View>

        {/* Usage Guidelines */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Usage Guidelines
          </ThemedText>
          <ThemedText style={styles.guidelinesText}>
            We&apos;re committed to providing secure and reliable WiFi services for all users. Our usage guidelines ensure network integrity, privacy protection, and fair access for everyone.
          </ThemedText>
          <Button
            mode="outlined"
            onPress={() =>
              toast.info(
                "Guidelines",
                "Usage guidelines would open in a full view"
              )
            }
            style={styles.guidelinesButton}
          >
            View Full Guidelines
          </Button>
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
  emergencyCard: {
    marginBottom: 24,
    backgroundColor: "#FFF5F5",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53E3E",
    marginBottom: 8,
  },
  emergencyText: {
    color: "#4A5568",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: "#F7FAFC",
    marginBottom: 8,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 16,
  },
  tipCard: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tipText: {
    color: "#4A5568",
  },
  guidelinesText: {
    marginBottom: 16,
  },
  guidelinesButton: {
    alignSelf: "flex-start",
  },
});
