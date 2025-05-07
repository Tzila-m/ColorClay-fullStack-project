const Table = require('../models/Table');
const TableAvailability = require('../models/TableAvailability');


//get
exports.getAvailableTables = async (req, res) => {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'must have date and timeSlot'  });
    }

    const unavailableTables = await TableAvailability.find({ date, timeSlot }).select('tableId')
    const unavailableIds = unavailableTables.map(item => item.tableId.toString())

    const availableTables = await Table.find({
      _id: { $nin: unavailableIds },// $nin = not in
    }).lean()

    return res.status(200).json(availableTables)
  
}


exports.getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ message:'must have date' });
    }

    const reservations = await TableAvailability.find({ date }).populate('tableId').lean()
    res.json(reservations.tableId)
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת ההזמנות', error })
  }
}



//delete
exports.deleteByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'must have a date' });
    }

    const result = await TableAvailability.deleteMany({ date });

    res.status(200)
  } catch (error) {
    res.status(500).json({ message: 'שגיאה במחיקה לפי תאריך', error });
  }
}


