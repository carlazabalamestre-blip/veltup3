import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { ProgressStepper } from './components/ProgressStepper.jsx';
import { MealCard } from './components/MealCard.jsx';
import { DisclaimerBox } from './components/DisclaimerBox.jsx';
import { meals } from './data/meals.js';
import { filterMeals } from './utils/mealFilter.js';
import { calculatePlanPrice, formatPrice } from './utils/priceCalculator.js';

const wizardSteps = [
  'Dades bàsiques',
  'Perfil',
  'Objectiu',
  'Hàbits',
  'Preferències',
  'Al·lèrgies',
  'Condicions',
  'Subscripció',
];

const profileOptions = [
  'Estudiant',
  'Treballador/a amb poc temps',
  'Esportista',
  'Persona amb al·lèrgies o intoleràncies',
  'Persona amb problemes digestius',
  'Gent gran',
  'Família',
  'Persona que vol millorar hàbits alimentaris',
  'Altres',
];

const objectiveOptions = [
  'Menjar més saludable',
  'Estalviar temps',
  'Perdre pes',
  'Guanyar massa muscular',
  'Millorar el rendiment esportiu',
  'Millorar la digestió',
  'Seguir recomanacions mèdiques',
  'Adaptar la dieta per al·lèrgies o intoleràncies',
  'Organitzar millor els àpats setmanals',
  'Altres',
];

const menuPreferences = [
  'Menú mediterrani',
  'Menú vegetarià',
  'Menú vegà',
  'Menú ric en proteïna',
  'Menú baix en sal',
  'Menú baix en sucre',
  'Menú hipocalòric',
  'Menú esportiu',
  'Menú digestiu',
  'Menú fàcil de mastegar',
  'Altres',
];

const allergyOptions = ['Gluten', 'Lactosa', 'Fruits secs', 'Ou', 'Peix', 'Marisc', 'Soja', 'Sèsam', 'Api', 'Mostassa', 'Altres'];

const conditionsOptions = [
  'SIBO',
  'Síndrome de l’intestí irritable',
  'Problemes de digestió',
  'Reflux',
  'Diabetis',
  'Hipertensió',
  'Colesterol elevat',
  'Recuperació mèdica',
  'Dificultat de masticació',
  'Altres',
  'Prefereixo no indicar-ho',
];

const daysNames = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];

const serviceOptions = [
  {
    key: 'amb nutricionista',
    title: 'Vull servei amb nutricionista',
    subtitle: 'Un professional revisarà el teu perfil, objectius i necessitats per crear un pla adaptat i fer-ne seguiment.',
  },
  {
    key: 'sense nutricionista',
    title: 'Ja tinc recomanacions i no necessito nutricionista',
    subtitle: 'Si ja tens indicacions externes, VELTUP prepararà els àpats seguint les teves instruccions.',
  },
  {
    key: 'orientació ia',
    title: 'Vull orientació inicial amb l’assistent IA',
    subtitle: 'L’assistent virtual et farà preguntes inicials per preparar una proposta orientativa.',
  },
];

const initialForm = {
  name: '',
  lastName: '',
  age: '',
  email: '',
  phone: '',
  city: '',
  zip: '',
  password: '',
  confirmPassword: '',
  profile: '',
  profileNotes: '',
  objective: '',
  objectiveNotes: '',
  mealsPerDay: 2,
  days: 7,
  people: 1,
  repeatMeals: 'Més d’un plat es pot repetir',
  subscription: 'Subscripció setmanal',
  deliveryDay: 'Dissabte',
  deliveryWindow: 'Matí',
  serviceType: 'amb nutricionista',
  preferredMenu: 'Menú mediterrani',
  likedFoods: '',
  dislikedFoods: '',
  avoidFoods: '',
  allergies: [],
  intolerances: [],
  conditions: [],
  medicalNotes: '',
  isReturningContainers: 'No',
  deliveryAddress: '',
  deliveryFloor: '',
  deliveryNotes: '',
  professionalSource: '',
  recommendations: '',
  prohibitions: '',
  textureNeeds: '',
  additionalNotes: '',
};

