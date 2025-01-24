const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class TemplateDownloader {
  constructor() {
    this.templatesUrl = process.env.AP_TEMPLATES_SOURCE_URL || 'https://cloud.activepieces.com/api/v1/flow-templates';
    this.apiKey = process.env.AP_API_KEY;
    this.localDirectory = path.join(__dirname, '../../../data/activepieces_templates');
  }

  async fetchTemplates() {
    try {
      console.log(`Fetching templates from: ${this.templatesUrl}`);

      const headers = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await axios.get(this.templatesUrl, { headers });
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

  async saveTemplates(templates) {
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

  async download() {
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

// Run if called directly
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

module.exports = { TemplateDownloader };
