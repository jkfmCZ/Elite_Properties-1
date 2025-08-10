import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IconPlus, 
  IconHome, 
  IconChartBar, 
  IconUsers, 
  IconSettings,
  IconBuilding,
  IconMapPin,
  IconCurrencyDollar,
  IconTrendingUp
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyManagement } from './PropertyManagement';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  totalValue: number;
  monthlyViews: number;
  totalBookings: number;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Refresh stats when returning to overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access the admin panel',
          variant: 'destructive',
        });
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:5000/api/properties/dashboard/my-properties?published=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('broker');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const properties = data.data;
          
          // Calculate stats from properties
          const totalProperties = properties.length;
          const availableProperties = properties.filter((p: any) => p.status === 'available').length;
          const soldProperties = properties.filter((p: any) => p.status === 'sold').length;
          const totalValue = properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
          const totalBookings = properties.reduce((sum: number, p: any) => sum + (p.booking_count || 0), 0);

          setStats({
            totalProperties,
            availableProperties,
            soldProperties,
            totalValue,
            monthlyViews: Math.floor(Math.random() * 10000) + 5000, // Mock data
            totalBookings
          });
        }
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: IconChartBar,
      description: 'Dashboard overview and statistics'
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: IconBuilding,
      description: 'Manage your property listings'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: IconTrendingUp,
      description: 'Property performance analytics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: IconSettings,
      description: 'Account and system settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your properties and monitor performance
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === item.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Stats Cards */}
            {!isLoading && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Properties
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.totalProperties}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <IconHome className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Available
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.availableProperties}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                        <IconMapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Value
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(stats.totalValue)}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                        <IconCurrencyDollar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.totalBookings}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                        <IconUsers className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('properties')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <IconPlus size={24} />
                    <span>Add New Property</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('properties')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <IconBuilding size={24} />
                    <span>Manage Properties</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <IconChartBar size={24} />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PropertyManagement />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Views This Month</span>
                      <span className="text-lg font-bold text-blue-600">
                        {stats?.monthlyViews || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bookings This Month</span>
                      <span className="text-lg font-bold text-green-600">
                        {stats?.totalBookings || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Property Value</span>
                      <span className="text-lg font-bold text-purple-600">
                        {stats ? formatCurrency(stats.totalValue / Math.max(stats.totalProperties, 1)) : '$0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">Available</span>
                      <span className="text-lg font-bold">
                        {stats?.availableProperties || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-red-600">Sold</span>
                      <span className="text-lg font-bold">
                        {stats?.soldProperties || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-600">Total Portfolio Value</span>
                      <span className="text-lg font-bold">
                        {stats ? formatCurrency(stats.totalValue) : '$0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Broker ID
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {localStorage.getItem('broker') ? JSON.parse(localStorage.getItem('broker')!).id : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {localStorage.getItem('broker') ? JSON.parse(localStorage.getItem('broker')!).email : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {localStorage.getItem('broker') ? JSON.parse(localStorage.getItem('broker')!).name : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('broker');
                        window.location.href = '/login';
                      }}
                    >
                      <IconSettings size={16} className="mr-2" />
                      Logout
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('properties')}
                    >
                      <IconBuilding size={16} className="mr-2" />
                      Manage Properties
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <IconChartBar size={16} className="mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
