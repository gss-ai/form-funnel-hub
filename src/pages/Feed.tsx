
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormCard from '@/components/FormCard';
import { Search, Filter } from 'lucide-react';

const Feed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('all');

  // Mock data - replace with actual API calls
  const forms = [
    {
      id: '1',
      title: 'Customer Satisfaction Survey',
      description: 'Help us improve our services by sharing your feedback about your recent experience.',
      creator: 'John Doe',
      tags: ['feedback', 'customer service'],
      createdAt: '2024-01-15',
      expiresAt: '2024-02-15',
      ratings: 4.5,
      totalRatings: 23,
      formUrl: 'https://forms.google.com/sample1',
      qrCode: 'sample-qr-code-1'
    },
    {
      id: '2',
      title: 'Product Development Research',
      description: 'Share your thoughts on new product features and help shape the future of our platform.',
      creator: 'Jane Smith',
      tags: ['research', 'product'],
      createdAt: '2024-01-14',
      expiresAt: '2024-02-20',
      ratings: 4.8,
      totalRatings: 45,
      formUrl: 'https://forms.google.com/sample2',
      qrCode: 'sample-qr-code-2'
    },
    {
      id: '3',
      title: 'Event Planning Survey',
      description: 'Help us plan the perfect community event by sharing your preferences and availability.',
      creator: 'Mike Johnson',
      tags: ['event', 'community'],
      createdAt: '2024-01-13',
      expiresAt: '2024-01-30',
      ratings: 4.2,
      totalRatings: 18,
      formUrl: 'https://forms.google.com/sample3',
      qrCode: 'sample-qr-code-3'
    }
  ];

  const availableTags = ['all', 'feedback', 'research', 'product', 'event', 'community', 'customer service'];

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || form.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Feed</h1>
          <p className="text-gray-600">Discover and fill interesting forms from the community</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag === 'all' ? 'All Tags' : tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map(form => (
          <FormCard key={form.id} form={form} />
        ))}
      </div>

      {filteredForms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No forms found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Feed;
