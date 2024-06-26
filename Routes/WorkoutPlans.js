const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');
const adminTokenHandler = require('../Middlewares/checkAdminToken');
const User = require('../Models/UserSchema');
const Workout = require('../Models/WorkoutSchema');
const authTokenHandler = require('../Middlewares/checkAuthToken');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.post('/workouts', adminTokenHandler, async (req, res) => {
    try {
        const { name, description, durationInMinutes, exercises, imageURL } = req.body;
        const workout = new Workout({
            name,
            description,
            durationInMinutes,
            exercises,
            imageURL,
        });

        await workout.save();
        res.json(createResponse(true, 'Workout created successfully', workout));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

router.get('/workouts', async (req, res) => {                       //to fetch workouts from backend
    try {
        const workouts = await Workout.find({});
        if (workouts.length == 0) {
            return res.json(createResponse(false, 'No workouts found'));
        }
        res.json(createResponse(true, 'Workouts fetched successfully', workouts));
        console.log(workouts)
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

router.get('/workouts/:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        res.json(createResponse(true, 'Workout fetched successfully', workout));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});


router.put('/workouts/:id',  async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        const { name, description, durationInMinutes, exercises, imageURL } = req.body;
        workout.name = name;
        workout.description = description;
        workout.durationInMinutes = durationInMinutes;
        workout.exercises = exercises;
        workout.imageURL = imageURL;
        await workout.save();
        res.json(createResponse(true, 'Workout updated successfully', workout));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

// router.delete('/workouts/:id', async (req, res) => {
//     try {
//         const workout = await Workout.findById(req.params.id);
//         if (!workout) {
//             return res.json(createResponse(false, 'Workout not found'));
//         }
//         await workout.remove();
//         res.json(createResponse(true, 'Workout deleted successfully'));
//     } catch (err) {
//         res.json(createResponse(false, err.message));
//     }
// });

router.delete('/workouts/:id', async (req, res) => {
    try {
      const workoutId = req.params.id;
      console.log('Deleting workout with ID:', workoutId);
      const workout = await Workout.findById(workoutId);
      if (!workout) {
        return res.json(createResponse(false, 'Workout not found'));
      }
      await Workout.deleteOne({ _id: workoutId }); // Use deleteOne() instead of workout.remove()
      console.log('Workout deleted successfully:', workoutId);
      res.json(createResponse(true, 'Workout deleted successfully'));
    } catch (err) {
      console.error('Error deleting workout:', err);
      res.json(createResponse(false, err.message));
    }
  });
  



router.use(errorHandler);


module.exports = router;