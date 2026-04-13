/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  Trophy, 
  Brain, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight,
  Wind,
  Zap,
  Target,
  Lightbulb,
  Eye
} from 'lucide-react';

// --- Types ---

type Screen = 'home' | 'guide-detail' | 'exercise' | 'final-anchor';

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: any;
  bgIcon: any;
  context: string;
  assessmentTitle: string;
  assessmentOptions: string[];
  steps: Step[];
  finalTitle: string;
  finalRitual: string;
  finalPoints: { title: string; desc: string; icon: any }[];
}

interface Step {
  title: string;
  instruction: string;
  icon: any;
  color: string;
}

// --- Data ---

const GUIDES: Guide[] = [
  {
    id: 'nervous',
    title: 'Estoy muy nervioso antes de competir',
    description: 'Bajar revoluciones antes de competir',
    icon: Trophy,
    bgIcon: Zap,
    context: 'Cuando notas respiración acelerada, tensión muscular, pensamientos rápidos o sensación de presión justo antes de competir.',
    assessmentTitle: '¿Qué te está pasando ahora?',
    assessmentOptions: [
      'Estoy demasiado acelerado y tenso',
      'Estoy desconcentrado y me cuesta entrar en ritmo',
      'Tengo energía, pero siento que puedo perder el control'
    ],
    steps: [
      {
        title: 'Si elegiste "Estoy demasiado acelerado"',
        instruction: 'Haz 6 a 10 ciclos de respiración: inhala por nariz 4 segundos, sostén 2, exhala por boca 6.',
        icon: Wind,
        color: 'bg-primary-container'
      },
      {
        title: 'Si elegiste "Tengo energía pero siento que puedo perder el control"',
        instruction: 'Respira 3 veces profundo y luego activa tu cuerpo con movimientos breves y firmes durante 20 a 30 segundos.',
        icon: Zap,
        color: 'bg-surface-container-highest'
      },
      {
        title: 'Si elegiste "Estoy desconcentrado"',
        instruction: 'Usa 1 minuto de respiración regulada y luego visualiza una primera acción bien ejecutada. Repite una frase corta: "Estoy preparado" o "Entro en foco".',
        icon: Target,
        color: 'bg-surface-container-high'
      }
    ],
    finalTitle: 'Entra en modo competencia',
    finalRitual: 'Ahora define tu mini ritual para este momento: una respiración, una imagen mental y una frase de enfoque.',
    finalPoints: [
      { title: 'Presencia pura', desc: 'No busques sentirte perfecto. La perfección es una distracción del ahora.', icon: Target },
      { title: 'Energía dirigida', desc: 'Busca sentirte regulado. Si aún hay nervios, está bien: ahora ya tienen dirección.', icon: Zap }
    ]
  },
  {
    id: 'overthinking',
    title: 'Estoy pensando demasiado en ganar o no fallar',
    description: 'Volver al proceso cuando la mente se va al resultado',
    icon: Brain,
    bgIcon: Target,
    context: 'Cuando empiezas a pensar "tengo que ganar", "no puedo fallar", "esta competencia define todo" o sientes que estás sobrepensando demasiado.',
    assessmentTitle: '¿Dónde se fue tu mente?',
    assessmentOptions: [
      'Estoy pensando en ganar, perder o decepcionar',
      'Estoy intentando hacerlo perfecto',
      'Estoy pensando demasiado cada movimiento'
    ],
    steps: [
      {
        title: 'Enfoque en Resultados',
        instruction: 'Cambia el resultado por 3 acciones concretas que sí controlas, por ejemplo: respirar, seguir tu estrategia, concentrarte en la siguiente jugada.',
        icon: Target,
        color: 'bg-primary-container'
      },
      {
        title: 'Eficacia Técnica',
        instruction: "Reemplaza 'perfecto' por 'ejecutable': elige una sola acción técnica clave para este momento.",
        icon: ShieldCheck,
        color: 'bg-surface-container-highest'
      },
      {
        title: 'Claridad Mental',
        instruction: 'Haz una respiración profunda y vuelve a una consigna simple como "siguiente acción".',
        icon: Lightbulb,
        color: 'bg-surface-container-high'
      }
    ],
    finalTitle: 'Tu ancla mental de competencia',
    finalRitual: 'Quédate con estas 3 acciones para el resto de la competencia. Cada vez que tu mente se vaya al resultado, vuelve a esta secuencia:',
    finalPoints: [
      { title: 'reconozco', desc: 'Paso 01', icon: Eye },
      { title: 'respiro', desc: 'Paso 02', icon: Wind },
      { title: 'ejecuto', desc: 'Paso 03', icon: Zap }
    ]
  }
];

