import { templateTransformer } from './templateTransformer';

const sampleTemplate = {
    "pieces": [
        "@activepieces/piece-wordpress",
        "@activepieces/piece-openai",
        "@activepieces/piece-twitter"
    ],
    "template": {
        "trigger": {
            "settings": {
                "pieceName": "@activepieces/piece-wordpress"
            },
            "nextAction": {
                "settings": {
                    "pieceName": "@activepieces/piece-openai"
                },
                "nextAction": {
                    "settings": {
                        "pieceName": "@activepieces/piece-twitter"
                    }
                }
            }
        }
    },
    "blogUrl": "https://www.activepieces.com/blog/example"
};

const transformed = templateTransformer.transformTemplate(sampleTemplate);
console.log(JSON.stringify(transformed, null, 2));
