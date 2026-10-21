import { redirect } from "next/navigation";
import { TUTORIAL_ONBOARDING_PROFILE_PATH } from "@/lib/onboarding-tutorial-storage";

export default function TutorialRootPage() {
  redirect(TUTORIAL_ONBOARDING_PROFILE_PATH);
}
