import type { Metadata } from "next";
import { ProfilePage } from "../components/profile-page";
import { getProfile } from "../data/profiles";

export const metadata: Metadata = { title: "Corporate Profile 2026 | MTCC", description: "Explore MTCC's purpose, services and national development expertise." };

export default async function CorporateProfilePage() {
  return <ProfilePage data={await getProfile("corporate-profile")} />;
}
