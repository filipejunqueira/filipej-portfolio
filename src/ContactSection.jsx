// ContactSection.jsx
// Import React, hooks, motion, Section, AnimatedSection, HoverFlipButton, UI components, and Lucide icons.
import React from "react"; // Removed useState as Formspree handles state
import { motion } from "framer-motion";
import Section from "./Section";
import AnimatedSection from "./AnimatedSection";
import HoverFlipButton from "./HoverFlipButton";
import { Card, Button, Input, Textarea, TextSecondary } from "./components/UI";
// Import centralized animations
import { defaultVariants } from "./animations";
import {
  Users,
  Linkedin,
  Github,
  Twitter,
  Send,
  Loader2, // Kept if you want a custom loading state on the button, Formspree handles its own
} from "lucide-react";
// Import Formspree hooks
import { useForm, ValidationError } from "@formspree/react";

/**
 * ContactSection Component: Displays contact information and Formspree form.
 */
const ContactSection = () => {
  // Initialize Formspree's useForm hook with your form ID
  const [state, handleSubmit] = useForm("xwpbkqew"); // Your Formspree form ID

  // Social contact buttons data (remains the same)
  const socialContactButtons = [
    {
      href: "https://linkedin.com/in/filipejunqueira",
      IconInitial: Linkedin,
      textInitial: "LinkedIn",
      textHover: "View Profile",
      bgColorInitial: "bg-sky-600 dark:bg-sky-700",
      bgColorHover: "hover:bg-sky-700 dark:hover:bg-sky-800",
      ariaLabel: "Filipe Junqueira on LinkedIn",
    },
    {
      href: "https://github.com/filipejunqueira",
      IconInitial: Github,
      textInitial: "GitHub",
      textHover: "View Repos",
      bgColorInitial: "bg-gray-700 dark:bg-slate-700",
      bgColorHover: "hover:bg-gray-800 dark:hover:bg-slate-600",
      ariaLabel: "Filipe Junqueira on GitHub",
    },
    {
      href: "https://x.com/CaptBroccoli",
      IconInitial: Twitter,
      textInitial: "Twitter / X",
      textHover: "@CaptBroccoli",
      bgColorInitial: "bg-sky-500 dark:bg-sky-600",
      bgColorHover: "hover:bg-sky-600 dark:hover:bg-sky-700",
      ariaLabel: "Filipe Junqueira (Captain Broccoli) on Twitter/X",
    },
  ];

  return (
    <Section title="Get In Touch" icon={Users} id="contact">
      <TextSecondary 
        as="p" 
        className="text-center text-base md:text-lg mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed"
      >
        I'm always open to discussing new projects, collaborations, or just
        connecting with like-minded individuals. Send me a message using the
        form below, or connect via social media!
      </TextSecondary>

      <motion.div
        className="max-w-xl mx-auto mb-12"
        initial="hidden"
        animate="visible"
        variants={defaultVariants}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6 sm:p-8">
        {/* Display thank you message on successful submission */}
        {state.succeeded ? (
          <p className="text-center text-lg font-medium text-green-600 dark:text-green-400 py-10">
            Thanks for your message! I'll get back to you soon. 😊
          </p>
        ) : (
          // Otherwise, display the form
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                name="name" // Formspree uses this name attribute
                required
                placeholder="Your Name"
              />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
                className="text-red-500 dark:text-red-400 text-xs mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email" // Formspree uses this name attribute
                required
                placeholder="you@example.com"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-red-500 dark:text-red-400 text-xs mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message" // Formspree uses this name attribute
                rows="4"
                required
                placeholder="Your message..."
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-red-500 dark:text-red-400 text-xs mt-1"
              />
            </div>
            <div>
              <Button
                type="submit"
                disabled={state.submitting} // Disable button while submitting
                variant="primary"
                className="w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
              {/* Display general submission errors not tied to a specific field */}
              {state.errors &&
                !state.errors.getAllerrors &&
                state.errors.getFormErrors().length > 0 && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 text-center">
                    Oops! There was a problem submitting your form. Please try
                    again.
                  </p>
                )}
            </div>
          </form>
        )}
        </Card>
      </motion.div>

      {/* Social Contact Buttons Grid (remains the same) */}
      <TextSecondary as="p" className="text-center text-base mb-6 md:mb-8">
        Or connect with me on social media:
      </TextSecondary>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
        {socialContactButtons.map((button, index) => (
          <AnimatedSection key={index} delay={index * 0.1} threshold={0.1}>
            <HoverFlipButton {...button} />
          </AnimatedSection>
        ))}
      </div>
    </Section>
  );
};

export default ContactSection;
