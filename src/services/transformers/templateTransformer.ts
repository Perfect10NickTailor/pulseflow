interface FlowTemplate {
    [key: string]: any;
    pieces?: string[];
    blogUrl?: string;
    template?: {
        trigger?: {
            settings?: {
                pieceName?: string;
            };
        };
    };
}

export class TemplateTransformer {
    private readonly replacements = {
        '@activepieces/': '@pulseflow/',
        'www.activepieces.com': 'www.example.com'  // placeholder domain
    };

    transformTemplate(template: FlowTemplate): FlowTemplate {
        const transformed = JSON.parse(JSON.stringify(template));

        // Transform piece names in the pieces array
        if (transformed.pieces) {
            transformed.pieces = transformed.pieces.map((piece: string) => 
                this.replacePieceName(piece)
            );
        }

        // Transform piece names in trigger settings
        if (transformed.template?.trigger?.settings?.pieceName) {
            transformed.template.trigger.settings.pieceName = 
                this.replacePieceName(transformed.template.trigger.settings.pieceName);
        }

        // Transform or remove blog URL
        if (transformed.blogUrl) {
            // Option 1: Remove blogUrl
            delete transformed.blogUrl;
            
            // Option 2: Replace with placeholder
            // transformed.blogUrl = 'https://www.example.com/blog/placeholder';
        }

        // Recursively transform nested actions
        if (transformed.template?.trigger?.nextAction) {
            this.transformAction(transformed.template.trigger.nextAction);
        }

        return transformed;
    }

    private transformAction(action: any): void {
        if (!action) return;

        // Transform piece name in current action
        if (action.settings?.pieceName) {
            action.settings.pieceName = this.replacePieceName(action.settings.pieceName);
        }

        // Recursively transform next action
        if (action.nextAction) {
            this.transformAction(action.nextAction);
        }
    }

    private replacePieceName(name: string): string {
        return Object.entries(this.replacements).reduce(
            (result, [from, to]) => result.replace(from, to),
            name
        );
    }
}

export const templateTransformer = new TemplateTransformer();

// Example usage:
/*
const originalTemplate = {
    // ... your JSON ...
};

const transformed = templateTransformer.transformTemplate(originalTemplate);
console.log(transformed);
*/
