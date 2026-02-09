'use client';

import Link from 'next/link';
import { FiBook, FiUsers, FiClock, FiTrendingUp, FiBookOpen, FiAward, FiSearch, FiArrowRight } from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FiBook className="text-3xl text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                LibraryHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-primary-600 transition">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-primary-600 transition">
                Contact
              </Link>
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  📚 Modern Library Management
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Manage Your Library{' '}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Effortlessly
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A comprehensive digital solution for library management. Issue books, track transactions, 
                manage reservations, and more - all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2">
                  Start Free Trial
                  <FiArrowRight />
                </Link>
                <Link href="/login" className="btn btn-outline text-lg px-8 py-3">
                  Sign In
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">10K+</div>
                  <div className="text-sm text-gray-600">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">5K+</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">99%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <FiBook className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold">Available Books</div>
                        <div className="text-2xl font-bold text-primary-600">8,432</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <FiUsers className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold">Active Members</div>
                        <div className="text-2xl font-bold text-green-600">4,891</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <FiClock className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-semibold">Today's Issues</div>
                        <div className="text-2xl font-bold text-orange-600">124</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to manage your library efficiently</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBookOpen className="text-4xl" />,
                title: 'Book Management',
                description: 'Easily catalog, organize, and track your entire book collection with detailed metadata.',
                color: 'from-blue-500 to-cyan-500',
                href: '#feature-book-management',
              },
              {
                icon: <FiUsers className="text-4xl" />,
                title: 'User Management',
                description: 'Manage students, faculty, and staff with different access levels and permissions.',
                color: 'from-purple-500 to-pink-500',
                href: '#feature-user-management',
              },
              {
                icon: <FiClock className="text-4xl" />,
                title: 'Transaction Tracking',
                description: 'Monitor book issues, returns, and reservations in real-time with automated notifications.',
                color: 'from-orange-500 to-red-500',
                href: '#feature-issue-return',
              },
              {
                icon: <FiSearch className="text-4xl" />,
                title: 'Advanced Search',
                description: 'Find books instantly with powerful search filters by title, author, ISBN, or category.',
                color: 'from-green-500 to-emerald-500',
                href: '#feature-search-discovery',
              },
              {
                icon: <FiTrendingUp className="text-4xl" />,
                title: 'Analytics & Reports',
                description: 'Get insights into library usage, popular books, and member activity with detailed reports.',
                color: 'from-indigo-500 to-blue-500',
                href: '#feature-analytics',
              },
              {
                icon: <FiAward className="text-4xl" />,
                title: 'Fine Management',
                description: 'Automated calculation and tracking of overdue fines with payment integration.',
                color: 'from-pink-500 to-rose-500',
                href: '#feature-fines',
              },
            ].map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Books in Catalog' },
              { value: '5,000+', label: 'Active Users' },
              { value: '50,000+', label: 'Transactions' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-5xl font-bold">{stat.value}</div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">About LibraryHub</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              LibraryHub is built to simplify day-to-day library operations with a clean, reliable workflow for
              cataloging, circulation, and member services. It is designed for schools, colleges, and public
              libraries that want a modern, web-first system.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From self-serve search to automated reminders, every feature is focused on reducing manual work and
              helping your team serve readers faster.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold mb-4">What You Get</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">01</span>
                Centralized catalog with clean metadata and fast search
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">02</span>
                Automated issue/return tracking with due-date alerts
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">03</span>
                Clear reporting on usage, fines, and popular titles
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-lg text-gray-600">Choose a plan that fits your library size and needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Free', note: 'For small libraries and pilots', features: ['Up to 1,000 books', 'Basic reporting', 'Email support'] },
              { name: 'Growth', price: '$49/mo', note: 'For growing institutions', features: ['Up to 25,000 books', 'Advanced analytics', 'Priority support'] },
              { name: 'Enterprise', price: 'Custom', note: 'For large networks', features: ['Unlimited books', 'Custom integrations', 'Dedicated success manager'] },
            ].map((plan) => (
              <div key={plan.name} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.note}</p>
                <ul className="space-y-2 text-gray-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-primary-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">See a Live Demo</h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore a guided walkthrough of key workflows like cataloging, issuing, and reporting. We can tailor
            the demo to your collection size and staff structure.
          </p>
          <Link href="/login" className="btn btn-outline text-lg px-8 py-3">
            Request Demo Access
          </Link>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">From the Blog</h2>
            <p className="text-lg text-gray-600">Practical tips on library operations and digital transformation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Modern Cataloging in a Day', tag: 'Operations' },
              { title: 'Reducing Overdue Books by 30%', tag: 'Insights' },
              { title: 'Choosing the Right Library KPIs', tag: 'Analytics' },
            ].map((post) => (
              <div key={post.title} className="bg-white border border-gray-200 rounded-2xl p-6">
                <span className="text-sm text-primary-600 font-semibold">{post.tag}</span>
                <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                <p className="text-gray-600 mt-3">Short, actionable reads for busy library teams.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white scroll-mt-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about onboarding or integrations? Our team is here to help.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-gray-700">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
              <div className="text-sm uppercase tracking-wide text-gray-500">Email</div>
              <div className="font-semibold">support@libraryhub.example</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4">
              <div className="text-sm uppercase tracking-wide text-gray-500">Phone</div>
              <div className="font-semibold">+1 (555) 010-1010</div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Legal & Security</h2>
            <p className="text-lg text-gray-600">Clear policies and strong protection for your data.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: 'privacy',
                title: 'Privacy',
                text: 'We collect only the information needed to operate the service and never sell user data.',
              },
              {
                id: 'terms',
                title: 'Terms',
                text: 'Transparent terms covering usage, responsibilities, and service expectations.',
              },
              {
                id: 'security',
                title: 'Security',
                text: 'Role-based access, regular backups, and secure infrastructure are standard.',
              },
            ].map((item) => (
              <div key={item.id} id={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 scroll-mt-24">
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Library?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of libraries already using LibraryHub to streamline their operations.
          </p>
          <Link href="/register" className="btn btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
            Get Started Now
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiBook className="text-2xl text-primary-400" />
                <span className="text-xl font-bold">LibraryHub</span>
              </div>
              <p className="text-gray-400">Modern library management made simple.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#about" className="hover:text-white transition">About</Link></li>
                <li><Link href="#blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 LibraryHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
