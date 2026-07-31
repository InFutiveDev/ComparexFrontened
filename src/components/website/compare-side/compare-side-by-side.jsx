"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { HiStar } from "react-icons/hi2";
import { readCompareSideSnapshot } from "@/lib/compare-side-href";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";
import { firmModePricing, pgFirms } from "@/lib/pg-catalog";
import { pgNameToSlug } from "@/lib/pg-slug";

const MAX_COMPARE_PG = 3;

const DEFAULT_MOCK_SLUGS = ["phonepe-pg", "payu-pg", "paytm-pg"];

const COMPANY_INFO_BY_NAME = {
  Razorpay: {
    brandName: "Razorpay",
    websiteUrl: "https://razorpay.com",
    headquartersCountry: "India",
    headquartersCity: "Bangalore",
    yearEstablished: 2014,
    merchantBaseCount: 1000000,
    countriesSupported: ["India", "United States", "Singapore"],
    rbiPapgStatus: "Compliant",
    pciDssStatus: "Level 1",
    companyOverview:
      "Razorpay is one of India's most widely adopted payment gateways, known for developer-friendly APIs and fast onboarding.",
    suggestNewTags: "Low Failure Rate, Sandbox Ready",
  },
  Cashfree: {
    brandName: "Cashfree",
    websiteUrl: "https://www.cashfree.com",
    headquartersCountry: "India",
    headquartersCity: "Bangalore",
    yearEstablished: 2015,
    merchantBaseCount: 600000,
    countriesSupported: ["India", "United Arab Emirates"],
    rbiPapgStatus: "Compliant",
    pciDssStatus: "Level 1",
    companyOverview:
      "Cashfree is a strong fit for businesses prioritising instant settlements, payout automation, and competitive MDR.",
    suggestNewTags: "Marketplace Friendly, API First",
  },
  "PhonePe PG": {
    brandName: "PhonePe",
    websiteUrl: "https://www.phonepe.com",
    headquartersCountry: "India",
    headquartersCity: "Bangalore",
    yearEstablished: 2016,
    merchantBaseCount: 850000,
    countriesSupported: ["India"],
    rbiPapgStatus: "Compliant",
    pciDssStatus: "Level 1",
    companyOverview:
      "PhonePe PG offers deep UPI coverage, fast checkout experiences, and enterprise-grade reliability for high-volume merchants.",
    suggestNewTags: "UPI Focused, Secure Checkout",
  },
  "PayU PG": {
    brandName: "PayU",
    websiteUrl: "https://payu.in",
    headquartersCountry: "India",
    headquartersCity: "Mumbai",
    yearEstablished: 2011,
    merchantBaseCount: 500000,
    countriesSupported: ["India", "United States", "United Kingdom"],
    rbiPapgStatus: "Compliant",
    pciDssStatus: "Level 1",
    companyOverview:
      "PayU PG is suited for mid-market and enterprise merchants looking for broad payment method coverage and scalable checkout flows.",
    suggestNewTags: "Enterprise Ready, Scaling Businesses",
  },
  "Paytm PG": {
    brandName: "Paytm",
    websiteUrl: "https://business.paytm.com",
    headquartersCountry: "India",
    headquartersCity: "Noida",
    yearEstablished: 2010,
    merchantBaseCount: 750000,
    countriesSupported: ["India"],
    rbiPapgStatus: "Compliant",
    pciDssStatus: "Level 1",
    companyOverview:
      "Paytm PG combines wallet-led checkout strength with competitive pricing for UPI, cards, and QR-led collections.",
    suggestNewTags: "SME Friendly, Popular Choice",
  },
  "GPay PG": {
    brandName: "Google Pay",
    websiteUrl: "https://pay.google.com",
    headquartersCountry: "India",
    headquartersCity: "Bangalore",
    yearEstablished: 2017,
    merchantBaseCount: 400000,
    countriesSupported: ["India", "United States", "Japan"],
    rbiPapgStatus: "In-Progress",
    pciDssStatus: "Level 2",
    companyOverview:
      "GPay PG is ideal for businesses that want frictionless UPI-first checkout and strong consumer trust.",
    suggestNewTags: "Mobile App Friendly, Cross Border Payments",
  },
};

function formatMerchantCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M+`;
  if (value >= 1000) return `${Math.round(value / 1000)}K+`;
  return String(value);
}

function formatCountriesList(countries) {
  if (!Array.isArray(countries) || !countries.length) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {countries.map((country) => (
        <span
          key={country}
          className="inline-flex items-center rounded-full border border-[#2D4CC8] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#13203F]"
        >
          {country}
        </span>
      ))}
    </div>
  );
}

function formatHeadquarters(firm) {
  const city = firm.headquartersCity?.trim();
  const country = firm.headquartersCountry?.trim();

  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return firm.location || "—";
}

function withCompanyInfo(firm) {
  const defaults = COMPANY_INFO_BY_NAME[firm.name] || {};
  const brandName =
    firm.brandName || defaults.brandName || firm.name.replace(/\s+PG$/i, "");

  return withOperationalDetails(
    withCommercialPricing({
      ...firm,
      brandName,
      websiteUrl: firm.websiteUrl || firm.website || defaults.websiteUrl || "",
      headquartersCountry:
        firm.headquartersCountry || defaults.headquartersCountry || "India",
      headquartersCity:
        firm.headquartersCity || defaults.headquartersCity || firm.location || "",
      companyLogoUrl: firm.companyLogoUrl || firm.logoUrl || null,
      yearEstablished:
        firm.yearEstablished || defaults.yearEstablished || null,
      merchantBaseCount:
        firm.merchantBaseCount ?? defaults.merchantBaseCount ?? null,
      countriesSupported:
        firm.countriesSupported?.length
          ? firm.countriesSupported
          : defaults.countriesSupported || [],
      rbiPapgStatus:
        firm.rbiPapgStatus || defaults.rbiPapgStatus || "—",
      pciDssStatus: firm.pciDssStatus || defaults.pciDssStatus || "—",
      companyOverview:
        firm.companyOverview || defaults.companyOverview || firm.overview || "—",
      suggestNewTags:
        firm.suggestNewTags || defaults.suggestNewTags || "—",
    }),
  );
}

const COMMERCIAL_EXTRAS_BY_NAME = {
  Razorpay: {
    emiBnplCharges: "2.5%",
    refundFeePolicy: "₹0",
    chargebackFee: "₹25",
    amcPlatformFees: "₹0/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.25%",
    offersPromotions: "Zero Setup (RAZFREE)",
    hardwareCost: "—",
    annualMaintenanceContract: "—",
    monthlyRental: "—",
    forexMarkup: "2.5%",
    settlementCurrency: "USD, EUR, GBP",
    settlementInfrastructure: "Partner Bank Network",
    multiCurrencyWallet: "Yes",
    perTransactionFee: "₹2",
    monthlyRetainer: "₹5,000",
  },
  Cashfree: {
    emiBnplCharges: "2.3%",
    refundFeePolicy: "₹0",
    chargebackFee: "₹30",
    amcPlatformFees: "₹0/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.2%",
    offersPromotions: "Startup Offer (CFSTART)",
    hardwareCost: "—",
    annualMaintenanceContract: "—",
    monthlyRental: "—",
    forexMarkup: "2.8%",
    settlementCurrency: "USD, SGD",
    settlementInfrastructure: "Correspondent Banking",
    multiCurrencyWallet: "Yes",
    perTransactionFee: "₹1.5",
    monthlyRetainer: "—",
  },
  "PhonePe PG": {
    emiBnplCharges: "2.2%",
    refundFeePolicy: "₹0",
    chargebackFee: "₹35",
    amcPlatformFees: "₹499/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.3%",
    offersPromotions: "Special Pricing (PPDEAL)",
    hardwareCost: "—",
    annualMaintenanceContract: "—",
    monthlyRental: "—",
    forexMarkup: "—",
    settlementCurrency: "—",
    settlementInfrastructure: "—",
    multiCurrencyWallet: "No",
    perTransactionFee: "—",
    monthlyRetainer: "—",
  },
  "PayU PG": {
    emiBnplCharges: "2.4%",
    refundFeePolicy: "₹5",
    chargebackFee: "₹40",
    amcPlatformFees: "₹0/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.35%",
    offersPromotions: "Special Pricing (PPDEAL)",
    hardwareCost: "—",
    annualMaintenanceContract: "—",
    monthlyRental: "—",
    forexMarkup: "3.0%",
    settlementCurrency: "USD, EUR, AED",
    settlementInfrastructure: "Local Collection Accounts",
    multiCurrencyWallet: "Yes",
    perTransactionFee: "₹2.5",
    monthlyRetainer: "₹8,000",
  },
  "Paytm PG": {
    emiBnplCharges: "2.1%",
    refundFeePolicy: "₹0",
    chargebackFee: "₹30",
    amcPlatformFees: "₹999/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.2%",
    offersPromotions: "Special Pricing (PPDEAL)",
    hardwareCost: "₹2,999",
    annualMaintenanceContract: "₹1,200",
    monthlyRental: "₹299/month",
    forexMarkup: "—",
    settlementCurrency: "—",
    settlementInfrastructure: "—",
    multiCurrencyWallet: "No",
    perTransactionFee: "—",
    monthlyRetainer: "—",
  },
  "GPay PG": {
    emiBnplCharges: "2.3%",
    refundFeePolicy: "₹0",
    chargebackFee: "₹25",
    amcPlatformFees: "₹0/month",
    setupFees: "₹0",
    instantSettlementCharges: "0.25%",
    offersPromotions: "Special Pricing (PPDEAL)",
    hardwareCost: "—",
    annualMaintenanceContract: "—",
    monthlyRental: "—",
    forexMarkup: "2.9%",
    settlementCurrency: "USD, JPY",
    settlementInfrastructure: "Nostro",
    multiCurrencyWallet: "Yes",
    perTransactionFee: "₹2",
    monthlyRetainer: "—",
  },
};

function withCommercialPricing(firm) {
  const modes =
    firm.modePricing || firmModePricing[firm.name] || {};
  const extras = COMMERCIAL_EXTRAS_BY_NAME[firm.name] || {};
  const offerText =
    firm.offer?.headline && firm.offer?.code
      ? `${firm.offer.headline} (${firm.offer.code})`
      : firm.offer?.headline || "";

  return {
    ...firm,
    upiMdr: firm.upiMdr || modes["UPI Payments"] || "—",
    creditCardMdr: firm.creditCardMdr || modes["Credit Card"] || "—",
    debitCardMdr: firm.debitCardMdr || modes["Debit Card"] || "—",
    internationalMdr: firm.internationalMdr || modes.International || "—",
    walletCharges: firm.walletCharges || modes["Wallet Payments"] || "—",
    netBankingCharges:
      firm.netBankingCharges || modes["Net Banking"] || "—",
    emiBnplCharges:
      firm.emiBnplCharges || extras.emiBnplCharges || "—",
    refundFeePolicy:
      firm.refundFeePolicy || extras.refundFeePolicy || "₹0",
    chargebackFee:
      firm.chargebackFee || extras.chargebackFee || "—",
    amcPlatformFees:
      firm.amcPlatformFees || extras.amcPlatformFees || "—",
    setupFees: firm.setupFees || extras.setupFees || "₹0",
    instantSettlementCharges:
      firm.instantSettlementCharges || extras.instantSettlementCharges || "—",
    offersPromotions:
      firm.offersPromotions ||
      extras.offersPromotions ||
      offerText ||
      "—",
    hardwareCost: firm.hardwareCost || extras.hardwareCost || "—",
    annualMaintenanceContract:
      firm.annualMaintenanceContract ||
      extras.annualMaintenanceContract ||
      "—",
    monthlyRental: firm.monthlyRental || extras.monthlyRental || "—",
    forexMarkup: firm.forexMarkup || extras.forexMarkup || "—",
    settlementCurrency:
      firm.settlementCurrency || extras.settlementCurrency || "—",
    settlementInfrastructure:
      firm.settlementInfrastructure || extras.settlementInfrastructure || "—",
    multiCurrencyWallet:
      firm.multiCurrencyWallet || extras.multiCurrencyWallet || "—",
    perTransactionFee:
      firm.perTransactionFee || extras.perTransactionFee || "—",
    monthlyRetainer: firm.monthlyRetainer || extras.monthlyRetainer || "—",
  };
}

const OPERATIONAL_EXTRAS_BY_NAME = {
  Razorpay: {
    onboardingTat: "1-2 Days",
    settlementCycle: "T+2",
    refundSla: "24 Hrs",
    approvalComplexity: "Low",
    dedicatedAccountManager: "Yes",
    merchantSupportAvailability: "24/7",
    escalationSupport: "Yes",
    instantSettlementAvailability: "Yes",
    internationalPaymentsSupport: "Yes",
    offlineModeSupport: "No",
    gstBillingSupport: "No",
    frmResponseTime: "—",
    restrictedCategories: ["Gambling", "Crypto"],
    bestSuitedBusinessTypes: ["Startup", "D2C", "SaaS"],
    sortByCategories: ["Full PG Stack", "One Click Checkout", "Orchestration"],
    featureAdvancedPayments: ["International", "Recurring", "Subscription", "Tokenization", "Smart Routing", "EMI", "BNPL"],
    featureBusinessSolutions: ["Payment Links", "Virtual Accounts", "Vendor Payouts", "Bulk Payouts", "Marketplace"],
    featureOfflinePos: [],
    featureRiskVerification: ["KYC Verification", "Fraud Detection", "Chargeback Management"],
    featureCrossBorder: [],
    featureOneClick: ["Guest Checkout", "Saved Cards", "UPI One-Click", "Checkout Customisation"],
    suggestNewFeature: "Advanced Subscription Billing",
    apiDocumentationUrl: "https://razorpay.com/docs",
    sdkAvailability: ["Python", "PHP", "Node.js", "Java", ".NET", "Ruby"],
    pluginAvailability: ["Shopify", "WooCommerce", "Magento", "BigCommerce"],
    sandboxAccess: "Yes",
    webhookSupport: "Yes",
    mobileSdkSupport: ["iOS", "Android", "React Native", "Flutter"],
  },
  Cashfree: {
    onboardingTat: "Instant",
    settlementCycle: "T+0",
    refundSla: "2-4 Hrs",
    approvalComplexity: "Low",
    dedicatedAccountManager: "Yes",
    merchantSupportAvailability: "24/7",
    escalationSupport: "Yes",
    instantSettlementAvailability: "Yes",
    internationalPaymentsSupport: "Yes",
    offlineModeSupport: "No",
    gstBillingSupport: "No",
    frmResponseTime: "—",
    restrictedCategories: ["Gambling", "Crypto", "Adult"],
    bestSuitedBusinessTypes: ["Marketplace", "Startup", "Enterprise"],
    sortByCategories: ["Full PG Stack", "Cross Border", "Orchestration"],
    featureAdvancedPayments: ["International", "Smart Routing", "Dynamic Routing", "EMI", "BNPL"],
    featureBusinessSolutions: ["Payment Links", "Split Settlements", "Vendor Payouts", "Bulk Payouts"],
    featureOfflinePos: [],
    featureRiskVerification: ["KYC Verification", "Fraud Detection", "Risk Engine"],
    featureCrossBorder: ["FX Management", "Multi-Currency", "Cross-Border Settlements"],
    featureOneClick: ["Saved Cards", "UPI One-Click"],
    suggestNewFeature: "Real-time Payout Analytics",
    apiDocumentationUrl: "https://docs.cashfree.com",
    sdkAvailability: ["Python", "PHP", "Node.js", "Java"],
    pluginAvailability: ["Shopify", "WooCommerce", "Magento"],
    sandboxAccess: "Yes",
    webhookSupport: "Yes",
    mobileSdkSupport: ["iOS", "Android", "Flutter"],
  },
  "PhonePe PG": {
    onboardingTat: "1-2 Days",
    settlementCycle: "T+0",
    refundSla: "Instant",
    approvalComplexity: "Medium",
    dedicatedAccountManager: "Yes",
    merchantSupportAvailability: "Business Hours",
    escalationSupport: "Yes",
    instantSettlementAvailability: "Yes",
    internationalPaymentsSupport: "No",
    offlineModeSupport: "Yes",
    gstBillingSupport: "Yes",
    frmResponseTime: "<100ms",
    restrictedCategories: ["Gambling", "Crypto"],
    bestSuitedBusinessTypes: ["Enterprise", "Retail", "D2C"],
    sortByCategories: ["Full PG Stack", "UPI Only", "POS"],
    featureAdvancedPayments: ["Recurring", "Tokenization", "Smart Routing", "EMI"],
    featureBusinessSolutions: ["Payment Links", "Payment Forms", "QR Payments"],
    featureOfflinePos: ["Soft POS", "Android POS", "Soundbox", "QR Solutions"],
    featureRiskVerification: ["KYC Verification", "Fraud Detection", "Chargeback Management"],
    featureCrossBorder: [],
    featureOneClick: ["Saved Cards", "UPI One-Click", "Checkout Customisation"],
    suggestNewFeature: "UPI Credit Line Support",
    apiDocumentationUrl: "https://developer.phonepe.com",
    sdkAvailability: ["Python", "PHP", "Node.js", "Java"],
    pluginAvailability: ["Shopify", "WooCommerce", "Magento"],
    sandboxAccess: "Yes",
    webhookSupport: "Yes",
    mobileSdkSupport: ["iOS", "Android", "React Native"],
  },
  "PayU PG": {
    onboardingTat: "1-2 Days",
    settlementCycle: "T+0",
    refundSla: "24 Hrs",
    approvalComplexity: "Medium",
    dedicatedAccountManager: "Yes",
    merchantSupportAvailability: "24/7",
    escalationSupport: "Yes",
    instantSettlementAvailability: "Yes",
    internationalPaymentsSupport: "Yes",
    offlineModeSupport: "No",
    gstBillingSupport: "Yes",
    frmResponseTime: "<500ms",
    restrictedCategories: ["Gambling", "Crypto", "Firearms"],
    bestSuitedBusinessTypes: ["Enterprise", "Mid-Market", "B2B"],
    sortByCategories: ["Full PG Stack", "Cross Border", "Fraud & Risk (FRM)"],
    featureAdvancedPayments: ["International", "Recurring", "Tokenization", "Smart Routing", "Dynamic Routing", "EMI", "BNPL"],
    featureBusinessSolutions: ["Payment Links", "Split Settlements", "Vendor Payouts", "Bulk Payouts", "Escrow"],
    featureOfflinePos: [],
    featureRiskVerification: ["KYC Verification", "Fraud Detection", "Risk Engine", "Chargeback Management"],
    featureCrossBorder: ["FX Management", "Multi-Currency", "Cross-Border Settlements"],
    featureOneClick: ["Guest Checkout", "Saved Cards", "UPI One-Click", "Funnel Analytics"],
    suggestNewFeature: "AI-based Fraud Scoring",
    apiDocumentationUrl: "https://docs.payu.in",
    sdkAvailability: ["Python", "PHP", "Node.js", "Java", ".NET"],
    pluginAvailability: ["Shopify", "WooCommerce", "Magento", "PrestaShop"],
    sandboxAccess: "Yes",
    webhookSupport: "Yes",
    mobileSdkSupport: ["iOS", "Android", "React Native", "Flutter"],
  },
  "Paytm PG": {
    onboardingTat: "1-2 Days",
    settlementCycle: "T+0",
    refundSla: "2-4 Hrs",
    approvalComplexity: "Low",
    dedicatedAccountManager: "No",
    merchantSupportAvailability: "Business Hours",
    escalationSupport: "Yes",
    instantSettlementAvailability: "Yes",
    internationalPaymentsSupport: "No",
    offlineModeSupport: "Yes",
    gstBillingSupport: "Yes",
    frmResponseTime: "<500ms",
    restrictedCategories: ["Gambling", "Crypto"],
    bestSuitedBusinessTypes: ["Retail", "Kirana", "SMB"],
    sortByCategories: ["Full PG Stack", "UPI Only", "POS"],
    featureAdvancedPayments: ["Recurring", "Tokenization", "EMI", "BNPL"],
    featureBusinessSolutions: ["Payment Links", "QR Payments"],
    featureOfflinePos: ["Soft POS", "Android POS", "Soundbox", "QR Solutions"],
    featureRiskVerification: ["KYC Verification", "Fraud Detection"],
    featureCrossBorder: [],
    featureOneClick: ["Saved Cards", "UPI One-Click"],
    suggestNewFeature: "GST-integrated Invoicing",
    apiDocumentationUrl: "https://business.paytm.com/docs",
    sdkAvailability: ["Python", "PHP", "Node.js", "Java"],
    pluginAvailability: ["Shopify", "WooCommerce", "Magento"],
    sandboxAccess: "Yes",
    webhookSupport: "Yes",
    mobileSdkSupport: ["iOS", "Android"],
  },
  "GPay PG": {
    onboardingTat: "3-5 Days",
    settlementCycle: "T+1",
    refundSla: "24 Hrs",
    approvalComplexity: "High",
    dedicatedAccountManager: "No",
    merchantSupportAvailability: "Custom",
    escalationSupport: "No",
    instantSettlementAvailability: "No",
    internationalPaymentsSupport: "Yes",
    offlineModeSupport: "No",
    gstBillingSupport: "No",
    frmResponseTime: "<1s",
    restrictedCategories: ["Gambling", "Crypto", "Adult", "Firearms"],
    bestSuitedBusinessTypes: ["Enterprise", "UPI-First"],
    sortByCategories: ["UPI Only", "Cross Border", "New PGs"],
    featureAdvancedPayments: ["International", "Tokenization", "Smart Routing"],
    featureBusinessSolutions: ["Payment Links"],
    featureOfflinePos: [],
    featureRiskVerification: ["Fraud Detection", "Identity Verification"],
    featureCrossBorder: ["FX Management", "Multi-Currency"],
    featureOneClick: ["UPI One-Click"],
    suggestNewFeature: "Google Pay Later Integration",
    apiDocumentationUrl: "https://developers.google.com/pay",
    sdkAvailability: ["Python", "Node.js", "Java"],
    pluginAvailability: ["Shopify", "WooCommerce"],
    sandboxAccess: "Yes",
    webhookSupport: "No",
    mobileSdkSupport: ["iOS", "Android", "Flutter"],
  },
};

const MERCHANT_EXPERIENCE_BY_NAME = {
  Razorpay: {
    comparexMatchScore: "9.2",
    merchantSuccessStories: "https://razorpay.com/customers",
    caseStudies: "https://razorpay.com/case-studies",
  },
  Cashfree: {
    comparexMatchScore: "9.0",
    merchantSuccessStories: "https://www.cashfree.com/customers",
    caseStudies: "https://www.cashfree.com/case-studies",
  },
  "PhonePe PG": {
    comparexMatchScore: "9.5",
    merchantSuccessStories: "https://www.phonepe.com/business/success-stories",
    caseStudies: "https://www.phonepe.com/business/case-studies",
  },
  "PayU PG": {
    comparexMatchScore: "9.5",
    merchantSuccessStories: "https://payu.in/success-stories",
    caseStudies: "https://payu.in/case-studies",
  },
  "Paytm PG": {
    comparexMatchScore: "9.3",
    merchantSuccessStories: "https://business.paytm.com/success-stories",
    caseStudies: "https://business.paytm.com/case-studies",
  },
  "GPay PG": {
    comparexMatchScore: "9.1",
    merchantSuccessStories: "https://developers.google.com/pay/success-stories",
    caseStudies: "https://developers.google.com/pay/case-studies",
  },
};

const TALK_TO_EXPERT_BY_NAME = {
  Razorpay: {
    talkToExpertEnabled: "Yes",
    expertName: "Arjun Mehta",
    expertDesignation: "Senior Payment Consultant",
    expertEmail: "arjun.mehta@razorpay.com",
    expertMobile: "+91 98765 43210",
    expertDescription:
      "Helps startups and D2C brands choose the right payment stack and optimise MDR.",
    calendarSync: "Calendly",
    availabilitySlots: "Mon–Fri, 10:00 AM – 6:00 PM",
  },
  Cashfree: {
    talkToExpertEnabled: "Yes",
    expertName: "Priya Sharma",
    expertDesignation: "Enterprise Solutions Lead",
    expertEmail: "priya.sharma@cashfree.com",
    expertMobile: "+91 98765 43211",
    expertDescription:
      "Specialises in instant settlement, payouts, and marketplace payment routing.",
    calendarSync: "Calendly",
    availabilitySlots: "Mon–Sat, 9:00 AM – 7:00 PM",
  },
  "PhonePe PG": {
    talkToExpertEnabled: "Yes",
    expertName: "Rahul Verma",
    expertDesignation: "UPI & Enterprise Expert",
    expertEmail: "rahul.verma@phonepe.com",
    expertMobile: "+91 98765 43212",
    expertDescription:
      "Guides high-volume merchants on UPI checkout, QR, and enterprise integrations.",
    calendarSync: "Calendly",
    availabilitySlots: "Mon–Fri, 11:00 AM – 7:00 PM",
  },
  "PayU PG": {
    talkToExpertEnabled: "Yes",
    expertName: "Neha Kapoor",
    expertDesignation: "Mid-Market PG Specialist",
    expertEmail: "neha.kapoor@payu.in",
    expertMobile: "+91 98765 43213",
    expertDescription:
      "Advises on cross-border payments, FRM, and scalable checkout for growing brands.",
    calendarSync: "Calendly",
    availabilitySlots: "Mon–Fri, 10:00 AM – 8:00 PM",
  },
  "Paytm PG": {
    talkToExpertEnabled: "Yes",
    expertName: "Vikram Singh",
    expertDesignation: "Retail & SMB Expert",
    expertEmail: "vikram.singh@paytm.com",
    expertMobile: "+91 98765 43214",
    expertDescription:
      "Supports retail and kirana merchants with POS, QR, and wallet-led collections.",
    calendarSync: "Calendly",
    availabilitySlots: "Mon–Sat, 10:00 AM – 6:00 PM",
  },
  "GPay PG": {
    talkToExpertEnabled: "No",
    expertName: "—",
    expertDesignation: "—",
    expertEmail: "—",
    expertMobile: "—",
    expertDescription: "—",
    calendarSync: "—",
    availabilitySlots: "—",
  },
};

const CRM_LEAD_BY_NAME = {
  Razorpay: {
    leadStatus: "Qualified",
    merchantAssignedTo: "CompareX Team A",
    lastFollowUpDate: "18 Jul 2026",
    expectedActivationDate: "05 Aug 2026",
    activationStatus: "Active",
    monthlyGmv: "₹2.5 Cr",
    commissionEligibility: "Yes",
  },
  Cashfree: {
    leadStatus: "Contacted",
    merchantAssignedTo: "CompareX Team B",
    lastFollowUpDate: "20 Jul 2026",
    expectedActivationDate: "10 Aug 2026",
    activationStatus: "Pending",
    monthlyGmv: "₹1.8 Cr",
    commissionEligibility: "Yes",
  },
  "PhonePe PG": {
    leadStatus: "Qualified",
    merchantAssignedTo: "CompareX Team A",
    lastFollowUpDate: "22 Jul 2026",
    expectedActivationDate: "01 Aug 2026",
    activationStatus: "Active",
    monthlyGmv: "₹3.2 Cr",
    commissionEligibility: "Yes",
  },
  "PayU PG": {
    leadStatus: "New",
    merchantAssignedTo: "CompareX Team C",
    lastFollowUpDate: "25 Jul 2026",
    expectedActivationDate: "12 Aug 2026",
    activationStatus: "Pending",
    monthlyGmv: "₹2.1 Cr",
    commissionEligibility: "Yes",
  },
  "Paytm PG": {
    leadStatus: "Contacted",
    merchantAssignedTo: "CompareX Team B",
    lastFollowUpDate: "24 Jul 2026",
    expectedActivationDate: "08 Aug 2026",
    activationStatus: "Active",
    monthlyGmv: "₹1.5 Cr",
    commissionEligibility: "No",
  },
  "GPay PG": {
    leadStatus: "Lost",
    merchantAssignedTo: "CompareX Team D",
    lastFollowUpDate: "10 Jul 2026",
    expectedActivationDate: "—",
    activationStatus: "Inactive",
    monthlyGmv: "—",
    commissionEligibility: "No",
  },
};

function normalizeSettlementCycle(value) {
  if (!value) return "—";
  const normalized = String(value).trim().toLowerCase();
  if (normalized.includes("instant") || normalized === "t+0") return "T+0";
  if (normalized.includes("t+1")) return "T+1";
  if (normalized.includes("t+2")) return "T+2";
  if (normalized.includes("t+3")) return "T+3";
  if (normalized.includes("weekly")) return "Weekly";
  return value;
}

function normalizeOnboardingTat(value) {
  if (!value) return "—";
  const normalized = String(value).trim().toLowerCase();
  if (normalized.includes("instant") || normalized.includes("12 hour")) {
    return "Instant";
  }
  if (
    normalized.includes("18 hour") ||
    normalized.includes("24 hour") ||
    normalized.includes("1-2")
  ) {
    return "1-2 Days";
  }
  if (normalized.includes("3-5") || normalized.includes("72")) {
    return "3-5 Days";
  }
  if (normalized.includes("week")) return "1 Week+";
  return value;
}

function withOperationalDetails(firm) {
  const extras = OPERATIONAL_EXTRAS_BY_NAME[firm.name] || {};
  const experience = MERCHANT_EXPERIENCE_BY_NAME[firm.name] || {};
  const talkToExpert = TALK_TO_EXPERT_BY_NAME[firm.name] || {};
  const crmLead = CRM_LEAD_BY_NAME[firm.name] || {};

  return {
    ...firm,
    onboardingTat:
      firm.onboardingTat ||
      extras.onboardingTat ||
      normalizeOnboardingTat(firm.onboarding) ||
      "—",
    settlementCycle:
      firm.settlementCycle ||
      extras.settlementCycle ||
      normalizeSettlementCycle(firm.settlement) ||
      "—",
    refundSla: firm.refundSla || extras.refundSla || "—",
    approvalComplexity:
      firm.approvalComplexity || extras.approvalComplexity || "—",
    dedicatedAccountManager:
      firm.dedicatedAccountManager ??
      extras.dedicatedAccountManager ??
      "—",
    merchantSupportAvailability:
      firm.merchantSupportAvailability ||
      extras.merchantSupportAvailability ||
      "—",
    escalationSupport:
      firm.escalationSupport ?? extras.escalationSupport ?? "—",
    instantSettlementAvailability:
      firm.instantSettlementAvailability ??
      extras.instantSettlementAvailability ??
      "—",
    internationalPaymentsSupport:
      firm.internationalPaymentsSupport ??
      extras.internationalPaymentsSupport ??
      "—",
    offlineModeSupport:
      firm.offlineModeSupport ?? extras.offlineModeSupport ?? "—",
    gstBillingSupport:
      firm.gstBillingSupport ?? extras.gstBillingSupport ?? "—",
    frmResponseTime:
      firm.frmResponseTime || extras.frmResponseTime || "—",
    restrictedCategories:
      firm.restrictedCategories?.length
        ? firm.restrictedCategories
        : extras.restrictedCategories || [],
    bestSuitedBusinessTypes:
      firm.bestSuitedBusinessTypes?.length
        ? firm.bestSuitedBusinessTypes
        : extras.bestSuitedBusinessTypes || [],
    sortByCategories:
      firm.sortByCategories?.length
        ? firm.sortByCategories
        : extras.sortByCategories || [],
    featureCorePayments:
      firm.featureCorePayments?.length
        ? firm.featureCorePayments
        : extras.featureCorePayments || [
            "UPI Payments", "Credit Card", "Debit Card", "Net Banking", "Wallet", "QR Payments",
          ],
    featureAdvancedPayments:
      firm.featureAdvancedPayments?.length
        ? firm.featureAdvancedPayments
        : extras.featureAdvancedPayments || [],
    featureBusinessSolutions:
      firm.featureBusinessSolutions?.length
        ? firm.featureBusinessSolutions
        : extras.featureBusinessSolutions || [],
    featureOfflinePos:
      firm.featureOfflinePos?.length
        ? firm.featureOfflinePos
        : extras.featureOfflinePos || [],
    featureRiskVerification:
      firm.featureRiskVerification?.length
        ? firm.featureRiskVerification
        : extras.featureRiskVerification || [],
    featureDeveloperTechnical:
      firm.featureDeveloperTechnical?.length
        ? firm.featureDeveloperTechnical
        : extras.featureDeveloperTechnical || [
            "APIs", "SDKs", "Sandbox", "Webhooks",
          ],
    featureCrossBorder:
      firm.featureCrossBorder?.length
        ? firm.featureCrossBorder
        : extras.featureCrossBorder || [],
    featureOneClick:
      firm.featureOneClick?.length
        ? firm.featureOneClick
        : extras.featureOneClick || [],
    suggestNewFeature: firm.suggestNewFeature || extras.suggestNewFeature || "—",
    apiDocumentationUrl:
      firm.apiDocumentationUrl || extras.apiDocumentationUrl || "",
    sdkAvailability:
      firm.sdkAvailability?.length
        ? firm.sdkAvailability
        : extras.sdkAvailability || [],
    pluginAvailability:
      firm.pluginAvailability?.length
        ? firm.pluginAvailability
        : extras.pluginAvailability || [],
    sandboxAccess:
      firm.sandboxAccess ?? extras.sandboxAccess ?? "—",
    webhookSupport:
      firm.webhookSupport ?? extras.webhookSupport ?? "—",
    mobileSdkSupport:
      firm.mobileSdkSupport?.length
        ? firm.mobileSdkSupport
        : extras.mobileSdkSupport || [],
    merchantRating: firm.merchantRating || firm.review || "—",
    totalReviews:
      firm.totalReviews ?? firm.reviewCount ?? "—",
    comparexMatchScore:
      firm.comparexMatchScore ||
      experience.comparexMatchScore ||
      firm.trust ||
      "—",
    merchantSuccessStories:
      firm.merchantSuccessStories ||
      experience.merchantSuccessStories ||
      "—",
    caseStudies:
      firm.caseStudies || experience.caseStudies || "—",
    talkToExpertEnabled:
      firm.talkToExpertEnabled ??
      talkToExpert.talkToExpertEnabled ??
      "Yes",
    expertName: firm.expertName || talkToExpert.expertName || "—",
    expertDesignation:
      firm.expertDesignation || talkToExpert.expertDesignation || "—",
    expertEmail: firm.expertEmail || talkToExpert.expertEmail || "—",
    expertMobile: firm.expertMobile || talkToExpert.expertMobile || "—",
    expertDescription:
      firm.expertDescription || talkToExpert.expertDescription || "—",
    calendarSync: firm.calendarSync || talkToExpert.calendarSync || "—",
    availabilitySlots:
      firm.availabilitySlots || talkToExpert.availabilitySlots || "—",
    leadStatus: firm.leadStatus || crmLead.leadStatus || "—",
    merchantAssignedTo:
      firm.merchantAssignedTo || crmLead.merchantAssignedTo || "—",
    lastFollowUpDate:
      firm.lastFollowUpDate || crmLead.lastFollowUpDate || "—",
    expectedActivationDate:
      firm.expectedActivationDate || crmLead.expectedActivationDate || "—",
    activationStatus:
      firm.activationStatus || crmLead.activationStatus || "—",
    monthlyGmv: firm.monthlyGmv || crmLead.monthlyGmv || "—",
    commissionEligibility:
      firm.commissionEligibility ?? crmLead.commissionEligibility ?? "—",
  };
}

const MOCK_FIRMS = pgFirms.map((firm) =>
  withCompanyInfo({
    ...firm,
    slug: pgNameToSlug(firm.name),
    modePricing: firmModePricing[firm.name] || {},
    badge: firm.featured
      ? "Top Rated Here"
      : firm.bestForTags?.[0]?.replace(/^[^A-Za-z0-9]+/, "") || "Popular Choice",
  }),
);

function firmKey(firm) {
  return firm.slug || pgNameToSlug(firm.name);
}

function resolveFirmsBySlugs(slugs, sources) {
  const bySlug = new Map();
  for (const source of sources) {
    for (const firm of source) {
      const key = firmKey(firm);
      if (!bySlug.has(key)) bySlug.set(key, firm);
    }
  }
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
}

function parseSlugsParam(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, MAX_COMPARE_PG);
}

function StarRating({ score }) {
  const value = Number.parseFloat(score);
  if (!Number.isFinite(value)) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  const filled = Math.round(Math.min(5, Math.max(0, value)));

  return (
    <div className="flex items-center justify-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <HiStar
            key={index}
            className={`size-3.5 ${
              index < filled ? "text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-600">
        {value.toFixed(1)}/5
      </span>
    </div>
  );
}

