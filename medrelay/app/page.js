"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TextParallaxContent from "./components/TextParallaxContent";
import StackCardTestimonials from "./components/StackCardTestimonials";
import BasicFAQ from "./components/BasicFAQ";
import ShiftingContactForm from "./components/ShiftingContactForm";
import CountUpStats from "./components/CountUpStats";
import Footer from "./components/Footer";
import { Basic } from "next/font/google";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "FAQ", href: "#faq" },
];

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Refs for each section
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/RoleSelection");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("username", username, { expires: 7 });
      setAuthDialogOpen(false);
      router.push("/RoleSelection");
    } else {
      setMessage(data.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("username", username, { expires: 7 });
      setAuthDialogOpen(false);
      router.push("/RoleSelection");
    } else {
      setMessage(data.message);
    }
  };

  const handleNavigationClick = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">MedRelay</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                MedRelay™
              </span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() =>
                  handleNavigationClick(
                    item.name === "Home"
                      ? homeRef
                      : item.name === "Features"
                      ? featuresRef
                      : item.name === "Testimonials"
                      ? testimonialsRef
                      : faqRef
                  )
                }
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={() => setAuthDialogOpen(true)}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">MedRelay</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  MedRelay
                </span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() =>
                        handleNavigationClick(
                          item.name === "Home"
                            ? homeRef
                            : item.name === "Features"
                            ? featuresRef
                            : item.name === "Testimonials"
                            ? testimonialsRef
                            : faqRef
                        )
                      }
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  <button
                    onClick={() => setAuthDialogOpen(true)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <DialogPanel
          className="w-full max-w-lg p-8 bg-white rounded-lg shadow"
          as={motion.div}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLogin ? "Log in to your account" : "Sign up for an account"}
            </h2>
            <button
              type="button"
              onClick={() => setAuthDialogOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  whileFocus={{ scale: 1 }}
                />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Organization
              </label>
              <motion.input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                whileFocus={{ scale: 1 }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                whileFocus={{ scale: 1 }}
              />
            </div>
            {!isLogin && (
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <motion.input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  whileFocus={{ scale: 1 }}
                />
              </div>
            )}
            {message && <p className="text-sm text-red-600 mb-4">{message}</p>}
            <motion.button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Log in" : "Sign up"}
            </motion.button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              {isLogin ? " Sign up" : " Log in"}
            </button>
          </p>
        </DialogPanel>
      </Dialog>

      <div className="relative isolate px-6 pt-14 lg:px-8" ref={homeRef}>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <img src="/logo.png" width="300" height="300" alt="Logo" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Ahead of Emergency™
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Real-time communication platform for Ambulance services to
              directly connect with nearby Hospitals
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => setAuthDialogOpen(true)}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </button>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      <div ref={featuresRef}>
        <CountUpStats />
        <TextParallaxContent />
      </div>
      <div ref={testimonialsRef}>
        <StackCardTestimonials />
      </div>
      <div ref={faqRef}>
        <BasicFAQ />
      </div>
      <ShiftingContactForm />
      <Footer />
    </div>
  );
}
