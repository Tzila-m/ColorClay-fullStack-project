const Table = require("../models/Table");
const TableAvailability = require("../models/TableAvailability");
const Order = require('../models/Order'); 
// router.get("/",tableAvailabilityController.getAvailableTables)
// router.get("/ByDate",tableAvailabilityController.getReservationsByDate)
// router.delete("/",verifyAdmin,tableAvailabilityController.deleteByDate)  

//get
exports.getAvailableTables = async (req, res) => {
  const { date, timeSlot } = req.query;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: 'Must have date and timeSlot' });
  }

  const unavailableTables = await TableAvailability.find({ date, timeSlot }).select('tableId');
  const unavailableIds = unavailableTables.map(item => item.tableId.toString());

  //%nin מחזיר את מה שלא קיים 
  const availableTables = await Table.find({
    _id: { $nin: unavailableIds },
  }).lean();

  return res.status(200).json(availableTables);
};

exports.getReservationsByDate = async (req, res) => {
  try {
    // לקבל היום לפי UTC - תחילת היום
    const now = new Date();
    const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    // תחילת היום הבא UTC
    const startOfNextDayUTC = new Date(startOfDayUTC);
    startOfNextDayUTC.setUTCDate(startOfNextDayUTC.getUTCDate() + 1);

    try {
  const reservations = await Order.find({
      date: { $gte: startOfDayUTC, $lt: startOfNextDayUTC }
    })
    .populate('tableId')
    .populate('userId')
    .lean();
  res.json(reservations);
} catch (error) {
  console.error('Error populating:', error);
  res.status(500).json({ message: 'Error retrieving orders', error: error.message });
}


    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservations', error });
  }
};





// DELETE 
exports.deleteByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'חסר תאריך' });
    }

    const result = await TableAvailability.deleteMany({ date });

    res.status(200);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה במחיקה לפי תאריך', error });
  }
};