function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [wizardStep, setWizardStep] = useState(1);
  const [loginState, setLoginState] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [selectedService, setSelectedService] = useState('amb nutricionista');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'El teu perfil s’ha enviat al nutricionista de VELTUP. Quins són els teus objectius principals?' },
  ]);
  const [aiMessages, setAiMessages] = useState([
    { from: 'bot', text: 'Hola, sóc l’assistent virtual de VELTUP. Et faré unes preguntes per entendre millor les teves necessitats.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [generatedMeals, setGeneratedMeals] = useState([]);
  const [planner, setPlanner] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [menuWarning, setMenuWarning] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('veltup-form');
      if (stored) setFormData(JSON.parse(stored));
      const storedMeals = localStorage.getItem('veltup-selectedMeals');
      if (storedMeals) setSelectedMeals(JSON.parse(storedMeals));
      const storedRoute = localStorage.getItem('veltup-route');
      if (storedRoute) setCurrentRoute(storedRoute);
    } catch (error) {
      console.warn('No es poden carregar dades locals', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('veltup-form', JSON.stringify(formData));
    localStorage.setItem('veltup-selectedMeals', JSON.stringify(selectedMeals));
    localStorage.setItem('veltup-route', currentRoute);
  }, [formData, selectedMeals, currentRoute]);

  const compatibleMeals = useMemo(() => filterMeals(meals, formData), [formData]);

  const totalSelected = selectedMeals.length;
  const totalRequired = formData.days * formData.mealsPerDay;
  const daysList = daysNames.slice(0, formData.days);
  const priceData = calculatePlanPrice({
    days: formData.days,
    mealsPerDay: formData.mealsPerDay,
    people: formData.people,
    serviceType: formData.serviceType,
  });

  const goTo = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const current = new Set(prev[field] || []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [field]: Array.from(current) };
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (!loginState.email || !loginState.password) {
      setLoginError('Introdueix un correu i una contrasenya.');
      return;
    }
    setLoginError('');
    setIsAuthenticated(true);
    setCurrentRoute('dashboard');
  };

  const handleRegisterNext = () => {
    if (wizardStep < wizardSteps.length) {
      setWizardStep((step) => step + 1);
    } else {
      goTo('serviceChoice');
    }
  };

  const handleRegisterPrev = () => {
    if (wizardStep > 1) setWizardStep((step) => step - 1);
  };

  const handleSelectMeal = (meal) => {
    if (selectedMeals.some((item) => item.id === meal.id)) return;
    if (selectedMeals.length >= totalRequired) {
      setMenuWarning('Has seleccionat el nombre màxim d’àpats per al teu pla actual.');
      return;
    }
    setSelectedMeals((prev) => [...prev, meal]);
    setMenuWarning('');
  };

  const handleRemoveMeal = (id) => {
    setSelectedMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const generateMealProposal = () => {
    const available = compatibleMeals.slice();
    if (available.length === 0) {
      setMenuWarning('No hi ha plats compatibles amb el teu perfil actual. Revisa les restriccions o canvia preferències.');
      setGeneratedMeals([]);
      return;
    }
    const proposal = [];
    while (proposal.length < Math.min(10, available.length)) {
      const index = proposal.length % available.length;
      proposal.push(available[index]);
    }
    setGeneratedMeals(proposal);
    setMenuWarning('');
  };

  const buildPlanner = () => {
    const plan = {};
    daysList.forEach((day, dayIndex) => {
      plan[day] = {};
      const dayMeals = selectedMeals.slice(dayIndex * formData.mealsPerDay, dayIndex * formData.mealsPerDay + formData.mealsPerDay);
      const types = formData.mealsPerDay === 1 ? ['dinar'] : ['dinar', 'sopar'];
      types.forEach((type, index) => {
        plan[day][type] = dayMeals[index] || null;
      });
    });
    setPlanner(plan);
  };

  const handleAssignMeal = (day, mealType, mealId) => {
    setPlanner((prev) => {
      const next = { ...prev };
      const meal = selectedMeals.find((item) => item.id === mealId) || null;
      next[day] = { ...next[day], [mealType]: meal };
      return next;
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('landing');
  };

  const aiAsk = (question) => {
    const responses = {
      'Com et trobes actualment?': 'Gràcies per compartir-ho. Continuem per adaptar la proposta a la teva situació actual.',
      'Tens cansament, inflor, dolor digestiu, reflux, diarrea, restrenyiment o altres molèsties?': 'Aquesta informació ens ajuda a prioritzar plats més suaus i digestius.',
      'Tens alguna al·lèrgia diagnosticada?': 'Si hi ha al·lèrgies, filtrarem els plats perquè no hi apareguin ingredients incompatibles.',
      'Tens alguna intolerància coneguda?': 'Això ens ajuda a eliminar lactosa, gluten o altres components de la selecció.',
      'Hi ha aliments que et senten malament?': 'Entès. Prioritzarem alternatives i aliments de fàcil digestió.',
      'Tens alguna condició digestiva com SIBO o intestí irritable?': 'Recomanem un pla baix en fermentables i amb ingredients molt suaus.',
      'Tens alguna patologia metabòlica, cardiovascular o mèdica que vulguis indicar?': 'Hem anotat la condició per al resum final i la revisió manual.',
      'Fas esport o activitat física? Amb quina freqüència?': 'Ajustarem la proporció de proteïna i hidrats segons el teu nivell d’activitat.',
      'Quin objectiu vols assolir?': 'Perfecte, això ens ajudarà a definir el tipus de menú recomanat.',
      'Tens proves mèdiques, analítiques o recomanacions prèvies?': 'Això ens permetrà incloure un avís de revisió manual si cal.',
      'Quins aliments vols evitar?': 'Entès, exclourem aquests ingredients de la selecció.',
      'Quants dies i àpats vols cobrir amb VELTUP?': 'Genial, tenim la durada i el volum de menús que necessites.',
    };
    setAiMessages((prev) => [...prev, { from: 'user', text: question }, { from: 'bot', text: responses[question] || 'Molt bé, seguim construint la proposta!' }]);
  };

  const renderLanding = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container hero-grid">
          <div className="hero-panel">
            <p className="section-title">Menjar saludable, personalitzat i preparat per a tu</p>
            <h1 className="hero-title">VELTUP: menjar saludable en format tupper, adaptat a tu</h1>
            <p className="hero-copy">
              Rep cada setmana tuppers adaptats a les teves necessitats nutricionals, preferències i ritme de vida. Fem el treball perquè tu facis la vida més senzilla.
            </p>
            <div className="btn-group">
              <button className="btn-primary" type="button" onClick={() => goTo('registerIntro')}>
                Començar ara
              </button>
              <button className="btn-secondary" type="button" onClick={() => goTo('serviceChoice')}>
                Veure com funciona
              </button>
            </div>
          </div>
          <div className="hero-panel">
            <h2>Necessites una solució real?</h2>
            <p>VELTUP ofereix un camí clar: salut, qualitat i comoditat fins a la porta de casa teva.</p>
            <div className="card-grid">
              <div className="feature-card">
                <h3>Estalvia temps</h3>
                <p>Menys planificació, menys cuina i més hores per al que realment importa.</p>
              </div>
              <div className="feature-card">
                <h3>Menús adaptats</h3>
                <p>Al·lèrgies, intoleràncies i objectius personals integrats en cada tupper.</p>
              </div>
              <div className="feature-card">
                <h3>Servei digital</h3>
                <p>Procés senzill, responsive i pensat per a totes les edats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">El problema</h2>
          <p className="section-copy">Moltes persones tenen dificultats per mantenir una alimentació equilibrada per manca de temps, estrès, horaris exigents o rutines irregulars. La solució no és un plat preparat qualsevol: és un pla adaptat a tu.</p>
          <div className="card-grid">
            <div className="service-card">
              <h3>Manca de temps</h3>
              <p>La primera raó per la qual la gent abandona una dieta saludable.</p>
            </div>
            <div className="service-card">
              <h3>Opcions ultraprocessades</h3>
              <p>Evitem plats poc equilibrats que generen fatiga i malestar.</p>
            </div>
            <div className="service-card">
              <h3>Restriccions difícils</h3>
              <p>Al·lèrgies, intoleràncies i problemes digestius requereixen una selecció fiable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">La solució VELTUP</h2>
          <div className="card-grid">
            <div className="service-card">
              <h3>Menús saludables</h3>
              <p>Preparats per personalitzat, equilibrats i amb ingredients de proximitat.</p>
            </div>
            <div className="service-card">
              <h3>Personalització real</h3>
              <p>Adaptat a preferències, condicionaments i objectius específics.</p>
            </div>
            <div className="service-card">
              <h3>Format tupper</h3>
              <p>Pràctic, apte per microones, nevera i rentavaixelles.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Com funciona</h2>
          <div className="card-grid">
            <div className="panel-card">
              <h3>1. Registra’t</h3>
              <p>Comença amb un formulari senzill que defineix el teu perfil i necessitats.</p>
            </div>
            <div className="panel-card">
              <h3>2. Explica’ns el teu hàbit</h3>
              <p>Preferències, restriccions, objectius i servici triat.</p>
            </div>
            <div className="panel-card">
              <h3>3. Triem servei</h3>
              <p>Amb nutricionista, sense nutricionista o amb assistent IA.</p>
            </div>
            <div className="panel-card">
              <h3>4. Generem el menú</h3>
              <p>Proposta de plats personalitzada i setmanal.</p>
            </div>
            <div className="panel-card">
              <h3>5. Reps els tuppers</h3>
              <p>Distribució setmanal, a domicili, amb packaging sostenible.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Tipus de servei</h2>
          <div className="card-grid">
            <div className="service-card">
              <h3>Servei amb nutricionista</h3>
              <p>Assessorament professional, seguiment i ajustaments constants.</p>
              <ul>
                <li>Avaluació inicial.</li>
                <li>Definició d’objectius.</li>
                <li>Planificació dels àpats.</li>
                <li>Seguiment de l’evolució.</li>
                <li>Ajustos del pla.</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Servei sense nutricionista</h3>
              <p>Si ja tens recomanacions externes, VELTUP adapta els plats a les teves indicacions.</p>
              <ul>
                <li>Introducció de recomanacions pròpies.</li>
                <li>Adaptació a dietes ja definides.</li>
                <li>Flexibilitat setmanal.</li>
                <li>Preparació per cuiners especialitzats.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Menús adaptats</h2>
          <div className="grid-3">
            {['Dietes per al·lèrgies i intoleràncies', 'Dieta baixa en FODMAP', 'Dieta esportiva', 'Dieta vegana', 'Dieta per a gent gran', 'Dieta per infants'].map((item) => (
              <div key={item} className="wall-card">
                <h3>{item}</h3>
                <p>Opcions pensades per a necessitats específiques amb qualitat i seguretat.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Packaging i sostenibilitat</h2>
          <p className="section-copy">Els tuppers de VELTUP estan pensats per ser pràctics, segurs i sostenibles. El packaging utilitza envasos reutilitzables, resistents, aptes per microones, nevera i rentavaixelles.</p>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderAuthChoice = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container">
          <div className="hero-panel">
            <h2 className="section-title">Accés a VELTUP</h2>
            <p className="hero-copy">Selecciona la teva opció per començar de manera ràpida i senzilla.</p>
            <div className="card-grid">
              <div className="service-card">
                <h3>Registrar-se</h3>
                <p>Comença el registre per crear el teu pla personalitzat de menjar saludable.</p>
                <button className="btn-primary" type="button" onClick={() => goTo('registerIntro')}>
                  Registrar-se
                </button>
              </div>
              <div className="service-card">
                <h3>Iniciar sessió</h3>
                <p>Accedeix a l’àrea privada demo i revisa el teu pla setmanal simulat.</p>
                <button className="btn-primary" type="button" onClick={() => goTo('login')}>
                  Iniciar sessió
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderLogin = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '680px' }}>
          <div className="form-panel">
            <h2 className="section-title">Iniciar sessió</h2>
            <p className="section-copy">Introdueix les teves dades de demo per accedir a l’àrea privada.</p>
            <form onSubmit={handleLogin}>
              <div className="form-field">
                <label htmlFor="login-email">Correu electrònic</label>
                <input id="login-email" type="email" value={loginState.email} onChange={(e) => setLoginState({ ...loginState, email: e.target.value })} placeholder="hola@veltup.cat" required />
              </div>
              <div className="form-field">
                <label htmlFor="login-password">Contrasenya</label>
                <input id="login-password" type="password" value={loginState.password} onChange={(e) => setLoginState({ ...loginState, password: e.target.value })} placeholder="********" required />
              </div>
              <button className="action-button btn-primary" type="submit">Entrar</button>
              <button type="button" className="btn-secondary" onClick={() => goTo('authChoice')}>Tornar enrere</button>
              {loginError && <div className="alert-box" style={{ marginTop: '16px' }}>{loginError}</div>}
              <p style={{ marginTop: '16px', color: '#5b655f' }}><strong>He oblidat la contrasenya</strong> - Aquesta demo simula l’accés sense backend.</p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderRegisterIntro = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="hero-panel">
            <h2 className="section-title">VELTUP: menjar saludable en format tupper, adaptat a tu</h2>
            <p className="hero-copy">VELTUP neix per donar resposta a una necessitat real: cada vegada tenim menys temps per cuinar, però mantenir una alimentació equilibrada continua sent essencial per a la salut i el benestar. Per això oferim un servei de menjar preparat personalitzat, amb opció de seguiment nutricional i enviament setmanal a domicili.</p>
            <div className="card-grid">
              <div className="feature-card"><h3>Estalvia temps</h3><p>Sense planificar ni cuinar, reps un pla setmanal que afavoreix la teva salut.</p></div>
              <div className="feature-card"><h3>Menús saludables</h3><p>Plats equilibrats, fets per experts i adaptats a les teves restriccions.</p></div>
              <div className="feature-card"><h3>Servei flexible</h3><p>Tria servei amb nutricionista o sense nutricionista segons el teu ritme.</p></div>
            </div>
            <button className="action-button btn-primary" type="button" onClick={() => { setCurrentRoute('register'); setWizardStep(1); }}>Començar registre</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderWizard = () => {
    const formSteps = {
      1: (
        <>
          <div className="grid-2">
            <div className="form-field"><label>Nom</label><input value={formData.name} onChange={(e) => updateField('name', e.target.value)} required /></div>
            <div className="form-field"><label>Cognoms</label><input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} required /></div>
          </div>
          <div className="grid-2">
            <div className="form-field"><label>Edat</label><input type="number" min="14" value={formData.age} onChange={(e) => updateField('age', e.target.value)} required /></div>
            <div className="form-field"><label>Correu electrònic</label><input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required /></div>
          </div>
          <div className="grid-2">
            <div className="form-field"><label>Telèfon</label><input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} /></div>
            <div className="form-field"><label>Ciutat</label><input value={formData.city} onChange={(e) => updateField('city', e.target.value)} /></div>
          </div>
          <div className="grid-2">
            <div className="form-field"><label>Codi postal</label><input value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} /></div>
            <div className="grid-2"><div className="form-field"><label>Contrasenya</label><input type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} required /></div><div className="form-field"><label>Confirmar contrasenya</label><input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required /></div></div>
          </div>
        </>
      ),
      2: (
        <>
          <div className="section-copy">Quin perfil s’adapta més a tu?</div>
          <div className="checkbox-grid">
            {profileOptions.map((item) => (
              <label key={item} className="checkbox-option"><input type="radio" name="profile" checked={formData.profile === item} onChange={() => updateField('profile', item)} /> <span>{item}</span></label>
            ))}
          </div>
          <div className="form-field"><label>Explica breument la teva situació actual</label><textarea rows="4" value={formData.profileNotes} onChange={(e) => updateField('profileNotes', e.target.value)} /></div>
        </>
      ),
      3: (
        <>
          <div className="section-copy">Objectiu principal</div>
          <div className="checkbox-grid">
            {objectiveOptions.map((item) => (
              <label key={item} className="checkbox-option"><input type="radio" name="objective" checked={formData.objective === item} onChange={() => updateField('objective', item)} /> <span>{item}</span></label>
            ))}
          </div>
          <div className="form-field"><label>Explica el teu objectiu principal</label><textarea rows="4" value={formData.objectiveNotes} onChange={(e) => updateField('objectiveNotes', e.target.value)} /></div>
        </>
      ),
      4: (
        <>
          <div className="grid-2">
            <div className="form-field"><label>Quants àpats fas normalment al dia?</label><select value={formData.mealsPerDay} onChange={(e) => updateField('mealsPerDay', Number(e.target.value))}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option></select></div>
            <div className="form-field"><label>Quant temps dediques a cuinar durant la setmana?</label><input value={formData.profileNotes} onChange={(e) => updateField('profileNotes', e.target.value)} placeholder="Ex. 1-2 hores" /></div>
          </div>
          <div className="form-field"><label>Consumeixes sovint plats preparats o menjar ràpid?</label><select value={formData.subscription} onChange={(e) => updateField('subscription', e.target.value)}><option>Mai</option><option>Alguna vegada</option><option>Moltes vegades</option></select></div>
          <div className="form-field"><label>Tens horaris regulars o irregulars?</label><select value={formData.deliveryWindow} onChange={(e) => updateField('deliveryWindow', e.target.value)}><option>Regulars</option><option>Irregulars</option></select></div>
        </>
      ),
      5: (
        <>
          <div className="section-copy">Preferències alimentàries</div>
          <div className="checkbox-grid">
            {menuPreferences.map((item) => (
              <label key={item} className="checkbox-option"><input type="checkbox" checked={formData.preferredMenu === item} onChange={() => updateField('preferredMenu', item)} /> <span>{item}</span></label>
            ))}
          </div>
          <div className="form-field"><label>Aliments que t’agraden especialment</label><input value={formData.likedFoods} onChange={(e) => updateField('likedFoods', e.target.value)} /></div>
          <div className="form-field"><label>Aliments que no vols menjar</label><input value={formData.dislikedFoods} onChange={(e) => updateField('dislikedFoods', e.target.value)} /></div>
          <div className="form-field"><label>Aliments que vols evitar per motius personals</label><input value={formData.avoidFoods} onChange={(e) => updateField('avoidFoods', e.target.value)} /></div>
        </>
      ),
      6: (
        <>
          <div className="section-copy">Al·lèrgies i intoleràncies</div>
          <div className="checkbox-grid">
            {allergyOptions.map((item) => (
              <label key={item} className="checkbox-option"><input type="checkbox" checked={formData.allergies.includes(item)} onChange={() => toggleArrayValue('allergies', item)} /> <span>{item}</span></label>
            ))}
          </div>
          <div className="alert-box"><strong>Avis important:</strong> En cas d’al·lèrgies greus, VELTUP haurà de revisar manualment la informació abans de confirmar qualsevol menú.</div>
        </>
      ),
      7: (
        <>
          <div className="section-copy">Condicions digestives o mèdiques</div>
          <div className="checkbox-grid">
            {conditionsOptions.map((item) => (
              <label key={item} className="checkbox-option"><input type="checkbox" checked={formData.conditions.includes(item)} onChange={() => toggleArrayValue('conditions', item)} /> <span>{item}</span></label>
            ))}
          </div>
          <div className="form-field"><label>Explica les indicacions rellevants, si ho consideres necessari</label><textarea rows="4" value={formData.medicalNotes} onChange={(e) => updateField('medicalNotes', e.target.value)} /></div>
          <div className="alert-box"><strong>Avis:</strong> Aquesta informació només s’utilitza per adaptar millor la proposta de menús. La plataforma no substitueix el diagnòstic ni el seguiment d’un professional sanitari.</div>
        </>
      ),
      8: (
        <>
          <div className="grid-2">
            <div className="form-field"><label>Quants dies vols cobrir?</label><select value={formData.days} onChange={(e) => updateField('days', Number(e.target.value))}><option value={3}>3 dies</option><option value={5}>5 dies</option><option value={7}>7 dies</option><option value={14}>14 dies</option><option value={21}>Personalitzat</option></select></div>
            <div className="form-field"><label>Quants àpats vols al dia?</label><select value={formData.mealsPerDay} onChange={(e) => updateField('mealsPerDay', Number(e.target.value))}><option value={1}>Dinar</option><option value={2}>Dinar i sopar</option></select></div>
          </div>
          <div className="grid-2">
            <div className="form-field"><label>Per quantes persones?</label><select value={formData.people} onChange={(e) => updateField('people', Number(e.target.value))}><option value={1}>1 persona</option><option value={2}>2 persones</option><option value={3}>3 persones</option><option value={4}>4 persones</option></select></div>
            <div className="form-field"><label>Vols plats repetits?</label><select value={formData.repeatMeals} onChange={(e) => updateField('repeatMeals', e.target.value)}><option>Més d’un plat es pot repetir</option><option>Alguns repetits</option><option>M’és igual</option></select></div>
          </div>
          <div className="grid-2">
            <div className="form-field"><label>Modalitat</label><select value={formData.subscription} onChange={(e) => updateField('subscription', e.target.value)}><option>Comanda puntual</option><option>Subscripció setmanal</option></select></div>
            <div className="form-field"><label>Dia preferit de repartiment</label><select value={formData.deliveryDay} onChange={(e) => updateField('deliveryDay', e.target.value)}><option>Dilluns</option><option>Dimarts</option><option>Dimecres</option><option>Dijous</option><option>Dissabte</option></select></div>
          </div>
          <div className="form-field"><label>Franja horària preferida</label><select value={formData.deliveryWindow} onChange={(e) => updateField('deliveryWindow', e.target.value)}><option>Matí</option><option>Tarda</option><option>Capvespre</option></select></div>
        </>
      ),
    };

    return (
      <main className="app-shell">
        <Header currentRoute={currentRoute} onNavigate={goTo} />
        <section className="page-section">
          <div className="container" style={{ maxWidth: '960px' }}>
            <ProgressStepper steps={wizardSteps} active={wizardStep} />
            <div className="hero-panel">
              <h2 className="section-title">Registre i personalització</h2>
              <p className="section-copy">Completa el formulari pas a pas per crear un pla VELTUP adaptat a tu.</p>
              {formSteps[wizardStep]}
              <div className="btn-group" style={{ marginTop: '22px' }}>
                {wizardStep > 1 && <button type="button" className="btn-secondary" onClick={handleRegisterPrev}>Anterior</button>}
                <button type="button" className="btn-primary" onClick={handleRegisterNext}>{wizardStep === wizardSteps.length ? 'Continuar' : 'Següent'}</button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  };

  const renderServiceChoice = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Com vols personalitzar el teu pla VELTUP?</h2>
          <div className="card-grid">
            {serviceOptions.map((option) => (
              <div key={option.key} className="service-card" style={{ borderColor: selectedService === option.key ? 'rgba(63, 125, 86, 0.35)' : 'var(--border)' }}>
                <h3>{option.title}</h3>
                <p>{option.subtitle}</p>
                <button type="button" className="btn-primary" onClick={() => setSelectedService(option.key)}>{selectedService === option.key ? 'Seleccionat' : 'Seleccionar'}</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('register')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => {
              updateField('serviceType', selectedService);
              if (selectedService === 'amb nutricionista') goTo('nutritionistChat');
              else if (selectedService === 'sense nutricionista') goTo('manualServiceForm');
              else goTo('aiChat');
            }}>Continuar</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderNutritionistChat = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-title">Xat amb nutricionista</h2>
          <p className="section-copy">Simulem una conversa amb un nutricionista per recollir informació bàsica i generar una proposta preliminar.</p>
          <DisclaimerBox title="Avis" >Aquesta aplicació ofereix orientació nutricional general i no substitueix el diagnòstic, tractament o seguiment d’un professional sanitari.</DisclaimerBox>
          <div className="chat-window">
            <div className="chat-history">
              {chatMessages.map((message, index) => (
                <div key={`${message.from}-${index}`} className={`chat-message ${message.from}`}><p>{message.text}</p></div>
              ))}
            </div>
            <form className="chat-form" onSubmit={(event) => {
              event.preventDefault();
              if (!chatInput.trim()) return;
              setChatMessages((prev) => [...prev, { from: 'user', text: chatInput }, { from: 'bot', text: 'Gràcies. El nutricionista està llegint les teves notes i preparant la proposta.' }]);
              setChatInput('');
            }}>
              <input placeholder="Escriu el teu missatge..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <button type="submit" className="action-button btn-primary">Enviar</button>
            </form>
            <div className="info-box" style={{ marginTop: '14px' }}>
              <p><strong>Missatges inicials:</strong> Quin és el teu objectiu principal? Tens alguna condició mèdica diagnosticada? Quins aliments vols evitar? Quin nivell d’activitat física tens?</p>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('serviceChoice')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => { buildPlanner(); goTo('menuGenerator'); }}>Generar proposta preliminar de menús</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderManualServiceForm = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '920px' }}>
          <h2 className="section-title">Servei sense nutricionista</h2>
          <p className="section-copy">Introdueix les recomanacions que ja tens perquè VELTUP prepari els plats seguint les teves indicacions.</p>
          <div className="form-panel">
            <div className="form-field"><label>Professional que ha fet la recomanació</label><input value={formData.professionalSource} onChange={(e) => updateField('professionalSource', e.target.value)} /></div>
            <div className="form-field"><label>Objectiu del pla</label><input value={formData.objective} onChange={(e) => updateField('objective', e.target.value)} /></div>
            <div className="form-field"><label>Recomanacions nutricionals rebudes</label><textarea rows="4" value={formData.recommendations} onChange={(e) => updateField('recommendations', e.target.value)} /></div>
            <div className="form-field"><label>Aliments prohibits</label><input value={formData.prohibitions} onChange={(e) => updateField('prohibitions', e.target.value)} /></div>
            <div className="form-field"><label>Aliments recomanats</label><input value={formData.likedFoods} onChange={(e) => updateField('likedFoods', e.target.value)} /></div>
            <div className="form-field"><label>Al·lèrgies</label><input value={formData.allergies.join(', ')} onChange={(e) => updateField('allergies', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></div>
            <div className="form-field"><label>Intoleràncies</label><input value={formData.intolerances.join(', ')} onChange={(e) => updateField('intolerances', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></div>
            <div className="form-field"><label>Patologies o condicions rellevants</label><input value={formData.conditions.join(', ')} onChange={(e) => updateField('conditions', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></div>
            <div className="form-field"><label>Necessitats de textura</label><input value={formData.textureNeeds} onChange={(e) => updateField('textureNeeds', e.target.value)} /></div>
            <div className="form-field"><label>Notes addicionals</label><textarea rows="3" value={formData.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} /></div>
          </div>
          <DisclaimerBox title="Missatge important">VELTUP prepararà els menús seguint les indicacions introduïdes. L’equip podrà revisar manualment la informació abans de confirmar la comanda.</DisclaimerBox>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('serviceChoice')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => { buildPlanner(); goTo('menuGenerator'); }}>Generar proposta de menús</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderAIChat = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-title">Orientació inicial amb assistent IA</h2>
          <p className="section-copy">L’assistent virtual recull la informació bàsica i genera una proposta inicial orientativa.</p>
          <DisclaimerBox title="Avis obligatori">Aquesta eina ofereix orientació general i no substitueix el diagnòstic, tractament ni seguiment d’un metge o nutricionista. En cas d’al·lèrgies greus, patologies, medicació o símptomes persistents, consulta sempre un professional sanitari.</DisclaimerBox>
          <div className="chat-window">
            <div className="chat-history">
              {aiMessages.map((message, index) => (
                <div key={`${message.from}-${index}`} className={`chat-message ${message.from}`}><p>{message.text}</p></div>
              ))}
            </div>
            <div className="btn-group" style={{ gap: '10px', flexWrap: 'wrap' }}>
              {[
                'Com et trobes actualment?',
                'Tens alguna al·lèrgia diagnosticada?',
                'Tens alguna intolerància coneguda?',
                'Tens alguna condició digestiva com SIBO o intestí irritable?',
                'Fas esport o activitat física? Amb quina freqüència?',
                'Quin objectiu vols assolir?',
                'Quins aliments vols evitar?',
                'Quants dies i àpats vols cobrir amb VELTUP?',
              ].map((question) => (
                <button key={question} type="button" className="btn-secondary" onClick={() => aiAsk(question)}>{question}</button>
              ))}
            </div>
            <div style={{ marginTop: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-secondary" type="button" onClick={() => goTo('serviceChoice')}>Tornar enrere</button>
              <button className="action-button btn-primary" type="button" onClick={() => { buildPlanner(); goTo('menuGenerator'); }}>Generar proposta de menús</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderMenuGenerator = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Generador de menús</h2>
          <p className="section-copy">Selecciona els plats que millor s’adapten al teu pla. Has de triar un total de {totalRequired} àpats per {formData.days} dies.</p>
          <div className="btn-group" style={{ marginBottom: '18px' }}>
            <button className="btn-secondary" type="button" onClick={generateMealProposal}>Actualitzar proposta</button>
            <button className="btn-primary" type="button" onClick={() => goTo('weeklyPlanner')}>Veure planificació</button>
          </div>
          {menuWarning && <div className="alert-box">{menuWarning}</div>}
          <div className="summary-row" style={{ marginBottom: '14px' }}>
            <span>Plats compatibles: {compatibleMeals.length}</span>
            <span>Seleccionats: {totalSelected} / {totalRequired}</span>
          </div>
          <div className="card-grid">
            {generatedMeals.length === 0 ? (
              <div className="feature-card"><h3>Premeu "Actualitzar proposta"</h3><p>Generarem una selecció inicial de plats adaptats al teu perfil.</p></div>
            ) : generatedMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} selected={selectedMeals.some((item) => item.id === meal.id)} onSelect={handleSelectMeal} onRemove={handleRemoveMeal} />
            ))}
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('serviceChoice')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => { if (selectedMeals.length > 0) { buildPlanner(); goTo('weeklyPlanner'); } }}>Continuar</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderWeeklyPlanner = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h2 className="section-title">Pantalla de planificació setmanal</h2>
          <p className="section-copy">Assigna els plats als dies i comprova l’estat de cada àpat abans de confirmar el pla.</p>
          <div className="panel-card">
            <table className="table-grid">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>Dinar</th>
                  <th>Sopar</th>
                  <th>Estat</th>
                </tr>
              </thead>
              <tbody>
                {daysList.map((day) => {
                  const dayPlan = planner[day] || {};
                  return (
                    <tr key={day}>
                      <td>{day}</td>
                      {['dinar', 'sopar'].slice(0, formData.mealsPerDay).map((mealType) => {
                        const meal = dayPlan[mealType];
                        return (
                          <td key={`${day}-${mealType}`}>
                            {meal ? meal.name : <span style={{ color: '#6c6f69' }}>Pendent</span>}
                          </td>
                        );
                      })}
                      <td><span className="status-chip">{selectedMeals.length >= totalRequired ? 'Assignat' : 'Pendent'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="alert-box" style={{ marginTop: '18px' }}>
              Si vols canviar un plat, torna al generador de menús i ajusta la selecció. Això t’ajuda a tenir un pla coherent per cada dia.
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('menuGenerator')}>Tornar al generador de menús</button>
            <button className="action-button btn-primary" type="button" onClick={() => goTo('planSummary')}>Resum del pla</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderPlanSummary = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <h2 className="section-title">Resum del pla</h2>
          <div className="summary-card">
            <div className="summary-row"><strong>Nom</strong><span>{formData.name} {formData.lastName}</span></div>
            <div className="summary-row"><strong>Perfil</strong><span>{formData.profile || 'No definit'}</span></div>
            <div className="summary-row"><strong>Objectiu principal</strong><span>{formData.objective || 'No definit'}</span></div>
            <div className="summary-row"><strong>Tipus de servei</strong><span>{formData.serviceType}</span></div>
            <div className="summary-row"><strong>Restriccions alimentàries</strong><span>{formData.avoidFoods || 'Cap'}</span></div>
            <div className="summary-row"><strong>Al·lèrgies</strong><span>{formData.allergies.join(', ') || 'Cap'}</span></div>
            <div className="summary-row"><strong>Intoleràncies</strong><span>{formData.intolerances.join(', ') || 'Cap'}</span></div>
            <div className="summary-row"><strong>Condicions</strong><span>{formData.conditions.join(', ') || 'Cap'}</span></div>
            <div className="summary-row"><strong>Dies</strong><span>{formData.days}</span></div>
            <div className="summary-row"><strong>Àpats per dia</strong><span>{formData.mealsPerDay}</span></div>
            <div className="summary-row"><strong>Persones</strong><span>{formData.people}</span></div>
            <div className="summary-row"><strong>Modalitat</strong><span>{formData.subscription}</span></div>
            <div className="summary-row"><strong>Menú seleccionat</strong><span>{selectedMeals.map((meal) => meal.name).join(', ') || 'Cap seleccionat'}</span></div>
            <div className="summary-row"><strong>Preu estimat</strong><span>{formatPrice(priceData.subtotal)}</span></div>
          </div>
          <DisclaimerBox title="Avis important">Aquest pla és una proposta orientativa. En cas d’al·lèrgies greus, patologies o indicacions mèdiques, l’equip de VELTUP haurà de revisar la informació abans de confirmar la preparació.</DisclaimerBox>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('weeklyPlanner')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => goTo('delivery')}>Continuar amb l’enviament</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderDeliveryForm = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-title">Adreça i enviament</h2>
          <div className="form-panel">
            <div className="grid-2"><div className="form-field"><label>Nom complet</label><input value={formData.name} onChange={(e) => updateField('name', e.target.value)} required /></div><div className="form-field"><label>Telèfon</label><input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} required /></div></div>
            <div className="grid-2"><div className="form-field"><label>Correu electrònic</label><input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required /></div><div className="form-field"><label>Adreça</label><input value={formData.deliveryAddress} onChange={(e) => updateField('deliveryAddress', e.target.value)} required /></div></div>
            <div className="grid-2"><div className="form-field"><label>Pis / porta</label><input value={formData.deliveryFloor} onChange={(e) => updateField('deliveryFloor', e.target.value)} /></div><div className="form-field"><label>Codi postal</label><input value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} required /></div></div>
            <div className="grid-2"><div className="form-field"><label>Ciutat</label><input value={formData.city} onChange={(e) => updateField('city', e.target.value)} required /></div><div className="form-field"><label>Dia de repartiment preferit</label><select value={formData.deliveryDay} onChange={(e) => updateField('deliveryDay', e.target.value)}><option>Dilluns</option><option>Dimarts</option><option>Dimecres</option><option>Dijous</option><option>Dissabte</option></select></div></div>
            <div className="form-field"><label>Franja horària preferida</label><select value={formData.deliveryWindow} onChange={(e) => updateField('deliveryWindow', e.target.value)}><option>Matí</option><option>Tarda</option><option>Capvespre</option></select></div>
            <div className="form-field"><label>Notes per al repartidor</label><textarea rows="3" value={formData.deliveryNotes} onChange={(e) => updateField('deliveryNotes', e.target.value)} /></div>
            <div className="checkbox-option"><input type="radio" name="return-containers" checked={formData.isReturningContainers === 'Sí'} onChange={() => updateField('isReturningContainers', 'Sí')} /> <span>Vull retornar tuppers reutilitzables anteriors</span></div>
            <div className="checkbox-option"><input type="radio" name="return-containers" checked={formData.isReturningContainers === 'No'} onChange={() => updateField('isReturningContainers', 'No')} /> <span>No</span></div>
            <div className="checkbox-option"><input type="radio" name="return-containers" checked={formData.isReturningContainers === 'Encara no en tinc'} onChange={() => updateField('isReturningContainers', 'Encara no en tinc')} /> <span>Encara no en tinc</span></div>
            <div className="checkbox-option"><input type="checkbox" checked={true} readOnly /> <span>Confirmo que les dades d’al·lèrgies i intoleràncies són correctes.</span></div>
            <div className="checkbox-option"><input type="checkbox" checked={true} readOnly /> <span>Entenc que VELTUP pot revisar manualment la meva comanda abans de preparar-la.</span></div>
            <div className="checkbox-option"><input type="checkbox" checked={true} readOnly /> <span>Accepto les condicions del servei.</span></div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => goTo('planSummary')}>Tornar enrere</button>
            <button className="action-button btn-primary" type="button" onClick={() => { setConfirmation({ ...formData, price: priceData.subtotal, status: 'Pendent de revisió' }); goTo('confirmation'); }}>Confirmar proposta</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderConfirmation = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="hero-panel">
            <h2 className="section-title">La teva proposta VELTUP s’ha registrat correctament</h2>
            <p className="hero-copy">Hem rebut la teva informació i el teu pla de menús. El nostre equip revisarà la proposta abans de preparar la comanda, especialment si has indicat al·lèrgies, intoleràncies o necessitats mèdiques.</p>
            <div className="summary-card">
              <div className="summary-row"><strong>Dies coberts</strong><span>{formData.days}</span></div>
              <div className="summary-row"><strong>Àpats totals</strong><span>{totalRequired * formData.people}</span></div>
              <div className="summary-row"><strong>Persones</strong><span>{formData.people}</span></div>
              <div className="summary-row"><strong>Tipus de servei</strong><span>{formData.serviceType}</span></div>
              <div className="summary-row"><strong>Restriccions principals</strong><span>{formData.allergies.join(', ') || 'Cap'}</span></div>
              <div className="summary-row"><strong>Adreça d’enviament</strong><span>{formData.deliveryAddress || 'No especificada'}</span></div>
              <div className="summary-row"><strong>Preu estimat</strong><span>{formatPrice(priceData.subtotal)}</span></div>
              <div className="summary-row"><strong>Estat</strong><span>{confirmation?.status || 'Pendent de revisió'}</span></div>
            </div>
            <div className="btn-group" style={{ marginTop: '24px' }}>
              <button className="btn-secondary" type="button" onClick={() => goTo('landing')}>Tornar a l’inici</button>
              <button className="btn-secondary" type="button" onClick={() => goTo('dashboard')}>Veure el meu pla</button>
              <button className="action-button btn-primary" type="button" onClick={() => { setSelectedMeals([]); setFormData(initialForm); goTo('registerIntro'); }}>Crear una nova comanda</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const renderDashboard = () => (
    <main className="app-shell">
      <Header currentRoute={currentRoute} onNavigate={goTo} />
      <section className="page-section">
        <div className="container">
          <h2 className="section-title">Àrea privada demo</h2>
          <p className="section-copy">Accedeix a les teves dades i el teu pla setmanal simulats.</p>
          <div className="grid-2">
            <div className="panel-card"><h3>El meu pla setmanal</h3><p>{formData.days} dies amb {formData.mealsPerDay} àpats diaris per {formData.people} persones.</p></div>
            <div className="panel-card"><h3>Les meves comandes</h3><p>Proposta actual: {formData.subscription}. Estat: {confirmation?.status || 'Pendent de revisió'}.</p></div>
          </div>
          <div className="grid-2" style={{ marginTop: '20px' }}>
            <div className="panel-card"><h3>Les meves dades nutricionals</h3><p>Objectiu: {formData.objective || 'No definit'}. Restriccions: {formData.allergies.join(', ') || 'Cap'}.</p></div>
            <div className="panel-card"><h3>Recomanacions</h3><p>{formData.serviceType === 'amb nutricionista' ? 'Esperant revisió professional' : 'Pla basat en la teva informació actual.'}</p></div>
          </div>
          <div className="panel-card" style={{ marginTop: '20px' }}>
            <h3>Xat amb nutricionista</h3>
            <p>Aquest xat és una simulació per ajudar-te a imaginar el flux de comunicació amb l’equip de VELTUP.</p>
          </div>
          <div className="btn-group" style={{ marginTop: '24px' }}>
            <button className="btn-secondary" type="button" onClick={() => setCurrentRoute('landing')}>Sortir</button>
            <button className="action-button btn-primary" type="button" onClick={() => goTo('planSummary')}>Veure el meu pla</button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );

  const routeRender = {
    landing: renderLanding,
    authChoice: renderAuthChoice,
    login: renderLogin,
    registerIntro: renderRegisterIntro,
    register: renderWizard,
    serviceChoice: renderServiceChoice,
    nutritionistChat: renderNutritionistChat,
    manualServiceForm: renderManualServiceForm,
    'sense nutricionista': renderManualServiceForm,
    'orientació ia': renderAIChat,
    menuGenerator: renderMenuGenerator,
    weeklyPlanner: renderWeeklyPlanner,
    planSummary: renderPlanSummary,
    delivery: renderDeliveryForm,
    confirmation: renderConfirmation,
    dashboard: renderDashboard,
  };

  return routeRender[currentRoute] ? routeRender[currentRoute]() : renderLanding();
}

export default App;
