import { Compass } from "lucide-react";
import { Container, Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <Container className="flex flex-col items-center gap-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center border border-brand-slate-200 text-brand-navy-700">
          <Compass aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h1 className="font-display text-3xl font-semibold text-brand-slate-900">Page not found</h1>
        <p className="max-w-md text-brand-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try heading back home,
          or get in touch if you were looking for something specific.
        </p>
        <div className="flex gap-3">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/contact" variant="ghost">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
