
import { useEffect, useState } from "react";
import { questions } from "../data/questions";

export default function Flashcards({ onResult }) {
  const [predmet, setPredmet] = useState("");
  const [okruh, setOkruh] = useState("");
  const [tema, setTema] = useState("");
  const [filtr, setFiltr] = useState("vse");
  const [index, setIndex] = useState(0);
  const [otocena, setOtocena] = useState(false);
  const [odpovedUzivatele, setOdpovedUzivatele] = useState("");

  const [vysledky, setVysledky] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("flashcards-vysledky") || "{}"
      );
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "flashcards-vysledky",
      JSON.stringify(vysledky)
    );
  }, [vysledky]);

  const predmety = [...new Set(questions.map(q => q.predmet))];

  const okruhy = [...new Set(
    questions
      .filter(q => q.predmet === predmet)
      .map(q => q.okruh)
  )];

  const temata = [...new Set(
    questions
      .filter(q => q.predmet === predmet && q.okruh === okruh)
      .map(q => q.tema)
  )];

  const vybraneOtazky = questions.filter(q =>
    (!predmet || q.predmet === predmet) &&
    (!okruh || q.okruh === okruh) &&
    (!tema || q.tema === tema)
  );

  const filtrovaneOtazky = vybraneOtazky.filter(q =>
    filtr === "vse" || vysledky[q.id]?.stav === filtr
  );

  const aktualniOtazka = filtrovaneOtazky[index];

  const resetKarty = () => {
    setIndex(0);
    setOtocena(false);
    setOdpovedUzivatele("");
  };

  const vyberPredmet = (hodnota) => {
    setPredmet(hodnota);
    setOkruh("");
    setTema("");
    resetKarty();
  };

  const vyberOkruh = (hodnota) => {
    setOkruh(hodnota);
    setTema("");
    resetKarty();
  };

  const dalsiKarta = () => {
    setIndex(i =>
      filtrovaneOtazky.length
        ? (i + 1) % filtrovaneOtazky.length
        : 0
    );
    setOtocena(false);
    setOdpovedUzivatele("");
  };

  const hodnotit = (stav) => {
    if (!aktualniOtazka) return;

    const vysledek = {
      questionId: aktualniOtazka.id,
      stav,
      datum: new Date().toISOString()
    };

    const noveVysledky = {
      ...vysledky,
      [aktualniOtazka.id]: vysledek
    };

    setVysledky(noveVysledky);
    onResult?.(vysledek);

    // Pokud filtrujeme konkrétní stav, otázka
    // může po hodnocení ze seznamu zmizet.
    if (filtr !== "vse" && stav !== filtr) {
      setIndex(i => Math.max(
        0,
        Math.min(i, filtrovaneOtazky.length - 2)
      ));
      setOtocena(false);
      setOdpovedUzivatele("");
    } else {
      dalsiKarta();
    }
  };

  const pocet = (stav) =>
    vybraneOtazky.filter(
      q => vysledky[q.id]?.stav === stav
    ).length;

  return (
    <main className="fc-page">
      <div className="fc-heading">
        <h1>Maturitní kartičky</h1>
        <p>Vyber předmět, okruh a téma a začni procvičovat.</p>
      </div>

      <div className="fc-stats">
        <div>Celkem: <strong>{vybraneOtazky.length}</strong></div>
        <div>Umím: <strong>{pocet("umim")}</strong></div>
        <div>Neumím: <strong>{pocet("neumim")}</strong></div>
        <div>Zopakovat: <strong>{pocet("zopakovat")}</strong></div>
      </div>

      <div className="fc-layout">
        <aside className="fc-panel">
          <h2>Předměty</h2>

          {predmety.map(p => (
            <button
              key={p}
              className={`fc-option ${predmet === p ? "active" : ""}`}
              onClick={() => vyberPredmet(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="fc-option"
            onClick={() => vyberPredmet("")}
          >
            Všechny předměty
          </button>
        </aside>

        <section className="fc-center">
          <div className="fc-filters">
            <label htmlFor="fc-filter">Filtrovat podle znalosti</label>
            <select
              id="fc-filter"
              value={filtr}
              onChange={e => {
                setFiltr(e.target.value);
                resetKarty();
              }}
            >
              <option value="vse">Všechny otázky</option>
              <option value="umim">Umím</option>
              <option value="neumim">Neumím</option>
              <option value="zopakovat">Zopakovat</option>
            </select>
          </div>

          {aktualniOtazka ? (
            <>
              <div className="fc-card">
                <span className="fc-counter">
                  Otázka {index + 1} z {filtrovaneOtazky.length}
                </span>

                <h2>
                  {otocena
                    ? "Správná odpověď"
                    : aktualniOtazka.otazka}
                </h2>

                {otocena ? (
                  <p>{aktualniOtazka.odpoved}</p>
                ) : (
                  <textarea
                    placeholder="Napiš svoji odpověď..."
                    value={odpovedUzivatele}
                    onChange={e =>
                      setOdpovedUzivatele(e.target.value)
                    }
                  />
                )}

                <button
                  className="fc-primary"
                  onClick={() => setOtocena(!otocena)}
                >
                  {otocena
                    ? "Zobrazit otázku"
                    : "Zobrazit odpověď"}
                </button>
              </div>

              <div className="fc-actions">
                <button
                  className="fc-know"
                  disabled={!otocena}
                  onClick={() => hodnotit("umim")}
                >
                  Umím
                </button>

                <button
                  className="fc-dontknow"
                  disabled={!otocena}
                  onClick={() => hodnotit("neumim")}
                >
                  Neumím
                </button>

                <button
                  className="fc-repeat"
                  disabled={!otocena}
                  onClick={() => hodnotit("zopakovat")}
                >
                  Zopakovat
                </button>
              </div>

              <button
                className="fc-next"
                onClick={dalsiKarta}
              >
                Další otázka →
              </button>
            </>
          ) : (
            <div className="fc-card">
              <h2>Žádné otázky</h2>
              <p>Pro tento výběr nejsou dostupné kartičky.</p>
            </div>
          )}
        </section>

        <aside className="fc-panel">
          <h2>Okruhy</h2>

          {okruhy.length === 0 && (
            <p>Nejdříve vyber předmět.</p>
          )}

          {okruhy.map(o => (
            <button
              key={o}
              className={`fc-option ${okruh === o ? "active" : ""}`}
              onClick={() => vyberOkruh(o)}
            >
              {o}
            </button>
          ))}

          {okruh && (
            <>
              <h2>Témata</h2>

              {temata.map(t => (
                <button
                  key={t}
                  className={`fc-option ${tema === t ? "active" : ""}`}
                  onClick={() => {
                    setTema(t);
                    resetKarty();
                  }}
                >
                  {t}
                </button>
              ))}

              <button
                className="fc-option"
                onClick={() => {
                  setTema("");
                  resetKarty();
                }}
              >
                Všechna témata
              </button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
