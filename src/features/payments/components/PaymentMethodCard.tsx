import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { PaymentMethod } from "../types";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  isSelected?: boolean;
  onSelect?: () => void;
  onSetDefault?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

export function PaymentMethodCard({
  paymentMethod,
  isSelected = false,
  onSelect,
  onSetDefault,
  onDelete,
  onEdit,
  showActions = true,
}: PaymentMethodCardProps) {
  const theme = useTheme();

  // Get icon based on payment method type and card brand
  const getPaymentIcon = () => {
    switch (paymentMethod.type) {
      case "credit_card":
      case "debit_card":
      case "stripe":
        switch (paymentMethod.cardBrand) {
          case "visa":
            return "credit-card";
          case "mastercard":
            return "credit-card";
          case "amex":
            return "credit-card";
          default:
            return "credit-card";
        }
      case "paypal":
        return "payment";
      case "apple_pay":
        return "phone-iphone";
      case "google_pay":
        return "android";
      case "samsung_pay":
        return "phone-android";
      case "mobile_money":
        return "smartphone";
      case "cash":
        return "attach-money";
      default:
        return "credit-card";
    }
  };

  // Get payment method display name
  const getPaymentDisplayName = () => {
    // Show nickname if available
    if (paymentMethod.nickname) {
      return paymentMethod.nickname;
    }

    switch (paymentMethod.type) {
      case "credit_card":
      case "debit_card":
        const cardType =
          paymentMethod.type === "credit_card" ? "Credit" : "Debit";
        const brand = paymentMethod.cardBrand
          ? paymentMethod.cardBrand.charAt(0).toUpperCase() +
            paymentMethod.cardBrand.slice(1)
          : "";
        return `${brand} ${cardType} •••• ${paymentMethod.lastFour}`;
      case "stripe":
        const stripeBrand = paymentMethod.cardBrand
          ? paymentMethod.cardBrand.charAt(0).toUpperCase() +
            paymentMethod.cardBrand.slice(1)
          : "";
        return `${stripeBrand} Stripe •••• ${paymentMethod.lastFour}`;
      case "paypal":
        return `PayPal${
          paymentMethod.email ? ` (${paymentMethod.email})` : ""
        }`;
      case "apple_pay":
        return "Apple Pay";
      case "google_pay":
        return "Google Pay";
      case "samsung_pay":
        return "Samsung Pay";
      case "mobile_money":
        const provider = paymentMethod.mobileMoneyProvider === "orange_money"
          ? "Orange Money"
          : "MTN Mobile Money";
        const phone = paymentMethod.phoneNumber
          ? ` (${paymentMethod.phoneNumber.slice(-4)})`
          : "";
        return `${provider}${phone}`;
      case "cash":
        return "Cash";
      default:
        return "Payment Method";
    }
  };

  // Get secondary info display (expiry, phone, device, etc.)
  const getSecondaryInfo = () => {
    if (
      paymentMethod.type === "credit_card" ||
      paymentMethod.type === "debit_card" ||
      paymentMethod.type === "stripe"
    ) {
      if (paymentMethod.expiryMonth && paymentMethod.expiryYear) {
        return `Expires ${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`;
      }
    }

    if (paymentMethod.type === "mobile_money" && paymentMethod.phoneNumber) {
      return paymentMethod.phoneNumber;
    }

    if (
      (paymentMethod.type === "apple_pay" ||
        paymentMethod.type === "google_pay" ||
        paymentMethod.type === "samsung_pay") &&
      paymentMethod.deviceName
    ) {
      return paymentMethod.deviceName;
    }

    return null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected
            ? theme.colors.primaryContainer
            : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
        },
      ]}
      onPress={onSelect}
      disabled={!onSelect}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={getPaymentIcon()}
            size={24}
            color={isSelected ? theme.colors.primary : theme.colors.onSurface}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.methodName,
                {
                  color: isSelected
                    ? theme.colors.primary
                    : theme.colors.onSurface,
                },
              ]}
            >
              {getPaymentDisplayName()}
            </Text>
            {paymentMethod.isDefault && (
              <View
                style={[
                  styles.defaultBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.defaultText,
                    { color: theme.colors.onPrimary },
                  ]}
                >
                  Default
                </Text>
              </View>
            )}
          </View>

          {getSecondaryInfo() && (
            <Text
              style={[
                styles.secondaryText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {getSecondaryInfo()}
            </Text>
          )}
        </View>
      </View>

      {showActions && (isSelected || onDelete || onSetDefault || onEdit) && (
        <View style={styles.actionsContainer}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onEdit}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}

          {!paymentMethod.isDefault && onSetDefault && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSetDefault}
            >
              <MaterialIcons
                name="star-outline"
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodName: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "500",
  },
  secondaryText: {
    fontSize: 14,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});
