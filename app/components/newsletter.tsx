import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary to-accent p-8 text-center md:p-12">
          <h2 className="text-balance font-sans text-3xl font-bold text-primary-foreground md:text-4xl">
            Get exclusive deals & updates
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/90">
            Subscribe to our newsletter and be the first to know about new
            arrivals and special offers.
          </p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background text-foreground"
            />
            <Button type="submit" size="lg" variant="secondary">
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-sm text-primary-foreground/80">
            Join 50,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
