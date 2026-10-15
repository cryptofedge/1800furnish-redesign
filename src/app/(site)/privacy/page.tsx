import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `What ${SITE_NAME} collects through this website and how it is used.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 15, 2026">
      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Who we are</h2>
        <p>
          {SITE_NAME} supplies furniture, facility and maintenance products, and Nooksguard security equipment, to
          institutions, public agencies and businesses. This policy explains what we collect through this website and
          what we do with it.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">What we collect</h2>
        <ul>
          <li>
            <strong>Quote requests.</strong> Your organization name, contact name, email, phone number (optional),
            notes, and the products, quantities or facility package you ask about.
          </li>
          <li>
            <strong>Your quote list.</strong> Items you add with “Add to quote” are kept only in your own browser until
            you send a request. We can’t see the list before then.
          </li>
          <li>
            <strong>Standard server logs.</strong> Like any website, our hosting provider records basic technical
            details (such as IP address, browser type and pages requested) to keep the site running and secure.
          </li>
        </ul>
        <p>We don’t use advertising cookies, and we don’t sell personal information.</p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">How we use it</h2>
        <p>
          To prepare and follow up on your quote, answer your questions, fulfill orders and keep business records. We
          also use general, non-identifying information to improve the website.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Who we share it with</h2>
        <p>
          Only service providers that run this website for us, such as our website host and our email delivery
          service, and only so they can provide that service. We may also share information when it’s needed to fulfill
          a contract you place with us, or when the law requires it.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">How long we keep it</h2>
        <p>
          As long as we need it to respond to you and to keep the business, tax and contract records we’re required to
          keep. After that, we delete it.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Your choices</h2>
        <p>
          You can ask us to show, correct or delete the information you sent us. Send your request through our{" "}
          <Link href="/#quote" className="link">
            quote form
          </Link>{" "}
          and write “Privacy request” in the notes.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Children</h2>
        <p>This website is for businesses and institutions. It isn’t directed to children under 13.</p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Changes to this policy</h2>
        <p>If we change this policy, we’ll update the date at the top of this page.</p>
      </section>
    </LegalPage>
  );
}
