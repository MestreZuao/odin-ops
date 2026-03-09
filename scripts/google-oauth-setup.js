#!/usr/bin/env node

/**
 * Google OAuth 2.0 Setup
 * Obtém refresh token para integração com Google Workspace
 */

const http = require('http');
const url = require('url');
const open = require('open');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Erro: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurados em .env');
  process.exit(1);
}

console.log('🔐 Google OAuth Setup');
console.log('====================\n');

// Criar servidor local para receber callback
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/callback') {
    const code = parsedUrl.query.code;
    const error = parsedUrl.query.error;

    if (error) {
      res.writeHead(400);
      res.end(`❌ Erro de autenticação: ${error}`);
      console.error(`\n❌ Erro: ${error}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400);
      res.end('❌ Código de autorização não recebido');
      server.close();
      process.exit(1);
    }

    // Trocar código por refresh token
    console.log('\n⏳ Trocando código por refresh token...');

    const https = require('https');
    const postData = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const tokenReq = https.request(options, (tokenRes) => {
      let body = '';

      tokenRes.on('data', (chunk) => {
        body += chunk;
      });

      tokenRes.on('end', async () => {
        try {
          const data = JSON.parse(body);

          if (data.error) {
            throw new Error(data.error_description || data.error);
          }

          const refreshToken = data.refresh_token;
          const accessToken = data.access_token;

          console.log('\n✅ Token obtido com sucesso!\n');
          console.log('📋 Informações de Token:');
          console.log(`   Refresh Token: ${refreshToken}`);
          console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
          console.log(`   Token Type: ${data.token_type}`);
          console.log(`   Expira em: ${data.expires_in}s\n`);

          // Atualizar .env
          const fs = require('fs');
          const envPath = require('path').join(__dirname, '../.env');
          let envContent = fs.readFileSync(envPath, 'utf8');

          // Substituir GOOGLE_REFRESH_TOKEN
          envContent = envContent.replace(
            /GOOGLE_REFRESH_TOKEN=.*/,
            `GOOGLE_REFRESH_TOKEN=${refreshToken}`
          );

          fs.writeFileSync(envPath, envContent);

          console.log('💾 Token salvo em .env automaticamente!');
          console.log('\n✅ Google Workspace integração configurada com sucesso!');
          console.log('\n📝 Próximos passos:');
          console.log('   1. Teste com: node lib/google-client.js');
          console.log('   2. Configure Obsidian integration');
          console.log('   3. Configure N8N integration');
          console.log('   4. Teste fluxo completo\n');

          // Responder ao navegador
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Google OAuth - Sucesso</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
                  .success { color: #28a745; font-size: 24px; margin-bottom: 20px; }
                  .token { background: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; }
                  .monospace { font-family: 'Courier New', monospace; word-break: break-all; }
                </style>
              </head>
              <body>
                <div class="success">✅ Autenticação bem-sucedida!</div>
                <p>Seu refresh token foi salvo em <strong>.env</strong></p>
                <div class="token">
                  <strong>Refresh Token:</strong><br/>
                  <span class="monospace">${refreshToken}</span>
                </div>
                <p>Você pode fechar esta janela e voltar ao terminal.</p>
              </body>
            </html>
          `);

          server.close();
          process.exit(0);
        } catch (error) {
          console.error('\n❌ Erro ao obter token:', error.message);
          res.writeHead(400);
          res.end(`❌ Erro: ${error.message}`);
          server.close();
          process.exit(1);
        }
      });
    });

    tokenReq.on('error', (error) => {
      console.error('\n❌ Erro na requisição:', error.message);
      res.writeHead(500);
      res.end(`❌ Erro: ${error.message}`);
      server.close();
      process.exit(1);
    });

    tokenReq.write(postData);
    tokenReq.end();
  }
});

// Iniciar servidor
server.listen(3000, async () => {
  console.log('🚀 Servidor local iniciado em http://localhost:3000\n');

  // URL de autorização do Google
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets'
  ].join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  console.log('🔐 Abrindo navegador para autorização...\n');
  console.log('📝 Você será redirecionado para Google para autorizar o acesso');
  console.log('✅ Após autorizar, um token será gerado automaticamente\n');

  try {
    await open(authUrl.toString());
    console.log('✅ Navegador aberto! Aguardando autorização...\n');
  } catch (error) {
    console.log('⚠️  Não consegui abrir navegador automaticamente.');
    console.log('📋 Abra este URL manualmente:\n');
    console.log(authUrl.toString());
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('\n❌ Erro: Porta 3000 já está em uso');
    console.error('⚠️  Feche outra aplicação usando a porta 3000 e tente novamente');
  } else {
    console.error('\n❌ Erro no servidor:', error.message);
  }
  process.exit(1);
});
