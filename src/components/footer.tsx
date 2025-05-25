import React from "react";

import { Mail, Linkedin, Github } from "lucide-react"; // Import Lucide icons
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { MainRoutes } from "@/lib/helpers";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:${hoverColor}`}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="hover:underline text-gray-800 hover:text-gray-900"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <div className="w-full bg-white/40 shadow-lg  text-gray-300 hover:text-gray-100 py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First Column: Links */}
          <div>
            <h3 className="font-bold text-gray-800  text-lg mb-4">
              Quick Links
            </h3>
            <ul className="  space-y-2">
              {MainRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Second Column: About Us */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">About Us</h3>
            <p className="text-gray-900">
              We are committed to helping you unlock your full potential with
              AI-powered tools. Our platform offers a wide range of resources to
              improve your interview skills and chances of success.
            </p>
          </div>

          {/* Third Column: Services */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">Services</h3>
            <ul>
              <FooterLink to="/generate">Interview Preparation</FooterLink>
              <FooterLink to="/jobs">Job Insights</FooterLink>
              <FooterLink to="/resume">Resume Building</FooterLink>
            </ul>
          </div>

          {/* Fourth Column: Address and Social Media */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4">Contact Us</h3>
            <p className="mb-4 text-gray-900">Sanjay S</p>
            <div className="flex gap-4">
              <SocialLink
                href="https://github.com/SanjaySundaravadivelu"
                icon={<Github size={24} />}
                hoverColor="text-blue-500"
              />
              <SocialLink
                href="mailto:s.sanjaysundaram@gmail.com"
                icon={<Mail size={24} />}
                hoverColor="text-blue-400"
              />

              <SocialLink
                href="https://www.linkedin.com/in/sanjay-s-8483aa170/"
                icon={<Linkedin size={24} />}
                hoverColor="text-blue-700"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
