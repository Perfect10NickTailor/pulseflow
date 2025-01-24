import axios from 'axios';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Template {
  id: string;
  [key: string]: any;
}

interface ApiResponse {
  next: string;
  previous: string;
  data: Template[];
}

class TemplateDownloader {
  private readonly templatesUrl: string;
  private readonly apiKey?: string;
  private readonly localDirectory: string;

  constructor() {
    this.templatesUrl = process.env.AP_TEMPLATES_SOURCE_URL || 'https://cloud.activepieces.com/api/v1/flow-templates';
    this.apiKey = process.env.AP_API_KEY;
    this.localDirectory = path.join(__dirname, '../../../data/activepieces_templates');
  }

  private async fetchTemplates(): Promise<Template[] | null> {
    try {
      console.log(`Fetching templates from: ${this.templatesUrl}`);

      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.get<ApiResponse>(this.templatesUrl, { headers });
      console.log(`Status Code: ${response.status}`);
      console.log(`Response preview: ${JSON.stringify(response.data).slice(0, 500)}...`);

      if (response.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        console.log('Error: Invalid response format or missing data');
        return null;
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      return null;
    }
  }

  private async saveTemplates(templates: Template[]): Promise<void> {
    // Ensure directory exists
    await fs.ensureDir(this.localDirectory);
    console.log(`Saving templates to: ${this.localDirectory}`);

    for (const template of templates) {
      const templateId = template.id || 'unknown_template';
      const fileName = `${templateId}.json`;
      const filePath = path.join(this.localDirectory, fileName);

      await fs.writeJson(filePath, template, { spaces: 2 });
      console.log(`Saved template: ${fileName}`);
    }
  }

  async download(): Promise<void> {
    const templates = await this.fetchTemplates();
    if (templates && Array.isArray(templates)) {
      console.log(`Fetched ${templates.length} templates.`);
      await this.saveTemplates(templates);
      console.log('All templates saved successfully.');
    } else {
      console.log('No templates fetched or invalid response format.');
    }
  }
}

// Allow running from command line
if (require.main === module) {
  console.log('Starting template download...');
  const downloader = new TemplateDownloader();
  downloader.download()
    .then(() => {
      console.log('Template download completed.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Template download failed:', error);
      process.exit(1);
    });
}

export { TemplateDownloader };
