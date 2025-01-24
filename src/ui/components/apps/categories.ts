export const categories = {
  CORE: 'Core',
  COMMUNICATION: 'Communication',
  DATA: 'Data Management',
  AUTOMATION: 'Automation',
  AI: 'Artificial Intelligence',
  SOCIAL: 'Social Media',
  PRODUCTIVITY: 'Productivity',
  DEVELOPER: 'Developer Tools'
};

// Map pieces to categories
export const pieceCategories: Record<string, string> = {
  'flow-control': categories.CORE,
  'google-sheets': categories.DATA,
  'slack': categories.COMMUNICATION,
  'openai': categories.AI,
  'github': categories.DEVELOPER,
  // Add more mappings as needed
};

export const getPieceCategory = (pieceId: string): string => {
  return pieceCategories[pieceId] || categories.AUTOMATION;
};
