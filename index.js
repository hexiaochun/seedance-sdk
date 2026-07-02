'use strict';
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const os    = require('os');

const VERSION    = '2.1.0';
const CONFIG_DIR = path.join(os.homedir(), '.seedance', 'sdk');

function request(method, reqPath, body, headers) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'seedance2-api.vercel.app',
      path: reqPath, method,
      headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}), ...headers },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function session() {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, 'session.json'), 'utf8')).session;
  } catch { return null; }
}

module.exports = { request, session, VERSION, CONFIG_DIR };
