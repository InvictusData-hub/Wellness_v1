import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addWellnessLog } from '../../services/wellnessService';
import RatingScale from '../ui/RatingScale';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface WellnessLogFormProps {
  onSuccess: () => void;
}

const WellnessLogForm: React.FC<WellnessLogFormProps> = ({ onSuccess }) => {
  const { authState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    sleepQuality: 5,
    soreness: 5,
    stiffness: 5,
    fatigue: 5,
    notes: ''
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!authState.user) {
      setError('You must be logged in to submit wellness data');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      // Format the current date as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      const logData = {
        userId: authState.user.username,
        date: today,
        ...formData
      };
      
      const result = await addWellnessLog(logData);
      
      if (result) {
        setSuccess(true);
        // Reset form to default values
        setFormData({
          sleepQuality: 5,
          soreness: 5,
          stiffness: 5,
          fatigue: 5,
          notes: ''
        });
        
        // Notify parent component of success
        onSuccess();
      } else {
        setError('Failed to save your wellness log. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while saving your wellness log.');
      console.error('Wellness log submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  return (
    <Card title="Log Today's Wellness">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
            Your wellness log has been saved successfully!
          </div>
        )}
        
        <div className="space-y-6">
          <RatingScale
            label="Sleep Quality"
            value={formData.sleepQuality}
            onChange={(value) => handleInputChange('sleepQuality', value)}
          />
          
          <RatingScale
            label="Soreness"
            value={formData.soreness}
            onChange={(value) => handleInputChange('soreness', value)}
          />
          
          <RatingScale
            label="Stiffness"
            value={formData.stiffness}
            onChange={(value) => handleInputChange('stiffness', value)}
          />
          
          <RatingScale
            label="Fatigue"
            value={formData.fatigue}
            onChange={(value) => handleInputChange('fatigue', value)}
          />
          
          <div className="mb-4">
            <label 
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about how you're feeling today..."
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={3}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Save Today's Log
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WellnessLogForm;