const EQUIPMENT_RULES: { keywords: RegExp; equipment: string }[] = [
	{ keywords: /halt[eè]re/i, equipment: 'halteres' },
	{ keywords: /kettlebell/i, equipment: 'kettlebell' },
	{ keywords: /landmine/i, equipment: 'landmine' },
	{ keywords: /swiss\s*ball|ballon/i, equipment: 'swiss_ball' },
	{ keywords: /sangles|trx|suspension/i, equipment: 'sangles' },
	{ keywords: /[eé]lastique|bande/i, equipment: 'elastique' },
	{ keywords: /poulie|cable|câble|vis[- ]?[aà][- ]?vis/i, equipment: 'poulie' },
	{ keywords: /machine|presse|smith|leg\s*press|hack\s*squat/i, equipment: 'machine' },
	{ keywords: /barre|d[eé]velopp[eé]\s+couch[eé](?!.*halt)|squat\s+barre/i, equipment: 'barre' },
];

export function deriveEquipment(name: string): string {
	const normalized = name.toLowerCase();
	for (const rule of EQUIPMENT_RULES) {
		if (rule.keywords.test(normalized)) {
			return rule.equipment;
		}
	}
	return 'poids_du_corps';
}
