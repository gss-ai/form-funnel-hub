
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, FileText, Users } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      type: 'filled',
      title: 'Completed "Customer Satisfaction Survey"',
      time: '2 hours ago',
      icon: <FileText className="w-4 h-4" />,
      color: 'green'
    },
    {
      type: 'rated',
      title: 'Rated "Market Research Form" 5 stars',
      time: '1 day ago',
      icon: <Star className="w-4 h-4" />,
      color: 'yellow'
    },
    {
      type: 'posted',
      title: 'Posted "Product Feedback Survey"',
      time: '3 days ago',
      icon: <Users className="w-4 h-4" />,
      color: 'blue'
    },
    {
      type: 'filled',
      title: 'Completed "Event Planning Survey"',
      time: '1 week ago',
      icon: <FileText className="w-4 h-4" />,
      color: 'green'
    }
  ];

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'green': return 'default';
      case 'yellow': return 'secondary';
      case 'blue': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className={`p-2 rounded-full bg-${activity.color}-100`}>
            <div className={`text-${activity.color}-600`}>
              {activity.icon}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
          <Badge variant={getBadgeVariant(activity.color)} className="capitalize">
            {activity.type}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
