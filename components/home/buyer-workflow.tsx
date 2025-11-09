import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Search,
  FileCheck,
  CreditCard,
  TrendingUp,
  BarChart3,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
} from "lucide-react";

const workflowSteps = [
  {
    step: 1,
    title: "Browse & Discover",
    description: "Explore diverse investment opportunities across various crops, durations, and risk levels. Filter by your preferences and review detailed farm information.",
    icon: Search,
    duration: "5-10 minutes",
    image: "https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBmYXJtaW5nfGVufDF8fHx8MTc2MjI4MzYxNnww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Filter by crop type, duration, and returns",
      "View farm photos and detailed descriptions",
      "Check risk levels and insurance coverage",
      "Read success stories and reviews",
    ],
  },
  {
    step: 2,
    title: "Review & Select",
    description: "Deep dive into investment details, analyze projected returns, and use our calculator to plan your investment amount.",
    icon: FileCheck,
    duration: "10-15 minutes",
    image: "https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBpbnZlc3RtZW50JTIwcGxhbm5pbmd8ZW58MXx8fHwxNzYyMjgzNjE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Use the investment calculator",
      "Review farm location and size",
      "Check payout schedules",
      "Understand key highlights and benefits",
    ],
  },
  {
    step: 3,
    title: "Invest Securely",
    description: "Complete your investment with our secure payment system. Your investment is protected by comprehensive farm insurance from day one.",
    icon: CreditCard,
    duration: "5 minutes",
    image: "https://images.unsplash.com/photo-1658869163471-81665d648612?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBoYW5kc2hha2UlMjBidXNpbmVzc3xlbnwxfHx8fDE3NjIyODM2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Secure payment processing",
      "Instant investment confirmation",
      "Digital investment certificate",
      "Automatic insurance activation",
    ],
  },
  {
    step: 4,
    title: "Track Progress",
    description: "Stay informed with regular updates on your farm's progress. Access real-time reports, photos, and growth milestones throughout the investment period.",
    icon: BarChart3,
    duration: "Ongoing",
    image: "https://images.unsplash.com/photo-1761839257946-4616bcfafec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NjIyODM2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Weekly farm progress reports",
      "Photo updates from the field",
      "Growth milestone notifications",
      "Direct communication with farm managers",
    ],
  },
  {
    step: 5,
    title: "Receive Returns",
    description: "Celebrate harvest success and receive your returns according to the payout schedule. Reinvest or withdraw your earnings seamlessly.",
    icon: DollarSign,
    duration: "As scheduled",
    image: "https://images.unsplash.com/photo-1761097446245-16ca9c3e372a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwaGFydmVzdCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjI4MzYxNXww&ixlib=rb-4.1.0&q=80&w=1080",
    features: [
      "Timely payout processing",
      "Detailed return breakdown",
      "One-click reinvestment option",
      "Flexible withdrawal methods",
    ],
  },
];

const benefits = [
  {
    icon: Shield,
    title: "100% Insurance Coverage",
    description: "Every farm is fully insured against crop failure and natural disasters",
  },
  {
    icon: TrendingUp,
    title: "Proven Returns",
    description: "Historical returns of 12-50% based on investment duration",
  },
  {
    icon: Clock,
    title: "Flexible Durations",
    description: "Choose from 3 to 18-month investment periods that fit your goals",
  },
];

interface BuyerWorkflowProps {
  onGetStarted: () => void;
}

export function BuyerWorkflow({ onGetStarted }: BuyerWorkflowProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Your Investment Journey</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            From browsing opportunities to receiving returns, we've made agricultural investing
            simple, transparent, and rewarding. Here's how it works.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-primary hover:bg-white/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-10">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">5 Simple Steps to Start Investing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes it easy for anyone to start building wealth through
            agricultural investments.
          </p>
        </div>

        <div className="space-y-12">
          {workflowSteps.map((step, index) => (
            <div
              key={step.step}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                </div>

                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {step.step === 1 && (
                  <Button onClick={onGetStarted} className="mt-4">
                    Explore Investments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 border-y border-border py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of investors who are growing their wealth through sustainable agriculture.
            Start with as little as $300.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="bg-primary hover:bg-primary/90">
              Browse Investments
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
            <div>
              <p className="text-3xl font-bold text-primary mb-2">$2.5M+</p>
              <p className="text-sm text-muted-foreground">Total Invested</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">1,200+</p>
              <p className="text-sm text-muted-foreground">Active Investors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-2">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
