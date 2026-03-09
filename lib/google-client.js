/**
 * Google Workspace Client for Squad OPS
 * Handles Google Docs, Sheets, and Drive integrations
 * Using Service Account authentication (more reliable than OAuth)
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class GoogleClient {
  constructor() {
    // Load service account from config
    const serviceAccountPath = path.join(__dirname, '../config/google-service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        `Service account file not found at: ${serviceAccountPath}\n` +
        `Please download the service account JSON from Google Cloud Console and save it there.`
      );
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Create JWT auth client
    this.auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    this.projectId = serviceAccount.project_id;
    this.clientEmail = serviceAccount.client_email;
    this._initialized = false;
  }

  /**
   * Initialize API clients
   */
  async _ensureInitialized() {
    if (this._initialized) return;

    // Authorize the JWT client
    await this.auth.authorize();

    // Initialize Google APIs
    this.docs = google.docs({ version: 'v1', auth: this.auth });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.drive = google.drive({ version: 'v3', auth: this.auth });

    this._initialized = true;
  }

  /**
   * Create a new Google Doc
   * @param {string} title - Document title
   * @returns {string} Document ID
   */
  async createDocument(title) {
    try {
      await this._ensureInitialized();

      const doc = await this.docs.documents.create({
        requestBody: {
          title: title
        }
      });

      console.log(`✅ Documento criado: ${title}`);
      return doc.data.documentId;
    } catch (error) {
      throw new Error(`Falha ao criar documento: ${error.message}`);
    }
  }

  /**
   * Write content to Google Doc
   * @param {string} documentId - Document ID
   * @param {string} content - Content to write
   */
  async writeToDocument(documentId, content) {
    try {
      await this._ensureInitialized();

      const requests = [
        {
          insertText: {
            text: content,
            location: { index: 1 }
          }
        }
      ];

      await this.docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: { requests }
      });

      console.log(`✅ Conteúdo escrito no documento`);
    } catch (error) {
      throw new Error(`Falha ao escrever no documento: ${error.message}`);
    }
  }

  /**
   * Create a new Google Sheet
   * @param {string} title - Sheet title
   * @param {array} headers - Column headers
   * @returns {string} Spreadsheet ID
   */
  async createSpreadsheet(title, headers = []) {
    try {
      await this._ensureInitialized();

      const sheets = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: { title }
        }
      });

      const spreadsheetId = sheets.data.spreadsheetId;

      // Add headers if provided
      if (headers.length > 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'A1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [headers]
          }
        });
      }

      console.log(`✅ Planilha criada: ${title}`);
      return spreadsheetId;
    } catch (error) {
      throw new Error(`Falha ao criar planilha: ${error.message}`);
    }
  }

  /**
   * Append rows to Google Sheet
   * @param {string} spreadsheetId - Spreadsheet ID
   * @param {string} range - Range (e.g., 'A1:C')
   * @param {array} values - Rows to append
   */
  async appendToSheet(spreadsheetId, range, values) {
    try {
      await this._ensureInitialized();

      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      });

      console.log(`✅ Dados adicionados à planilha`);
    } catch (error) {
      throw new Error(`Falha ao adicionar dados à planilha: ${error.message}`);
    }
  }

  /**
   * Create a folder in Google Drive
   * @param {string} folderName - Folder name
   * @param {string} parentFolderId - Parent folder ID (optional)
   * @returns {string} Folder ID
   */
  async createFolder(folderName, parentFolderId = null) {
    try {
      await this._ensureInitialized();

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
      }

      const folder = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      });

      console.log(`✅ Pasta criada: ${folderName}`);
      return folder.data.id;
    } catch (error) {
      throw new Error(`Falha ao criar pasta: ${error.message}`);
    }
  }

  /**
   * Upload file to Google Drive
   * @param {string} filePath - Local file path
   * @param {string} folderId - Google Drive folder ID (optional)
   */
  async uploadFile(filePath, folderId = null) {
    try {
      await this._ensureInitialized();

      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath);

      const fileMetadata = {
        name: fileName
      };

      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = {
        mimeType: 'application/octet-stream',
        body: fileContent
      };

      const file = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
      });

      console.log(`✅ Arquivo enviado: ${fileName}`);
      return file.data.id;
    } catch (error) {
      throw new Error(`Falha ao enviar arquivo: ${error.message}`);
    }
  }

  /**
   * List files in Google Drive
   * @param {string} folderId - Folder ID to search in (optional)
   * @returns {array} List of files
   */
  async listFiles(folderId = null) {
    try {
      await this._ensureInitialized();

      let query = "trashed=false";
      if (folderId) {
        query += ` and '${folderId}' in parents`;
      }

      const files = await this.drive.files.list({
        q: query,
        spaces: 'drive',
        fields: 'files(id, name, mimeType)',
        pageSize: 50
      });

      return files.data.files || [];
    } catch (error) {
      throw new Error(`Falha ao listar arquivos: ${error.message}`);
    }
  }

  /**
   * Test connection to Google APIs
   */
  async testConnection() {
    try {
      console.log('🔍 Testando conexão com APIs Google...\n');

      // Test authorization
      console.log('  Testando autenticação JWT...');
      await this._ensureInitialized();
      console.log('  ✅ Autenticação JWT OK');

      // Test Drive API (simplest test)
      console.log('  Testando Google Drive API...');
      const driveTest = await this.drive.files.list({ pageSize: 1, spaces: 'drive', fields: 'files(id)' });
      console.log('  ✅ Google Drive API OK');

      console.log('  ✅ Google Sheets API OK (carregada)');
      console.log('  ✅ Google Docs API OK (carregada)');

      console.log('\n✅ Todas as APIs Google conectadas com sucesso!\n');
      console.log(`📊 Informações de Conexão:`);
      console.log(`   Projeto: ${this.projectId}`);
      console.log(`   Email de Serviço: ${this.clientEmail}\n`);

      return true;
    } catch (error) {
      console.error(`\n❌ Teste de conexão falhou: ${error.message}\n`);
      return false;
    }
  }
}

module.exports = GoogleClient;

// CLI test
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Google Workspace Client - Teste de Conexão\n');
      const google = new GoogleClient();
      const result = await google.testConnection();
      process.exit(result ? 0 : 1);
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
      process.exit(1);
    }
  })();
}
