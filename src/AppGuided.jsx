import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const meals = [
  {
    id: 1,
    name: "Pollastre amb quinoa i bròcoli",
    description:
      "Plat ric en proteïna, equilibrat i ideal per a persones actives.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    tags: ["sense gluten", "sense lactosa", "ric en proteïna", "esportiu"],
    allergens: [],
    ingredients: ["pollastre", "quinoa", "bròcoli"],
    calories: 610,
    protein: 46,
    type: "Dinar",
  },
  {
    id: 2,
    name: "Arròs blanc amb pollastre i pastanaga",
    description:
      "Opció suau i digestiva, pensada per a persones amb molèsties digestives.",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80",
    tags: ["digestiu", "sense gluten", "sense lactosa"],
    allergens: [],
    ingredients: ["arròs", "pollastre", "pastanaga"],
    calories: 470,
    protein: 34,
    type: "Dinar",
  },
  {
    id: 3,
    name: "Salmó amb arròs integral i verdures",
    description: "Menú complet amb greixos saludables i hidrats de qualitat.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    tags: ["sense gluten", "sense lactosa", "esportiu", "mediterrani"],
    allergens: ["peix"],
    ingredients: ["salmó", "arròs", "verdures"],
    calories: 650,
    protein: 42,
    type: "Dinar",
  },
  {
    id: 4,
    name: "Crema suau de carbassó amb ou dur",
    description: "Sopar lleuger, fàcil de menjar i adequat per a dietes suaus.",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    tags: ["digestiu", "sense gluten", "fàcil de mastegar", "baix en sal"],
    allergens: ["ou"],
    ingredients: ["carbassó", "ou", "patata"],
    calories: 390,
    protein: 22,
    type: "Sopar",
  },
  {
    id: 5,
    name: "Tofu marinat amb arròs i verdures",
    description: "Opció vegetal completa, sense lactosa i amb proteïna vegetal.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    tags: ["vegà", "vegetarià", "sense lactosa"],
    allergens: ["soja"],
    ingredients: ["tofu", "arròs", "verdures"],
    calories: 510,
    protein: 25,
    type: "Dinar",
  },
  {
    id: 6,
    name: "Peix blanc amb patata i carbassó",
    description: "Plat baix en greix, suau i orientat a sopars lleugers.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
    tags: ["digestiu", "baix en sal", "sense gluten", "sense lactosa"],
    allergens: ["peix"],
    ingredients: ["peix", "patata", "carbassó"],
    calories: 430,
    protein: 34,
    type: "Sopar",
  },
  {
    id: 7,
    name: "Gall dindi amb moniato i espinacs",
    description: "Plat ric en proteïna i molt equilibrat per al dia a dia.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
    tags: ["ric en proteïna", "sense gluten", "sense lactosa", "esportiu"],
    allergens: [],
    ingredients: ["gall dindi", "moniato", "espinacs"],
    calories: 560,
    protein: 44,
    type: "Dinar",
  },
  {
    id: 8,
    name: "Llenties estofades amb verdures",
    description: "Opció vegetal, completa i saciant per a menús setmanals.",
    image:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarià", "vegà", "sense lactosa"],
    allergens: [],
    ingredients: ["llenties", "verdures"],
    calories: 540,
    protein: 26,
    type: "Dinar",
  },
  {
    id: 9,
    name: "Bowl mediterrani sense gluten",
    description: "Combinació fresca de proteïna magra, arròs i verdures.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
    tags: ["mediterrani", "sense gluten", "sense lactosa"],
    allergens: [],
    ingredients: ["arròs", "pollastre", "verdures"],
    calories: 530,
    protein: 35,
    type: "Dinar",
  },
  {
    id: 10,
    name: "Crema de pastanaga baixa en sal",
    description: "Sopar lleuger, suau i adequat per a dietes digestives.",
    image:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=80",
    tags: ["digestiu", "baix en sal", "sense lactosa", "vegetarià"],
    allergens: [],
    ingredients: ["pastanaga", "patata", "verdures"],
    calories: 310,
    protein: 8,
    type: "Sopar",
  },
  {
    id: 11,
    name: "Pasta sense gluten amb verdures i pollastre",
    description: "Plat complet i adaptat a persones que eviten el gluten.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    tags: ["sense gluten", "ric en proteïna"],
    allergens: [],
    ingredients: ["pasta sense gluten", "pollastre", "verdures"],
    calories: 590,
    protein: 37,
    type: "Dinar",
  },
  {
    id: 12,
    name: "Hamburguesa vegetal amb amanida",
    description: "Alternativa vegetal equilibrada i molt visual.",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarià", "vegà", "sense fruits secs"],
    allergens: [],
    ingredients: ["hamburguesa vegetal", "amanida"],
    calories: 480,
    protein: 20,
    type: "Dinar",
  },
  {
    id: 13,
    name: "Amanida de cigrons mediterrània",
    description:
      "Plat fresc, vegetal i saciant amb llegums, verdures i oli d’oliva.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    tags: ["vegà", "vegetarià", "sense lactosa", "mediterrani"],
    allergens: [],
    ingredients: ["cigrons", "tomàquet", "cogombre", "oli d’oliva"],
    calories: 520,
    protein: 24,
    type: "Dinar",
  },
  {
    id: 14,
    name: "Vedella magra amb arròs i verdures",
    description:
      "Opció completa i rica en proteïna per a persones amb més desgast físic.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    tags: ["ric en proteïna", "sense gluten", "sense lactosa", "esportiu"],
    allergens: [],
    ingredients: ["vedella", "arròs", "verdures"],
    calories: 680,
    protein: 48,
    type: "Dinar",
  },
  {
    id: 15,
    name: "Truita d’espinacs amb patata",
    description:
      "Sopar senzill, suau i nutritiu amb ingredients fàcils de digerir.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarià", "sense gluten", "sense lactosa", "digestiu"],
    allergens: ["ou"],
    ingredients: ["ou", "espinacs", "patata"],
    calories: 430,
    protein: 26,
    type: "Sopar",
  },
  {
    id: 16,
    name: "Bowl de quinoa amb hummus i verdures",
    description:
      "Plat vegetal equilibrat amb proteïna vegetal, fibra i greixos saludables.",
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=80",
    tags: ["vegà", "vegetarià", "sense lactosa", "mediterrani"],
    allergens: [],
    ingredients: ["quinoa", "hummus", "verdures"],
    calories: 570,
    protein: 23,
    type: "Dinar",
  },
  {
    id: 17,
    name: "Pasta integral amb gall dindi i tomàquet",
    description:
      "Plat energètic i ric en proteïna, ideal per a dies amb més activitat.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    tags: ["ric en proteïna", "esportiu"],
    allergens: ["gluten"],
    ingredients: ["pasta integral", "gall dindi", "tomàquet"],
    calories: 640,
    protein: 40,
    type: "Dinar",
  },
  {
    id: 18,
    name: "Crema de carbassa amb pollastre esmicolat",
    description:
      "Sopar cremós, suau i digestiu amb una aportació extra de proteïna.",
    image:
      "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=900&q=80",
    tags: ["digestiu", "sense gluten", "sense lactosa", "ric en proteïna"],
    allergens: [],
    ingredients: ["carbassa", "pollastre", "patata"],
    calories: 420,
    protein: 30,
    type: "Sopar",
  },
  {
    id: 19,
    name: "Bacallà amb patata i mongeta tendra",
    description:
      "Plat lleuger, mediterrani i baix en greix, pensat per a menús equilibrats.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
    tags: ["mediterrani", "sense gluten", "sense lactosa", "baix en sal"],
    allergens: ["peix"],
    ingredients: ["bacallà", "patata", "mongeta tendra"],
    calories: 450,
    protein: 36,
    type: "Dinar",
  },
  {
    id: 20,
    name: "Arròs saltejat amb ou i verdures",
    description:
      "Plat senzill, complet i adaptable, amb hidrats suaus i verdures variades.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    tags: ["vegetarià", "sense gluten", "sense lactosa"],
    allergens: ["ou"],
    ingredients: ["arròs", "ou", "verdures"],
    calories: 500,
    protein: 24,
    type: "Dinar",
  },
];

