import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { BarChart2, CalendarDays, DollarSign, Package, Users } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { DatePicker } from "@/components/ui/date-picker"; 
    import { Button } from '@/components/ui/button';
    import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';


    const initialTicketData = [
        { name: 'Jan', Tickets: 400, Closed: 240 }, { name: 'Feb', Tickets: 300, Closed: 139 },
        { name: 'Mar', Tickets: 200, Closed: 380 }, { name: 'Apr', Tickets: 278, Closed: 300 },
        { name: 'May', Tickets: 189, Closed: 400 }, { name: 'Jun', Tickets: 239, Closed: 280 },
    ];

    const inventoryValueData = [
        { name: 'Screens', value: 4000 }, { name: 'Batteries', value: 3000 },
        { name: 'Keyboards', value: 2000 }, { name: 'Misc', value: 2780 },
    ];
    const COLORS = ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE'];


    const ReportsPage = () => {
      const [dateRange, setDateRange] = useState({ from: null, to: null });

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <BarChart2 className="mr-3 h-7 w-7 text-primary"/>Reports & Analytics
              </CardTitle>
              <CardDescription>Visualize key metrics and trends for your operations.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-accent/30 rounded-lg border items-center">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="date-from" className="text-sm">From:</Label>
                        <DatePicker date={dateRange.from} setDate={(date) => setDateRange(prev => ({...prev, from: date}))} placeholder="Start Date" buttonClassName="w-auto text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="date-to" className="text-sm">To:</Label>
                        <DatePicker date={dateRange.to} setDate={(date) => setDateRange(prev => ({...prev, to: date}))} placeholder="End Date" buttonClassName="w-auto text-sm" />
                    </div>
                    <Button className="text-sm"><CalendarDays className="mr-2 h-4 w-4"/> Apply Filter</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-blue-500"/>Ticket Volume</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={initialTicketData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Tickets" fill="#8884d8" />
                                    <Bar dataKey="Closed" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-500"/>Inventory Value by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <Pie
                                    data={inventoryValueData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {inventoryValueData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                                <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Package className="mr-2 h-5 w-5 text-orange-500"/>Top Moving Parts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Chart for top moving parts placeholder.</p>
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md mt-2">Graph Area</div>
                        </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-purple-500"/>Partner Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Chart for partner activity placeholder.</p>
                            <div className="h-[250px] flex items-center justify-center text-muted-foreground bg-slate-50 rounded-md mt-2">Graph Area</div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };
    export default ReportsPage;