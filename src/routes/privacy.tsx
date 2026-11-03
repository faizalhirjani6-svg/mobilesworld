import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy&Policy | Mobile World" },
      { name: "description", content: "Mobile World's privacy information covering repair details, device access, website storage, retention and privacy requests." },
      { property: "og:title", content: "Privacy&Policy | Mobile World" },
      { property: "og:description", content: "How Mobile World handles repair information and device data, plus how to contact us about your privacy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy&Policy">
      <p>Your privacy matters to Mobile World. This policy explains how personal information is handled when you browse our website, contact the shop or leave a device with us for repair.</p>
      <section aria-labelledby="privacy-collection">
        <h2 id="privacy-collection">01 / Information we collect</h2>
        <p className="mt-3">For a repair, we collect the details needed to identify your device, understand the problem and keep you informed:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Your name and contact phone number.</li>
          <li>Your device model and a description of the fault.</li>
          <li>Information you choose to share when discussing the repair.</li>
        </ul>
        <p className="mt-3">If testing requires a device passcode, it is used only for the repair. Please discuss access requirements with us before leaving your device.</p>
      </section>
      <section aria-labelledby="privacy-use">
        <h2 id="privacy-use">02 / How your information is used</h2>
        <p className="mt-3">We use repair details to diagnose the fault, carry out the agreed work, contact you about progress or collection, and honour your warranty. We never sell your personal information.</p>
      </section>
      <section aria-labelledby="privacy-device">
        <h2 id="privacy-device">03 / Your device and personal files</h2>
        <p className="mt-3">We do not open, copy or view your photos, messages or files beyond what is needed to confirm that the phone works. Any data-transfer service should be discussed separately so the work you want is clear.</p>
        <p className="mt-3">Before handing over your device, back up important files and remove sensitive information where possible. Do not share account passwords unless you have discussed why access is needed.</p>
      </section>
      <section aria-labelledby="privacy-website">
        <h2 id="privacy-website">04 / Website storage and external links</h2>
        <p className="mt-3">This website uses browser session storage to remember whether the opening animation has already played during your visit. This setting is not a repair record.</p>
        <p className="mt-3">Links to maps or other external services take you to websites with their own privacy policies. Review those policies before sharing information with those services.</p>
      </section>
      <section aria-labelledby="privacy-retention">
        <h2 id="privacy-retention">05 / How long information is kept</h2>
        <p className="mt-3">Repair records are kept for the length of your warranty, then deleted. If you have a question about a particular record, contact the shop so we can discuss it with you.</p>
      </section>
      <section aria-labelledby="privacy-requests">
        <h2 id="privacy-requests">06 / Your privacy requests</h2>
        <p className="mt-3">You can ask us to see, correct or delete the personal details we hold about you. Please identify the relevant repair when contacting us, without sending passwords or sensitive files.</p>
      </section>
      <section aria-labelledby="privacy-updates">
        <h2 id="privacy-updates">07 / Updates to this policy</h2>
        <p className="mt-3">This page may be updated to reflect changes to our services or information-handling practices. The date at the top identifies the latest revision.</p>
      </section>
      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact">08 / Contact Mobile World</h2>
        <p className="mt-3">For a privacy question or request, speak to us at the shop counter or call <a href="tel:+919104262340" className="font-semibold text-primary underline underline-offset-4">+91 91042 62340</a>.</p>
        <address className="mt-3 not-italic">Anjani Residency, near Iscon Temple, Jahangipura, Rander, Surat, Gujarat.</address>
      </section>
    </LegalPage>
  ),
});
