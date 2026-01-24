"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "Get in touch via email",
      value: "support@anantastro.com",
      link: "mailto:support@anantastro.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us directly",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      description: "Visit our office",
      value: "123 Astrology Street, Cosmic City, CC 12345",
      link: "#",
    },
    {
      icon: Clock,
      title: "Hours",
      description: "We're here for you",
      value: "Mon - Sun: 24/7 Support",
      link: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-light text-primary-dark relative py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions? We&apos;re here to help! Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="bg-gray-50 border-gray-200 rounded-lg h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone (Optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    className="bg-gray-50 border-gray-200 rounded-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    className="bg-gray-50 border-gray-200 rounded-lg min-h-32"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-[#d6682a] text-white font-bold text-lg py-6 rounded-lg hover:shadow-lg transition-all"
                  size="lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600 leading-relaxed">
                  Whether you have questions about our services, need technical support, or want to provide feedback, we&apos;re here to help. Our team is available 24/7 to assist you.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary-dark flex items-center justify-center shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                            {info.link !== "#" ? (
                              <a
                                href={info.link}
                                className="text-primary-dark hover:text-primary font-medium"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-primary-dark font-medium">{info.value}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Additional Info Card */}
              <Card className="border-0 shadow-lg bg-primary-light">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h3>
                      <p className="text-gray-700 text-sm mb-4">
                        For urgent matters or immediate support, please call us directly or use our live chat feature available on the website.
                      </p>
                      <Button
                        variant="outline"
                        className="!border-[#794235] text-[#794235] hover:bg-[#794235] hover:text-white"
                      >
                        Start Live Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-8" style={{ background: '#fcbb18' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How accurate are the AI-generated reports?",
                answer: "Our AI reports combine traditional astrological wisdom with advanced algorithms, providing highly accurate insights. However, for critical life decisions, we recommend consulting with our expert astrologers.",
              },
              {
                question: "How do I book a consultation?",
                answer: "You can book a consultation directly from our homepage booking form, or navigate to the Services page to choose a specific type of consultation.",
              },
              {
                question: "Is my personal information secure?",
                answer: "Absolutely! We use industry-standard encryption to protect all your data. Your birth details and personal information are never shared with third parties.",
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "Yes, we offer a 30-day money-back guarantee on all our services. If you're not satisfied, contact our support team for a full refund.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

