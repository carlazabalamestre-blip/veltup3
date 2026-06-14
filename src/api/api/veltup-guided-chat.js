import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

function getFallbackResponse() {
  return {
    assistantMessage:
      "He entès la informació, però necessito una mica més de detall per crear el teu perfil VELTUP.",
    nextQuestion:
      "Quin dia i franja horària prefereixes per rebre els teus tàpers? Per exemple: dissabte a la tarda, dilluns al matí o dimecres al vespre.",
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
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Mètode no permès.",
    });
  }

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: "Falta ANTHROPIC_API_KEY a les variables d'entorn.",
      });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const { service, messages } = body;
    const safeMessages = Array.isArray(messages) ? messages : [];

    const serviceName =
      service === "nutritionist"
        ? "Amb nutricionista"
        : service === "manual"
        ? "Sense nutricionista"
        : "Orientació IA";

    const conversation = safeMessages
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
      return res.status(200).json(getFallbackResponse());
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error("Error amb Claude:", error);

    return res.status(500).json({
      error: "No s'ha pogut generar la resposta amb l'assistent de VELTUP.",
    });
  }
}
