# VELTUP

Aplicació web React/Vite per al projecte VELTUP: servei de menjar saludable personalitzat en format tupper.

## Estructura del projecte

- `index.html` - pàgina d’entrada.
- `package.json` - dependències i scripts.
- `vite.config.js` - configuració de Vite.
- `src/main.jsx` - punt d’entrada de l’aplicació.
- `src/App.jsx` - lògica central de l’aplicació i rutes simulades.
- `src/styles.css` - estils globals i disseny responsive.
- `src/components/` - components reutilitzables.
- `src/data/meals.js` - base de dades local de plats.
- `src/utils/mealFilter.js` - lògica de filtratge de plats segons perfil.
- `src/utils/priceCalculator.js` - càlcul de preu estimat.

## Com executar-ho

Aquest projecte requereix Node.js i npm per executar-lo localment.

1. Obre un terminal a la carpeta del projecte:
   ```bash
   cd /Users/carlazabalamestre/Desktop/veltup
   ```
2. Instal·la les dependències:
   ```bash
   npm install
   ```
3. Executa el servidor de desenvolupament:
   ```bash
   npm run dev
   ```
4. Obre la URL que apareix a la consola.

> Si l’entorn no té `node` o `npm`, instal·la-les abans d’executar.

## Com funciona la lògica de filtratge de menús

La funció `filterMeals` (`src/utils/mealFilter.js`) analitza el perfil de l’usuari i exclou automàticament plats que contenen al·lèrgens o ingredients incompatibles amb:

- al·lèrgies declarades
- intoleràncies declarades
- aliments que l’usuari vol evitar
- preferències de dieta (vegà, vegetarià, baix en sal, esportiu)
- condicions digestives com SIBO o intestí irritable

A continuació ordena els plats compatibles perquè prioritzin etiquetes digestives, esportives i de baix risc.

## Com es podria connectar amb una API real més endavant

### API d’intel·ligència artificial
- Crear una ruta backend que rebi el perfil de l’usuari i retorni preguntes/respostes dinàmiques.
- Substituir les simulacions de xat d’IA per consultes a un servei com OpenAI, Azure OpenAI o una API nativa.
- Emmagatzemar el text d’entrada i respostes per a revisions futures.

### Backend i base de dades d’usuaris
- Afegir un servidor Node/Express, Django o similar.
- Emmagatzemar usuaris, perfils, preferències i ordres en una base de dades (PostgreSQL, MongoDB, etc.).
- Autenticació amb JWT o sessions.
- Substituir `localStorage` per consultes a l’API.

### Sistema de pagaments
- Integrar Stripe, PayPal o un gateway local.
- Afegir una pantalla de checkout després de la confirmació del pla.
- Gestionar subscripcions setmanals i facturació recurrent.

### Subscripció setmanal i àrea privada
- Crear una API per a la gestió de subscripcions i estats de comanda.
- Afegir autenticació real per accedir a l’àrea privada del client.
- Emmagatzemar plans setmanals, calendari de menús i xat amb el nutricionista a la base de dades.

## Notes

- L’aplicació està feta per ser clara, responsive i accessible.
- El flux inclou registre, selecció de serveis, simulació de xat, generador de menús, planificació setmanal, resum i confirmació.
- La interfície en català transmet salut, proximitat, sostenibilitat i confiança.
