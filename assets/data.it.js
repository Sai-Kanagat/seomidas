(function(){
  const faqIT = {
    1: { q: "Perché la mesh è il principale collo di bottiglia nella FEA?", a: "La mesh richiede una pulizia manuale della geometria e il defeaturing. Gli ingegneri dedicano spesso il 60-80% del tempo di simulazione a questa fase. MeshFree la elimina grazie all'Implicit Boundary Method." },
    2: { q: "Quanto tempo perdono gli ingegneri nella pulizia della geometria?", a: "Fino al 70% del tempo di simulazione. Sia SimSolid sia Ansys richiedono questa fase. Posizioniamo MeshFree come lo strumento che restituisce tempo ai progettisti." },
    3: { q: "Qual è la differenza tra FEA meshless e FEA tradizionale?", a: "La FEA tradizionale suddivide il modello in piccoli elementi. La FEA meshless (come MeshFree) usa approssimazioni matematiche per risolvere direttamente la geometria CAD, senza creare una mesh." },
    4: { q: "Posso simulare parti in movimento senza mesh?", a: "Sì, MeshFree gestisce analisi statiche lineari, modali e contatto non lineare di base. Per dinamiche esplicite molto complesse (crash test) servono ancora strumenti tradizionali come Radioss." },
    5: { q: "Che cos'è l'Implicit Boundary Method (IBM)?", a: "L'IBM è il motore matematico alla base di MeshFree. Usa funzioni implicite per definire i contorni della geometria, permettendo al solutore di lavorare direttamente sul modello CAD senza generare una mesh." },
    6: { q: "Come gestisce MeshFree gli assiemi CAD complessi?", a: "Importa i file CAD nativi e rileva automaticamente contatti e contorni. Non servono defeaturing né generazione manuale della mesh." },
    7: { q: "Cosa succede se il mio modello CAD ha errori o buchi?", a: "MeshFree è molto tollerante verso le geometrie imperfette. Gestisce piccoli buchi e sovrapposizioni senza far fallire la simulazione, risparmiando ore di riparazione." },
    8: { q: "La simulazione meshless è accurata per l'analisi a fatica?", a: "Sì, MeshFree può eseguire analisi a fatica basate sui risultati di tensione. Tuttavia, per la fatica non lineare molto complessa potrebbe essere preferibile un solutore tradizionale." },
    9: { q: "I progettisti possono eseguire simulazioni senza uno specialista CAE?", a: "Assolutamente. È il valore centrale di MeshFree. L'interfaccia intuitiva e l'assenza di mesh permettono ai progettisti di validare in autonomia i propri progetti." },
    10: { q: "Qual è la curva di apprendimento di MeshFree?", a: "Poiché elimina la mesh e usa un'interfaccia standard simile a quella dei CAD, gli ingegneri imparano in genere MeshFree in 1-2 giorni, contro le settimane richieste da Ansys." },
    11: { q: "MeshFree vs SimSolid: quale è più accurato per la validazione del progetto?", a: "Entrambi sono validati NAFEMS. MeshFree usa l'Implicit Boundary Method (matematica trasparente). SimSolid usa le External Approximations (matematica opaca). MeshFree è validato entro il 4%." },
    12: { q: "SimSolid è davvero accurato quanto Ansys?", a: "I test NAFEMS mostrano che i risultati di SimSolid sono spesso entro il 10% da quelli di Ansys. Tuttavia, SimSolid non può simulare contatti con attrito né grandi deformazioni." },
    13: { q: "Perché gli ingegneri si lamentano della 'matematica opaca' di SimSolid?", a: "La logica del solutore è proprietaria e difficile da ispezionare. Gli ingegneri non riescono a spiegare perché un risultato sia quello che è. MeshFree offre un approccio documentato." },
    14: { q: "MeshFree vs Ansys Discovery: quale è migliore per i progettisti?", a: "Ansys Discovery è un trampolino di lancio. MeshFree nasce per la validazione di grandi assiemi senza mesh, girando in modo nativo su workstation standard." },
    15: { q: "NFX CFD è valido quanto Fluent per la simulazione di pompe?", a: "La ricerca pubblicata rileva che, in uno studio su una pompa centrifuga, i risultati di Fluent erano più sensibili alle scelte temporali rispetto a NFX. NFX offre risultati molto accurati a una frazione del costo." },
    16: { q: "Qual è la migliore alternativa ad Ansys per una piccola azienda di ingegneria?", a: "Midas MTS. Offre strutturale (MeshFree) e CFD (NFX) in un unico pacchetto a €20k, contro oltre $100k di Ansys." },
    17: { q: "MeshFree vs Abaqus per l'analisi non lineare.", a: "Abaqus è lo standard di riferimento per le non linearità estreme. MeshFree è ideale per il contatto non lineare standard della fase di progettazione. Puntiamo all'80% dei casi d'uso che non richiedono Abaqus." },
    18: { q: "SimSolid può gestire dinamiche esplicite come Radioss?", a: "No. SimSolid è limitato nelle dinamiche esplicite e nei contatti con attrito. Se servono, gli utenti devono orientarsi su Ansys o Midas NFX." },
    19: { q: "Qual è il miglior software CAE per la progettazione HVAC?", a: "NFX è eccellente per l'HVAC. Gestisce in modo nativo lo scambio termico coniugato e il flusso dei fluidi, ed è integrato con MeshFree per le verifiche strutturali." },
    20: { q: "MTS è meglio che acquistare separatamente Ansys Mechanical e Fluent?", a: "Sì, per le aziende di fascia media. MTS riunisce MeshFree e NFX a €20k, mentre le licenze Ansys superano facilmente i $50k." },
    21: { q: "Quanto costa davvero una licenza Ansys?", a: "Ansys Mechanical Pro può costare 80k-120k RMB/anno, la versione Enterprise può superare 300k-500k. Le suite complete di Abaqus possono arrivare a 500k-800k RMB/anno." },
    22: { q: "Cosa include il pacchetto MTS (€20k)?", a: "MTS è un pacchetto all-in-one che comprende sia MeshFree (strutturale) sia NFX (CFD). Una sola licenza copre entrambi." },
    23: { q: "Esiste una licenza perpetua per MTS?", a: "Sì, Midas offre licenze perpetue con un canone annuale di manutenzione, a differenza dei modelli solo in abbonamento di Ansys." },
    24: { q: "Qual è il ROI del passaggio a uno strumento CAE meshless?", a: "Se un progettista passa 10 ore a settimana ad aspettare le mesh, passare a MeshFree recupera il 60% di quel tempo. Sono centinaia di ore di capacità liberate." },
    25: { q: "MTS richiede hardware costoso?", a: "No. MeshFree gira in modo efficiente su workstation di ingegneria standard, a differenza di SimSolid che spesso richiede hardware di fascia alta per i grandi assiemi." },
    26: { q: "Esiste una prova gratuita di MeshFree?", a: "Sì, e-FEM offre una prova gratuita con il supporto del nostro Simulation Team." },
    27: { q: "Come si confronta il prezzo con COMSOL?", a: "COMSOL è eccellente per la multifisica ma molto costoso. MTS offre strutturale e CFD a un costo totale di proprietà molto inferiore." },
    28: { q: "Ci sono costi di formazione associati a MTS?", a: "La formazione è minima. Forniamo l'onboarding. La maggior parte degli ingegneri è produttiva in 2 giorni." },
    29: { q: "Quanto costa una licenza SimSolid?", a: "SimSolid viene in genere incluso in Altair HyperWorks o Inspire, con prezzi a partire da circa $10k-$15k, ma non include la CFD." },
    30: { q: "Possiamo far crescere le licenze MTS insieme al nostro team?", a: "Sì, Midas offre opzioni di licenza flessibili, comprese le licenze di rete." },
    41: { q: "Come gestisce MeshFree i grandi assiemi?", a: "Grazie all'Implicit Boundary Method, MeshFree evita i colli di bottiglia di memoria della mesh tradizionale. Può risolvere assiemi enormi su una workstation standard." },
    42: { q: "Posso usare MeshFree per l'analisi termo-strutturale?", a: "Sì. MeshFree permette di importare profili termici da NFX (o da fonti esterne) e di mapparli direttamente sul modello strutturale per un'analisi accoppiata." },
    43: { q: "Quali formati CAD supporta MeshFree?", a: "Supporto nativo per SolidWorks, CATIA, NX, Creo, Inventor e per formati neutri come STEP e IGES." },
    44: { q: "Come gestisce NFX lo scambio termico coniugato?", a: "NFX ha un solutore CHT dedicato che calcola simultaneamente lo scambio termico tra dominio fluido e dominio solido, ideale per il raffreddamento dell'elettronica e i collettori di scarico." },
    45: { q: "MTS è disponibile con licenza di rete?", a: "Sì, Midas offre licenze di rete che permettono a più ingegneri di condividere il software, massimizzando il ROI per l'azienda." },
    46: { q: "MeshFree può eseguire analisi di contatto non lineare?", a: "Sì, MeshFree supporta il contatto non lineare, inclusi attrito, separazione e grandi deformazioni, anche se per dinamiche esplicite molto complesse può servire NFX." },
    47: { q: "Qual è la differenza tra NFX Designer e NFX Analyst?", a: "NFX offre due modalità di interfaccia. La modalità Designer semplifica il flusso di lavoro per i progettisti, mentre la modalità Analyst sblocca mesh avanzata, condizioni al contorno e controlli del solutore per gli specialisti CAE." },
    51: { q: "MeshFree può simulare giunti bullonati?", a: "Sì, MeshFree gestisce automaticamente le connessioni bullonate, importando i precarichi e calcolando le tensioni di contatto senza mesh manuale delle filettature." },
    52: { q: "Quali sono i requisiti hardware di MeshFree?", a: "Una workstation di ingegneria standard (16GB+ di RAM, CPU moderna). Non servono costosi cluster GPU come per i solutori tradizionali." },
    53: { q: "MTS include strumenti di ottimizzazione?", a: "Sì, MTS include strumenti di ottimizzazione topologica e di forma, che permettono agli ingegneri di alleggerire i progetti sulla base dei risultati FEA." },
    54: { q: "Quanto è accurato MeshFree per l'analisi modale?", a: "Molto accurato. I benchmark NAFEMS mostrano che MeshFree è entro il 4% dalla FEM tradizionale per frequenze naturali e forme modali." },
    55: { q: "Posso automatizzare MeshFree con uno script?", a: "Sì, MeshFree supporta l'automazione in Python e JavaScript per studi parametrici ed elaborazioni batch." },
    59: { q: "Quanto costa una licenza Abaqus?", a: "Le suite complete di Abaqus possono costare da $50.000 a $80.000 per il primo anno, a seconda dei moduli (Nonlinear, Explicit, CFD)." },
    60: { q: "SimSolid può eseguire CFD?", a: "No, Simcenter Simsolid è esclusivamente un solutore strutturale e di conduzione termica. Per la fluidodinamica, Siemens richiede l'acquisto separato di FloEFD o STAR-CCM+." },
    61: { q: "MeshFree può importare file SimSolid?", a: "I file SimSolid sono proprietari. Tuttavia, entrambi gli strumenti partono dal CAD, quindi si può importare direttamente in MeshFree il CAD nativo (STEP, SolidWorks, ecc.)." },
    62: { q: "Che cos'è il vantaggio 'Zero-Core-Tax' di Midas?", a: "A differenza di Ansys e Abaqus, che fanno pagare extra i core HPC (High-Performance Computing), Midas MTS utilizza tutti i core CPU e la RAM disponibili sulla workstation senza costi di licenza aggiuntivi." },
    63: { q: "Come gestisce MeshFree gli assiemi con migliaia di parti?", a: "MeshFree usa il metodo IBM per evitare di creare la mesh negli spazi tra le parti. Questo riduce drasticamente i Gradi di Libertà (DOF) e permette di risolvere assiemi enormi su una singola workstation." },
    65: { q: "MTS supporta l'analisi a fatica per strutture saldate?", a: "Sì, NFX e MeshFree includono moduli di fatica che supportano i codici standard per la fatica delle saldature (ad esempio Eurocodice, IIW) per valutare i giunti saldati." },
    66: { q: "MeshFree può gestire materiali non lineari?", a: "Sì, MeshFree supporta plasticità, iperelasticità e altri modelli di materiale non lineari, anche se per deformazioni estreme si consiglia NFX." },
    67: { q: "Qual è la differenza tra NFX e Fluent?", a: "Fluent è uno strumento CFD di fascia alta e complesso, che richiede competenze approfondite. NFX è uno strumento CFD progettato per progettisti e analisti che hanno bisogno di risultati accurati per applicazioni industriali standard (pompe, valvole, HVAC) senza una curva di apprendimento ripida." },
    68: { q: "Come gestisce Midas la sicurezza dei dati?", a: "Midas è installato on-premise. Nessun dato CAD sensibile viene inviato al cloud, a garanzia della piena protezione della proprietà intellettuale." },
    70: { q: "MTS è adatto alle applicazioni automotive?", a: "Sì, MTS è molto usato nell'automotive per la validazione del telaio, l'analisi delle sospensioni e i componenti del propulsore." },
    71: { q: "Come si confronta MeshFree con SolidWorks Simulation?", a: "SolidWorks Simulation richiede una mesh conforme, che spesso fallisce sugli assiemi saldati complessi. MeshFree elimina completamente la mesh e gestisce con facilità gli assiemi complessi." },
    72: { q: "NFX può simulare flussi multifase?", a: "Sì, NFX supporta il flusso multifase (metodo VOF) per applicazioni come lo sloshing del carburante, la miscelazione e i sistemi di raffreddamento." },
    73: { q: "Qual è il ROI di MTS rispetto ad Abaqus?", a: "Per un team di 2 ingegneri, MTS fa risparmiare circa €150k in 3 anni eliminando le tasse sui core HPC e riducendo del 60% il lavoro di mesh sul CAD." },
    74: { q: "MeshFree supporta l'ottimizzazione topologica?", a: "Sì, MTS include l'ottimizzazione topologica, che permette agli ingegneri di trovare la distribuzione ottimale del materiale per ridurre il peso mantenendo la rigidezza." },
    75: { q: "Come gestisce NFX le macchine rotanti?", a: "NFX usa le tecniche MRF e sliding mesh per simulare con accuratezza pompe, turbine e ventole." },
    76: { q: "MeshFree può essere usato per il raffreddamento dell'elettronica?", a: "MeshFree gestisce le tensioni strutturali e termiche, mentre NFX gestisce il flusso d'aria e lo scambio termico coniugato. Insieme formano un flusso di lavoro completo per il raffreddamento dell'elettronica." },
    77: { q: "Qual è lo stato di validazione NAFEMS di MeshFree?", a: "MeshFree è validato rispetto a diversi benchmark NAFEMS, dimostrando un'accuratezza entro il 4% dalla FEM tradizionale." },
    79: { q: "MeshFree può analizzare i materiali compositi?", a: "Sì, MeshFree supporta la laminazione dei compositi e i criteri di rottura (Tsai-Wu, Hashin)." },
    80: { q: "Come aiuta MTS nella DfAM (Design for Additive Manufacturing)?", a: "MTS aiuta a validare le strutture reticolari, le distorsioni termiche durante la stampa e le tensioni di rimozione dei supporti." },
    81: { q: "Qual è la differenza tra le approssimazioni esterne (SimSolid) e l'IBM (MeshFree)?", a: "Le approssimazioni esterne usano un modello matematico proprietario e opaco. L'IBM usa funzioni di contorno implicite, matematicamente trasparenti e verificabili." },
    82: { q: "Posso usare NFX su un normale laptop?", a: "Sì, per modelli piccoli. Per modelli grandi si consiglia una workstation standard. NFX scala in modo efficiente con i core CPU disponibili." },
    85: { q: "Che cos'è il benchmark 'Ugly STEP'?", a: "È un benchmark proprietario creato da e-FEM per dimostrare che MeshFree può gestire file CAD sporchi e non a tenuta stagna, senza fallire e senza richiedere riparazioni manuali." },
    86: { q: "MeshFree ha un'API Python?", a: "Sì, MeshFree offre un'API Python completa per automazione, studi parametrici e flussi di lavoro personalizzati." },
    87: { q: "MTS può essere integrato con i sistemi PLM?", a: "Sì, MTS si integra con i principali sistemi PLM come Teamcenter e Windchill." },
    88: { q: "Qual è la differenza tra MTS Advanced e Professional?", a: "Advanced include MeshFree (strutture) e NFX (CFD). Professional include moduli aggiuntivi come ottimizzazione e fatica." },
    89: { q: "Come gestisce MeshFree i bulloni precaricati?", a: "Crea automaticamente le connessioni bullonate e consente di applicare i precarichi, calcolando le tensioni di contatto risultanti senza mesh manuale." },
    91: { q: "MeshFree può simulare i drop test?", a: "MeshFree non è un solutore di dinamica esplicita. Per i drop test servono NFX (con dinamica esplicita) o un solutore crash dedicato." },
    92: { q: "Cos'è in pratica il flusso di lavoro 'Zero-Mesh'?", a: "Importa il CAD -> Applica le condizioni al contorno -> Risolvi. Nessuna mesh, nessun defeaturing. Un processo in 3 passaggi." },
    93: { q: "Come gestisce MTS i grandi assiemi con materiali diversi?", a: "MeshFree assegna automaticamente le proprietà dei materiali alle diverse parti, gestendo con facilità assiemi complessi multi-materiale." },
    94: { q: "NFX può simulare reazioni chimiche?", a: "NFX supporta modelli di combustione di base, adatti a simulazioni di bruciatori e motori. Per la chimica complessa servono invece strumenti specializzati." },
    95: { q: "Qual è il principale vantaggio di Midas rispetto ad Altair?", a: "Midas offre un pacchetto all-in-one strutturale + CFD (MTS) a un costo totale di proprietà inferiore, con matematica trasparente (IBM) e senza tasse di licenza legate al numero di core." },
    96: { q: "MeshFree è certificato NAFEMS?", a: "'Certificato' è una parola impegnativa, ma validato NAFEMS significa che è stato testato rigorosamente su benchmark standard, dimostrando un'accuratezza entro il 4% dalla FEM tradizionale." },
    97: { q: "Come supporta e-FEM gli utenti Midas in Italia?", a: "Attraverso il Simulation Team: supporto locale in italiano, formazione, consulenza e riproduzione dei benchmark per casi d'uso specifici." },
    98: { q: "MeshFree può analizzare la dilatazione termica?", a: "Sì, MeshFree supporta le condizioni al contorno termiche e calcola la dilatazione termica e le tensioni termiche risultanti." },
    99: { q: "Qual è la roadmap futura di MTS?", a: "Integrazione continua di IBM, NFX CFD e rilevamento delle condizioni al contorno assistito dall'AI, per ridurre ulteriormente il tempo dal CAD alla decisione." },
    100: { q: "Perché dovrei passare da Ansys a MTS?", a: "Se siete una PMI o un ufficio tecnico che spende troppo per le licenze core di Ansys e perde ore sulla mesh, MTS offre l'80% dei risultati con il 20% del costo e del tempo." }
  };
  faqData.forEach(f => { if (faqIT[f.id]) { f.q = faqIT[f.id].q; f.a = faqIT[f.id].a; } });

  const nafemsDescIT = {
    'NAFEMS LE1': "Membrana ellittica (stato piano di tensione)",
    'NAFEMS LE10': "Pressione su piastra spessa (solido 3D)",
    'NAFEMS R0031/1': "Striscia laminata sotto flessione a 3 punti",
    'NAFEMS FV12': "Piastra quadrata sottile libera (modi 1–6)",
    'NAFEMS FV32': "Membrana rastremata a sbalzo",
    'NAFEMS FV52': "Piastra quadrata solida semplicemente appoggiata",
    'NAFEMS T1': "Conduzione termica 2D stazionaria",
    'NAFEMS T4': "Piastra 2D con contorno convettivo"
  };
  nafemsBenchmarks.forEach(b => { if (nafemsDescIT[b.id]) b.desc = nafemsDescIT[b.id]; });

  const intentIT = {
    'Product / Transactional': "Prodotto / Transazionale",
    'Commercial Investigation': "Ricerca commerciale",
    'Informational / Solution': "Informativa / Soluzione",
    'Authority / Vertical': "Autorevolezza / Verticale",
    'BOFU / Switching': "BOFU / Migrazione",
    'Prodotto / Transazionale IT': "Prodotto / Transazionale IT",
    'Confronto & Settori IT': "Confronto & Settori IT",
    'Brand & Migrazione IT': "Brand & Migrazione IT"
  };
  allKeywords.forEach(k => { k.intentLabel = intentIT[k.intent] || k.intent; });

  const roadmapIT = [
    {
      phase: "FASE 1: GIORNI 1–30",
      title: "Pulizia e riparazione delle entità",
      items: [
        "Aggiornare i footer a © 2026.",
        "Redirect 301 di /hello-world/ e /landing_mecspe22/.",
        "Consolidare /nfx/ e /nfx-intro/.",
        "Risolvere il conflitto di dominio efem.it.",
        "Rivendicare le schede standalone di midas MeshFree e NFX su G2 e Capterra, ottenendo le prime 10 recensioni verificate.",
        "Esportare i volumi di ricerca reali delle keyword da Semrush/GKP."
      ]
    },
    {
      phase: "FASE 2: GIORNI 31–90",
      title: "Information gain e pillar",
      items: [
        "Liberare i file Dropbox NAFEMS wp_oct_20 Part 2 trasformandoli in tabelle benchmark HTML aperte e bilingui.",
        "Pubblicare 4 pillar principali: MeshFree vs Simcenter Simsolid, Alternativa ad Ansys/Abaqus, Simulazione Senza Mesh e Soluzioni ai problemi di mesh in SolidWorks.",
        "Implementare JSON-LD completo (SoftwareApplication, FAQPage, TechArticle) + box di risposta AEO da 50 parole.",
        "Lanciare il calcolatore TCO interattivo su midasmechanical.it."
      ]
    },
    {
      phase: "FASE 3: GIORNI 91–180",
      title: "SEO multimodale e parassita",
      items: [
        "Pubblicare 12 tutorial YouTube bilingui con capitoli, metriche OCR in-frame (ad esempio Part Count, Solve Time, Error %) e sottotitoli .vtt.",
        "Lanciare github.com/efem-cae/meshless-nafems-benchmarks e i DOI su Zenodo/ResearchGate.",
        "Collocare articoli italiani a firma su ilprogettistaindustriale.it e ingenio-web.it.",
        "Far crescere il programma di referral per i consulenti."
      ]
    },
    {
      phase: "FASE 4: MESI 6–12",
      title: "Fossati dell'ecosistema",
      items: [
        "Coordinarsi con MIDAS HQ per inserire MeshFree in nafems.org/publications/code-verification/.",
        "Costruire un'alleanza di link con i distributori MIDAS europei (komes.pl, femcomp.se).",
        "Lanciare la borsa di studio universitaria italiana sulle tesi meshless (per link .edu e futuri acquirenti).",
        "Eseguire audit trimestrali della Share of Voice nell'AI."
      ]
    }
  ];
  roadmapData.forEach((p,i) => { p.phase = roadmapIT[i].phase; p.title = roadmapIT[i].title; p.items = roadmapIT[i].items; });
})();
