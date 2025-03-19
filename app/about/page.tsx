import { ArrowRight, Check, Github, Globe, Mail, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">About ToolHub</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We're on a mission to make financial tools accessible to everyone, completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Story</h2>
                <p className="text-muted-foreground">
                  ToolHub began with a simple idea: financial tools should be accessible to everyone, not just those who
                  can afford expensive software or financial advisors.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2023, we set out to create a comprehensive suite of calculators and tools that would help
                  people make better financial decisions. Our team of financial experts and developers worked tirelessly
                  to build tools that are both powerful and easy to use.
                </p>
                <p className="text-muted-foreground">
                  Today, ToolHub is used by thousands of people around the world to plan their finances, manage their
                  debt, and make informed investment decisions.
                </p>
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-24 w-24 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Values</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                The principles that guide everything we do.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Accessibility",
                description:
                  "We believe financial tools should be available to everyone, regardless of their financial situation.",
                icon: <Globe className="h-10 w-10 text-primary" />,
              },
              {
                title: "Transparency",
                description: "We're open about how our tools work and the assumptions they make. No black boxes here.",
                icon: <Check className="h-10 w-10 text-primary" />,
              },
              {
                title: "Privacy",
                description: "Your financial data is yours alone. We don't store it, sell it, or use it for anything.",
                icon: <Users className="h-10 w-10 text-primary" />,
              },
            ].map((value, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="p-2 w-fit rounded-lg bg-muted mb-4">{value.icon}</div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">The people behind ToolHub.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                bio: "Financial advisor with 15 years of experience.",
              },
              {
                name: "Sarah Chen",
                role: "Lead Developer",
                bio: "Full-stack developer specializing in financial applications.",
              },
              {
                name: "Michael Rodriguez",
                role: "Financial Analyst",
                bio: "CFA with expertise in investment strategies.",
              },
              {
                name: "Jessica Kim",
                role: "UX Designer",
                bio: "Creating intuitive interfaces for complex financial tools.",
              },
            ].map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have questions, feedback, or suggestions? We'd love to hear from you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>contact@toolhub.app</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="h-5 w-5 text-primary" />
                  <span>github.com/toolhub</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Button asChild>
                  <Link href="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Send us a message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input className="w-full p-2 rounded-md border" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input className="w-full p-2 rounded-md border" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input className="w-full p-2 rounded-md border" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea className="w-full p-2 rounded-md border" rows={4}></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

