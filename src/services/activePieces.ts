import axios from 'axios';

const AP_TEMPLATES_URL = "https://cloud.activepieces.com/api/v1/flow-templates";

export interface ActivePiecesTemplate {
  id: string;
  name: string;
  description: string;
  pieces: Array<{
    name: string;
    logoUrl: string;
    projectId: string;
    version: string;
  }>;
}

export interface PieceMetadata {
  id: string;
  name: string;
  displayName: string;
  logoUrl: string;
  description: string;
  version: string;
  actions?: Record<string, any>;
  triggers?: Record<string, any>;
}

class ActivePiecesService {
  private pieces: Map<string, PieceMetadata> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const response = await axios.get(AP_TEMPLATES_URL);
      const templates: ActivePiecesTemplate[] = response.data.data;
      
      // Extract unique pieces from templates
      const uniquePieces = new Map<string, PieceMetadata>();
      
      templates.forEach(template => {
        template.pieces.forEach(piece => {
          if (!uniquePieces.has(piece.name)) {
            uniquePieces.set(piece.name, {
              id: piece.name,
              name: piece.name,
              displayName: this.formatDisplayName(piece.name),
              logoUrl: piece.logoUrl,
              description: `Integration with ${this.formatDisplayName(piece.name)}`,
              version: piece.version
            });
          }
        });
      });

      this.pieces = uniquePieces;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to fetch ActivePieces templates:', error);
      throw error;
    }
  }

  private formatDisplayName(name: string): string {
    return name
      .replace('piece-', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getAllPieces(): Promise<PieceMetadata[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return Array.from(this.pieces.values());
  }

  async getPieceById(id: string): Promise<PieceMetadata | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.pieces.get(id);
  }
}

export const activePiecesService = new ActivePiecesService();
