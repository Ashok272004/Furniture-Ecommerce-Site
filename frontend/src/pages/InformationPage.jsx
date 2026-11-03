import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const policyPages = {
  privacy: {
    title: "Privacy policy",
    intro: "Sample privacy information for the FurniNest project demo.",
    sections: [
      ["Information used", "This demo may use account details such as your name and email, plus delivery details such as your phone number and address when you place an order."],
      ["Why it is used", "Account information supports sign-in. Order and delivery information is used to create and manage orders and provide customer support."],
      ["Payments", "Online payment is started through Razorpay checkout. Review the payment provider's own privacy information for how it processes payment data."],
      ["Storage and contact", "This demo uses a session cookie for sign-in and browser storage for cart and appearance preferences. For privacy questions, use the demo contact details in the footer."],
    ],
  },
  terms: {
    title: "Terms of service",
    intro: "Sample terms for using this FurniNest project demo.",
    sections: [
      ["Product information", "Product descriptions, images, prices, and stock shown on the site are provided for this demo and may be changed by the store administrator."],
      ["Orders and payment", "Orders are submitted for review and depend on product availability. This demo offers Cash on Delivery and Razorpay checkout where configured."],
      ["Accounts", "Keep your sign-in details private and provide accurate delivery information when placing an order."],
      ["Before launch", "Add the real business identity, delivery and cancellation rules, return and refund process, warranty terms, and dispute contact before accepting public orders."],
    ],
  },
  cookies: {
    title: "Cookie policy",
    intro: "This project demo uses only the browser storage needed for its current features.",
    sections: [
      ["Sign-in session", "A session cookie may be used to keep your account signed in while you use the site."],
      ["Cart and appearance", "The demo stores cart and theme preferences in browser local storage. These are browser storage entries, not cookies."],
      ["Third-party checkout", "Razorpay checkout may use its own technologies when you choose online payment. See Razorpay's own notices for details."],
      ["Changes", "If analytics, advertising, or other tracking tools are added, update this policy and any consent controls to match."],
    ],
  },
  copyright: {
    title: "Copyright notice",
    intro: "© " + new Date().getFullYear() + " FurniNest Demo. All rights reserved.",
    sections: [
      ["Site materials", "The FurniNest demo name, site layout, and original interface text are provided for this project. Do not reuse materials without permission from their respective owners."],
      ["Product imagery", "Product images may be uploaded by the store administrator or sourced from third parties. Image rights remain with their respective owners or licensors."],
    ],
  },
};

const faqs = [
  ["How do I find a product?", "Choose a category from the home page, then search or sort the products on that category page."],
  ["Which payment options are available?", "This demo supports Cash on Delivery and Razorpay online checkout when payment credentials are configured."],
  ["Where can I see my order status?", "Sign in and open My Orders to view your orders and their current status."],
  ["How do I contact the store?", "Use the sample email and phone number in the footer. Replace them with your real support details before launch."],
];

function InformationPage() {
  const { document } = useParams();
  const policy = policyPages[document];
  const isHelp = window.location.pathname === "/help";
  const isSitemap = window.location.pathname === "/sitemap";

  let title = policy?.title || "Information";
  if (isHelp) title = "FAQs & Help Center";
  if (isSitemap) title = "Sitemap";

  return (
    <>
      <Navbar />
      <main className="information-page">
        <Link className="information-page__back" to="/">← Back to FurniNest</Link>
        <p className="eyebrow">FURNINEST</p>
        <h1>{title}</h1>

        {policy && (
          <>
            <p className="information-page__intro">{policy.intro}</p>
            <div className="information-page__sample-note">
              Sample content for a student project. It is not legal advice. Replace it with policies that match the real business and have them reviewed before launch.
            </div>
            <div className="information-page__sections">
              {policy.sections.map(([heading, content]) => (
                <section key={heading}>
                  <h2>{heading}</h2>
                  <p>{content}</p>
                </section>
              ))}
              {document === "privacy" && (
                <p className="information-page__source-note">
                  For applicable Indian requirements, review the official <a href="https://www.meity.gov.in/digital-personal-data-protection-act" target="_blank" rel="noreferrer">Digital Personal Data Protection Act and Rules</a> and the <a href="https://consumeraffairs.gov.in/pages/consumer-protection-acts" target="_blank" rel="noreferrer">Consumer Protection (E-Commerce) Rules</a>.
                </p>
              )}
            </div>
          </>
        )}

        {isHelp && (
          <div className="information-page__sections information-page__faqs">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
            <p>Still need help? Write to <a href="mailto:hello@furninest.example">hello@furninest.example</a> (demo address).</p>
          </div>
        )}

        {isSitemap && (
          <nav className="information-page__sitemap" aria-label="Full site navigation">
            <Link to="/">Home</Link>
            <a href="/#shop-categories-title">Shop all furniture</a>
            <a href="/#about">About us</a>
            <a href="/#contact">Contact</a>
            <Link to="/help">FAQs &amp; Help Center</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/legal/privacy">Privacy policy</Link>
            <Link to="/legal/terms">Terms of service</Link>
            <Link to="/legal/cookies">Cookie policy</Link>
            <Link to="/legal/copyright">Copyright notice</Link>
          </nav>
        )}

        {!policy && !isHelp && !isSitemap && (
          <p className="information-page__intro">This information page is not available.</p>
        )}
      </main>
      <Footer />
    </>
  );
}

export default InformationPage;
