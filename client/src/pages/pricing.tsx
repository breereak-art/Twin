import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

const pricingTiers = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI content creation",
    icon: Sparkles,
    features: [
      "3 thread generations per day",
      "1 voice pack",
      "Basic hook templates",
      "Community support",
    ],
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
    isCurrentPlan: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious creators who want to scale their content",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited thread generations",
      "10 voice packs",
      "All hook templates",
      "Thread remixer",
      "Omni-repurpose (LinkedIn, newsletters, scripts)",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonText: "Coming Soon",
    buttonVariant: "default" as const,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$99",
    period: "per month",
    description: "For agencies managing multiple client accounts",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Unlimited voice packs",
      "Multi-client dashboard",
      "Team collaboration",
      "White-label exports",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    buttonText: "Coming Soon",
    buttonVariant: "default" as const,
  },
];

export default function Pricing() {
  return (
    <div className="container max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-pricing-title">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-pricing-subtitle">
          Choose the plan that fits your content creation needs. Upgrade anytime as you grow.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative flex flex-col ${tier.popular ? "border-primary" : ""}`}
            data-testid={`card-pricing-${tier.id}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground" data-testid="badge-popular">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-muted">
                  <tier.icon className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl" data-testid={`text-tier-name-${tier.id}`}>
                {tier.name}
              </CardTitle>
              <CardDescription data-testid={`text-tier-description-${tier.id}`}>
                {tier.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold" data-testid={`text-tier-price-${tier.id}`}>
                  {tier.price}
                </span>
                <span className="text-muted-foreground ml-2">/{tier.period}</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3"
                    data-testid={`text-feature-${tier.id}-${index}`}
                  >
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={tier.buttonVariant}
                disabled={!tier.isCurrentPlan}
                data-testid={`button-subscribe-${tier.id}`}
              >
                {tier.buttonText}
                {!tier.isCurrentPlan && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2"
                    data-testid={`badge-coming-soon-${tier.id}`}
                  >
                    Coming Soon
                  </Badge>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4" data-testid="text-faq-title">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold" data-testid="text-faq-q1">
              When will paid plans be available?
            </h3>
            <p className="text-muted-foreground text-sm" data-testid="text-faq-a1">
              We're currently in beta and working hard to bring you the best experience. 
              Paid plans will be available soon. Join the waitlist to be notified.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold" data-testid="text-faq-q2">
              Can I cancel anytime?
            </h3>
            <p className="text-muted-foreground text-sm" data-testid="text-faq-a2">
              Yes, you can cancel your subscription at any time. 
              Your access will continue until the end of your billing period.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold" data-testid="text-faq-q3">
              Do you offer refunds?
            </h3>
            <p className="text-muted-foreground text-sm" data-testid="text-faq-a3">
              Yes, we offer a 14-day money-back guarantee on all paid plans. 
              If you're not satisfied, contact support for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
