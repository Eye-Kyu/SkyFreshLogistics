import { Container, Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="section">
      <Container>
        <div className="corridor stack-lg">
          <p className="corridor__code" aria-hidden="true">
            404
          </p>
          <h1 data-hero-item>This lane doesn&apos;t exist</h1>
          <p className="lead" data-hero-item>
            The page you&apos;re looking for has moved or never existed. Head home, or tell us what you were after.
          </p>
          <div className="actions" data-hero-item>
            <Button href="/">Back to home</Button>
            <Button href="/contact" variant="quiet">
              Contact us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
