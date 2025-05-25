const Table = require("../models/Table");
const TableAvailability = require("../models/TableAvailability");
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

//get
exports.getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Must have a date' });
    }

    const reservations = await TableAvailability.find({ date }).populate('tableId').lean();
    res.json(reservations.tableId);
  } catch (error) {
    res.status(500).json({ message: ' Error retrieving countries ', error });
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

