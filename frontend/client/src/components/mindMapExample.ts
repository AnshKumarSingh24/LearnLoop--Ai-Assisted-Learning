import type { MindMapData } from "./MindMap";

export const mindMapExample: MindMapData = {
  topic: "Photosynthesis",
  summary: "Plants convert sunlight into stored chemical energy through linked light-dependent and carbon-fixation reactions.",
  details: "Photosynthesis uses light energy, water, and carbon dioxide to produce sugars and release oxygen, as described in the source lesson.",
  sourceReference: {
    page: 3,
    section: "Photosynthesis",
    quote: "Photosynthesis converts light energy into chemical energy in green plants.",
  },
  branches: [
    {
      id: "b1",
      keyword: "Light Reactions",
      summary: "Chlorophyll captures light energy and helps drive the reactions that release oxygen.",
      details: "The light reactions capture energy from sunlight. The source explains that chlorophyll absorbs sunlight in leaves.",
      example: "Chlorophyll absorbs sunlight in the leaves.",
      sourceReference: { page: 3, section: "Light Reactions", quote: "Chlorophyll absorbs sunlight in the leaves." },
      children: [
        { id: "b1c1", keyword: "Chlorophyll", summary: "A leaf pigment that absorbs sunlight.", details: "The document identifies chlorophyll as the pigment that absorbs sunlight in leaves.", sourceReference: { page: 3, section: "Light Reactions", quote: "Chlorophyll absorbs sunlight in the leaves." } },
        { id: "b1c2", keyword: "Oxygen Release", summary: "Oxygen is released as a byproduct.", details: "The source states that oxygen is released into the atmosphere as a byproduct.", sourceReference: { page: 3, section: "Products", quote: "Oxygen is released into the atmosphere as a byproduct." } },
      ],
    },
    {
      id: "b2",
      keyword: "Carbon Dioxide",
      summary: "Carbon dioxide enters leaves through small openings called stomata.",
      details: "The document describes stomata as the small openings through which carbon dioxide enters.",
      sourceReference: { page: 4, section: "Gas Exchange", quote: "Carbon dioxide enters through small openings called stomata." },
      children: [
        { id: "b2c1", keyword: "Leaf Stomata", summary: "Small openings allow carbon dioxide to enter.", details: "Carbon dioxide enters through small openings called stomata.", sourceReference: { page: 4, section: "Gas Exchange", quote: "Carbon dioxide enters through small openings called stomata." } },
        { id: "b2c2", keyword: "Gas Exchange", summary: "The source links carbon dioxide intake to leaves.", details: "The source passage describes carbon dioxide entering the plant through leaf openings.", sourceReference: { page: 4, section: "Gas Exchange", quote: "Carbon dioxide enters through small openings called stomata." } },
      ],
    },
    {
      id: "b3",
      keyword: "Water Transport",
      summary: "Roots take up water from soil and transport it to leaves.",
      details: "The lesson connects water absorption by roots with transport to the leaves.",
      sourceReference: { page: 4, section: "Water", quote: "Roots absorb water from the soil and transport it to the leaves." },
      children: [
        { id: "b3c1", keyword: "Root Absorption", summary: "Roots absorb water from the soil.", details: "Roots absorb water from the soil before it is transported to leaves.", sourceReference: { page: 4, section: "Water", quote: "Roots absorb water from the soil and transport it to the leaves." } },
        { id: "b3c2", keyword: "Leaf Transport", summary: "Water moves from roots to leaves.", details: "The source explicitly says roots transport absorbed water to the leaves.", sourceReference: { page: 4, section: "Water", quote: "Roots absorb water from the soil and transport it to the leaves." } },
      ],
    },
    {
      id: "b4",
      keyword: "Sugar Production",
      summary: "The process produces glucose, which stores energy for the plant.",
      details: "The source states that photosynthesis produces glucose and that glucose stores energy for the plant.",
      sourceReference: { page: 5, section: "Products", quote: "The process produces glucose that stores energy for the plant." },
      children: [
        { id: "b4c1", keyword: "Glucose", summary: "Photosynthesis produces glucose.", details: "The document names glucose as a product of photosynthesis.", sourceReference: { page: 5, section: "Products", quote: "The process produces glucose that stores energy for the plant." } },
        { id: "b4c2", keyword: "Stored Energy", summary: "Glucose stores energy for the plant.", details: "The source explains that glucose stores energy for the plant.", sourceReference: { page: 5, section: "Products", quote: "The process produces glucose that stores energy for the plant." } },
      ],
    },
  ],
};
