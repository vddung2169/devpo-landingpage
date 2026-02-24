import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const newsArticles = [
  {
    title: "iPhone 16 Pro Max: Everything You Need to Know",
    excerpt:
      "Apple's latest flagship brings revolutionary camera technology and unprecedented performance to your pocket.",
    date: "March 15, 2024",
    image: "/news-iphone-16-pro-announcement.jpg",
    category: "Product Launch",
  },
  {
    title: "5G Technology: The Future is Here",
    excerpt:
      "Discover how 5G connectivity is transforming mobile experiences with lightning-fast speeds and ultra-low latency.",
    date: "March 12, 2024",
    image: "/news-5g-technology-future.jpg",
    category: "Technology",
  },
  {
    title: "Best Budget Smartphones of 2024",
    excerpt:
      "Get flagship features without breaking the bank. Our expert picks for the best value smartphones this year.",
    date: "March 10, 2024",
    image: "/news-budget-smartphones-2024.jpg",
    category: "Buying Guide",
  },
  {
    title: "Wireless Charging: Tips and Tricks",
    excerpt:
      "Maximize your wireless charging efficiency and extend your battery life with these expert recommendations.",
    date: "March 8, 2024",
    image: "/news-wireless-charging-tips.jpg",
    category: "Tips & Tricks",
  },
];

export function News() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground lg:text-5xl">
            Latest News & Updates
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Stay informed with the latest mobile technology news, product
            launches, and expert insights
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {newsArticles.map((article, index) => (
            <Card
              key={index}
              className="group overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {article.category}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <h3 className="mb-2 text-balance text-xl font-semibold text-foreground">
                  {article.title}
                </h3>
                <p className="mb-4 text-pretty text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
                <Button variant="link" className="group/btn p-0 text-primary">
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
}
