import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { computeSymmetricalComponents } from './symmetricalComponents.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

function isValidPhasor(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    typeof p.magnitude === 'number' &&
    isFinite(p.magnitude) &&
    p.magnitude >= 0 &&
    typeof p.angleDeg === 'number' &&
    isFinite(p.angleDeg)
  );
}

app.post('/api/symmetrical-components', (req, res) => {
  const { Va, Vb, Vc } = req.body ?? {};

  if (!isValidPhasor(Va) || !isValidPhasor(Vb) || !isValidPhasor(Vc)) {
    return res.status(400).json({
      error:
        'Invalid input: Va, Vb, and Vc must each have a non-negative finite magnitude and a finite angleDeg.',
    });
  }

  const result = computeSymmetricalComponents(Va, Vb, Vc);
  res.json(result);
});

// Serve built client in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
