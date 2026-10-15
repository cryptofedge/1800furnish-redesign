import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE_NAME}`,
  description: `The terms for using the ${SITE_NAME} website, prices and quote requests.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 15, 2026">
      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Using this website</h2>
        <p>
          By using this website you agree to these terms. If you don’t agree, please don’t use the site. Don’t misuse
          it: no attempts to access areas that aren’t public, no automated scraping, and nothing that interferes with
          how the site works.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Prices and quotes</h2>
        <ul>
          <li>Prices are list prices per unit in US dollars and can change without notice.</li>
          <li>
            Estimates from the facility calculator and your quote list are not offers. An order is only confirmed when
            we send you a written quote and you accept it.
          </li>
          <li>Volume pricing, taxes, delivery, installation and lead times are set out in your quote.</li>
        </ul>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Product information</h2>
        <p>
          We work to keep descriptions and photos accurate. Some photos show the product in a room setting or a similar
          model, and colors can look different on screen. The 3D shape view is a simplified stand-in, not the actual
          product. Final specifications, finishes and dimensions are confirmed in your quote.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Security equipment</h2>
        <p>
          Some Nooksguard products, such as X-ray screening systems and camera-based devices, may be subject to federal,
          state or local rules on registration, operation or privacy. Buyers are responsible for the permits and lawful
          use that apply to their site. We’re happy to help with product documentation.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Names, logos and content</h2>
        <p>
          The {SITE_NAME} and Nooksguard names and logos, and the content of this website, belong to their owners. You
          may share links to our pages, but don’t copy our content for commercial use without permission.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Other websites</h2>
        <p>Links to other websites are provided for convenience. We aren’t responsible for their content.</p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">No warranty for the website</h2>
        <p>
          This website is provided “as is”. We aren’t liable for losses caused by using it or by errors on it, to the
          extent the law allows. Product warranties are the ones stated in your quote and order documents.
        </p>
      </section>

      <section>
        <h2 className="type-display mb-3 text-2xl text-ink">Questions</h2>
        <p>
          Send questions about these terms through our{" "}
          <Link href="/#quote" className="link">
            quote form
          </Link>
          . If we change these terms, we’ll update the date at the top of this page.
        </p>
      </section>
    </LegalPage>
  );
}
