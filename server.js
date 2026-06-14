import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

dotenv.config();

console.log(
  "Clau Claude carregada:",
  process.env.ANTHROPIC_API_KEY ? "Sí" : "No"
);

console.log(
  "Clau Resend carregada:",
  process.env.RESEND_API_KEY ? "Sí" : "No"
);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

function cleanJson(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch {
    try {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      const possibleJson = text.slice(firstBrace, lastBrace + 1);

      return JSON.parse(possibleJson);
    } catch {
      return null;
    }
  }
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function getDeliveryText(deliverySlot) {
  const value = normalizeText(deliverySlot);

  if (!value) {
    return "a la franja d’entrega indicada";
  }

  const days = [
    "dilluns",
    "dimarts",
    "dimecres",
    "dijous",
    "divendres",
    "dissabte",
    "diumenge",
  ];

  const day = days.find((item) => value.includes(item));

  let moment = "";

  if (value.includes("matí") || value.includes("mati")) {
    moment = "al matí";
  } else if (value.includes("migdia")) {
    moment = "al migdia";
  } else if (value.includes("tarda")) {
    moment = "a la tarda";
  } else if (value.includes("vespre") || value.includes("nit")) {
    moment = "al vespre";
  }

  if (day && moment) {
    return `el següent ${day} ${moment}`;
  }

  if (day) {
    return `el següent ${day}`;
  }

  return deliverySlot;
}

function buildMealsList(selectedMeals) {
  if (!Array.isArray(selectedMeals) || selectedMeals.length === 0) {
    return "<li>No hi ha plats seleccionats.</li>";
  }

  return selectedMeals
    .map((meal) => `<li>${meal.name} — ${meal.type || "Àpat"}</li>`)
    .join("");
}

function buildMealsText(selectedMeals) {
  if (!Array.isArray(selectedMeals) || selectedMeals.length === 0) {
    return "No hi ha plats seleccionats.";
  }

  return selectedMeals.map((meal) => `- ${meal.name}`).join("\n");
}

app.get("/", (req, res) => {
  res.send("Servidor VELTUP funcionant correctament amb Claude i Resend.");
});

app.post("/api/veltup-guided-chat", async (req, res) => {
  try {
    const { service, messages } = req.body;

    const serviceName =
      service === "nutritionist"
        ? "Amb nutricionista"
        : service === "manual"
        ? "Sense nutricionista"
        : "Orientació IA";

    const conversation = messages
      .map((message) => {
        const name = message.role === "user" ? "Usuari" : "VELTUP";
        return `${name}: ${message.text}`;
      })
      .join("\n");

    const prompt = `
Ets l'assistent digital de VELTUP.

VELTUP és un servei de tuppers saludables, personalitzats i entregats a domicili.
L'usuari ha triat aquest servei: ${serviceName}

Has de fer una entrevista guiada, curta, clara i natural.
L'objectiu és entendre l'usuari i crear un perfil alimentari perquè després la web pugui recomanar plats visuals.

CONVERSA FINS ARA:
${conversation || "Encara no hi ha conversa."}

REGLES IMPORTANTS:
- Respon sempre en català.
- No diguis que ets Claude ni Anthropic.
- Parla com l'assistent de VELTUP.
- Fes només UNA pregunta nova cada vegada.
- No repeteixis preguntes que l'usuari ja ha respost.
- No facis diagnòstics mèdics.
- No substitueixis un metge ni un nutricionista.
- Si l'usuari parla de patologies, SIBO, colon irritable, medicació, trastorns alimentaris o al·lèrgies greus, recomana revisió professional.
- Has d'anar construint un perfil estructurat.
- Quan tinguis prou informació, posa readyForNextStep a true.
- Normalment n'hi ha prou amb 4-7 respostes útils de l'usuari.
- Sigues amable, proper i concret.
- Abans de posar readyForNextStep a true, has d'haver preguntat també quin dia i franja horària vol l'entrega dels seus tàpers.
- Exemple de pregunta d'entrega: "Quin dia i franja horària prefereixes per rebre els teus tàpers? Per exemple: dissabte a la tarda, dilluns al matí o dimecres al vespre."

SI EL SERVEI ÉS "Amb nutricionista":
Recull informació útil per preparar una primera valoració:
- Objectiu principal
- Hàbits alimentaris
- Horaris o rutina
- Restriccions, al·lèrgies o intoleràncies
- Problemes digestius o necessitats especials
- Preferències alimentàries
- Quants dies vol cobrir
- Si vol dinars, sopars o tots dos
- Dia i franja horària d'entrega
- Si necessita seguiment professional

SI EL SERVEI ÉS "Sense nutricionista":
Ajuda l'usuari a configurar el pla directament:
- Què vol rebre
- Quants dies
- Dinars, sopars o tots dos
- Al·lèrgies o intoleràncies
- Aliments que vol evitar
- Preferències alimentàries
- Tipus de plats recomanats
- Dia i franja horària d'entrega

SI EL SERVEI ÉS "Orientació IA":
Ajuda l'usuari a decidir el millor camí:
- Què busca
- Si necessita nutricionista
- Si pot configurar el pla directament
- Si té restriccions o necessitats especials
- Dia i franja horària d'entrega
- Recomanació de servei

Has de retornar NOMÉS un JSON vàlid amb aquesta estructura exacta:

{
  "assistantMessage": "Resposta natural i breu per a l'usuari",
  "nextQuestion": "Pregunta següent clara i curta",
  "detectedNeeds": ["necessitat detectada 1", "necessitat detectada 2"],
  "recommendation": ["recomanació 1", "recomanació 2"],
  "summary": "Resum curt del perfil de l'usuari",
  "profile": {
    "goal": "objectiu principal o buit",
    "days": "nombre de dies o buit",
    "mealsPerDay": "dinar, sopar, dinar-sopar o buit",
    "people": "nombre de persones o 1",
    "deliverySlot": "dia i franja horària d'entrega o buit",
    "allergies": ["gluten", "lactosa", "fruits secs", "ou", "peix", "soja"],
    "avoidFoods": ["aliment a evitar 1", "aliment a evitar 2"],
    "preferences": ["preferència 1", "preferència 2"],
    "recommendedTags": ["digestiu", "sense lactosa", "sense gluten", "ric en proteïna", "vegetarià", "vegà", "baix en sal", "mediterrani", "esportiu"]
  },
  "readyForNextStep": false
}

Quan readyForNextStep sigui true, el perfil ha d'estar tan complet com sigui possible.
Si falta informació important, readyForNextStep ha de ser false i has de fer una pregunta concreta.
`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawText =
      message.content?.[0]?.type === "text" ? message.content[0].text : "";

    const parsed = cleanJson(rawText);

    if (!parsed) {
      return res.json({
        assistantMessage:
          "He entès la informació, però necessito una mica més de detall per crear el teu perfil VELTUP.",
        nextQuestion:
          "Quin dia i franja horària prefereixes per rebre els teus tàpers? Per exemple: dissabte a la tarda.",
        detectedNeeds: [],
        recommendation: [],
        summary: "Encara falta informació per crear una recomanació completa.",
        profile: {
          goal: "",
          days: "",
          mealsPerDay: "",
          people: "1",
          deliverySlot: "",
          allergies: [],
          avoidFoods: [],
          preferences: [],
          recommendedTags: [],
        },
        readyForNextStep: false,
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Error amb Claude:", error);

    res.status(500).json({
      error: "No s'ha pogut generar la resposta amb l'assistent de VELTUP.",
    });
  }
});

app.post("/api/send-confirmation-email", async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      service,
      profile,
      selectedMeals,
      deliverySlot,
    } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        error: "Falta RESEND_API_KEY al fitxer .env.",
      });
    }

    if (!email) {
      return res.status(400).json({
        error: "Falta el correu electrònic de l’usuari.",
      });
    }

    const finalDeliverySlot =
      deliverySlot || profile?.deliverySlot || "Franja d’entrega pendent";

    const deliveryText = getDeliveryText(finalDeliverySlot);
    const mealsList = buildMealsList(selectedMeals);
    const mealsText = buildMealsText(selectedMeals);

    const serviceName =
      service === "nutritionist"
        ? "Amb nutricionista"
        : service === "manual"
        ? "Sense nutricionista"
        : "Orientació IA";

    const subject = "Confirmació del teu pla VELTUP";

    const html = `
      <div style="font-family: Arial, sans-serif; color: #2d2d2a; line-height: 1.6; max-width: 680px; margin: 0 auto;">
        <h1 style="color: #245d1b;">Gràcies per utilitzar VELTUP</h1>

        <p>Hola ${name || ""},</p>

        <p>
          Hem rebut correctament la configuració del teu pla VELTUP.
          La teva dieta, els teus plats i el teu pla personalitzat han quedat registrats.
        </p>

        <p>
          Segons la franja que has escollit, rebràs els teus tàpers
          <strong>${deliveryText}</strong>.
        </p>

        <h2 style="color: #245d1b;">Resum del teu pla</h2>

        <ul>
          <li><strong>Servei:</strong> ${serviceName}</li>
          <li><strong>Objectiu:</strong> ${profile?.goal || "No indicat"}</li>
          <li><strong>Dies:</strong> ${profile?.days || "No indicat"}</li>
          <li><strong>Àpats:</strong> ${profile?.mealsPerDay || "No indicat"}</li>
          <li><strong>Franja d’entrega:</strong> ${finalDeliverySlot}</li>
          <li><strong>Adreça:</strong> ${address || "No indicada"}</li>
        </ul>

        <h2 style="color: #245d1b;">Plats seleccionats</h2>

        <ul>
          ${mealsList}
        </ul>

        <p>
          L’equip de VELTUP revisarà la teva proposta i prepararà la teva comanda
          perquè la rebis a casa el més aviat possible.
        </p>

        <p style="margin-top: 32px;">
          Gràcies per confiar en VELTUP.<br />
          <strong>Menjar sa, a la teva mida.</strong>
        </p>
      </div>
    `;

    const text = `
Gràcies per utilitzar VELTUP

Hola ${name || ""},

Hem rebut correctament la configuració del teu pla VELTUP.
La teva dieta, els teus plats i el teu pla personalitzat han quedat registrats.

Segons la franja que has escollit, rebràs els teus tàpers ${deliveryText}.

Servei: ${serviceName}
Objectiu: ${profile?.goal || "No indicat"}
Dies: ${profile?.days || "No indicat"}
Àpats: ${profile?.mealsPerDay || "No indicat"}
Franja d'entrega: ${finalDeliverySlot}
Adreça: ${address || "No indicada"}

Plats seleccionats:
${mealsText}

Gràcies per confiar en VELTUP.
Menjar sa, a la teva mida.
`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "VELTUP <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Error de Resend:", error);

      return res.status(500).json({
        error:
          error.message ||
          "Resend no ha pogut enviar el correu de confirmació.",
      });
    }

    res.json({
      ok: true,
      message: "Correu de confirmació enviat correctament amb Resend.",
      data,
    });
  } catch (error) {
    console.error("Error enviant el correu amb Resend:", error);

    res.status(500).json({
      error: "No s'ha pogut enviar el correu de confirmació amb Resend.",
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor VELTUP funcionant a http://localhost:${port}`);
});
