import React from 'react';

export interface FooterProps {
  /**
   * Newsletter submission handler
   */
  onNewsletterSubmit?: (email: string) => void;
  /**
   * Social media links
   */
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
  };
  /**
   * Quick links configuration
   */
  quickLinks?: {
    left?: Array<{ label: string; href: string }>;
    right?: Array<{ label: string; href: string }>;
  };
  /**
   * Newsletter section configuration
   */
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
  };
  /**
   * Copyright text
   */
  copyrightText?: string;
  /**
   * Designer credit
   */
  designerCredit?: {
    text: string;
    name: string;
    href?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({
  onNewsletterSubmit,
  socialLinks = {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    discord: '#',
  },
  quickLinks = {
    left: [
      { label: 'Buy Crypto', href: '/buy-crypto' },
      { label: 'Sell Crypto', href: '/sell-crypto' },
      { label: 'Swap', href: '/swap' },
      { label: 'Coin Market', href: '/market' },
    ],
    right: [
      { label: 'Earn', href: '/earn' },
      { label: 'Blog', href: '/blog' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  newsletter = {
    title: 'Newsletter',
    description: 'Welcome to CritoX your gateway to the world of Web3 trading! Our user-friendly platform',
    placeholder: 'Enter Your Email...',
  },
  copyrightText = 'CritoX',
  designerCredit = {
    text: 'Designed By',
    name: 'Pixelaxis',
    href: '#',
  },
}) => {
  const [email, setEmail] = React.useState('');
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNewsletterSubmit && email) {
      onNewsletterSubmit(email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-accent5 relative overflow-hidden">
      {/* Blur Effects */}
      <div className="w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] absolute bottom-[-6%] blur-[85px] left-[-9%] bg-primary/50"></div>
      <div className="w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] absolute top-[-6%] blur-[85px] right-[-8%] bg-accent1/50"></div>

      <div className="pb-120 pt-120 relative z-[2] container grid grid-cols-12 xxl:grid-cols-10 gap-6 lg:divide-x divide-accent4">
        {/* Quick Links */}
        <div className="fade_up_anim col-span-12 md:col-span-6 xl:col-span-3">
          <h3 className="mb-4 xl:mb-6">Quick Links</h3>
          <div className="grid grid-cols-2">
            <div className="col-span-1 flex flex-col gap-4">
              {quickLinks.left?.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="animated-link hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              {quickLinks.right?.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="animated-link hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div
          data-delay=".15"
          className="fade_up_anim col-span-12 md:col-span-6 xl:col-span-6 xxl:col-span-4"
        >
          <div className="text-center px-4 md:px-6 lg:px-10 xxl:px-16">
            <h3 className="mb-4 xl:mb-6">{newsletter.title}</h3>
            <p className="text-neutral4 lg:text-lg mb-8 xl:mb-10">
              {newsletter.description}
            </p>
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:border-primary bg-transparent rounded-full px-5 py-4 border border-accent4"
                required
              />
              <button
                type="submit"
                aria-label="submit button"
                className="size-[56px] rounded-full bg-primary shrink-0 f-center text-xl hover:bg-primary/90 transition-colors"
              >
                <i className="ti ti-arrow-up-right"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div
          data-delay=".3"
          className="fade_up_anim col-span-12 xl:col-span-3"
        >
          <div className="text-center pl-4 lg:pl-6 xxl:pl-10 xxxl:pl-12">
            <h3 className="mb-4 xl:mb-6">Follow Us</h3>
            <div className="mb-7 xl:mb-10 flex justify-center gap-4">
              {socialLinks.facebook && (
                <a
                  className="social-link size-10 rounded-full border border-accent4 f-center hover:bg-primary hover:border-primary transition-colors"
                  href={socialLinks.facebook}
                  aria-label="facebook link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-brand-facebook"></i>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  className="social-link size-10 rounded-full border border-accent4 f-center hover:bg-primary hover:border-primary transition-colors"
                  href={socialLinks.twitter}
                  aria-label="twitter link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-brand-twitter"></i>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  className="social-link size-10 rounded-full border border-accent4 f-center hover:bg-primary hover:border-primary transition-colors"
                  href={socialLinks.instagram}
                  aria-label="instagram link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-brand-instagram"></i>
                </a>
              )}
              {socialLinks.discord && (
                <a
                  className="social-link size-10 rounded-full border border-accent4 f-center hover:bg-primary hover:border-primary transition-colors"
                  href={socialLinks.discord}
                  aria-label="discord link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-brand-discord"></i>
                </a>
              )}
            </div>
            <p className="text-neutral4 lg:text-lg">
              empowers you to explore a wide range of popular cryptocurrencies
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-5 xl:py-8 border-t border-accent4">
        <div className="container text-center flex justify-center gap-2 sm:gap-3 items-center relative z-[2]">
          <p className="text-xs sm:text-sm md:text-base xl:text-lg">
            Copyright @ <span id="year">{currentYear}</span> {copyrightText}
          </p>
          <span className="text-sm xl:text-xl">|</span>
          <p className="text-xs sm:text-sm md:text-base xl:text-lg">
            {designerCredit.text}{' '}
            <a
              href={designerCredit.href}
              className="text-primary underline lg:text-lg hover:text-primary/80 transition-colors"
            >
              {designerCredit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
