import { generateEventDescription } from "../services/groqService.js";

export async function generateDescription(req, res, next){
  try{
    const { name, date, keywords } = req.body;

    const description = await generateEventDescription({
      name,
      date,
      keywords: Array.isArray(keywords) ? keywords : []
    });

    res.json({ description });
  }catch(err){ next(err); }
}
