import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Mobile World" },
      { name: "description", content: "How Mobile World handles your personal details and device data." },
      { property: "og:title", content: "Privacy Policy | Mobile World" },
      { property: "og:description", content: "How Mobile World handles your details and device data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy Policy">
      <p>Mobile World collects only what we need to repair your device and contact you about it.</p>
      <h2>What we collect</h2>
      <p>Your name, phone number, device model and a description of the fault. If a repair needs your passcode for testing, we use it only during the repair.</p>
      <h2>How we use it</h2>
      <p>To carry out the repair, contact you when it is ready, and honour your warranty. We never sell your details.</p>
      <h2>Your device data</h2>
      <p>We do not open, copy or view your photos, messages or files beyond what is needed to confirm the phone works.</p>
      <h2>Retention</h2>
      <p>Repair records are kept for the length of your warranty, then deleted.</p>
      <h2>Contact</h2>
      <p>Ask us at the shop counter to see, correct or delete the details we hold about you.</p>
    </LegalPage>
  ),
});
