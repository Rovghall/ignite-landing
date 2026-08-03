/**
 * Convert European Portuguese blog/legal JSON to Brazilian Portuguese via
 * ordered lexical replacements (source is already PT, not English).
 *
 * Usage:
 *   node scripts/pt-to-ptbr-blog.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

/** Longest-first literal replacements */
const REPLACEMENTS = [
  ['registá-los', 'registrá-los'],
  ['registá-las', 'registrá-las'],
  ['registá-lo', 'registrá-lo'],
  ['registá-la', 'registrá-la'],
  ['registarem', 'registrarem'],
  ['Registarem', 'Registrarem'],
  ['registando', 'registrando'],
  ['Registando', 'Registrando'],
  ['registamos', 'registramos'],
  ['Registamos', 'Registramos'],
  ['registados', 'registrados'],
  ['Registados', 'Registrados'],
  ['registadas', 'registradas'],
  ['Registadas', 'Registradas'],
  ['registado', 'registrado'],
  ['Registado', 'Registrado'],
  ['registada', 'registrada'],
  ['Registada', 'Registrada'],
  ['registam', 'registram'],
  ['Registam', 'Registram'],
  ['registar', 'registrar'],
  ['Registar', 'Registrar'],
  ['regista', 'registra'],
  ['Regista', 'Registra'],
  ['registe', 'registre'],
  ['Registe', 'Registre'],
  ['registos', 'registros'],
  ['Registos', 'Registros'],
  ['registo', 'registro'],
  ['Registo', 'Registro'],
  ['telemóveis', 'celulares'],
  ['Telemóveis', 'Celulares'],
  ['telemóvel', 'celular'],
  ['Telemóvel', 'Celular'],
  ['Contactos', 'Contatos'],
  ['contactos', 'contatos'],
  ['Contacto', 'Contato'],
  ['contacto', 'contato'],
  ['descarregarem', 'baixarem'],
  ['descarregando', 'baixando'],
  ['descarregados', 'baixados'],
  ['descarregadas', 'baixadas'],
  ['descarregado', 'baixado'],
  ['descarregada', 'baixada'],
  ['descarregue', 'baixe'],
  ['Descarregue', 'Baixe'],
  ['descarrega', 'baixa'],
  ['Descarrega', 'Baixa'],
  ['descarregar', 'baixar'],
  ['Descarregar', 'Baixar'],
  ['utilizadores', 'usuários'],
  ['Utilizadores', 'Usuários'],
  ['utilizador', 'usuário'],
  ['Utilizador', 'Usuário'],
  ['palavras-passe', 'senhas'],
  ['palavra-passe', 'senha'],
  ['Palavra-passe', 'Senha'],
  ['ecrãs', 'telas'],
  ['Ecrãs', 'Telas'],
  ['ecrã', 'tela'],
  ['Ecrã', 'Tela'],
  ['ficheiros', 'arquivos'],
  ['Ficheiros', 'Arquivos'],
  ['ficheiro', 'arquivo'],
  ['Ficheiro', 'Arquivo'],
  ['pequenos-almoços', 'cafés da manhã'],
  ['pequeno-almoço', 'café da manhã'],
  ['Pequeno-almoço', 'Café da manhã'],
  ['autocarros', 'ônibus'],
  ['autocarro', 'ônibus'],
  ['Autocarro', 'Ônibus'],
  ['comboios', 'trens'],
  ['comboio', 'trem'],
  ['Comboio', 'Trem'],
  ['ginásios', 'academias'],
  ['Ginásios', 'Academias'],
  ['ginásio', 'academia'],
  ['Ginásio', 'Academia'],
  ['secções', 'seções'],
  ['Secções', 'Seções'],
  ['secção', 'seção'],
  ['Secção', 'Seção'],
  ['factos', 'fatos'],
  ['Factos', 'Fatos'],
  ['facto', 'fato'],
  ['Facto', 'Fato'],
  ['óptimos', 'ótimos'],
  ['óptimas', 'ótimas'],
  ['óptimo', 'ótimo'],
  ['Óptimo', 'Ótimo'],
  ['óptima', 'ótima'],
  ['exactamente', 'exatamente'],
  ['Exactamente', 'Exatamente'],
  ['exactos', 'exatos'],
  ['exactas', 'exatas'],
  ['exacto', 'exato'],
  ['Exacto', 'Exato'],
  ['exacta', 'exata'],
  ['Exacta', 'Exata'],
  ['eletrónicos', 'eletrônicos'],
  ['eletrónicas', 'eletrônicas'],
  ['eletrónico', 'eletrônico'],
  ['Eletrónico', 'Eletrônico'],
  ['eletrónica', 'eletrônica'],
  ['actualizações', 'atualizações'],
  ['actualização', 'atualização'],
  ['Actualização', 'Atualização'],
  ['actualmente', 'atualmente'],
  ['Actualmente', 'Atualmente'],
  ['actual', 'atual'],
  ['Actual', 'Atual'],
  ['acções', 'ações'],
  ['acção', 'ação'],
  ['Acção', 'Ação'],
  ['direcções', 'direções'],
  ['direcção', 'direção'],
  ['Direcção', 'Direção'],
  ['selecção', 'seleção'],
  ['Selecção', 'Seleção'],
  ['adopção', 'adoção'],
  ['Adopção', 'Adoção'],
].sort((a, b) => b[0].length - a[0].length)

function convertText(text) {
  if (typeof text !== 'string' || !text) return text
  let out = text
  for (const [from, to] of REPLACEMENTS) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    out = out.replace(re, to)
  }
  return out
}

function walk(value, keyHint = '') {
  if (typeof value === 'string') {
    if (keyHint === 'slug' || keyHint === 'date' || keyHint === 'type' || keyHint === 'id') {
      return value
    }
    return convertText(value)
  }
  if (Array.isArray(value)) return value.map((v) => walk(v, keyHint))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = walk(v, k)
    return out
  }
  return value
}

function convertFile(relPath) {
  const src = path.join(ROOT, relPath)
  const data = JSON.parse(fs.readFileSync(src, 'utf8'))
  fs.writeFileSync(src, `${JSON.stringify(walk(data), null, 2)}\n`, 'utf8')
  console.log(`converted ${relPath}`)
}

for (const file of ['blog.json', 'legal.json']) {
  const src = path.join(ROOT, 'content', 'pt', file)
  const dest = path.join(ROOT, 'content', 'pt-br', file)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  convertFile(path.join('content', 'pt-br', file))
}

console.log('done')
