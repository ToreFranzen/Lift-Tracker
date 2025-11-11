import React, { useState, useEffect } from 'react';
import { Dumbbell, Calendar, Trash2, Plus, TrendingUp } from 'lucide-react';

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const result = await window.storage.get('workout-history');
      if (result && result.value) {
        setWorkouts(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No previous workouts found');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkouts = async (updatedWorkouts) => {
    setSaving(true);
    try {
      await window.storage.set('workout-history', JSON.stringify(updatedWorkouts));
    } catch (error) {
      alert('Failed to save workout: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addWorkout = async (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps) return;

    const newWorkout = {
      id: Date.now(),
      exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : null,
      date: new Date().toISOString()
    };

    const updatedWorkouts = [newWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);

    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const deleteWorkout = async (id) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExerciseStats = (exerciseName) => {
    const exerciseWorkouts = workouts.filter(w => 
      w.exercise.toLowerCase() === exerciseName.toLowerCase()
    );
    return exerciseWorkouts.length;
  };

  const uniqueExercises = [...new Set(workouts.map(w => w.exercise))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading workouts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Dumbbell className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Workout Tracker</h1>
          </div>
          <p className="text-gray-600">Track your fitness journey</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Log New Workout
          </h2>
          <form onSubmit={addWorkout} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise
                </label>
                <input
                  type="text"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="e.g., Bench Press"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (lbs/kg) - Optional
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 135"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Add Workout'}
            </button>
          </form>
        </div>

        {uniqueExercises.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Exercise Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uniqueExercises.map(ex => (
                <div key={ex} className="bg-indigo-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-800">{ex}</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {getExerciseStats(ex)}
                  </div>
                  <div className="text-sm text-gray-600">sessions</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Workout History ({workouts.length})
          </h2>
          
          {workouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No workouts logged yet.</p>
              <p>Start tracking your progress above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map(workout => (
                <div
                  key={workout.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {workout.exercise}
                      </h3>
                      <div className="text-gray-600 mt-1">
                        <span className="font-medium">{workout.sets}</span> sets × {' '}
                        <span className="font-medium">{workout.reps}</span> reps
                        {workout.weight && (
                          <span> @ <span className="font-medium">{workout.weight}</span> lbs</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {formatDate(workout.date)}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete workout"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💾 Your workouts are saved to your browser's storage</p>
        </div>
      </div>
    </div>
  );
          }