// --- Components ---

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="fixed top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-highest/80 backdrop-blur-xl border border-outline-variant/10 text-primary hover:bg-surface-container-high transition-all duration-300 active:scale-90"
  >
    <X size={24} />
  </button>
);

const BackgroundDecoration = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-[10%] -right-[10%] w-[500px] h-[500px] bg-primary-container/20 blur-[120px] rounded-full" />
    <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] bg-surface-container-highest/30 blur-[100px] rounded-full" />
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const navigateTo = (nextScreen: Screen, guide?: Guide) => {
    if (guide) setSelectedGuide(guide);
    setScreen(nextScreen);
    window.scrollTo(0, 0);
  };

  const reset = () => {
    setScreen('home');
    setSelectedGuide(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundDecoration />
      
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto w-full"
          >
            <section className="mb-12">
              <h1 className="text-[3.5rem] leading-tight font-extrabold tracking-tight text-on-surface mb-6 text-editorial-balance">
                ¿Cómo puedo ayudarte?
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl text-editorial-balance">
                Elige la situación que más se parece a lo que te está pasando ahora. Esta guía te ayudará a actuar rápido, con pasos claros, sin pensar de más.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUIDES.map((guide) => (
                <button 
                  key={guide.id}
                  onClick={() => navigateTo('guide-detail', guide)}
                  className="group text-left p-8 bg-surface-container-low rounded-3xl hover:bg-surface-container-high transition-all duration-300 flex flex-col justify-between min-h-[240px] relative overflow-hidden ambient-shadow"
                >
                  <div className="z-10">
                    <guide.icon className="text-primary mb-4" size={32} />
                    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center text-primary font-semibold z-10">
                    <span>Empezar guía</span>
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <guide.bgIcon size={160} />
                  </div>
                </button>
              ))}
              
              {/* Placeholder for other options from image */}
              <button className="group text-left p-8 bg-surface-container-low rounded-3xl opacity-60 cursor-not-allowed flex flex-col justify-between min-h-[240px] relative overflow-hidden">
                <div className="z-10">
                  <RotateCcw className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-bold text-on-surface">Cometí un error y no logro soltarlo</h3>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <RotateCcw size={160} />
                </div>
              </button>
              
              <button className="group text-left p-8 bg-surface-container-low rounded-3xl opacity-60 cursor-not-allowed flex flex-col justify-between min-h-[240px] relative overflow-hidden">
                <div className="z-10">
                  <ShieldCheck className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-bold text-on-surface">Siento presión, dudas o poca confianza</h3>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <ShieldCheck size={160} />
                </div>
              </button>
            </div>

            <footer className="mt-24 mb-8 flex flex-col items-center justify-center space-y-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" />
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-on-surface-variant/60">Momentum Consciente</p>
            </footer>
          </motion.main>
        )}

        {screen === 'guide-detail' && selectedGuide && (
          <motion.main 
            key="guide-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow pt-32 pb-40 px-6 md:px-12 max-w-4xl mx-auto w-full"
          >
            <CloseButton onClick={reset} />
            
            <section className="mb-16">
              <h1 className="text-[2.5rem] md:text-[3.5rem] leading-[1.1] font-extrabold tracking-tight text-on-surface mb-8 text-editorial-balance">
                {selectedGuide.description}
              </h1>
              <div className="bg-surface-container-low rounded-[2rem] p-8 md:p-10 ambient-shadow">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">Cuándo usarla</p>
                <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
                  {selectedGuide.context}
                </p>
              </div>
            </section>

            <section className="mb-16">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-on-surface mb-3">{selectedGuide.assessmentTitle}</h2>
                <p className="text-on-surface-variant max-w-xl leading-relaxed">
                  Marca la opción que mejor describa tu estado. No intentes corregirlo todavía, solo identifica qué está pasando.
                </p>
              </div>
              
              <div className="grid gap-4">
                {selectedGuide.assessmentOptions.map((option, idx) => (
                  <button 
                    key={idx}
                    className="group flex items-center justify-between p-6 bg-surface-container-high rounded-2xl hover:bg-primary-container transition-all duration-300 text-left active:scale-[0.98]"
                  >
                    <span className="text-lg font-medium text-on-surface group-hover:text-on-primary-container">{option}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-primary group-hover:bg-primary transition-colors" />
                  </button>
                ))}
              </div>
            </section>

            <div className="w-full h-64 rounded-[2.5rem] bg-surface-container-low overflow-hidden relative mb-16 grayscale contrast-125 opacity-40 mix-blend-multiply">
              <img 
                src={`https://picsum.photos/seed/${selectedGuide.id}/1200/600`} 
                alt="Atmospheric" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none flex justify-center">
              <button 
                onClick={() => navigateTo('exercise')}
                className="pointer-events-auto w-full md:w-auto md:min-w-[400px] h-16 bg-primary text-on-primary-container bg-primary-container font-bold text-lg rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300"
              >
                Vamos a regular tu estado paso a paso
                <ArrowRight size={20} />
              </button>
            </footer>
          </motion.main>
        )}

        {screen === 'exercise' && selectedGuide && (
          <motion.main 
            key="exercise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow pt-32 pb-40 px-6 md:px-12 max-w-4xl mx-auto w-full"
          >
            <CloseButton onClick={reset} />
            
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4 block">Paso 2 de 3</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
                Regula tu activación
              </h1>
            </div>

            <div className="grid gap-6 w-full">
              {selectedGuide.steps.map((step, idx) => (
                <section 
                  key={idx}
                  className="bg-surface-container-low p-8 md:p-10 rounded-[2rem] transition-all hover:bg-surface-container border border-transparent hover:border-outline-variant/10 ambient-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{step.title}</h2>
                      <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-medium">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <footer className="fixed bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none flex justify-center">
              <button 
                onClick={() => navigateTo('final-anchor')}
                className="pointer-events-auto w-full md:w-auto md:min-w-[400px] h-16 bg-primary text-on-primary-container bg-primary-container font-bold text-lg rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300"
              >
                Continuar
                <ArrowRight size={20} />
              </button>
            </footer>
          </motion.main>
        )}

        {screen === 'final-anchor' && selectedGuide && (
          <motion.main 
            key="final-anchor"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-4xl mx-auto w-full flex flex-col items-center"
          >
            <CloseButton onClick={reset} />
            
            <div className="text-center mb-12">
              <div className="w-24 h-24 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto mb-8">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shadow-lg">
                  <selectedGuide.icon className="text-primary" size={32} />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-8">
                {selectedGuide.finalTitle}
              </h1>
              <div className="space-y-6 max-w-prose mx-auto">
                <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-medium">
                  {selectedGuide.finalRitual}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-12">
              {selectedGuide.finalPoints.map((point, idx) => (
                <div 
                  key={idx}
                  className={`p-8 rounded-3xl transition-all duration-500 group ${idx === 1 ? 'bg-primary-container' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
                >
                  <point.icon className="text-primary mb-4 block group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="text-lg font-bold text-on-surface mb-2">{point.title}</h3>
                  <p className="text-on-surface-variant leading-snug">{point.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 w-full max-w-sm">
              <button 
                onClick={reset}
                className="w-full h-16 rounded-full bg-primary text-on-primary font-bold text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Volver a la pantalla principal
                <ArrowRight size={20} />
              </button>
              <p className="text-center mt-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">
                Enfoque Total • Resiliencia
              </p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
