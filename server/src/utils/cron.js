import cron from 'node-cron'
import {aggregateWeeklyData} from '../controller/weeklyController.js'


cron.schedule('* * * * *' , async ()=>{
      console.log('Running main aggregation job at:', new Date());
      try {
        await aggregateWeeklyData();
           console.log('Aggregation completed successfully!');
      } catch (error) {
        console.error("Error running aggregation" , error)
      }
})