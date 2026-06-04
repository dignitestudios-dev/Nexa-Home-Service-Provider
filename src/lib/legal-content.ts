export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: "Terms & Conditions",
  lastUpdated: "May 20, 2026",
  intro:
    "These Terms and Conditions govern your use of the NexaHome service provider platform. By creating an account or using our services, you agree to the terms outlined below.",
  sections: [
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
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "May 20, 2026",
  intro:
    "This Privacy Policy explains how NexaHome collects, uses, and protects personal information when you use our service provider application.",
  sections: [
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
  ],
};
