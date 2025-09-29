import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const dataPath = path.join(projectRoot, 'src', 'data', 'sounds.json');
const heartDir = path.join(projectRoot, 'public', 'audio', 'heart');
const lungDir = path.join(projectRoot, 'public', 'audio', 'lung');
const outputPath = path.join(projectRoot, 'src', 'data', 'processedSounds.json');

const manualOverrides = {
  heart: {
    normal: { files: ['01_Normal_S1_And_S2_Base_Of_Heart.mp3'], strategy: 'replace' },
    overmitralareas1s2s3: { files: ['16_S3_Over_Mitral_Area_S1_S2_S3.mp3'], strategy: 'replace' },
    s4s4s1s2: { files: ['20_S4_S4_S1_S2.mp3'], strategy: 'replace' },
    summationgallop: { files: ['21_Summation_Gallop.mp3'], strategy: 'replace' },
    openingsnapofmitralvalve: { files: ['23_Opening_Snap_Of_Mitral_Valve.mp3'], strategy: 'replace' },
    aorticejection: { files: ['25_Aortic_Ejection_Sound.mp3'], strategy: 'replace' },
    midsystolicclick: { files: ['26_Midsystolic_Click.mp3'], strategy: 'replace' },
    innocentsystolicejectionmurmur: { files: ['27_Innocent_Systolic_Ejection_Murmur.mp3'], strategy: 'replace' },
    aorticstenosisaorticvalvularstenosismurmur: { files: ['32_Aortic_Valvular_Stenosis_Murmur.mp3'], strategy: 'replace' },
    supravalvularpulmonicstenosismurmor: { files: ['28_Supravalvular_Pulmonic_Stenosis_Murmor.mp3'], strategy: 'replace' },
    pulmonicvalvularstenosismurmur: { files: ['29_Pumonic_Valvular_Stenosis_Murmur.mp3'], strategy: 'replace' },
    subvalvularpulmonicstenosismurmur: { files: ['30_Subvalvular_Pulmonic_Stenosis_Murmur.mp3'], strategy: 'replace' },
    supravalvularaorticstenosismurmor: { files: ['31_Supravalvular_Aortic_Stenosis_Murmor.mp3'], strategy: 'replace' },
    subvalvularaorticstenosismurmur: { files: ['33_Subvalvular_Aortic_Stenosis_Murmur.mp3'], strategy: 'replace' },
    tricuspidregurgitationinsufficiencymurmur: { files: ['34_Tricuspid_Regurgitation_Insufficiency_Murmur.mp3'], strategy: 'replace' },
    holosystolicmitralregurgitation: { files: ['35_Holosystolic_Mitral_Regurgitation_Insufficiency_Murmur.mp3'], strategy: 'replace' },
    acutemitralregurgitationinsufficiencymurmur: { files: ['36_Acute_Mitral_Regurgitation_Insufficiency_Murmur.mp3'], strategy: 'replace' },
    mitralvalveprolapsemurmurwithclick: { files: ['37_Mitral_Valve_Prolapse_Murmur_With_Click.mp3'], strategy: 'replace' },
    aorticregurgitationearlydiastolicaorticregurgitation: { files: ['38_Early_Diastolic_Aortic_Regurgitation_Murmur.mp3'], strategy: 'replace' },
    grahamsteellmurmur: { files: ['40_Graham_Steell_Murmur.mp3'], strategy: 'replace' },
    normalpressurepulmonicvalvemurmur: { files: ['41_Normal_Pressure_Pulmonic_Valve_Murmur.mp3'], strategy: 'replace' },
    mitralstenosisatrialfibrillation: { files: ['42_Mitral_Stenosis_Murmur_Atrial_Fibrillation.mp3'], strategy: 'replace' },
    mitralstenosisnormalsinus: { files: ['43_Mitral_Stenosis_Murmur_Normal_Sinus_Rhythm.mp3'], strategy: 'replace' },
    tricuspidstenosismurmur: { files: ['44_Tricuspid_Stenosis_Murmur.mp3'], strategy: 'replace' },
    cervicalvenoushummurmur: { files: ['45_Cervical_Venous_Hum_Murmur.mp3'], strategy: 'replace' },
    patentductusarteriosusmurmur: { files: ['46_Patent_Ductus_Arteriosus_Murmur.mp3'], strategy: 'replace' },
    aorticprostheticvalvesoundandmurmur: { files: ['47_Aortic_Prosthetic_Valve_Sound_And_Murmur.mp3'], strategy: 'replace' },
    mitralprostheticvalvesoundandmurmur: { files: ['48_Mitral_Prosthetic_Valve_Sound_And_Murmur.mp3'], strategy: 'replace' },
    pericardialfrictionrub: { files: ['49_Pericardial_Friction_Rub.mp3'], strategy: 'replace' },
    mediastinalcrunch: { files: ['50_Mediastinal_Crunch.mp3'], strategy: 'replace' },
    abnormals3: { files: ['17_Abnormal_S3.mp3'], strategy: 'replace' },
    pericardialknock: { files: ['18_Pericardial_Knock.mp3'], strategy: 'replace' },
    rightsideds3: { files: ['19_Right-Sided_S3.mp3'], strategy: 'replace' },
    rightsideds4: { files: ['22_Right-Sided_S4.mp3'], strategy: 'replace' },
    pulmonicejectionsound: { files: ['24_Pulmonic_Ejection_Sound.mp3'], strategy: 'replace' },
    austinflintmurmur: { files: ['39_Austin_Flint_Murmur.mp3'], strategy: 'replace' },
  },
  lung: {
    normaltracheamainstembronchi: { files: ['1_Normal Trachea-Mainstem Bronchi_Breath_Sounds.mp3'], strategy: 'replace' },
    bronchovesicular: { files: ['2_Bronchovesicular_Breath_Sounds.mp3'], strategy: 'replace' },
    normalbreathoverotherchestwallarea: { files: ['3_Normal_Breath_Sounds_Over_Other_Chest_Wall_Areas.mp3'], strategy: 'replace' },
    normalbreathmidlung: { files: ['4_Normal_Breath_Sounds_Midlung.mp3'], strategy: 'replace' },
    normalbreathapex: { files: ['5_Normal_Breath_Sounds_Apex.mp3'], strategy: 'replace' },
    bronchophonynormal: { files: ['6_Bronchophony_Normal.mp3'], strategy: 'replace' },
    bronchophonyconsolidation: { files: ['7_Bronchophony_Consolidation.mp3'], strategy: 'replace' },
    whisperedpectoriloquynormal: { files: ['8_Whispered_Pectoriloquy_Normal.mp3'], strategy: 'replace' },
    whisperedpectoriloquyatelectasis: { files: ['9_Whispered_Pectoriloquy_Atelectasis.mp3'], strategy: 'replace' },
    egophonynormal: { files: ['10_Egophony_Normal.mp3'], strategy: 'replace' },
    egophonytumorpleuraleffusion: { files: ['11_Egophony_Tumor_Pleural_Effusion.mp3'], strategy: 'replace' },
    diminishedbreathsoundsshallowbreathing: { files: ['12_Diminished_Breath_Sounds_Shallow_Breathing.mp3'], strategy: 'replace' },
    absentbreathsoundspneumothorax: { files: ['13_Absent_Breath_Sounds_Pneumothorax.mp3'], strategy: 'replace' },
    diminishedbreathsoundspleuraleffusion: { files: ['14_Diminished_Breath_Sounds_Pleural_Effusion.mp3'], strategy: 'replace' },
    diminishedbreathsoundshyperinflatedlungs: { files: ['15_Diminished_Breath_Sounds_Hyperinflated_Lungs.mp3'], strategy: 'replace' },
    diminishedbreathsoundsobesity: { files: ['16_Diminished_Breath_Sounds_Obesity.mp3'], strategy: 'replace' },
    coarsecrackles: { files: ['17_Coarse_Crackles.mp3'], strategy: 'replace' },
    finecrackles: { files: ['18_Fine_Crackles.mp3'], strategy: 'replace' },
    wheezes: { files: ['19_Wheezes.mp3'], strategy: 'replace' },
    lowpitchedwheezes: { files: ['20_Low-Pitched_Wheezes.mp3'], strategy: 'replace' },
    lateinspiratorycracklesinterstitialfibrosis: { files: ['21_Late_Inspiratory_Crackles_Interstitial_Fibrosis.mp3'], strategy: 'replace' },
    lateinspiratorycracklesleftventricularheartfailure: { files: ['22_Late_Inspiratory_Crackles_Left_Ventricular_Heart_Failure.mp3'], strategy: 'replace' },
    earlytomidinspiratorycracklesbornchiectasis: { files: ['24_Early_To_Mid-Inspiratory_Crackles_Bornchiectasis.mp3'], strategy: 'replace' },
    pleuralcrackles: { files: ['25_Pleural_Crackels.mp3'], strategy: 'replace' },
    expiratorypolyphonicwheezes: { files: ['26_Expiratory_Polyphonic_Wheezes.mp3'], strategy: 'replace' },
    fixedmonophonicwheezes: { files: ['27_Fixed_Monophonic_Wheezes.mp3'], strategy: 'replace' },
    stridor: { files: ['28_Stridor.mp3'], strategy: 'replace' },
  },
};

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function buildFileIndex(directory) {
  const entries = await fs.readdir(directory);
  return entries.map((filename) => {
    const [prefix, ...rest] = filename.split('_');
    const number = Number.parseInt(prefix, 10);
    const base = rest.join('_').replace(/\.mp3$/i, '');
    return {
      filename,
      number: Number.isNaN(number) ? null : number,
      normalized: normalize(base),
    };
  });
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function getManual(category, normalizedName) {
  const overrides = manualOverrides[category] ?? {};
  return overrides[normalizedName] ?? null;
}

function findMatchingFiles(entries, normalizedName) {
  const exactMatches = entries.filter((entry) => entry.normalized === normalizedName);
  if (exactMatches.length) {
    return exactMatches.map((entry) => entry.filename);
  }
  const containsMatches = entries.filter(
    (entry) => entry.normalized.includes(normalizedName) || normalizedName.includes(entry.normalized),
  );
  if (containsMatches.length) {
    return containsMatches.map((entry) => entry.filename);
  }
  return [];
}

function sanitizeId(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');
}

async function main() {
  const raw = JSON.parse(await fs.readFile(dataPath, 'utf8'));
  const heartIndex = await buildFileIndex(heartDir);
  const lungIndex = await buildFileIndex(lungDir);

  const processed = { heart: [], lung: [] };

  const categories = [
    { key: 'heart', list: raw.heart_sounds, index: heartIndex },
    { key: 'lung', list: raw.lung_sounds, index: lungIndex },
  ];

  for (const { key, list, index } of categories) {
    list.forEach((item, idx) => {
      const normalizedName = normalize(String(item.sound_name ?? ''));
      const manual = getManual(key, normalizedName);
      const audioNumbers = [];

      if (item.audio_file_number) {
        const parts = String(item.audio_file_number)
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        for (const p of parts) {
          const num = Number.parseInt(p, 10);
          if (!Number.isNaN(num)) {
            audioNumbers.push(num);
          }
        }
      }

      let filenames = [];

      if (manual) {
        filenames.push(...manual.files);
        if (manual.strategy === 'replace') {
          audioNumbers.length = 0;
        }
      }

      if (audioNumbers.length) {
        const matchedByNumber = audioNumbers
          .map((num) => index.filter((entry) => entry.number === num).map((entry) => entry.filename))
          .flat();
        filenames.push(...matchedByNumber);
      }

      if (!filenames.length) {
        const autoMatches = findMatchingFiles(index, normalizedName);
        filenames.push(...autoMatches);
      }

      filenames = unique(filenames);

      if (!filenames.length) {
        console.warn(`Could not find audio for ${key}:${item.sound_name}`);
      }

      const problemNumberRaw = String(item.problem_number ?? '').trim();
      const problemId = sanitizeId(problemNumberRaw);
      const fallback = normalizedName || `sound-${idx}`;
      const id = `${key}-${problemId || fallback}`;

      processed[key].push({
        id,
        problemNumber: problemNumberRaw,
        name: item.sound_name,
        description: item.sound_description,
        audio: filenames.map((filename) => `/audio/${key}/${filename}`),
      });
    });
  }

  await fs.writeFile(outputPath, `${JSON.stringify(processed, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
