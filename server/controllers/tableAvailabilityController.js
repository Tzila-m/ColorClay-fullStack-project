const Table = require("../models/Table");
const TableAvailability = require("../models/TableAvailability");

//get 
exports.getyByDateAndtimeSlot = async (req, res) => {
    const { date,timeSlot } = req.body;
    if (!date || !timeSlot)
        return res.status(400).json({ message: "Please fill all fields" })

    const available = await Table.findAll({ date , timeSlot});
    res.status(200).json(available);
}

//post
exports.createTableAvailability = async (req, res) => {
    
    const nextWeekDate = new Date();
    nextWeekDate.setDate(currentDate.getDate() + 7);
    const tables = await Table.find();

    for (const table of tables) {
        await TableAvailability.create({ 
          tableId: table._id, 
          date: nextWeekDate, 
          timeSlot: "morning" 
        });
  
        await TableAvailability.create({ 
          tableId: table._id, 
          date: nextWeekDate, 
          timeSlot: "afternoon" 
        });
  
        await TableAvailability.create({ 
          tableId: table._id, 
          date: nextWeekDate, 
          timeSlot: "evening" 
        });

        res.status(201).json({ message: "Availabilities created successfully for next week" });
}
}


//delete
exports.deleteTodayTableAvailabilities = async (req, res) => {
  
      
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); 
      
      const result = await TableAvailability.deleteMany({ date: todayDate });
  
      res.status(200).json({
        message: "All table availabilities for today have been deleted successfully",
      });
   
  }