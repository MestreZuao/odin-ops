/**
 * Obsidian Vault Client for Squad OPS
 * Handles reading, writing, and managing Obsidian vault files
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ObsidianClient {
  constructor() {
    this.vaultPath = process.env.OBSIDIAN_VAULT_PATH;

    if (!this.vaultPath) {
      throw new Error(
        'OBSIDIAN_VAULT_PATH não configurado em .env\n' +
        'Exemplo: OBSIDIAN_VAULT_PATH=D:\\ProjetosIA\\Obsidian\\BRAIN\\Brain JV'
      );
    }

    // Validar que o vault existe
    if (!fs.existsSync(this.vaultPath)) {
      throw new Error(
        `Vault Obsidian não encontrado em: ${this.vaultPath}\n` +
        'Verifique o caminho em OBSIDIAN_VAULT_PATH no .env'
      );
    }

    this.squadOpsPath = path.join(this.vaultPath, '00 - Squad OPS');
    this.processesPath = path.join(this.squadOpsPath, 'Processes');
    this.agentsPath = path.join(this.squadOpsPath, 'Agents');
    this.automationsPath = path.join(this.squadOpsPath, 'Automations');
    this.qaPath = path.join(this.squadOpsPath, 'QA');
    this.templatesPath = path.join(this.squadOpsPath, 'Templates');
  }

  /**
   * Create a new markdown file in Obsidian
   * @param {string} filename - File name (without .md)
   * @param {string} content - Markdown content
   * @param {string} subfolder - Subfolder (Processes, Agents, QA, etc.)
   * @returns {string} File path
   */
  async createNote(filename, content, subfolder = null) {
    try {
      let targetPath;

      if (subfolder) {
        targetPath = path.join(this.squadOpsPath, subfolder);
      } else {
        targetPath = this.squadOpsPath;
      }

      // Ensure directory exists
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      const filePath = path.join(targetPath, `${filename}.md`);

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Nota criada: ${filename}.md`);

      return filePath;
    } catch (error) {
      throw new Error(`Falha ao criar nota: ${error.message}`);
    }
  }

  /**
   * Read a markdown file from Obsidian
   * @param {string} filename - File name (without .md)
   * @param {string} subfolder - Subfolder
   * @returns {string} File content
   */
  async readNote(filename, subfolder = null) {
    try {
      let targetPath;

      if (subfolder) {
        targetPath = path.join(this.squadOpsPath, subfolder);
      } else {
        targetPath = this.squadOpsPath;
      }

      const filePath = path.join(targetPath, `${filename}.md`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Nota não encontrada: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`✅ Nota lida: ${filename}.md`);

      return content;
    } catch (error) {
      throw new Error(`Falha ao ler nota: ${error.message}`);
    }
  }

  /**
   * Update a markdown file in Obsidian
   * @param {string} filename - File name (without .md)
   * @param {string} content - New content
   * @param {string} subfolder - Subfolder
   */
  async updateNote(filename, content, subfolder = null) {
    try {
      let targetPath;

      if (subfolder) {
        targetPath = path.join(this.squadOpsPath, subfolder);
      } else {
        targetPath = this.squadOpsPath;
      }

      const filePath = path.join(targetPath, `${filename}.md`);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Nota não encontrada: ${filePath}`);
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Nota atualizada: ${filename}.md`);
    } catch (error) {
      throw new Error(`Falha ao atualizar nota: ${error.message}`);
    }
  }

  /**
   * List all notes in a subfolder
   * @param {string} subfolder - Subfolder (Processes, Agents, QA, etc.)
   * @returns {array} List of file names
   */
  async listNotes(subfolder = null) {
    try {
      let targetPath;

      if (subfolder) {
        targetPath = path.join(this.squadOpsPath, subfolder);
      } else {
        targetPath = this.squadOpsPath;
      }

      if (!fs.existsSync(targetPath)) {
        return [];
      }

      const files = fs.readdirSync(targetPath)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));

      console.log(`✅ ${files.length} notas encontradas em ${subfolder || 'raiz'}`);
      return files;
    } catch (error) {
      throw new Error(`Falha ao listar notas: ${error.message}`);
    }
  }

  /**
   * Create a process documentation note
   * @param {string} processName - Nome do processo
   * @param {object} data - Dados do processo
   */
  async createProcessNote(processName, data) {
    const content = `# Processo: ${processName}

## 📋 Informações Básicas

- **Nome:** ${processName}
- **Data de Criação:** ${new Date().toLocaleDateString('pt-BR')}
- **Status:** 🟢 Novo
- **Responsável:** ${data.owner || 'Tyr'}

## 📊 Descrição

${data.description || 'Descrição do processo'}

## 🔄 Etapas

${data.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || '1. Etapa padrão'}

## 🎯 Objetivo

${data.objective || 'Objetivo do processo'}

## ✅ Critérios de Sucesso

${data.criteria?.map(c => `- [ ] ${c}`).join('\n') || '- [ ] Completar todas as etapas'}

## 📅 Histórico

- **2026-03-09:** Processo criado

---

**Última atualização:** ${new Date().toLocaleDateString('pt-BR')}
`;

    return await this.createNote(processName, content, 'Processes');
  }

  /**
   * Create a demand tracking note
   * @param {string} demandId - ID da demanda
   * @param {object} data - Dados da demanda
   */
  async createDemandNote(demandId, data) {
    const content = `# Demanda: ${demandId}

## 📨 Informações da Demanda

- **ID:** ${demandId}
- **Título:** ${data.title || 'Demanda sem título'}
- **Solicitante:** ${data.requester || 'Não informado'}
- **Prioridade:** ${data.priority || 'Normal'}
- **Data:** ${new Date().toLocaleDateString('pt-BR')}

## 📝 Descrição

${data.description || 'Descrição da demanda'}

## 👤 Responsáveis

- **Tyr (Orquestrador):** Acompanhando
- **Agente Designado:** ${data.assignedAgent || 'Pendente'}

## 🔄 Progresso

| Etapa | Agente | Status | Data |
|-------|--------|--------|------|
| Discovery | ${data.assignedAgent || '-'} | ⏳ Aguardando | - |
| Execução | - | ⏳ Aguardando | - |
| Validação | Heimdall | ⏳ Aguardando | - |
| Entrega | Tyr | ⏳ Aguardando | - |

## 📊 Quality Gates

- [ ] Gate 1 (70%)
- [ ] Gate 2 (70%)
- [ ] Gate 3 (70%)
- [ ] Gate Final (70%)

## 📋 Documentação Relacionada

- [[00 - Squad OPS Overview]]
- [[${data.assignedAgent || 'Tyr'} - Orquestrador]]

---

**Status:** 🟡 Em andamento
**Última atualização:** ${new Date().toLocaleDateString('pt-BR')}
`;

    return await this.createNote(`Demanda-${demandId}`, content, 'Processes');
  }

  /**
   * Test connection to Obsidian vault
   */
  async testConnection() {
    try {
      console.log('🔍 Testando conexão com vault Obsidian...\n');

      // Test read vault
      console.log('  Testando acesso ao vault...');
      if (fs.existsSync(this.squadOpsPath)) {
        console.log('  ✅ Squad OPS folder OK');
      }

      // List subfolders
      const subfolders = ['Agents', 'Processes', 'Automations', 'QA', 'Templates'];
      for (const folder of subfolders) {
        const folderPath = path.join(this.squadOpsPath, folder);
        const status = fs.existsSync(folderPath) ? '✅' : '⚠️ ';
        console.log(`  ${status} ${folder}`);
      }

      console.log('\n✅ Conexão com Obsidian OK!\n');
      console.log(`📁 Caminho do vault: ${this.vaultPath}`);
      console.log(`📁 Caminho Squad OPS: ${this.squadOpsPath}\n`);

      return true;
    } catch (error) {
      console.error(`\n❌ Teste de conexão falhou: ${error.message}\n`);
      return false;
    }
  }
}

module.exports = ObsidianClient;

// CLI test
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Obsidian Client - Teste de Conexão\n');
      const obsidian = new ObsidianClient();
      const result = await obsidian.testConnection();
      process.exit(result ? 0 : 1);
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
      process.exit(1);
    }
  })();
}
