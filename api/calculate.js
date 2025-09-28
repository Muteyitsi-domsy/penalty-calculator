export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { principal, penaltyType, penaltyValue, interestRate } = req.body;
    
    const penalty = penaltyType === 'flat' ? penaltyValue : (principal * penaltyValue) / 100;
    const total = principal + penalty + (principal * (interestRate / 100));

    res.json({
      success: true,
      data: {
        totalAccrued: Math.round(total * 100) / 100,
        breakdown: {
          principal: Math.round(principal * 100) / 100,
          totalPenalty: Math.round(penalty * 100) / 100,
          totalInterest: Math.round((principal * (interestRate / 100)) * 100) / 100
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
