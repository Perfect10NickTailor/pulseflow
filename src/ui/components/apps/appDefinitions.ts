export interface AppDefinition {
  id: string;
  name: string;
  displayName: string;
  icon: string | null;
  logoUrl?: string;
  color: string;
  description: string;
  category: string;
}

// App categories matching Make.com's style
export const categories = {
  CORE: 'Core',
  COMMUNICATION: 'Communication',
  PRODUCTIVITY: 'Productivity'
};

export const apps: AppDefinition[] = [
  // Built-in apps
  {
    id: 'flow-control',
    name: 'Flow Control',
    displayName: 'Flow Control',
    icon: '⚡',
    color: 'bg-emerald-500',
    description: 'Control the flow of your automation',
    category: categories.CORE
  },
  // Gmail piece
  {
    id: 'gmail',
    name: 'Gmail',
    displayName: 'Gmail',
    icon: null,
    logoUrl: 'https://cdn.activepieces.com/pieces/gmail.png',
    color: 'bg-red-500',
    description: 'Email service by Google',
    category: categories.COMMUNICATION
  }
];

export const getAllApps = (): AppDefinition[] => apps;

export const getAppsByCategory = (category: string): AppDefinition[] => {
  return apps.filter(app => app.category === category);
};
