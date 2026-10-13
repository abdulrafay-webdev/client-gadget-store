"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Get in Touch</h1>
        <p className="text-sm text-[#A1A1A1] max-w-lg mx-auto">
          Need help with your gadget choice, warranty claim, or order status? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#111111] border border-[#222222] space-y-4">
            <h3 className="text-base font-bold text-white border-b border-[#222222] pb-3">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#A1A1A1]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Physical Store</strong>
                  <span>Shop #4, Gadget Plaza, Hall Road, Lahore, Punjab, Pakistan</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Phone Support</strong>
                  <a href="tel:+923121080916" className="hover:text-white transition">
                    0312-1080916
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email Inquiries</strong>
                  <a href="mailto:hamzagadgetstore@gmail.com" className="hover:text-white transition">
                    hamzagadgetstore@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Operational Hours</strong>
                  <span>Monday – Saturday: 11:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-2.5">
              <a
                href="https://wa.me/923121080916"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb9HelgCnA7miThMdt16"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-outline w-full py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <span>Join Official WhatsApp Channel</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-[#222222]">
              <span className="text-xs font-bold text-[#D4AF37] block mb-2 uppercase tracking-wider">
                Official Social Profiles
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://www.facebook.com/share/1Egkytf2Gd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition flex items-center gap-1.5"
                >
                  <span>Facebook Page</span>
                </a>
                <a
                  href="https://www.instagram.com/hamzagadgetstore?dlrf=MXYwdTJsazJ1OTg3YQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@hamzagadget.store?_r=1&_t=ZS-9AUywpQ8HEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition flex items-center gap-1.5"
                >
                  <span>TikTok</span>
                </a>
                <a
                  href="https://youtube.com/@hamzagadgetstore-78?si=Nfl_Vl4erm3TsHGh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition flex items-center gap-1.5"
                >
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-[#222222]">
            <h3 className="text-base font-bold text-white border-b border-[#222222] pb-3 mb-6">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#161616] rounded-xl border border-emerald-900/60">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message Received!</h4>
                <p className="text-xs text-[#A1A1A1]">
                  Thank you for reaching out. A representative from Hamza Gadget Store will contact you within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-gold-outline text-xs py-2 px-4 mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] mb-1.5">
                    Your Message / Inquiry
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need help with..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-gold py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
