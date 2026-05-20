import SettingsLegalPage from "../_components/settings-legal-page";

export default function TermsAndConditionsPage() {
  return (
    <SettingsLegalPage
      title="Terms and Conditions"
      lastUpdated="May 20, 2026"
      intro="These Terms and Conditions govern your use of the NexaHome service provider platform. By creating an account or using our services, you agree to the terms outlined below."
      sections={[
        {
          heading: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing or using NexaHome, you confirm that you are at least 18 years old and have the authority to enter into this agreement on behalf of yourself or your business.",
            "If you do not agree with these terms, you must discontinue use of the platform immediately.",
          ],
        },
        {
          heading: "2. Service Provider Account",
          paragraphs: [
            "You are responsible for maintaining accurate profile information, including business details, service areas, pricing, and contact information.",
            "You must keep your login credentials secure and notify us promptly of any unauthorized access to your account.",
          ],
        },
        {
          heading: "3. Bookings and Payments",
          paragraphs: [
            "All job requests accepted through NexaHome are subject to platform policies, customer agreements, and applicable local laws.",
            "NexaHome may charge platform fees, subscription fees, or promotional credits as described in your service plan.",
          ],
        },
        {
          heading: "4. Conduct and Compliance",
          paragraphs: [
            "You agree not to engage in fraudulent activity, harassment, discrimination, or any behavior that harms customers, partners, or the NexaHome community.",
            "You must comply with licensing, insurance, and safety requirements required for the services you offer.",
          ],
        },
        {
          heading: "5. Limitation of Liability",
          paragraphs: [
            "NexaHome provides the platform on an “as is” basis. We are not liable for indirect, incidental, or consequential damages arising from your use of the service.",
            "Our total liability for any claim related to the platform shall not exceed the fees paid by you to NexaHome in the twelve months preceding the claim.",
          ],
        },
        {
          heading: "6. Changes to These Terms",
          paragraphs: [
            "We may update these Terms and Conditions from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
            "For questions about these terms, contact support at support@nexahomeapp.com.",
          ],
        },
      ]}
    />
  );
}
