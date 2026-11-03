import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Mobile World" },
      { name: "description", content: "Terms for repairs, warranties and device collection at Mobile World." },
      { property: "og:title", content: "Terms of Service | Mobile World" },
      { property: "og:description", content: "Repair, warranty and collection terms at Mobile World." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Terms of Service">
      <p>These terms apply to every repair carried out by Mobile World. By leaving a device with us you agree to them.</p>
      <h2>Quotes and diagnosis</h2>
      <p>Diagnosis is free. We give you a price before starting work and will not exceed it without your approval.</p>
      <h2>Warranty</h2>
      <p>Replaced parts and labour carry a written warranty from the date of collection. The warranty does not cover new physical damage, liquid damage, or repairs opened by another party.</p>
      <h2>Data</h2>
      <p>Please back up your phone before a repair. We take care with your data but cannot be held responsible for data loss during repair.</p>
      <h2>Uncollected devices</h2>
      <p>Devices not collected within 90 days of the repair being completed may be recycled after we have tried to contact you.</p>
      <h2>Payment</h2>
      <p>Payment is due on collection. Devices are released only once the repair is paid in full.</p>
    </LegalPage>
  ),
});
