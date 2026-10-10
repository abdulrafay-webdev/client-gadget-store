import React from "react";
import { Lock, Shield, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Data & Trust
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-sm text-[#A1A1A1]">
          How Hamza Gadget Store safeguards your personal information and transaction details.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-[#111111] border border-[#222222] space-y-6 text-xs sm:text-sm text-[#A1A1A1] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            When you place a guest order at Hamza Gadget Store, we collect information necessary to fulfill your shipment: your full name, telephone number (for courier coordination), delivery address, and optional email address.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Use of Information</h2>
          <p>
            Your information is exclusively used to process your gadget order, generate shipping airway bills with courier services, provide order tracking updates, and deliver customer support. We never sell, rent, or trade your personal data with third-party advertising companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Security</h2>
          <p>
            All data transmitted through our online platform is encrypted using industry-standard SSL encryption. Your cart contents are stored locally on your device via secure browser storage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Inquiries & Contact</h2>
          <p>
            If you have questions regarding your data or wish to request data erasure, please contact our support team at <strong className="text-white">support@hamzagadgets.pk</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
