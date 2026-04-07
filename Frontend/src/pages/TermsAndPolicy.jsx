import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const TermsAndPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Flawskin";
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          color: #374151;
          

        }

        .hero-bg {
          background: linear-gradient(to bottom, #0e332b, #E9EFEF 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-image-overlay {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 40%;
          background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqpvY44S0PeyLH3HlpDaixOwQYzJc-QvNE7ouncGNEIlAlzge1V1CA9L8OpzXU8ZctzGGUevialqi_P2OE9ZvtI43YxiOB0AGrI3Q6e-XS-Cxvo7P-e-uAGJrW5_M77AuQ4Xlz-XWU_P3VSszXDJYsfGtmeV-N6WxjqUFO0M1J2HrgEqwwN6rd73chrmhee8-J09ywNrTBjvfijCQtzcR6eZV6IfVKaz2DJ7SYmdXTnDtGr-GoBWG7OAldgv_1CCixp6COLPrFJ8dD");
          background-size: cover;
          background-position: top right;
          opacity: 0.15;
          mask-image: linear-gradient(to left, rgb(206, 45, 45), rgba(153, 15, 15, 0));
          -webkit-mask-image: linear-gradient(to left, rgb(193, 33, 33), rgba(210, 54, 54, 0));
        }

        .brand-circle {
          width: 32px;
          height: 32px;
          background-color: #0ea5e9;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 30px;
        }

        .section-icon {
          background-color: #e0f2fe;
          color: #0ea5e9;
          padding: 10px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          width: 40px;
          height: 40px;
        }

        .heading-with-icon {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .heading-with-icon h4 {
          margin-bottom: 0;
        }

        .icon-sm {
          width: 20px;
          height: 20px;
        }

        footer {
          background-color: #0f172a;
          color: #9ca3af;
        }

        footer h5 {
          color: white;
        }

        footer a {
          color: #9ca3af;
          text-decoration: none;
        }

        footer a:hover {
          color: white;
        }

        .contact-info-item {
          margin-bottom: 1rem;
        }

        .icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .bg-flaw-blue-light {
          background-color: #e0f2fe;
        }

        .text-flaw-blue {
          color: #0ea5e9;
        }

        .text-flaw-dark {
          color: #1e293b;
        }

        .text-flaw-gray {
          color: #64748b;
        }

        .not-italic {
          font-style: normal;
        }

        .tracking-tighter {
          letter-spacing: -0.05em;
        }
      `}</style>

      {/* HERO */}
      <section className="hero-bg py-5 position-relative">
        <div className="hero-image-overlay"></div>
        <div className="container position-relative">
          <h1 className="display-4 fw-bold text-dark">Terms And Privacy Policy</h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="container my-5">
        {/* PRIVACY POLICY */}
        <div className="heading-with-icon">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">1. PRIVACY POLICY</h4>
        </div>
        <p className="text-muted">
          This website is operated by FLAWSKIN PRIVATE LIMITED. Throughout the site, the terms “we”, “us” and “our” refer to FLAWSKIN PRIVATE LIMITED. FLAWSKIN PRIVATE LIMITED offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here. By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content. Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service. Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
        </p>

        {/* ONLINE STORE TERMS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">2. ONLINE STORE TERMS</h4>
        </div>
        <p className="text-muted">
          By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws). You must not transmit any worms or viruses or any code of a destructive nature. A breach or violation of any of the Terms will result in an immediate termination of your Services.
        </p>

        {/* GENERAL CONDITIONS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 14H4v-4h8v4zm0-6H4V8h8v4zm8 6h-8v-4h8v4zm0-6h-8V8h8v4z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">3. GENERAL CONDITIONS</h4>
        </div>
        <p className="text-muted">
          We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us. The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.
        </p>

        {/* ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">4. ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h4>
        </div>
        <p className="text-muted">
          We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk. This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.
        </p>

        {/* MODIFICATIONS TO THE SERVICE AND PRICES */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">5. MODIFICATIONS TO THE SERVICE AND PRICES</h4>
        </div>
        <p className="text-muted">
          Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
        </p>

        {/* PRODUCTS OR SERVICES */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">6. PRODUCTS OR SERVICES</h4>
        </div>
        <p className="text-muted">
          Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited. We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
        </p>

        {/* REFUND & CANCELLATION POLICY */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1-.45-1.41-.81-1.41-1.44 0-.68.57-1.19 1.54-1.19.87 0 1.41.4 1.71.98l1.23-.84c-.48-.85-1.37-1.41-2.49-1.49V6h-1.24v1.18c-1.15.18-2.09.99-2.09 2.25 0 1.36.98 2.06 2.33 2.64 1.03.44 1.45.85 1.45 1.51 0 .69-.56 1.28-1.56 1.28-1.01 0-1.6-.48-1.92-1.09l-1.26.86c.53.99 1.57 1.65 2.7 1.78V18h1.24v-1.18c1.24-.2 2.18-1.02 2.18-2.32 0-1.45-1.02-2.09-2.35-2.68z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">7. REFUND & CANCELLATION POLICY</h4>
        </div>
        
        <h5 className="fw-bold mt-4">Refund Policy</h5>
        <p className="text-muted">
          <strong>No Refunds:</strong> Once a payment has been made, it is non-refundable under any circumstances.
        </p>
        
        <h5 className="fw-bold mt-4">Cancellation Policy</h5>
        <p className="text-muted">
          Customers must inform us at least 1 hour before the scheduled appointment to cancel or reschedule. Cancellations made less than 1 hour before the appointment will be considered a last-minute cancellation, and the service fee will be charged in full.
        </p>

        {/* ACCURACY OF BILLING AND ACCOUNT INFORMATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">8. ACCURACY OF BILLING AND ACCOUNT INFORMATION</h4>
        </div>
        <p className="text-muted">
          We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed. For more detail, please review our Returns Policy.
        </p>

        {/* OPTIONAL TOOLS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">9. OPTIONAL TOOLS</h4>
        </div>
        <p className="text-muted">
          We may provide you with access to third-party tools over which we neither monitor nor have any control nor input. You acknowledge and agree that we provide access to such tools ”as is” and “as available” without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools. Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s). We may also, in the future, offer new services and/or features through the website (including, the release of new tools and resources). Such new features and/or services shall also be subject to these Terms of Service.
        </p>

        {/* THIRD-PARTY LINKS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">10. THIRD-PARTY LINKS</h4>
        </div>
        <p className="text-muted">
          Certain content, products and services available via our Service may include materials from third-parties. Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties. We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.
        </p>

        {/* USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h10v2H7zm0 4h7v2H7z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">11. USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS</h4>
        </div>
        <p className="text-muted">
          If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments. We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party’s intellectual property or these Terms of Service. You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.
        </p>

        {/* PERSONAL INFORMATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">12. PERSONAL INFORMATION</h4>
        </div>
        <p className="text-muted">
          Your submission of personal information through the store is governed by our Privacy Policy.
        </p>

        {/* ERRORS, INACCURACIES AND OMISSIONS */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">13. ERRORS, INACCURACIES AND OMISSIONS</h4>
        </div>
        <p className="text-muted">
          Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order). We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.
        </p>

        {/* PROHIBITED USES */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8h-8v-2h8v2z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">14. PROHIBITED USES</h4>
        </div>
        <p className="text-muted">
          In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.
        </p>

        {/* DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">15. DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY</h4>
        </div>
        <p className="text-muted">
          We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable. You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you. You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement. In no case shall FLAWSKIN PRIVATE LIMITED, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content (or product) posted, transmitted, or otherwise made available via the service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.
        </p>

        {/* INDEMNIFICATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6h-2v2h-2V6h-2V4h2V2h2v2h2v2zm-10 3c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 4c-2.33 0-7 1.17-7 3.5V17h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">16. INDEMNIFICATION</h4>
        </div>
        <p className="text-muted">
          You agree to indemnify, defend and hold harmless FLAWSKIN PRIVATE LIMITED and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
        </p>

        {/* SEVERABILITY */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">17. SEVERABILITY</h4>
        </div>
        <p className="text-muted">
          In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.
        </p>

        {/* TERMINATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">18. TERMINATION</h4>
        </div>
        <p className="text-muted">
          The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site. If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).
        </p>

        {/* ENTIRE AGREEMENT */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">19. ENTIRE AGREEMENT</h4>
        </div>
        <p className="text-muted">
          The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service). Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.
        </p>

        {/* GOVERNING LAW */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm1 0V8l5 4-5 4z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">20. GOVERNING LAW</h4>
        </div>
        <p className="text-muted">
          These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and jurisdiction of Bangalore, Karnataka.
        </p>

        {/* CHANGES TO TERMS OF SERVICE */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">21. CHANGES TO TERMS OF SERVICE</h4>
        </div>
        <p className="text-muted">
          You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.
        </p>

        {/* CONTACT INFORMATION */}
        <div className="heading-with-icon mt-4">
          <span className="section-icon">
            <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </span>
          <h4 className="fw-bold mb-0">22. CONTACT INFORMATION</h4>
        </div>
        <p className="text-muted">
          Questions about the Terms of Service should be sent to: <strong><a href="mailto:contact@flawskin.com">contact@flawskin.com</a></strong>
        </p>
      </main>

      {/* FOOTER */}
      <footer className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5>Flawskin</h5>
              <p className="small">
                Professional laser hair reduction and medical aesthetic treatments tailored to your skin journey.
              </p>
            </div>

            <div className="col-md-8">
              <h5>Support</h5>
              {/* Contact Details Grid */}
              <div className="contact-info-grid mt-3 pt-3">
                {/* Phone Info */}
                <div className="contact-info-item d-flex gap-2">
                  <div className="icon-circle bg-flaw-blue-light d-flex align-items-center justify-content-center text-flaw-blue">
                    <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2a5 5 0 00-5-5v2c1.66 0 3 1.34 3 3z"></path>
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="fw-bold text-uppercase small text-flaw-dark mb-0">Phone</h4>
                    <p className="text-flaw-gray small mb-0">+91 7892644030</p>
                  </div>
                </div>

                {/* Address Info */}
                <div className="contact-info-item d-flex gap-2">
                  <div className="icon-circle bg-flaw-blue-light d-flex align-items-center justify-content-center text-flaw-blue">
                    <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"></path>
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h4 className="fw-bold text-uppercase small text-flaw-dark mb-0">Address</h4>
                    <address className="text-flaw-gray small mb-0 not-italic">
                      Bangalore, JP Nagar, <br />7th Phase, 560078
                    </address>
                  </div>
                </div>

                {/* Operating Hours - Full Width */}
                <div className="contact-info-item hours-item d-flex gap-2">
                  <div className="icon-circle bg-flaw-blue-light d-flex align-items-center justify-content-center text-flaw-blue">
                    <svg className="icon-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                    </svg>
                  </div>
                  <br/>
                  <div className="contact-info-content w-100">
                    <h4 className="fw-bold text-uppercase small text-flaw-dark mb-1">Operating Hours</h4>
                    <div className="d-flex gap-3">
                      <div>
                        <p className="text-muted text-uppercase fw-bold small tracking-tighter mb-0">Mon-Thur</p>
                        <p className="text-flaw-gray small mb-0">8AM-10PM</p>
                      </div>
                      <div>
                        <p className="text-muted text-uppercase fw-bold small tracking-tighter mb-0">Fri-Sat</p>
                        <p className="text-flaw-gray small mb-0">8AM-10PM</p>
                      </div>
                      <div>
                        <p className="text-muted text-uppercase fw-bold small tracking-tighter mb-0">Sun</p>
                        <p className="text-flaw-gray small mb-0">9AM-10PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-secondary" />
          <p className="text-center small mb-0">
            © 2024 Flawskin. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default TermsAndPolicy;