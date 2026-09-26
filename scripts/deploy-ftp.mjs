#!/usr/bin/env node
/**
 * Sube la exportación estática (`out/`) al hosting por FTP (con TLS si el servidor lo admite).
 *
 *   npm run deploy            → build + subida
 *   npm run deploy -- --dry-run  → solo lista lo que se subiría
 *
 * La contraseña NUNCA se guarda en el repositorio: se pide al ejecutar
 * o se toma de la variable de entorno FTP_PASSWORD.
 * Valores por defecto tomados del perfil de publicación de site4now.
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createInterface } from 'node:readline';

const HOST = process.env.FTP_HOST ?? 'win1232.site4now.net';
const USER = process.env.FTP_USER ?? 'jamconsulting-004';
const REMOTE_DIR = process.env.FTP_REMOTE_DIR ?? 'Sitiio';
const USE_TLS = process.env.FTP_NO_TLS !== '1';
const OUT_DIR = 'out';
const dryRun = process.argv.includes('--dry-run');

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });
}

function askPassword(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text); // no mostrar lo que se escribe
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

if (!existsSync(OUT_DIR)) {
  console.error('No existe la carpeta out/. Ejecuta primero: npm run build');
  process.exit(1);
}

const files = listFiles(OUT_DIR);
const remoteUrl = (file) =>
  `ftp://${HOST}/${REMOTE_DIR}/${relative(OUT_DIR, file).split(sep).map(encodeURIComponent).join('/')}`;

console.log(`${files.length} archivos → ftp://${HOST}/${REMOTE_DIR}/ (usuario ${USER})`);
if (dryRun) {
  files.forEach((f) => console.log('  ' + relative(OUT_DIR, f)));
  process.exit(0);
}

const password = process.env.FTP_PASSWORD ?? (await askPassword('Contraseña FTP: '));
if (!password) {
  console.error('Se necesita la contraseña FTP.');
  process.exit(1);
}

// Una sola conexión: curl empareja cada -T con la URL que le sigue.
const args = ['--fail', '--ftp-create-dirs', '--user', `${USER}:${password}`, '--progress-bar'];
if (USE_TLS) args.push('--ssl');
for (const file of files) args.push('-T', file, remoteUrl(file));

const curl = spawn('curl', args, { stdio: ['ignore', 'inherit', 'inherit'] });
curl.on('close', (code) => {
  if (code === 0) console.log('\n✓ Deploy completado.');
  else console.error(`\n✗ La subida falló (curl terminó con código ${code}).`);
  process.exit(code ?? 1);
});
