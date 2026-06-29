import type { ActivismTypeData, Dimension } from '../types.js';

export const activismTypes: Record<Dimension, ActivismTypeData> = {
  R: {
    id: 'R',
    title: "Builder",
    color: "bg-teal-50 text-teal-900 border-teal-200",
    resultTitle: "a Builder.",
    description: "You prefer practical, hands-on, and tangible problem-solving. You value concrete results and are highly effective in roles that require logistical execution, physical engagement, and structured outcomes rather than abstract theory.",
    resultText: "Builders find satisfaction in the physical production of civic change and are motivated by being able to see and touch the results of their labor. They enjoy constructing tangible infrastructure and setting up the mechanical layouts of events. For Builders, activism is most motivating when it leaves the abstract and moves towards the concrete."
  },
  I: {
    id: 'I',
    title: "Analyst",
    color: "bg-blue-50 text-blue-900 border-blue-200",
    resultTitle: "an Analyst.",
    description: "You are analytical, intellectual, and observational. You excel at gathering data, identifying patterns, and understanding complex systems. You are critical to movements because you ensure actions are grounded in factual realities and well-researched policy.",
    resultText: "Analysts are energized by a love of learning and a desire to truly understand the root causes of systemic challenges. They feel most rewarded when uncovering solutions to difficult problems. Analysts tend to find activism most exciting when they can grapple with problems and share their learned wisdom with others to support their communities."
  },
  A: {
    id: 'A',
    title: "Storyteller",
    color: "bg-cyan-50 text-cyan-900 border-cyan-200",
    resultTitle: "a Storyteller.",
    description: "You are expressive, original, and independent. You rely on creativity and intuition. In political spaces, you are the force that translates complex, dry issues into emotionally resonant narratives that mobilize the public.",
    resultText: "Storytellers use art and creative media to bring out the human elements of activism. They derive satisfaction from turning dry, abstract policy ideas into powerful, emotionally moving narratives through graphic design, film, and social media. For Storytellers, civic work is most exciting when it focuses on capturing the public’s attention and change how people see a cause."
  },
  S: {
    id: 'S',
    title: "Connector",
    color: "bg-sky-50 text-sky-900 border-sky-200",
    resultTitle: "a Connector.",
    description: "You are empathetic, supportive, and focused on human well-being. You thrive in collaborative environments where you can teach, heal, or facilitate. You are the glue that keeps activist communities healthy and engaged.",
    resultText: "Connectors are driven by the relational and cooperative nature of civic work. They focus their energy into healing, teaching, and mutual support. They experience intrinsic reward when building deep, supportive relationships with community members and supporting marginalized communities through direct service. The best positions for Connectors satisfies their fundamental need to collaborate, turning the struggle for justice into a shared, empathic experience."
  },
  E: {
    id: 'E',
    title: "Mobilizer",
    color: "bg-indigo-50 text-indigo-900 border-indigo-200",
    resultTitle: "a Mobilizer.",
    description: "You are ambitious, outgoing, and influential. You excel at leading teams, speaking publicly, and persuading others. You are essential for driving momentum, securing resources, and negotiating structural change.",
    resultText: "Mobilizers thrive in high-stakes, high-energy leadership roles within activism. They are naturally motivated by the challenge of persuading and energizing others. For Mobilizers, activism is most rewarding when it allows them to use their strategic minds to influence policy and lead people."
  },
  C: {
    id: 'C',
    title: "Organizer",
    color: "bg-slate-100 text-slate-900 border-slate-300",
    resultTitle: "an Organizer.",
    description: "You are detail-oriented, organized, and structured. You prefer clear guidelines and predictable environments. Movements rely on you to ensure compliance, manage resources efficiently, and keep the organizational machinery running.",
    resultText: "Organizers find their purpose in developing administrative structure, procedural accuracy, and organizational stability to the chaotic environments of social movements. They feel most rewarded when building the unseen infrastructure of activism, such as tracking schedules, managing compliance, and maintaining ledgers. For an Organizer, civic engagement is most fulfilling when it relies on the detail-orientation to ensure campaigns operates with efficiency and consistency."
  }
};
