import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export async function registerForEvent(req, res, next){
  try{
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if(!event){ res.status(404); throw new Error("Event not found"); }

    const reg = await Registration.create({ event: eventId, user: req.user._id });
    res.status(201).json(reg);
  }catch(err){
    // duplicate registration
    if(err.code === 11000){
      res.status(400);
      return next(new Error("Already registered"));
    }
    next(err);
  }
}

export async function myRegistrations(req, res, next){
  try{
    const regs = await Registration.find({ user: req.user._id }).populate("event");
    res.json(regs);
  }catch(err){ next(err); }
}
