"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AnalogClock } from "@/components/AnalogClock";

const SCENARIOS = [
  {
    id: 's1',
    title: 'What If Someone Calls You Fat?',
    description: 'A classmate says, "You\'re so fat!" How do you respond?',
    options: [
      { label: '😤 "You\'re fat too!"', lesson: 'Fighting back with anger often makes things worse. You deserve to be treated with kindness.' },
      { label: '😔 Cry and run away', lesson: 'It\'s okay to feel sad, but running away doesn\'t solve the problem. You are wonderful just as you are.' },
      { label: '😊 "That hurt my feelings. Please don\'t say that."', lesson: 'This is a brave and respectful way to set a boundary. You stood up for yourself without being mean.' },
      { label: '🤷 "I don\'t care what you think."', lesson: 'You know your worth! This shows confidence, but it might not help the other person understand how their words affect others.' },
    ],
  },
  {
    id: 's2',
    title: 'What If You Break Your Friend\'s Toy?',
    description: 'You accidentally break your friend\'s favourite toy. What do you do?',
    options: [
      { label: '🤥 Hide it and say nothing', lesson: 'Hiding the truth can hurt your friendship. Honesty builds trust.' },
      { label: '😢 Say "I\'m sorry" and offer to help fix it', lesson: 'This shows empathy and responsibility. A true friend forgives and helps you make things right.' },
      { label: '🙄 Blame someone else', lesson: 'Blaming others when you make a mistake damages trust. It takes courage to admit when you\'re wrong.' },
      { label: '😰 Run away', lesson: 'Running away from your problems doesn\'t make them disappear. Facing them with honesty shows strength.' },
    ],
  },
  {
    id: 's3',
    title: 'What If You See Someone Being Bullied?',
    description: 'You see someone being teased and they look really sad. What do you do?',
    options: [
      { label: '😐 Walk away and ignore it', lesson: 'Ignoring a problem allows it to continue. As a friend, you can make a difference.' },
      { label: '😡 Join in to fit in', lesson: 'Joining in hurts the other person and also hurts your own character. True friends stand up for what is right.' },
      { label: '😟 Tell the bully to stop', lesson: 'This is brave and shows you care. Sometimes a simple "Stop" is all it takes.' },
      { label: '🤗 Go to the person and ask if they\'re okay', lesson: 'This is a kind and supportive act. You don\'t have to be a superhero to make a difference. Just being there can help.' },
    ],
  },
  {
    id: 's4',
    title: 'Telling Time Challenge!',
    description: 'The clock shows 3:45. Which time is it?',
    options: [
      { label: '🕒 3:45', lesson: '✅ Correct! The clock shows 3:45 PM. You\'re learning to tell time!' },
      { label: '🕑 4:45', lesson: '❌ Not quite. The minute hand is on the 9, which means 45 minutes past the hour. The hour hand is just before the 4, so the time is 3:45.' },
      { label: '🕐 3:30', lesson: '❌ Look again. The minute hand is on the 9, not the 6. That means 45 minutes past the hour, not 30.' },
      { label: '🕔 5:45', lesson: '❌ Not quite. The hour hand is just before 4, which means the time is in the 3 o\'clock hour, not the 5 o\'clock hour.' },
    ],
  },
];

export default function CharacterBuilding() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showClock, setShowClock] = useState(false);

  if (!user) {
    router.push('/');
    return null;
  }

  const handleSelect = (optionIndex: number) => {
    const newOptions = [...selectedOptions, optionIndex];
    setSelectedOptions(newOptions);

    const scenario = SCENARIOS[currentScenario];
    const selectedLesson = scenario.options[optionIndex].lesson;

    // Show feedback
    setFeedback(selectedLesson);

    setTimeout(() => {
      setFeedback(null);
      if (currentScenario < SCENARIOS.length - 1) {
        setCurrentScenario(currentScenario + 1);
        // Reset clock visibility for next scenario
        if (SCENARIOS[currentScenario + 1]?.id === 's4') {
          setShowClock(true);
        } else {
          setShowClock(false);
        }
      } else {
        setIsComplete(true);
      }
    }, 2500);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-[#1e1916] mb-2">Great Choices!</h1>
          <p className="text-[#4a423b] text-lg mb-6">
            You've shown kindness, courage, and wisdom today!
          </p>
          <div className="bg-[#f7f2eb] p-6 rounded-xl mb-8 text-left">
            <p className="text-sm font-medium text-[#4a423b] mb-2">💡 Remember</p>
            <p className="text-[#1e1916] italic">
              "Every choice you make is a chance to show the world who you are."
            </p>
          </div>
          <button
            onClick={goToDashboard}
            className="px-8 py-3 bg-[#b28b6a] text-white rounded-full font-medium hover:shadow-xl transition-all"
          >
            📊 Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const scenario = SCENARIOS[currentScenario];
  const isClockScenario = scenario.id === 's4';

  return (
    <main className="min-h-screen bg-[#f7f2eb] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1e1916]">🧠 Build Character</h2>
          <span className="text-sm text-[#8a7e74]">
            {currentScenario + 1} of {SCENARIOS.length}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#1e1916] mb-2">{scenario.title}</h3>
        <p className="text-[#4a423b] mb-6">{scenario.description}</p>

        {/* Show analog clock for the clock scenario */}
        {isClockScenario && (
          <div className="flex justify-center mb-6">
            <AnalogClock hour={3} minute={45} />
          </div>
        )}

        <div className="space-y-3">
          {scenario.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={feedback !== null}
              className="w-full text-left px-6 py-4 bg-[#f7f2eb] hover:bg-[#dcc8b4] rounded-xl transition-all font-medium text-[#1e1916] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Feedback popup */}
        {feedback && (
          <div className={`mt-4 p-4 rounded-xl text-sm ${
            feedback.startsWith('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : feedback.startsWith('❌')
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    </main>
  );
}