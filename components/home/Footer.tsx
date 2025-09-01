"use client";

import { Heart, Github, Twitter, Rss, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Chyrp Lite
            </h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              A modern, elegant blogging platform designed for creators who
              value simplicity and style. Built with love for the community.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="/feed"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Rss size={20} />
              </a>
              <a
                href="mailto:contact@chyrp.net"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Admin Panel
                </a>
              </li>
              <li>
                <a
                  href="/feed"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  RSS Feed
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              © 2024 Chyrp Lite. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-text-secondary text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-error" />
              <span>by the Chyrp community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
