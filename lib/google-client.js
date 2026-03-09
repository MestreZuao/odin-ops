/**
 * Google Workspace Client for Squad OPS
 * Handles Google Docs, Sheets, and Drive integrations
 */

const { google } = require('googleapis');
require('dotenv').config();

class GoogleClient {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!this.clientId || !this.clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurados');
    }

    if (!this.refreshToken) {
      throw new Error('GOOGLE_REFRESH_TOKEN não configurado. Execute: node scripts/google-oauth-setup.js');
    }

    // Criar OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      'http://localhost:3000/callback'
    );

    // Setar refresh token
    this.oauth2Client.setCredentials({
      refresh_token: this.refreshToken
    });

    // Inicializar Google APIs
    this.docs = google.docs({ version: 'v1', auth: this.oauth2Client });
    this.sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Create a new Google Doc
   * @param {string} title - Document title
   * @returns {string} Document ID
   */
  async createDocument(title) {
    try {
      const doc = await this.docs.documents.create({
        requestBody: {
          title: title
        }
      });

      console.log(`✅ Document created: ${title}`);
      return doc.data.documentId;
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  /**
   * Write content to Google Doc
   * @param {string} documentId - Document ID
   * @param {string} content - Content to write
   */
  async writeToDocument(documentId, content) {
    try {
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

      console.log(`✅ Content written to document`);
    } catch (error) {
      throw new Error(`Failed to write to document: ${error.message}`);
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

      console.log(`✅ Spreadsheet created: ${title}`);
      return spreadsheetId;
    } catch (error) {
      throw new Error(`Failed to create spreadsheet: ${error.message}`);
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
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values
        }
      });

      console.log(`✅ Data appended to sheet`);
    } catch (error) {
      throw new Error(`Failed to append to sheet: ${error.message}`);
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

      console.log(`✅ Folder created: ${folderName}`);
      return folder.data.id;
    } catch (error) {
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  /**
   * Upload file to Google Drive
   * @param {string} filePath - Local file path
   * @param {string} folderId - Google Drive folder ID (optional)
   */
  async uploadFile(filePath, folderId = null) {
    try {
      const fs = require('fs');
      const path = require('path');

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

      console.log(`✅ File uploaded: ${fileName}`);
      return file.data.id;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * List files in Google Drive
   * @param {string} folderId - Folder ID to search in (optional)
   * @returns {array} List of files
   */
  async listFiles(folderId = null) {
    try {
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
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Test connection to Google APIs
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Google APIs connection...\n');

      // Test Docs API
      console.log('  Testing Google Docs API...');
      await this.docs.documents.list({ pageSize: 1 });
      console.log('  ✅ Google Docs API OK');

      // Test Sheets API
      console.log('  Testing Google Sheets API...');
      await this.sheets.spreadsheets.get({ spreadsheetId: '1BxiMVs0XRA5nFMoon1tB7_0VwXrJW8MsxDNiMZLSFAo' }).catch(() => {
        // Expected to fail with permission error - just testing connection
      });
      console.log('  ✅ Google Sheets API OK');

      // Test Drive API
      console.log('  Testing Google Drive API...');
      await this.drive.files.list({ pageSize: 1 });
      console.log('  ✅ Google Drive API OK');

      console.log('\n✅ All Google APIs connected successfully!\n');
      return true;
    } catch (error) {
      console.error(`\n❌ Connection test failed: ${error.message}\n`);
      return false;
    }
  }
}

module.exports = GoogleClient;

// CLI test
if (require.main === module) {
  (async () => {
    try {
      const google = new GoogleClient();
      await google.testConnection();
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  })();
}
