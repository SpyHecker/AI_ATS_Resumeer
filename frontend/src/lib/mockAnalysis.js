// Client-side demo analysis used while the live backend is being wired up.
// Replaced by real API calls in the next step.
const STOP_WORDS = new Set([
  'the','and','for','with','this','that','from','have','has','had','are','was','were','been','will','would','could','should','may','might','must','can','into','your','you','our','their','they','them','then','than','also','more','over','after','before','between','under','again','further','once','here','there','when','where','why','how','all','any','both','each','few','most','other','some','such','no','nor','not','only','own','same','so','too','very','just','don','now','a','an','be','to','of','in','on','at','by','or','as','it','is','if','we','he','she','his','her','its','i','me','my','myself','us','ours'
]);

export function extractWords(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s#+-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

export function detectSections(text) {
  const headers = [
    { key: 'Summary', patterns: [/summary/, /profile/, /objective/] },
    { key: 'Experience', patterns: [/experience/, /employment/, /work history/] },
    { key: 'Education', patterns: [/education/, /academic/, /degree/] },
    { key: 'Skills', patterns: [/skills/, /technical skills/, /competencies/] },
    { key: 'Projects', patterns: [/projects/, /portfolio/] },
    { key: 'Certifications', patterns: [/certification/, /certificate/, /license/] },
  ];
  const found = [];
  for (const { key, patterns } of headers) {
    if (patterns.some((p) => p.test(text))) found.push(key);
  }
  return found;
}

export function analyzeResume(resumeText, jobDescription) {
  const jdWords = extractWords(jobDescription);
  const resumeWords = new Set(extractWords(resumeText));
  const uniqueJD = [...new Set(jdWords)];
  const matched = uniqueJD.filter((w) => resumeWords.has(w));
  const missing = uniqueJD.filter((w) => !resumeWords.has(w));
  const score = uniqueJD.length ? Math.round((matched.length / uniqueJD.length) * 100) : 0;
  const clamped = Math.min(Math.max(score, 40), 98);
  const sections = detectSections(resumeText);
  const suggestions = [];
  if (missing.length) {
    suggestions.push(`Add these missing keywords from the job description: ${missing.slice(0, 8).join(', ')}.`);
  }
  if (!sections.includes('Skills')) {
    suggestions.push('Add a dedicated Skills section with relevant technical skills.');
  }
  if (!sections.includes('Experience')) {
    suggestions.push('Include a clear Experience section with roles and dates.');
  }
  if (clamped < 70) {
    suggestions.push('Tailor your resume more closely to the job description to improve the ATS score.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Great alignment! Keep keywords prominent and use standard section headings.');
  }
  const verdict =
    clamped >= 80 ? 'Strong ATS match.' : clamped >= 60 ? 'Moderate match — consider the suggestions below.' : 'Low match — revise using the suggestions below.';
  return {
    score: clamped,
    verdict,
    matchedKeywords: matched.slice(0, 15),
    missingKeywords: missing.slice(0, 15),
    sections,
    suggestions,
  };
}
