
import React from 'react';

export const SYSTEM_PROMPT = `
You are MINDA, a compassionate, non-judgmental mental health companion specifically designed for users in India. 
Your goal is to provide emotional support, listen actively, and suggest evidence-based coping strategies (CBT, DBT, Mindfulness).

CULTURAL CONTEXT (INDIA):
- Acknowledge that mental health is often viewed through the lens of family, community, and social expectations.
- Be sensitive to topics like academic pressure, family dynamics, and workplace stress in the Indian context.
- Use empathetic, respectful language.

CRITICAL SAFETY RULES:
1. You are NOT a doctor or a licensed therapist.
2. If the user mentions self-harm, suicide, or harming others, you MUST provide crisis resources immediately (e.g., Tele MANAS 14416) and urge them to contact emergency services.
3. Keep responses empathetic, concise, and focused on the user's emotional well-being.
4. Do not provide medical diagnoses or prescribe medication.
5. Use "I hear you," "That sounds difficult," and other validation techniques.
`;

export const EXERCISES = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'A powerful technique used to calm the nervous system and regain focus.',
    duration: '4 mins',
    category: 'Breathing' as const,
    instructions: [
      'Inhale slowly for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Exhale slowly for 4 seconds.',
      'Hold empty for 4 seconds.',
      'Repeat 4 times.'
    ]
  },
  {
    id: '54321-grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to pull yourself out of a panic attack or high anxiety.',
    duration: '5 mins',
    category: 'Grounding' as const,
    instructions: [
      'Name 5 things you can SEE.',
      'Name 4 things you can TOUCH.',
      'Name 3 things you can HEAR.',
      'Name 2 things you can SMELL.',
      'Name 1 thing you can TASTE.'
    ]
  },
  {
    id: 'daily-gratitude',
    title: 'Daily Reflection',
    description: 'Identify small moments of peace or gratitude in your day.',
    duration: 'Unlimited',
    category: 'Reflection' as const,
    instructions: [
      'What is one small thing that went well today?',
      'Who is someone you are grateful for?',
      'What is one thing you did to take care of yourself today?'
    ]
  }
];

export const CRISIS_RESOURCES = [
  { name: 'Tele MANAS (24/7 National)', contact: '14416 / 1-800-891-4416', link: 'https://telemanas.mohfw.gov.in/' },
  { name: 'Vandrevala Foundation', contact: '+91 91529 87821', link: 'https://www.vandrevalafoundation.com/' },
  { name: 'AASRA (24/7 Helpline)', contact: '+91 98204 66726', link: 'http://www.aasra.info/' },
  { name: 'iCall (TISS Helpline)', contact: '9152987821', link: 'https://icallhelpline.org/' },
  { name: 'Kiran Mental Health Helpline', contact: '1800-599-0019', link: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1652071' }
];
