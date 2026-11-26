import type { Metadata } from "next";
import { Container, CloseBand, PageIntro } from "@/components/ui/primitives";
import { FilterableProductGrid } from "@/components/catalog/FilterableProductGrid";
import { flowerCategories, flowerProducts, flowerGrades, destinationMarkets } from "@/data/products";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Floriculture export",
  description:
    "Export cut flowers, stems, and fillers with Bravair: graded, cold-chain handled, and shipped to global markets.",
};

export default function FloriculturePage() {
  return (
    <>
      <PageIntro
        title="Cut flowers, stems, and fillers, graded to spec"
        lead="Roses, summer flowers, carnations, and fillers, handled with the precision cut flowers demand."
        photo={{ photo: photos.flowers, slot: "floriculture-hero", ratio: "land" }}
      />

      <section className="section">
        <Container>
          <div className="head head--split">
            <h2>The stems we ship</h2>
            <p className="lead">Filter by family. Every variety is graded before it leaves.</p>
          </div>
          <FilterableProductGrid categories={flowerCategories} products={flowerProducts} label="Floriculture products" />
        </Container>
      </section>

      <section className="section band--soft">
        <Container>
          <div className="head head--split">
            <h2>Grades and specs</h2>
            <p className="lead">Rose grades by stem length, head size and bunch count.</p>
          </div>
          <div className="table-wrap" data-reveal>
            <table className="table">
              <caption className="visually-hidden">Rose grades</caption>
              <thead>
                <tr>
                  <th scope="col">Grade</th>
                  <th scope="col">Stem length</th>
                  <th scope="col">Head size</th>
                  <th scope="col">Bunch count</th>
                </tr>
              </thead>
              <tbody>
                {flowerGrades.map((row) => (
                  <tr key={row.grade}>
                    <td>{row.grade}</td>
                    <td>{row.stemLength}</td>
                    <td>{row.headSize}</td>
                    <td>{row.bunchCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid-12">
            <div className="g-aside">
              <h2>Where the flowers go</h2>
            </div>
            <ul className="rows g-main">
              {destinationMarkets.map((market) => (
                <li key={market.region} data-reveal>
                  <h3>{market.region}</h3>
                  <p>{market.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Ready to ship your flowers?"
        line="Tell us your varieties, volumes, and target market."
        primary={{ label: "Request a quote", href: "/contact" }}
      />
    </>
  );
}
