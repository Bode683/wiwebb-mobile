import { ThemedText } from "@/components/themed-text";
import { toast } from "@/components/ToastProvider";

import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  List,
  Surface,
  TextInput,
} from "react-native-paper";

/**
 * Support Screen
 *
 * Provides user support options including FAQ, contact form, and emergency support
 */
export default function SupportScreen() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!subject || !message) {
      toast.error("Validation Error", "Please fill out all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message Sent", "Your message has been sent");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Send Failed", "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const faqItems = [
    {
      id: "faq1",
      question: "How do I connect to a WiFi network?",
      answer:
        'Open the app, select an available network from the list, enter the password if required, and tap "Connect".',
    },
    {
      id: "faq2",
      question: "How do I manage my payment subscription?",
      answer:
        'Go to Billing & Subscription in Settings, view your active subscription, and manage renewal or upgrade options from there.',
    },
    {
      id: "faq3",
      question: "What devices can I connect at once?",
      answer:
        'Your plan allows simultaneous connections. Check your plan details in Settings to see the maximum number of devices you can connect.',
    },
    {
      id: "faq4",
      question: "How do I troubleshoot connection problems?",
      answer:
        'Try restarting your device, forgetting the network and reconnecting, or moving closer to the WiFi router. Contact support if issues persist.',
    },
    {
      id: "faq5",
      question: "How can I view my data usage?",
      answer:
        'Go to Usage Statistics in the main menu to see your bandwidth usage, data consumed, and performance metrics over time.',
    },
  ];

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Support</ThemedText>
        </View>

        {/* Emergency Support Card */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <ThemedText style={styles.emergencyTitle}>
              Connection Issues?
            </ThemedText>
            <ThemedText style={styles.emergencyText}>
              If you&apos;re having trouble connecting to WiFi, check your network settings or contact our support team.
            </ThemedText>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() =>
                toast.info(
                  "Support Requested",
                  "Support team will assist you shortly"
                )
              }
            >
              Get Help
            </Button>
          </Card.Actions>
        </Card>

        {/* FAQ Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Frequently Asked Questions
          </ThemedText>

          {faqItems.map((item) => (
            <List.Accordion
              key={item.id}
              title={item.question}
              expanded={expandedFaq === item.id}
              onPress={() => toggleFaq(item.id)}
              style={styles.faqItem}
            >
              <List.Item
                title=""
                description={item.answer}
                descriptionNumberOfLines={0}
                descriptionStyle={styles.faqAnswer}
              />
            </List.Accordion>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Contact Form */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Support</ThemedText>

          <TextInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Message"
            value={message}
            onChangeText={setMessage}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !subject || !message}
            style={styles.submitButton}
          >
            Send Message
          </Button>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Contact Information
          </ThemedText>

          <List.Item
            title="Email"
            description="support@wiwebb.com"
            left={(props) => <List.Icon {...props} icon="email" />}
          />

          <List.Item
            title="Phone"
            description="+1 (555) 123-4567"
            left={(props) => <List.Icon {...props} icon="phone" />}
          />

          <List.Item
            title="Hours"
            description="24/7 Support"
            left={(props) => <List.Icon {...props} icon="clock" />}
          />
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
  faqItem: {
    backgroundColor: "#F7FAFC",
    marginBottom: 8,
    borderRadius: 8,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});