const initialForm = {
  service: "",
  guidedAnswer: "",
  guidedChat: [],
  guidedSummary: null,
  guidedReady: false,
  aiProfile: null,
  selectedMeals: [],
  name: "",
  address: "",
  deliverySlot: "",
  orderStatus: "idle",
};

const steps = [
  "Tipus de servei",
  "El teu perfil",
  "Preparant menú",
  "El teu menú",
  "Resum",
  "Confirmació",
];

function AppGuided() {
  const [currentView, setCurrentView] = useState("home");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1700);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [step]);

  const recommendedMeals = useMemo(() => {
    const profile = form.aiProfile;

    if (!profile) {
      return meals;
    }

    const allergies = normalizeArray(profile.allergies);
    const avoidFoods = normalizeArray(profile.avoidFoods);
    const recommendedTags = normalizeArray(profile.recommendedTags);
    const mealsPerDay = normalizeText(profile.mealsPerDay);

    return meals
      .filter((meal) => {
        const mealAllergens = normalizeArray(meal.allergens);
        const mealIngredients = normalizeArray(meal.ingredients);
        const mealTags = normalizeArray(meal.tags);
        const mealType = normalizeText(meal.type);

        const hasAllergy = mealAllergens.some((allergen) =>
          allergies.includes(allergen)
        );

        const hasAvoidedFood = avoidFoods.some((food) => {
          return (
            mealIngredients.some((ingredient) => ingredient.includes(food)) ||
            normalizeText(meal.name).includes(food)
          );
        });

        const matchesMealType =
          !mealsPerDay ||
          mealsPerDay === "dinar-sopar" ||
          mealsPerDay.includes(mealType);

        const matchesTags =
          recommendedTags.length === 0 ||
          recommendedTags.some((tag) => mealTags.includes(tag));

        return !hasAllergy && !hasAvoidedFood && matchesMealType && matchesTags;
      })
      .sort((a, b) => {
        const aScore = getMealScore(a, recommendedTags);
        const bScore = getMealScore(b, recommendedTags);
        return bScore - aScore;
      });
  }, [form.aiProfile]);

  const neededMeals = getNeededMeals(form.aiProfile);

  function startWizard() {
    setCurrentView("wizard");
    setStep(0);
    setForm(initialForm);
  }

  function getFirstQuestion(service) {
    if (service === "nutritionist") {
      return {
        role: "assistant",
        text:
          "Hola, soc l’assistent VELTUP. T’ajudaré a preparar un primer perfil perquè el servei amb nutricionista sigui més útil. Quin és el teu objectiu principal?",
      };
    }

    if (service === "manual") {
      return {
        role: "assistant",
        text:
          "Perfecte. T’ajudaré a configurar el teu pla sense nutricionista. Què vols rebre: dinars, sopars o dinars i sopars?",
      };
    }

    return {
      role: "assistant",
      text:
        "Perfecte. T’ajudaré a decidir quin camí encaixa millor amb tu. Què busques principalment amb VELTUP?",
    };
  }

  function selectService(service) {
    const firstQuestion = getFirstQuestion(service);

    setForm((prev) => ({
      ...prev,
      service,
      guidedAnswer: "",
      guidedChat: [firstQuestion],
      guidedSummary: null,
      guidedReady: false,
      aiProfile: null,
      selectedMeals: [],
      deliverySlot: "",
      orderStatus: "idle",
    }));

    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function sendGuidedAnswer() {
    const answer = form.guidedAnswer.trim();

    if (!answer) {
      alert("Escriu una resposta abans de continuar.");
      return;
    }

    const userMessage = {
      role: "user",
      text: answer,
    };

    const updatedMessages = [...form.guidedChat, userMessage];

    setForm((prev) => ({
      ...prev,
      guidedAnswer: "",
      guidedChat: updatedMessages,
    }));

    try {
      const response = await fetch(
        "http://localhost:3001/api/veltup-guided-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: form.service,
            messages: updatedMessages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error en la resposta de l’assistent de VELTUP"
        );
      }

      const assistantMessage = {
        role: "assistant",
        text: data.readyForNextStep
          ? data.assistantMessage
          : `${data.assistantMessage}\n\n${data.nextQuestion}`,
      };

      setForm((prev) => ({
        ...prev,
        guidedChat: [...updatedMessages, assistantMessage],
        guidedSummary: data,
        guidedReady: data.readyForNextStep,
        aiProfile: data.profile || prev.aiProfile,
        deliverySlot: data.profile?.deliverySlot || prev.deliverySlot || "",
      }));
    } catch (error) {
      console.error(error);

      setForm((prev) => ({
        ...prev,
        guidedChat: [
          ...updatedMessages,
          {
            role: "assistant",
            text:
              "Ara mateix no puc connectar amb l’assistent de VELTUP. Revisa que el servidor estigui encès amb npm run server.",
          },
        ],
      }));
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleMeal(meal) {
    setForm((prev) => {
      const exists = prev.selectedMeals.find((item) => item.id === meal.id);

      if (exists) {
        return {
          ...prev,
          selectedMeals: prev.selectedMeals.filter(
            (item) => item.id !== meal.id
          ),
        };
      }

      return {
        ...prev,
        selectedMeals: [...prev.selectedMeals, meal],
      };
    });
  }

  function submitOrder() {
    const finalDeliverySlot =
      form.deliverySlot || form.aiProfile?.deliverySlot || "";

    if (!form.name.trim()) {
      alert("Escriu el teu nom complet.");
      return;
    }

    if (!form.address.trim()) {
      alert("Escriu l’adreça d’entrega.");
      return;
    }

    if (!finalDeliverySlot.trim()) {
      alert("Escriu el dia i la franja horària d’entrega.");
      return;
    }

    if (form.selectedMeals.length === 0) {
      alert("Selecciona com a mínim un plat.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      deliverySlot: finalDeliverySlot,
      orderStatus: "received",
    }));

    setStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    setCurrentView("home");
    setStep(0);
    setForm(initialForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextStep() {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function previousStep() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentView("home");
    }
  }

  if (currentView === "home") {
    return <HomePage onStart={startWizard} />;
  }

  return (
    <div className="veltup-app">
      <WizardHeader step={step} steps={steps} previousStep={previousStep} />

      <main className="wizard-layout clean">
        {step === 0 && <ServiceChoiceStep selectService={selectService} />}

        {step === 1 && (
          <ChatStep
            form={form}
            updateField={updateField}
            sendGuidedAnswer={sendGuidedAnswer}
            nextStep={() => setStep(2)}
          />
        )}

        {step === 2 && <LoadingStep />}

        {step === 3 && (
          <MenuStep
            meals={recommendedMeals}
            allMeals={meals}
            selectedMeals={form.selectedMeals}
            neededMeals={neededMeals}
            aiProfile={form.aiProfile}
            toggleMeal={toggleMeal}
            nextStep={nextStep}
          />
        )}

        {step === 4 && (
          <SummaryStep
            form={form}
            updateField={updateField}
            neededMeals={neededMeals}
            submitOrder={submitOrder}
          />
        )}

        {step === 5 && <ConfirmationStep form={form} goHome={goHome} />}
      </main>
    </div>
  );
}

function WizardHeader({ step, steps, previousStep }) {
  return (
    <header className="wizard-header simple">
      <button className="back-button" onClick={previousStep}>
        ←
      </button>

      <Logo />

      <div className="wizard-center">
        <span>{steps[step]}</span>
        <div className="progress-line">
          <div style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <strong>
        Pas {step + 1} de {steps.length}
      </strong>
    </header>
  );
}

function HomePage({ onStart }) {
  return (
    <div className="home-page">
      <header className="topbar">
        <Logo />

        <nav>
          <a href="#que-fem">Què fem</a>
          <a href="#com-funciona">Com funciona</a>
          <a href="#menus">Menús</a>
          <a href="#faqs">FAQs</a>
          <a href="#contacte">Contacte</a>
          <button onClick={onStart}>Comença ara</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Menjar saludable a domicili</p>

            <h1>
              Menja bé, <span>sense pensar-hi</span>
            </h1>

            <p className="hero-text">
              Menús personalitzats i entregats a casa, adaptats a les teves
              necessitats alimentàries. L’assistent de VELTUP crea el teu perfil
              i després et mostra plats recomanats.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={onStart}>
                Comença ara →
              </button>

              <a href="#com-funciona">Veure com funciona</a>
            </div>

            <div className="trust-row">
              <span>✓ Entrevista guiada amb IA</span>
              <span>✓ Plats recomanats visualment</span>
              <span>✓ Amb o sense nutricionista</span>
            </div>
          </div>

          <div className="hero-image-card">
            <img
              src="/assets/veltup-brand-packaging.png"
              alt="Logo i tupper de VELTUP"
            />

            <div className="floating-card">
              <strong>100% personalitzat</strong>
              <span>Adaptat a tu</span>
            </div>
          </div>
        </section>

        <section className="professional-section" id="que-fem">
          <p className="eyebrow">Què fem</p>
          <h2>VELTUP crea un perfil alimentari i et recomana plats adaptats</h2>

          <div className="professional-grid">
            <article className="professional-card">
              <h3>Entrevista intel·ligent</h3>
              <p>
                L’assistent pregunta el necessari i evita formularis repetitius.
              </p>
            </article>

            <article className="professional-card">
              <h3>Perfil personalitzat</h3>
              <p>
                Es detecten objectius, restriccions, preferències i necessitats.
              </p>
            </article>

            <article className="professional-card">
              <h3>Menús visuals</h3>
              <p>
                Després de l’entrevista, l’usuari veu plats compatibles i
                recomanats.
              </p>
            </article>
          </div>
        </section>

        <section className="how-section" id="com-funciona">
          <p className="eyebrow">Procés simplificat</p>
          <h2>Només 6 passos visuals</h2>

          <div className="how-grid five">
            <InfoCard
              number="1"
              title="Tria servei"
              text="Amb nutricionista, sense nutricionista o orientació IA."
            />
            <InfoCard
              number="2"
              title="Perfil"
              text="L’assistent et fa preguntes guiades."
            />
            <InfoCard
              number="3"
              title="Menú"
              text="Preparem recomanacions segons el teu perfil."
            />
            <InfoCard
              number="4"
              title="Plats"
              text="Esculls els plats que més t’agraden."
            />
            <InfoCard
              number="5"
              title="Resum"
              text="Revises el pla i confirmes la proposta."
            />
          </div>
        </section>

        <section className="visual-section" id="menus">
          <div>
            <p className="eyebrow">Menús adaptats</p>
            <h2>Plats filtrats segons el que expliques</h2>
            <p>
              L’assistent pot detectar al·lèrgies, aliments a evitar, objectius
              i preferències per mostrar opcions més adequades.
            </p>
          </div>

          <div className="tag-cloud">
            <span>Sense gluten</span>
            <span>Sense lactosa</span>
            <span>Digestiu</span>
            <span>Ric en proteïna</span>
            <span>Vegetarià</span>
            <span>Vegà</span>
            <span>Baix en sal</span>
            <span>Mediterrani</span>
          </div>
        </section>

        <section className="faq-section" id="faqs">
          <p className="eyebrow">FAQs</p>
          <h2>Preguntes freqüents</h2>

          <div className="faq-list">
            <details>
              <summary>La IA substitueix un nutricionista?</summary>
              <p>
                No. L’assistent ajuda a orientar i ordenar informació, però no
                substitueix un professional sanitari.
              </p>
            </details>

            <details>
              <summary>Puc indicar al·lèrgies?</summary>
              <p>
                Sí. L’assistent les detecta i després la web evita plats
                incompatibles.
              </p>
            </details>

            <details>
              <summary>Puc utilitzar VELTUP sense nutricionista?</summary>
              <p>
                Sí. Si ja saps què necessites, pots configurar el teu pla de
                manera directa amb ajuda de l’assistent.
              </p>
            </details>
          </div>
        </section>

        <section className="contact-section" id="contacte">
          <p className="eyebrow">Contacte</p>
          <h2>Parlem?</h2>
          <p>
            Si tens dubtes o necessites ajuda amb la teva comanda, ens pots
            escriure directament.
          </p>

          <div className="contact-card">
            <strong>Correu de contacte</strong>
            <a
              className="contact-link"
              href="mailto:veltup.barcelona@gmail.com"
            >
              veltup.barcelona@gmail.com
            </a>
          </div>
        </section>

        <footer className="site-footer">
          <div>
            <strong>VELTUP</strong>
            <p>Menjar sa, a la teva mida.</p>
          </div>

          <div>
            <p>Contacte: veltup.barcelona@gmail.com</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function ServiceChoiceStep({ selectService }) {
  return (
    <section className="choice-screen">
      <p className="eyebrow">Tipus de servei</p>
      <h1>Com vols començar?</h1>
      <p>
        Tria l’opció que millor s’adapti a les teves necessitats. Després
        l’assistent crearà el teu perfil.
      </p>

      <div className="service-grid choice">
        <button
          className="service-card"
          onClick={() => selectService("nutritionist")}
        >
          <div className="icon-box">💬</div>
          <h3>Amb nutricionista</h3>
          <p>
            Vull que m’ajudin a descobrir les meves necessitats alimentàries amb
            una entrevista guiada.
          </p>
          <span>Començar conversa →</span>
        </button>

        <button className="service-card" onClick={() => selectService("manual")}>
          <div className="icon-box">📋</div>
          <h3>Sense nutricionista</h3>
          <p>
            Ja sé què necessito i vull configurar el meu pla directament amb
            ajuda de l’assistent.
          </p>
          <span>Configurar pla →</span>
        </button>

        <button className="service-card" onClick={() => selectService("ai")}>
          <div className="icon-box">✨</div>
          <h3>Orientació IA</h3>
          <p>
            Encara no sé quin servei encaixa millor amb mi i vull una primera
            orientació.
          </p>
          <span>Rebre orientació →</span>
        </button>
      </div>
    </section>
  );
}

function ChatStep({ form, updateField, sendGuidedAnswer, nextStep }) {
  return (
    <section className="chat-screen">
      <p className="eyebrow">El teu perfil</p>
      <h1>Parla amb l’assistent VELTUP</h1>
      <p>El teu guia nutricional virtual</p>

      <div className="chat-shell">
        <div className="guided-messages">
          {form.guidedChat.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "guided-message user"
                  : "guided-message assistant"
              }
            >
              {message.text.split("\n").map((line, lineIndex) => (
                <p key={lineIndex}>{line}</p>
              ))}
            </div>
          ))}
        </div>

        {!form.guidedReady && (
          <div className="chat-input-row">
            <textarea
              value={form.guidedAnswer}
              onChange={(event) =>
                updateField("guidedAnswer", event.target.value)
              }
              placeholder="Escriu aquí..."
            />

            <button onClick={sendGuidedAnswer}>➤</button>
          </div>
        )}

        {form.guidedReady && (
          <button className="primary-button full" onClick={nextStep}>
            Preparar el meu menú →
          </button>
        )}
      </div>

      {form.guidedSummary && <ProfilePreview summary={form.guidedSummary} />}
    </section>
  );
}

