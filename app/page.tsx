import type { Metadata } from "next";
import { ProfilePage } from "./components/profile-page";
import { CurrencyProvider } from "./components/currency-toggle";
import { companyProfile } from "./data/company-profile";

export const metadata: Metadata = {
  title: "MTCC | Company Profile 2026",
  description: "Explore MTCC's businesses, projects, people, financial highlights and plans for a connected Maldives.",
};

export default function CompanyPage() {
  return <CurrencyProvider><ProfilePage data={companyProfile} /></CurrencyProvider>;
}
