export async function fetchSymmetricalComponents(Va, Vb, Vc) {
  const response = await fetch('/api/symmetrical-components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Va, Vb, Vc }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'API request failed');
  }
  return response.json();
}
