import SettingsLegalPage from "../_components/settings-legal-page";

export default function RefundPolicyPage() {
  return (
    <SettingsLegalPage
      title="Refund Policy"
      lastUpdated="May 20, 2026"
      intro="This Refund Policy describes when credits, subscription charges, or promotional purchases made through NexaHome may be eligible for a refund or account credit."
      sections={[
        {
          heading: "1. Subscription and Plan Fees",
          paragraphs: [
            "Subscription fees for service plans, Trusted Expert Badges, or ad promotions are generally non-refundable once the billing period has started.",
            "If you were charged in error or experienced a duplicate transaction, contact support within 7 days for review.",
          ],
        },
        {
          heading: "2. Job Credits and Promotions",
          paragraphs: [
            "Unused job credits may be eligible for a partial credit at NexaHome’s discretion if no leads were delivered during the purchased period.",
            "Promotional discounts or bonus credits cannot be exchanged for cash and expire on the date shown in your account.",
          ],
        },
        {
          heading: "3. Cancelled or Disputed Bookings",
          paragraphs: [
            "If a customer cancels before service begins according to platform rules, any related platform fees may be adjusted automatically.",
            "Disputes involving completed work should be reported through the app within 48 hours with supporting photos or notes.",
          ],
        },
        {
          heading: "4. Refund Request Process",
          paragraphs: [
            "To request a refund, open Report an Issue in account settings or email billing@nexahomeapp.com with your account email, transaction date, and reason.",
            "Approved refunds are returned to the original payment method within 5–10 business days depending on your bank or card issuer.",
          ],
        },
        {
          heading: "5. Non-Refundable Items",
          paragraphs: [
            "Fees for completed identity verification, processed background checks, and one-time profile setup services are not refundable.",
            "Chargebacks filed without first contacting NexaHome support may result in temporary account suspension pending investigation.",
          ],
        },
        {
          heading: "6. Policy Updates",
          paragraphs: [
            "NexaHome may update this Refund Policy at any time. The version displayed in your account settings is the version that applies to your purchases.",
            "For billing questions, reach our team at billing@nexahomeapp.com.",
          ],
        },
      ]}
    />
  );
}
