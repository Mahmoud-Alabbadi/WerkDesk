import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Ticket, CheckCircle, Clock, XCircle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { useAuth } from '@/hooks/useAuth';

    const PartnerDashboardPage = () => {
      const { user } = useAuth();

      const partnerStats = [
        { title: "My Open Tickets", value: "12", icon: Ticket, color: "text-blue-500" },
        { title: "Tickets In Progress", value: "5", icon: Clock, color: "text-status-inprogress" },
        { title: "Ready for Pickup", value: "3", icon: CheckCircle, color: "text-status-ready" },
        { title: "Recently Closed", value: "25", icon: XCircle, color: "text-gray-500" },
      ];

      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Welcome, {user?.name || 'Partner'}!</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {partnerStats.map((stat, index) => (
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
                    <p className="text-xs text-muted-foreground">View details</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-start mt-6 space-x-4">
            <Link to="/partner/tickets">
                <Button size="lg" className="text-base">
                    <Ticket className="mr-2 h-5 w-5" /> My Tickets
                </Button>
            </Link>
            <Link to="/partner/tickets/new"> {/* Assuming a route to create new ticket */}
                 <Button size="lg" variant="outline" className="text-base">
                    Submit New Ticket
                </Button>
            </Link>
          </div>

           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: partnerStats.length * 0.1 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your recent ticket updates will appear here.</p>
                 <ul className="mt-4 space-y-2 text-sm">
                    <li>Ticket #P101 status changed to 'Ready for Pickup'.</li>
                    <li>New comment on Ticket #P098.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default PartnerDashboardPage;