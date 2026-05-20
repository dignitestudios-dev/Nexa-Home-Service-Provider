import SettingsLegalPage from "../_components/settings-legal-page";

export default function PrivacyPolicyPage() {
  return (
    <SettingsLegalPage
      title="Privacy Policy"
      lastUpdated="May 20, 2026"
      intro="This Privacy Policy explains how NexaHome collects, uses, and protects personal information when you use our service provider application."
      sections={[
        {
          heading: "1. Information We Collect",
          paragraphs: [
            "We collect information you provide directly, such as your name, email address, phone number, business profile, documents, portfolio media, and payment-related details.",
            "We also collect technical data including device identifiers, IP address, app usage logs, and cookies used to keep you signed in and improve performance.",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          paragraphs: [
            "Your information is used to operate your account, verify identity, process bookings, send notifications, and provide customer support.",
            "We may use aggregated or anonymized data to analyze trends, improve features, and maintain platform security.",
          ],
        },
        {
          heading: "3. Sharing of Information",
          paragraphs: [
            "We share necessary profile details with customers when you accept jobs or appear in search results within your service area.",
            "We may share data with trusted service providers such as payment processors, cloud hosting partners, and analytics vendors under contractual safeguards.",
          ],
        },
        {
          heading: "4. Data Retention and Security",
          paragraphs: [
            "We retain your information for as long as your account is active or as needed to meet legal, tax, and operational requirements.",
            "We implement administrative, technical, and organizational measures designed to protect your data against unauthorized access or disclosure.",
          ],
        },
        {
          heading: "5. Your Rights and Choices",
          paragraphs: [
            "You may update profile information in account settings, manage notification preferences, or request account deletion subject to applicable law.",
            "Depending on your location, you may have rights to access, correct, or delete personal data by contacting privacy@nexahomeapp.com.",
          ],
        },
        {
          heading: "6. Updates to This Policy",
          paragraphs: [
            "We may revise this Privacy Policy periodically. Material changes will be communicated through the app or by email where appropriate.",
            "Your continued use of NexaHome after an update means you accept the revised policy.",
          ],
        },
      ]}
    />
  );
}