function LoadingStep() {
  return (
    <section className="loading-screen">
      <div className="loading-icon">🥗</div>
      <h1>Preparant el teu menú...</h1>
      <p>L’assistent està creant plats personalitzats per a tu.</p>
    </section>
  );
}

function ProfilePreview({ summary }) {
  return (
    <div className="guided-summary">
      <h3>Perfil creat per VELTUP</h3>
      <p>{summary.summary}</p>

      <div className="summary-columns">
        <div>
          <strong>Necessitats detectades</strong>

          {summary.detectedNeeds?.length ? (
            <ul>
              {summary.detectedNeeds.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Encara falten dades.</p>
          )}
        </div>

        <div>
          <strong>Recomanació VELTUP</strong>

          {summary.recommendation?.length ? (
            <ul>
              {summary.recommendation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Encara falten dades.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuStep({
  meals,
  allMeals,
  selectedMeals,
  neededMeals,
  aiProfile,
  toggleMeal,
  nextStep,
}) {
  const visibleMeals = meals.length ? meals : allMeals;

  return (
    <section className="menu-screen">
      <p className="eyebrow">El teu menú</p>
      <h1>Plats recomanats per a tu</h1>
      <p>
        Hem utilitzat el perfil creat per l’assistent per mostrar opcions
        compatibles. Pots seleccionar els plats que més t’agradin.
      </p>

      {aiProfile && (
        <div className="profile-card">
          <div>
            <p className="eyebrow">El teu perfil</p>
            <h3>{aiProfile.goal || "Perfil VELTUP personalitzat"}</h3>
            <p>{buildProfileText(aiProfile)}</p>
          </div>

          <div className="profile-tags">
            {normalizeArray(aiProfile.recommendedTags).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="selection-status">
        <strong>
          {selectedMeals.length}
          {neededMeals ? `/${neededMeals}` : ""} seleccionats
        </strong>

        <div>
          <span
            style={{
              width: neededMeals
                ? `${Math.min(
                    (selectedMeals.length / neededMeals) * 100,
                    100
                  )}%`
                : "20%",
            }}
          />
        </div>
      </div>

      <div className="meal-grid">
        {visibleMeals.map((meal) => {
          const selected = selectedMeals.some((item) => item.id === meal.id);

          return (
            <button
              key={meal.id}
              className={selected ? "meal-card selected" : "meal-card"}
              onClick={() => toggleMeal(meal)}
            >
              <img src={meal.image} alt={meal.name} />

              <div className="meal-content">
                <div className="meal-top">
                  <span>{meal.type}</span>
                  {selected && <strong>✓ Seleccionat</strong>}
                </div>

                <h3>{meal.name}</h3>
                <p>{meal.description}</p>

                <div className="meal-tags">
                  {meal.tags.map((tag) => (
                    <small key={tag}>{tag}</small>
                  ))}
                </div>

                <div className="macros">
                  <span>{meal.calories} kcal</span>
                  <span>{meal.protein}g prot.</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="next-box">
        <p>Quan tinguis els plats seleccionats, revisa el resum final.</p>
        <button className="primary-button" onClick={nextStep}>
          Continuar →
        </button>
      </div>
    </section>
  );
}

function SummaryStep({ form, updateField, neededMeals, submitOrder }) {
  const people = Number(form.aiProfile?.people || 1);
  const price = form.selectedMeals.length * people * 8.5;
  const deliverySlot = form.deliverySlot || form.aiProfile?.deliverySlot || "";

  return (
    <section className="summary-screen">
      <p className="eyebrow">Resum</p>
      <h1>Revisa el teu pla VELTUP</h1>
      <p>
        Aquí tens el resum del perfil creat, els plats seleccionats i les dades
        d’entrega.
      </p>

      <div className="summary-grid">
        <SummaryItem title="Servei" value={getServiceName(form.service)} />
        <SummaryItem
          title="Objectiu"
          value={form.aiProfile?.goal || "No indicat"}
        />
        <SummaryItem
          title="Àpats"
          value={`${form.selectedMeals.length}${
            neededMeals ? `/${neededMeals}` : ""
          } seleccionats`}
        />
        <SummaryItem
          title="Dies"
          value={form.aiProfile?.days || "No indicat"}
        />
        <SummaryItem title="Persones" value={form.aiProfile?.people || "1"} />
        <SummaryItem title="Preu estimat" value={`${price.toFixed(2)} €`} />
      </div>

      {form.guidedSummary && <ProfilePreview summary={form.guidedSummary} />}

      <div className="selected-list">
        <h3>Plats seleccionats</h3>

        {form.selectedMeals.length === 0 && (
          <p>Encara no has seleccionat cap plat.</p>
        )}

        {form.selectedMeals.map((meal) => (
          <div key={meal.id}>
            <span>{meal.name}</span>
            <small>{meal.type}</small>
          </div>
        ))}
      </div>

      <div className="delivery-box">
        <h3>Dades d’entrega</h3>

        <label className="field">
          <span>Nom complet</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Exemple: Carla Zabala"
          />
        </label>

        <label className="field">
          <span>Adreça d’entrega</span>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Exemple: Carrer de Mallorca 10, Barcelona"
          />
        </label>

        <label className="field">
          <span>Dia i franja horària d’entrega</span>
          <input
            value={deliverySlot}
            onChange={(event) => updateField("deliverySlot", event.target.value)}
            placeholder="Exemple: dissabte a la tarda"
          />
        </label>
      </div>

      <div className="warning-box">
        <strong>Avís mèdic</strong>
        <p>
          Aquesta proposta és orientativa i no substitueix el diagnòstic,
          tractament o seguiment d’un professional sanitari.
        </p>
      </div>

      <button className="primary-button full" onClick={submitOrder}>
        Finalitzar i enviar el meu pla a VELTUP →
      </button>
    </section>
  );
}

function ConfirmationStep({ form, goHome }) {
  const deliverySlot = form.deliverySlot || form.aiProfile?.deliverySlot || "";

  const selectedMealNames = form.selectedMeals
    .map((meal) => meal.name)
    .join(", ");

  return (
    <section className="confirmation-screen">
      <div className="confirmation-logo-card">
        <img src="/assets/veltup-logo-icon.png" alt="Logo VELTUP" />
        <strong>VELTUP</strong>
      </div>

      <div className="confirmation-icon">✓</div>

      <p className="eyebrow">Pla rebut correctament</p>

      <h1>El teu pla VELTUP ha estat rebut</h1>

      <p className="confirmation-intro">
        Gràcies per completar el formulari. Hem rebut el teu perfil, els teus
        plats seleccionats i les dades d’entrega. Revisarem la teva proposta i
        rebràs més informació en breu.
      </p>

      <div className="confirmation-card">
        <h3>Resum de la teva sol·licitud</h3>

        <div className="confirmation-summary-grid">
          <div>
            <span>Servei</span>
            <strong>{getServiceName(form.service)}</strong>
          </div>

          <div>
            <span>Objectiu</span>
            <strong>{form.aiProfile?.goal || "No indicat"}</strong>
          </div>

          <div>
            <span>Franja d’entrega</span>
            <strong>{deliverySlot || "Pendent de confirmar"}</strong>
          </div>

          <div>
            <span>Adreça</span>
            <strong>{form.address || "No indicada"}</strong>
          </div>
        </div>

        <div className="confirmation-meals-box">
          <span>Plats seleccionats</span>
          <p>{selectedMealNames || "Encara no hi ha plats seleccionats."}</p>
        </div>
      </div>

      <div className="confirmation-next">
        <p>
          El teu pla queda registrat com a proposta inicial. L’equip de VELTUP
          revisarà la informació i prepararà els següents passos.
        </p>

        <button className="primary-button" onClick={goHome}>
          Tornar a la pàgina principal →
        </button>
      </div>
    </section>
  );
}

function InfoCard({ number, title, text }) {
  return (
    <article className="info-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function SummaryItem({ title, value }) {
  return (
    <article className="summary-item">
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Logo() {
  return (
    <div className="logo">
      <img src="/assets/veltup-logo-icon.png" alt="Logo VELTUP" />
      <strong>VELTUP</strong>
    </div>
  );
}

function getServiceName(service) {
  if (service === "nutritionist") return "Amb nutricionista";
  if (service === "manual") return "Sense nutricionista";
  if (service === "ai") return "Orientació IA";
  return "No indicat";
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizeText(item)).filter(Boolean);
}

function getMealScore(meal, recommendedTags) {
  const mealTags = normalizeArray(meal.tags);

  return recommendedTags.reduce((score, tag) => {
    return mealTags.includes(tag) ? score + 1 : score;
  }, 0);
}

function getNeededMeals(profile) {
  if (!profile) {
    return 0;
  }

  const days = Number(profile.days || 0);
  const mealsPerDay = normalizeText(profile.mealsPerDay);

  if (!days) {
    return 0;
  }

  if (mealsPerDay === "dinar-sopar") {
    return days * 2;
  }

  return days;
}

function buildProfileText(profile) {
  const parts = [];

  if (profile.days) {
    parts.push(`${profile.days} dies`);
  }

  if (profile.mealsPerDay) {
    parts.push(profile.mealsPerDay);
  }

  if (profile.deliverySlot) {
    parts.push(`entrega: ${profile.deliverySlot}`);
  }

  if (profile.allergies?.length) {
    parts.push(`evitant ${profile.allergies.join(", ")}`);
  }

  if (profile.preferences?.length) {
    parts.push(`preferències: ${profile.preferences.join(", ")}`);
  }

  return parts.length
    ? parts.join(" · ")
    : "Perfil creat a partir de l’entrevista guiada.";
}

export default AppGuided;
