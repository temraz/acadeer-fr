import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, ClipboardList, CheckSquare, XSquare
} from 'lucide-react';
import AssignmentCard from '../components/assignments/AssignmentCard';
import AssignmentDetails from '../components/assignments/AssignmentDetails';
import { assignmentsData } from '../data/assignmentsData';

const Assignments = () => {
  const { t, language } = useApp();
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const statCards = [
    { 
      label: 'totalAssignments', 
      value: '24',
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      textColor: 'text-blue-600',
      bgIcon: 'bg-blue-50'
    },
    { 
      label: 'completedAssignments', 
      value: '18',
      icon: <CheckSquare className="w-6 h-6 text-green-600" />,
      textColor: 'text-green-600',
      bgIcon: 'bg-green-50'
    },
    { 
      label: 'upcomingAssignments', 
      value: '4',
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      textColor: 'text-purple-600',
      bgIcon: 'bg-purple-50'
    },
    { 
      label: 'cancelledAssignments', 
      value: '2',
      icon: <XSquare className="w-6 h-6 text-gray-600" />,
      textColor: 'text-gray-600',
      bgIcon: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('assignments')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {t('assignmentsDesc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label} className={`
              bg-white dark:bg-gray-800
              rounded-2xl p-6 transition-all duration-200
              shadow-lg hover:shadow-xl
              transform hover:scale-[1.02]
              backdrop-blur-xl
              border border-gray-100 dark:border-gray-700
            `}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {t(stat.label)}
                  </h3>
                  <p className={`${stat.textColor} dark:text-white text-3xl font-bold mt-3`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgIcon} dark:bg-gray-700 p-3 rounded-xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {assignmentsData.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={() => setSelectedAssignment(assignment)}
            />
          ))}
        </div>
      </div>

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <AssignmentDetails
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </div>
  );
};

export default Assignments; 