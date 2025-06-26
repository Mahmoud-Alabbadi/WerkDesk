import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Ticket, Users, PackageCheck, Activity } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';

    const stats = [
      { title: "Total Tickets", value: "1,234", icon: Ticket, color: "text-blue-500", bgColor: "bg-blue-100" },
      { title: "New Tickets", value: "56", icon: Ticket, color: "text-status-new", bgColor: "bg-status-new/20" },
      { title: "In Progress", value: "128", icon: Ticket, color: "text-status-inprogress", bgColor: "bg-status-inprogress/20" },
      { title: "Total Partners", value: "42", icon: Users, color: "text-purple-500", bgColor: "bg-purple-100" },
    ];

    const inventoryStats = [
      { title: "Total Parts", value: "5,678", icon: PackageCheck, color: "text-green-500", bgColor: "bg-green-100" },
      { title: "Low Stock Items", value: "15", icon: PackageCheck, color: "text-orange-500", bgColor: "bg-orange-100" },
      { title: "Inventory Value", value: "$12,345", icon: PackageCheck, color: "text-indigo-500", bgColor: "bg-indigo-100" },
    ];

    const AdminDashboardPage = () => {
      return (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <p className="text-xs text-muted-foreground">Updated just now</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
             {inventoryStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (stats.length + index) * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                     <p className="text-xs text-muted-foreground">+5% from last month</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-start mt-6">
            <Link to="/admin/tickets">
                <Button size="lg" className="text-base">
                    <Ticket className="mr-2 h-5 w-5" /> View All Tickets
                </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (stats.length + inventoryStats.length) * 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary" />Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Recent activity feed placeholder. This area will display latest ticket updates, inventory changes, and partner activities.</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li>Ticket #1235 status changed to 'In Progress'.</li>
                    <li>New part ' स्क्रीन रिप्लेसमेंट' added to inventory.</li>
                    <li>Partner 'TechFix Co.' submitted 3 new tickets.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminDashboardPage;