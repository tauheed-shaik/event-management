import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export async function listEvents(req, res, next){
  try{
    const events = await Event.find({}).sort({ date: 1 });

    // For admin analytics: attach registrationsCount
    const ids = events.map(e => e._id);
    const counts = await Registration.aggregate([
      { $match: { event: { $in: ids } } },
      { $group: { _id: "$event", count: { $sum: 1 } } }
    ]);

    const map = new Map(counts.map(x => [String(x._id), x.count]));
    const out = events.map(e => ({
      ...e.toObject(),
      registrationsCount: map.get(String(e._id)) || 0
    }));

    res.json(out);
  }catch(err){ next(err); }
}

export async function createEvent(req, res, next){
  try{
    const { name, date, location, type, keywords, description } = req.body;
    const item = await Event.create({
      name, date, location, type,
      keywords: Array.isArray(keywords) ? keywords : [],
      description
    });
    res.status(201).json(item);
  }catch(err){ next(err); }
}

export async function updateEvent(req, res, next){
  try{
    const { id } = req.params;
    const item = await Event.findById(id);
    if(!item){ res.status(404); throw new Error("Event not found"); }

    const { name, date, location, type, keywords, description } = req.body;
    item.name = name ?? item.name;
    item.date = date ?? item.date;
    item.location = location ?? item.location;
    item.type = type ?? item.type;
    item.keywords = Array.isArray(keywords) ? keywords : item.keywords;
    item.description = description ?? item.description;

    await item.save();
    res.json(item);
  }catch(err){ next(err); }
}

export async function deleteEvent(req, res, next){
  try{
    const { id } = req.params;
    await Registration.deleteMany({ event: id });
    const del = await Event.findByIdAndDelete(id);
    if(!del){ res.status(404); throw new Error("Event not found"); }
    res.json({ message: "Deleted" });
  }catch(err){ next(err); }
}