function PgHeader({ firm }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {firm.logoUrl && !logoFailed ? (
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border-2 border-[#2D4CC8] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firm.logoUrl}
            alt=""
            className="max-h-full max-w-full object-contain p-1"
            onError={() => setLogoFailed(true)}
          />
        </div>
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#2D4CC8] bg-white text-sm font-bold text-[#13203F]">
          {firm.logo}
        </div>
      )}

      <Link
        href={firm.slug ? `/compare-pg/${firm.slug}` : "#"}
        className="text-base font-bold text-[#2D4CC8] transition-colors hover:text-[#2542b6]"
      >
        {firm.name}
      </Link>

      <StarRating score={firm.review} />

      {firm.badge ? (
        <span className="inline-flex max-w-[160px] items-center justify-center rounded-full border border-[#2D4CC8]/25 bg-[#2D4CC8]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2D4CC8]">
          {firm.badge}
        </span>
      ) : null}
    </div>
  );
}

function CompanyLogoCell({ firm }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (firm.companyLogoUrl && !logoFailed) {
    return (
      <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-[#2D4CC8] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={firm.companyLogoUrl}
          alt={`${firm.brandName || firm.name} logo`}
          className="max-h-full max-w-full object-contain p-1"
          onError={() => setLogoFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#2D4CC8] bg-white text-sm font-bold text-[#13203F]">
      {firm.logo}
    </div>
  );
}

function WebsiteLink({ url }) {
  if (!url) return <span className="text-sm text-slate-400">—</span>;

  const href = url.startsWith("http") ? url : `https://${url}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-semibold text-[#2D4CC8] underline-offset-2 hover:underline"
    >
      {url.replace(/^https?:\/\//, "")}
    </a>
  );
}

function TagList({ labels }) {
  if (!labels?.length) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex items-center rounded-full border border-[#2D4CC8] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#13203F]"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function PlatformIcons({ platforms = [], extra = 0 }) {
  if (!platforms.length && !extra) {
    return <span className="text-sm text-slate-400">—</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {platforms.map((platform, index) => (
        <span
          key={`${platform.alt || "platform"}-${index}`}
          className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
        >
          {platform.icon ? (
            <Image
              src={platform.icon}
              alt={platform.alt || ""}
              width={28}
              height={28}
              className="object-contain"
            />
          ) : (
            <span className="text-[10px] font-bold text-slate-500">
              {(platform.alt || "?").slice(0, 2)}
            </span>
          )}
        </span>
      ))}
      {extra > 0 ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2D4CC8]/30 bg-[#2D4CC8]/10 text-[11px] font-bold text-[#2D4CC8]">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

function CellValue({ children, emphasize = false }) {
  return (
    <span
      className={`text-sm ${
        emphasize
          ? "font-bold text-[#2D4CC8]"
          : "font-semibold text-[#13203F]"
      }`}
    >
      {children}
    </span>
  );
}

function ToggleBadge({ value }) {
  const enabled =
    value === true ||
    String(value).toLowerCase() === "yes" ||
    String(value).toLowerCase() === "true";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        enabled
          ? "border-[#2D4CC8] bg-[#2D4CC8]/8 text-[#2D4CC8]"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {enabled ? "Yes" : "No"}
    </span>
  );
}

function modeRate(firm, mode) {
  return firm.modePricing?.[mode] || firm.pricing || "—";
}

function buildSections(openTalkToExpert) {
  return [
    {
      title: "Basic Company Information",
      rows: [
        {
          label: "Brand name",
          hint: "Public-facing brand name",
          render: (firm) => <CellValue>{firm.brandName || "—"}</CellValue>,
        },
        {
          label: "Company logo",
          hint: "Uploaded brand logo",
          render: (firm) => <CompanyLogoCell firm={firm} />,
        },
        {
          label: "Website URL",
          hint: "Official company website",
          render: (firm) => <WebsiteLink url={firm.websiteUrl} />,
        },
        {
          label: "Headquarters location",
          hint: "Country and city",
          render: (firm) => (
            <CellValue>{formatHeadquarters(firm)}</CellValue>
          ),
        },
        {
          label: "Year established",
          hint: "Year the company was founded",
          render: (firm) => (
            <CellValue>{firm.yearEstablished || "—"}</CellValue>
          ),
        },
        {
          label: "Merchant base count",
          hint: "Approximate active merchants",
          render: (firm) => (
            <CellValue>{formatMerchantCount(firm.merchantBaseCount)}</CellValue>
          ),
        },
        {
          label: "Countries supported",
          hint: "Markets where PG operates",
          render: (firm) => formatCountriesList(firm.countriesSupported),
        },
        {
          label: "RBI / PAPG status",
          hint: "Regulatory compliance status",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.rbiPapgStatus || "—"}
            </span>
          ),
        },
        {
          label: "PCI DSS status",
          hint: "Payment security certification",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.pciDssStatus || "—"}
            </span>
          ),
        },
        {
          label: "Company overview",
          hint: "Short company description (max 150 chars)",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.companyOverview || "—"}
            </p>
          ),
        },
      ],
    },
    {
      title: "Pricing & Commercial Details",
      rows: [
        {
          label: "UPI MDR",
          hint: "Per successful UPI transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.upiMdr || "—"}</CellValue>
          ),
        },
        {
          label: "Credit card MDR",
          hint: "Per successful credit card transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.creditCardMdr || "—"}</CellValue>
          ),
        },
        {
          label: "Debit card MDR",
          hint: "Per successful debit card transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.debitCardMdr || "—"}</CellValue>
          ),
        },
        {
          label: "International MDR",
          hint: "Per successful international transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.internationalMdr || "—"}</CellValue>
          ),
        },
        {
          label: "Wallet charges",
          hint: "Per successful wallet transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.walletCharges || "—"}</CellValue>
          ),
        },
        {
          label: "Net banking charges",
          hint: "Per successful net banking transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.netBankingCharges || "—"}</CellValue>
          ),
        },
        {
          label: "EMI & BNPL charges",
          hint: "Per successful EMI or BNPL transaction",
          render: (firm) => (
            <CellValue emphasize>{firm.emiBnplCharges || "—"}</CellValue>
          ),
        },
        {
          label: "Refund fee policy",
          hint: "Fee charged per refund",
          render: (firm) => (
            <CellValue>{firm.refundFeePolicy || "—"}</CellValue>
          ),
        },
        {
          label: "Dispute & chargeback handling",
          hint: "Fee per chargeback or dispute",
          render: (firm) => (
            <CellValue>{firm.chargebackFee || "—"}</CellValue>
          ),
        },
        {
          label: "AMC / platform fees",
          hint: "Monthly account maintenance fee",
          render: (firm) => (
            <CellValue>{firm.amcPlatformFees || "—"}</CellValue>
          ),
        },
        {
          label: "Setup fees",
          hint: "One-time onboarding cost",
          render: (firm) => (
            <CellValue>{firm.setupFees || "—"}</CellValue>
          ),
        },
        {
          label: "Instant settlement charges",
          hint: "Extra fee for instant settlement",
          render: (firm) => (
            <CellValue emphasize>
              {firm.instantSettlementCharges || "—"}
            </CellValue>
          ),
        },
        {
          label: "Offers / promotions",
          hint: "Active offers for merchants",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.offersPromotions || "—"}
            </p>
          ),
        },
        { subheader: "POS-Specific" },
        {
          label: "Hardware cost",
          hint: "One-time POS device cost",
          render: (firm) => (
            <CellValue>{firm.hardwareCost || "—"}</CellValue>
          ),
        },
        {
          label: "Annual maintenance contract",
          hint: "Yearly POS device maintenance",
          render: (firm) => (
            <CellValue>{firm.annualMaintenanceContract || "—"}</CellValue>
          ),
        },
        {
          label: "Monthly rental",
          hint: "Monthly POS device rental",
          render: (firm) => (
            <CellValue>{firm.monthlyRental || "—"}</CellValue>
          ),
        },
        { subheader: "Cross-Border Specific" },
        {
          label: "Forex markup / margin",
          hint: "Markup on cross-border transactions",
          render: (firm) => (
            <CellValue emphasize>{firm.forexMarkup || "—"}</CellValue>
          ),
        },
        {
          label: "Settlement currency",
          hint: "Supported settlement currencies",
          render: (firm) => (
            <CellValue>{firm.settlementCurrency || "—"}</CellValue>
          ),
        },
        {
          label: "Settlement infrastructure",
          hint: "How cross-border settlements are routed",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.settlementInfrastructure || "—"}
            </p>
          ),
        },
        {
          label: "Multi currency wallet",
          hint: "Supports multi-currency wallet",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.multiCurrencyWallet || "—"}
            </span>
          ),
        },
        { subheader: "FRM Specific" },
        {
          label: "Per transaction fee",
          hint: "Fee per screened transaction",
          render: (firm) => (
            <CellValue>{firm.perTransactionFee || "—"}</CellValue>
          ),
        },
        {
          label: "Monthly retainer",
          hint: "Monthly FRM service retainer",
          render: (firm) => (
            <CellValue>{firm.monthlyRetainer || "—"}</CellValue>
          ),
        },
      ],
    },
    {
      title: "Operational & Onboarding Details",
      rows: [
        {
          label: "Onboarding Checklist",
          hint: "Steps to onboard a merchant",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.onboardingChecklist || "—"}
            </p>
          ),
        },
        {
          label: "Onboarding TAT",
          hint: "Typical merchant activation time",
          render: (firm) => (
            <CellValue>{firm.onboardingTat || "—"}</CellValue>
          ),
        },
        {
          label: "Settlement cycle",
          hint: "When funds reach your account",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.settlementCycle || "—"}
            </span>
          ),
        },
        {
          label: "Refund SLA",
          hint: "Time to process refunds",
          render: (firm) => (
            <CellValue>{firm.refundSla || "—"}</CellValue>
          ),
        },
        {
          label: "Approval complexity",
          hint: "Merchant onboarding difficulty",
          render: (firm) => (
            <CellValue>{firm.approvalComplexity || "—"}</CellValue>
          ),
        },
        {
          label: "Dedicated account manager",
          hint: "Assigned relationship manager",
          render: (firm) => (
            <ToggleBadge value={firm.dedicatedAccountManager} />
          ),
        },
        {
          label: "Merchant support availability",
          hint: "Support hours for merchants",
          render: (firm) => (
            <CellValue>
              {firm.merchantSupportAvailability || "—"}
            </CellValue>
          ),
        },
        {
          label: "Escalation support",
          hint: "Priority escalation channel available",
          render: (firm) => <ToggleBadge value={firm.escalationSupport} />,
        },
        {
          label: "Instant settlement availability",
          hint: "Instant payout option supported",
          render: (firm) => (
            <ToggleBadge value={firm.instantSettlementAvailability} />
          ),
        },
        {
          label: "International payments support",
          hint: "Accepts cross-border payments",
          render: (firm) => (
            <ToggleBadge value={firm.internationalPaymentsSupport} />
          ),
        },
        { subheader: "POS-Specific" },
        {
          label: "Offline mode support",
          hint: "Works without internet connection",
          render: (firm) => <ToggleBadge value={firm.offlineModeSupport} />,
        },
        {
          label: "GST billing support",
          hint: "Built-in GST invoice generation",
          render: (firm) => <ToggleBadge value={firm.gstBillingSupport} />,
        },
        { subheader: "FRM-Specific" },
        {
          label: "Average response time",
          hint: "Fraud check latency per transaction",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.frmResponseTime || "—"}
            </span>
          ),
        },
        { subheader: "Restricted / Best Suited" },
        {
          label: "Restricted categories",
          hint: "Business types not supported",
          render: (firm) => <TagList labels={firm.restrictedCategories} />,
        },
        {
          label: "Best suited business types",
          hint: "Ideal merchant profiles",
          render: (firm) => (
            <TagList labels={firm.bestSuitedBusinessTypes} />
          ),
        },
      ],
    },
    {
      title: "Smart Tags / Merchant Discovery Layer",
      rows: [
        {
          label: "Smart tags",
          hint: "Up to 5 tags — how merchants discover this PG",
          render: (firm) => <TagList labels={firm.bestForTags?.slice(0, 5)} />,
        },
        {
          label: "Suggest new tags",
          hint: "Additional tags suggested by the provider",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.suggestNewTags || "—"}
            </p>
          ),
        },
      ],
    },
    {
      title: "Sort By Mapping Layer",
      rows: [
        {
          label: "Sort by categories",
          hint: "Categories this PG appears under",
          render: (firm) => <TagList labels={firm.sortByCategories} />,
        },
      ],
    },
    {
      title: "Product & Feature Repository",
      rows: [
        {
          label: "Core payments",
          hint: "UPI, Cards, Net Banking, Wallet, QR",
          render: (firm) => <TagList labels={firm.featureCorePayments} />,
        },
        {
          label: "Advanced payments",
          hint: "International, Recurring, EMI, BNPL, Smart Routing",
          render: (firm) => <TagList labels={firm.featureAdvancedPayments} />,
        },
        {
          label: "Business solutions",
          hint: "Links, Payouts, Marketplace, Escrow",
          render: (firm) => <TagList labels={firm.featureBusinessSolutions} />,
        },
        {
          label: "Offline & POS",
          hint: "Soft POS, Android POS, Soundbox, QR",
          render: (firm) => <TagList labels={firm.featureOfflinePos} />,
        },
        {
          label: "Risk & verification",
          hint: "KYC, Fraud Detection, Chargeback Mgmt",
          render: (firm) => <TagList labels={firm.featureRiskVerification} />,
        },
        {
          label: "Developer & technical",
          hint: "APIs, SDKs, Sandbox, Plugins",
          render: (firm) => <TagList labels={firm.featureDeveloperTechnical} />,
        },
        {
          label: "Cross-border",
          hint: "FX Management, Multi-Currency, Settlements",
          render: (firm) => <TagList labels={firm.featureCrossBorder} />,
        },
        {
          label: "One-click checkout",
          hint: "Guest, Saved Cards, UPI One-Click, Analytics",
          render: (firm) => <TagList labels={firm.featureOneClick} />,
        },
        {
          label: "Suggest new feature",
          hint: "Provider-suggested features not yet listed",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.suggestNewFeature || "—"}
            </p>
          ),
        },
      ],
    },
    {
      title: "Technical Integration Details",
      rows: [
        {
          label: "API documentation URL",
          hint: "Official developer docs link",
          render: (firm) => <WebsiteLink url={firm.apiDocumentationUrl} />,
        },
        {
          label: "SDK availability",
          hint: "Supported backend SDK languages",
          render: (firm) => <TagList labels={firm.sdkAvailability} />,
        },
        {
          label: "Plugin availability",
          hint: "Supported ecommerce plugins",
          render: (firm) => <TagList labels={firm.pluginAvailability} />,
        },
        {
          label: "Sandbox access",
          hint: "Test environment available",
          render: (firm) => <ToggleBadge value={firm.sandboxAccess} />,
        },
        {
          label: "Webhook support",
          hint: "Event callbacks supported",
          render: (firm) => <ToggleBadge value={firm.webhookSupport} />,
        },
        {
          label: "Mobile SDK support",
          hint: "Supported mobile platforms",
          render: (firm) => <TagList labels={firm.mobileSdkSupport} />,
        },
      ],
    },
    {
      title: "Merchant Experience & Ratings",
      rows: [
        {
          label: "Merchant rating",
          hint: "Auto-calculated average merchant rating",
          render: (firm) => (
            <div className="flex flex-col items-center gap-1">
              <StarRating score={firm.merchantRating} />
            </div>
          ),
        },
        {
          label: "Total reviews",
          hint: "Auto-calculated review count",
          render: (firm) => (
            <CellValue>
              {firm.totalReviews !== "—"
                ? Number(firm.totalReviews).toLocaleString("en-IN")
                : "—"}
            </CellValue>
          ),
        },
        {
          label: "CompareX match score",
          hint: "Auto-calculated CompareX compatibility score",
          render: (firm) => (
            <CellValue emphasize>{firm.comparexMatchScore || "—"}/10</CellValue>
          ),
        },
        {
          label: "Merchant success stories",
          hint: "Published merchant success stories",
          render: (firm) => <WebsiteLink url={firm.merchantSuccessStories} />,
        },
        {
          label: "Case studies",
          hint: "Published case study links",
          render: (firm) => <WebsiteLink url={firm.caseStudies} />,
        },
      ],
    },
    {
      title: "Talk to Expert Configuration",
      rows: [
        {
          label: "Talk to expert enabled",
          hint: "Whether merchants can book an expert call",
          render: (firm) => (
            <ToggleBadge value={firm.talkToExpertEnabled} />
          ),
        },
        {
          label: "Expert name",
          hint: "Assigned payment gateway expert",
          render: (firm) => <CellValue>{firm.expertName || "—"}</CellValue>,
        },
        {
          label: "Expert designation",
          hint: "Role or title of the expert",
          render: (firm) => (
            <CellValue>{firm.expertDesignation || "—"}</CellValue>
          ),
        },
        {
          label: "Expert email",
          hint: "Contact email for expert bookings",
          render: (firm) =>
            firm.expertEmail && firm.expertEmail !== "—" ? (
              <a
                href={`mailto:${firm.expertEmail}`}
                className="text-sm font-semibold text-[#2D4CC8] underline-offset-2 hover:underline"
              >
                {firm.expertEmail}
              </a>
            ) : (
              <span className="text-sm text-slate-400">—</span>
            ),
        },
        {
          label: "Expert mobile",
          hint: "Contact number for expert support",
          render: (firm) => <CellValue>{firm.expertMobile || "—"}</CellValue>,
        },
        {
          label: "Expert description",
          hint: "Short bio (max 100 characters)",
          render: (firm) => (
            <p className="mx-auto max-w-[220px] text-center text-xs leading-relaxed font-medium text-slate-600">
              {firm.expertDescription || "—"}
            </p>
          ),
        },
        {
          label: "Calendar sync with external tool",
          hint: "External calendar integration",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.calendarSync || "—"}
            </span>
          ),
        },
        {
          label: "Availability slots",
          hint: "Expert availability time slots",
          render: (firm) => (
            <CellValue>{firm.availabilitySlots || "—"}</CellValue>
          ),
        },
      ],
    },
    {
      title: "Internal PG CRM / Lead Management Layer",
      rows: [
        {
          label: "Lead status",
          hint: "Current lead stage",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.leadStatus || "—"}
            </span>
          ),
        },
        {
          label: "Merchant assigned to",
          hint: "CompareX team or agent owner",
          render: (firm) => (
            <CellValue>{firm.merchantAssignedTo || "—"}</CellValue>
          ),
        },
        {
          label: "Last follow-up date",
          hint: "Most recent merchant follow-up",
          render: (firm) => (
            <CellValue>{firm.lastFollowUpDate || "—"}</CellValue>
          ),
        },
        {
          label: "Expected activation date",
          hint: "Projected PG go-live date",
          render: (firm) => (
            <CellValue>{firm.expectedActivationDate || "—"}</CellValue>
          ),
        },
        {
          label: "Activation status",
          hint: "Merchant account activation state",
          render: (firm) => (
            <span className="inline-flex rounded-full border border-[#2D4CC8] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {firm.activationStatus || "—"}
            </span>
          ),
        },
        {
          label: "Monthly GMV",
          hint: "Estimated monthly gross merchandise value",
          render: (firm) => (
            <CellValue emphasize>{firm.monthlyGmv || "—"}</CellValue>
          ),
        },
        {
          label: "Commission eligibility",
          hint: "Eligible for reseller commission",
          render: (firm) => (
            <ToggleBadge value={firm.commissionEligibility} />
          ),
        },
      ],
    },
    
  ];
}

function CompareSideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openTalkToExpert } = useTalkToExpert();
  const [snapshot, setSnapshot] = useState([]);

  const requestedSlugs = useMemo(
    () => parseSlugsParam(searchParams.get("pgs")),
    [searchParams],
  );

  useEffect(() => {
    setSnapshot(readCompareSideSnapshot());
  }, []);

  const selectedFirms = useMemo(() => {
    const slugs =
      requestedSlugs.length >= 2 ? requestedSlugs : DEFAULT_MOCK_SLUGS;
    const matched = resolveFirmsBySlugs(slugs, [snapshot, MOCK_FIRMS]);
    const firms =
      matched.length >= 2
        ? matched
        : resolveFirmsBySlugs(DEFAULT_MOCK_SLUGS, [MOCK_FIRMS]);

    return firms.map((firm) => {
      const mock = MOCK_FIRMS.find(
        (item) => firmKey(item) === firmKey(firm),
      );
      return withCompanyInfo({
        ...mock,
        ...firm,
        modePricing:
          firm.modePricing ||
          mock?.modePricing ||
          firmModePricing[firm.name] ||
          {},
        badge:
          firm.badge ||
          mock?.badge ||
          (firm.featured ? "Top Rated Here" : firm.bestForTags?.[0]),
        slug: firm.slug || mock?.slug || pgNameToSlug(firm.name),
      });
    });
  }, [requestedSlugs, snapshot]);

  const sections = useMemo(
    () => buildSections(openTalkToExpert),
    [openTalkToExpert],
  );

  const colSpan = selectedFirms.length + 1;

  return (
    <section className="mx-auto w-full max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
      

      {selectedFirms.length < 2 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#13203F]">
            Select at least 2 payment gateways to compare.
          </p>
          <Link
            href="/compare-pg"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#2D4CC8] px-5 text-sm font-semibold text-white"
          >
            Go to Compare PG
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg shadow-[#13203F]/5 lg:max-h-[min(75vh,720px)] lg:overflow-y-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#f8fafc]">
                <th className="sticky left-0 z-40 min-w-[200px] bg-[#f8fafc] px-4 py-5 text-left text-[11px] font-bold uppercase tracking-wider text-[#13203F]/55 lg:top-0 lg:shadow-[0_1px_0_0_#e2e8f0]">
                  Comparing
                </th>
                {selectedFirms.map((firm) => (
                  <th
                    key={firm.id || firm.slug || firm.name}
                    className="min-w-[180px] bg-[#f8fafc] px-4 py-5 align-bottom lg:sticky lg:top-0 lg:z-30 lg:shadow-[0_1px_0_0_#e2e8f0]"
                  >
                    <PgHeader firm={firm} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <FragmentSection
                  key={section.title}
                  section={section}
                  firms={selectedFirms}
                  colSpan={colSpan}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FragmentSection({ section, firms, colSpan }) {
  return (
    <>
      <tr className="bg-[#f1f5f9]">
        <th
          colSpan={colSpan}
          scope="colgroup"
          className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#13203F]/70"
        >
          {section.title}
        </th>
      </tr>
      {section.rows.map((row) => {
        if (row.subheader) {
          return (
            <tr
              key={`${section.title}-${row.subheader}`}
              className="border-t border-slate-200 bg-slate-50/90"
            >
              <th
                colSpan={colSpan}
                scope="colgroup"
                className="px-4 py-2 text-left text-xs font-bold text-[#13203F]"
              >
                {row.subheader}
              </th>
            </tr>
          );
        }

        return (
        <tr
          key={`${section.title}-${row.label}`}
          className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
        >
          <th
            scope="row"
            className="sticky left-0 z-10 bg-white px-4 py-4 text-left align-top"
          >
            <div className="text-sm font-bold text-[#13203F]">{row.label}</div>
            {row.hint ? (
              <div className="mt-0.5 text-xs font-medium text-slate-500">
                {row.hint}
              </div>
            ) : null}
          </th>
          {firms.map((firm) => (
            <td
              key={`${row.label}-${firm.id || firm.slug || firm.name}`}
              className="px-4 py-4 text-center align-middle"
            >
              {row.render(firm)}
            </td>
          ))}
        </tr>
        );
      })}
    </>
  );
}

export default function CompareSideBySide() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm font-medium text-slate-500">
            Loading comparison…
          </div>
        </section>
      }
    >
      <CompareSideContent />
    </Suspense>
  );
}
