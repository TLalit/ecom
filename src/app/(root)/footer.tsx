import { LucideIcon } from "@/components/icons/icon";
import { Separator } from "@/components/ui/separator";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const workingHours = {
    title: "Hours",
    footer: "Appointment only",
    links: [
      {
        label: "Mon",
        description: "9:30 am-6:30 pm",
      },
      {
        label: "Tue",
        description: "9:30 am-6:30 pm",
      },
      {
        label: "Wed",
        description: "9:30 am-6:30 pm",
      },
      {
        label: "Thu",
        description: "9:30 am-6:30 pm",
      },
      {
        label: "Fri",
        description: "9:30 am-6:00 pm",
      },
      {
        label: "Sat",
        description: "10:00 am-4:30 pm",
      },
      {
        label: "Sun",
        description: "Closed",
      },
    ],
  };
  const footerLinks: {
    title: string;
    links: {
      label: string;
      href: string;
      icon?: JSX.Element;
      target?: string;
    }[];
  }[] = [
    {
      title: "About us",
      links: [
        {
          label: "Who we are",
          href: "/about#who-we-are",
        },

        {
          label: "Our Vision",
          href: "/about#our-vision",
        },
        {
          label: "Our Services",
          href: "/about#our-service",
        },
        {
          label: "Our Legacy",
          href: "/about#our-legacy",
        },
      ],
    },
  ];
  return (
    <>
      <section className="container flex flex-col gap-10 pt-20 lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p>Connect</p>
          <h1 className="text-5xl font-bold">Get in Touch</h1>
          <p className="text-lg">We&apos;d love to hear from you. Contact us today!</p>
          <div className="flex w-full gap-10">
            {(
              [
                {
                  icon: "Mail",
                  label: "Email",
                  tagline: "Send us an email with any questions or inquiries.",
                  link: "mailto:abc@gmail.com",
                  linkLabel: "Send Email",
                },
                {
                  icon: "Phone",
                  label: "Phone",
                  tagline: "Give us a call for immediate assistance or support.",
                  link: "tel:+1234567890",
                  linkLabel: "Call Now",
                },
                {
                  icon: "MapPin",
                  label: "Office",
                  tagline: "1234 Street Name, City Name",
                  link: "https://goo.gl/maps/abc",
                  linkLabel: "View on Map",
                },
              ] as const
            ).map((item, index) => (
              <div key={item.label} className="flex flex-1 flex-col items-center justify-center gap-5">
                <LucideIcon name={item.icon} className="size-16" />
                <label className="text-3xl font-bold">{item.label}</label>
                <p className="flex-1 text-center text-lg">{item.tagline}</p>
                <Link href={item.link} className="underline">
                  {item.linkLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="container pt-20">
        <Separator />
        <section>
          <div className="container mx-auto flex flex-col justify-between gap-10 py-10 lg:flex-row">
            <Link href="/" className="flex max-w-min flex-col">
              <Store />
            </Link>
            <div className="flex flex-[0.8] flex-col flex-wrap gap-10 md:flex-row">
              <div
                className="flex flex-1 flex-col gap-1 md:items-start"
                key={workingHours.title}
                title={workingHours.title}
              >
                <span className="text-center text-xl font-bold">{workingHours.title}</span>
                {workingHours.links.map((link, j) => {
                  return (
                    <p key={link.label} className="flex gap-2 rounded-lg p-1 transition-colors">
                      <span className="w-9 font-bold">{link.label}</span>:<span>{link.description}</span>
                    </p>
                  );
                })}
                <span className="font-bold">{workingHours.footer}</span>
              </div>
              {footerLinks.map((section, i) => {
                return (
                  <div className="flex flex-1 flex-col gap-1 md:items-start" key={section.title} title={section.title}>
                    <span className="text-xl font-bold">{section.title}</span>
                    {section.links.map((link, j) => {
                      return (
                        <Link
                          key={link.label}
                          className="hover:bg-default-300 flex gap-2 rounded-lg p-1 transition-colors"
                          href={link.href}
                          target={link.target}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <Separator />
        <section className="container mx-auto flex flex-col justify-center gap-10 py-10 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4">
            <span className="text-xl font-bold">Fast Shipping Worldwide</span>
            <div className="flex flex-row gap-2">
              {[{ img: "fedex" }, { img: "dhl" }, { img: "ups" }, { img: "aramex" }, { img: "bluedart" }].map(
                (logo, i) => (
                  <Image
                    alt={logo.img}
                    src={`/images/delivery/${logo.img}.png`}
                    key={logo.img}
                    width={48}
                    height={48}
                    className="drop-shadow-2xl"
                  />
                ),
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4">
            <span className="text-xl font-bold">Bulk and Cargo Shipping Worldwide</span>
            <div className="flex flex-row gap-2">
              {[{ img: "ship" }, { img: "plane" }].map((logo, i) => (
                <Image
                  alt={logo.img}
                  src={`/images/delivery/${logo.img}.png`}
                  key={logo.img}
                  width={48}
                  height={48}
                  className="drop-shadow-2xl"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-4">
            <span className="text-xl font-bold">Secure Payment</span>
            <div className="flex flex-row gap-2">
              {[
                { img: "wire" },
                {
                  img: "master",
                  link: "https://razorpay.me/@conceptskart",
                },
                {
                  img: "visa",
                  link: "https://razorpay.me/@conceptskart",
                },
                {
                  img: "razorpay",
                  link: "https://razorpay.me/@conceptskart",
                },
              ].map((logo, i) =>
                logo.link ? (
                  <Link
                    href={"#"}
                    scroll={false}
                    key={logo.img}
                    // target={isLoggedIn ? "_blank" : "_self"}
                    // onClick={logo.action}
                  >
                    <Image
                      alt={logo.img}
                      src={`/images/payment/${logo.img}.png`}
                      key={i}
                      width={48}
                      height={48}
                      className="drop-shadow-2xl"
                    />
                  </Link>
                ) : (
                  <Image
                    key={logo.img}
                    alt={logo.img}
                    src={`/images/payment/${logo.img}.png`}
                    width={48}
                    height={48}
                    className="cursor-pointer drop-shadow-2xl"
                  />
                ),
              )}
            </div>
          </div>
        </section>
        <Separator />
        <section className="container mx-auto flex items-center gap-5 py-5 text-center">
          <span className="text-sm">© Copyright 2006 - 2024 Concepts Source Inc.</span>
          {[
            {
              label: "Privacy Policy",
              href: "/privacy-policy",
            },

            {
              label: "Terms & Conditions",
              href: "/terms-and-condition",
            },
            {
              label: "Delivery Policy",
              href: "/delivery-policy",
            },
            {
              label: "Refund Policy",
              href: "/refund-policy",
            },
            {
              label: "Contact Us",
              href: "/contact-us",
            },
          ].map((link, i) => (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Link key={link.label} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </>
          ))}
        </section>
      </footer>
    </>
  );
};
