import type { Metadata } from "next";
import { ProfilePage } from "../components/profile-page";
import { getProfile } from "../data/profiles";

export const metadata: Metadata = { title: "Investor Profile 2026 | MTCC", description: "Explore MTCC's investment highlights, business portfolio and growth strategy." };

export default async function InvestorProfilePage() {
  return <ProfilePage data={await getProfile("investor-profile")} />;
}
